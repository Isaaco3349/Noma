import type { WalletClient } from "viem";
import { maxUint256, publicActions } from "viem";
import type { PaymentPlan } from "@/lib/intent/types";
import { erc20Abi, nomaScheduleRegistryAbi } from "./abis";
import { getNomaChainConfig, type NomaChainConfig } from "./config";
import {
  beneficiaryRefFromPlan,
  dayOfMonthFromPlan,
  scheduleKindFromPlan,
  tokenAmountFromUsd,
} from "./planToChain";

export type OnChainPlanResult = {
  planId: bigint;
  createTxHash: `0x${string}`;
  executeTxHash?: `0x${string}`;
};

export async function registerPlanOnChain(
  walletClient: WalletClient,
  plan: PaymentPlan,
  chainConfig?: NomaChainConfig,
): Promise<OnChainPlanResult> {
  const config = chainConfig ?? getNomaChainConfig();
  if (!config) {
    throw new Error(
      "On-chain addresses are not configured. Deploy contracts and set NEXT_PUBLIC_NOMA_* env vars.",
    );
  }

  const account = walletClient.account;
  if (!account) {
    throw new Error("Wallet account is not available.");
  }

  const client = walletClient.extend(publicActions);
  const amount = tokenAmountFromUsd(plan.amountUsd, config.tokenDecimals);
  const maxTotal = amount;
  const beneficiaryRef = beneficiaryRefFromPlan(plan);
  const schedule = scheduleKindFromPlan(plan);
  const dayOfMonth = dayOfMonthFromPlan(plan);
  const firstExecutionAt = BigInt(0);

  const allowance = await client.readContract({
    address: config.settlementToken,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address, config.settlementAdapter],
  });

  if (allowance < amount) {
    const approveHash = await walletClient.writeContract({
      address: config.settlementToken,
      abi: erc20Abi,
      functionName: "approve",
      args: [config.settlementAdapter, maxUint256],
      chain: walletClient.chain,
      account,
    });
    await client.waitForTransactionReceipt({ hash: approveHash });
  }

  const createHash = await walletClient.writeContract({
    address: config.registry,
    abi: nomaScheduleRegistryAbi,
    functionName: "createPlan",
    args: [
      config.settlementToken,
      config.payoutSink,
      beneficiaryRef,
      amount,
      maxTotal,
      schedule,
      dayOfMonth,
      firstExecutionAt,
    ],
    chain: walletClient.chain,
    account,
  });
  await client.waitForTransactionReceipt({ hash: createHash });

  const nextId = await client.readContract({
    address: config.registry,
    abi: nomaScheduleRegistryAbi,
    functionName: "nextPlanId",
  });
  const planId = nextId - BigInt(1);

  let executeTxHash: `0x${string}` | undefined;
  try {
    executeTxHash = await walletClient.writeContract({
      address: config.registry,
      abi: nomaScheduleRegistryAbi,
      functionName: "executePlan",
      args: [planId],
      chain: walletClient.chain,
      account,
    });
    await client.waitForTransactionReceipt({ hash: executeTxHash });
  } catch {
    executeTxHash = undefined;
  }

  return { planId, createTxHash: createHash, executeTxHash };
}
