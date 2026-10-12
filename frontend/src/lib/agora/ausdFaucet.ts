import type { Address, WalletClient } from "viem";
import { publicActions } from "viem";

/**
 * Agora Instant Settlement AUSD faucet on Monad testnet.
 * @see https://docs.agora.finance/developer/contract-deployments
 * @see https://docs.agora.finance/instant-settlement/guides/getting-testnet-tokens
 */
export const AUSD_FAUCET_MONAD_TESTNET =
  "0xd236c18D274E54FAccC3dd9DDA4b27965a73ee6C" as const;

export const ausdFaucetAbi = [
  {
    type: "function",
    name: "requestFunds",
    stateMutability: "nonpayable",
    inputs: [{ name: "recipient", type: "address" }],
    outputs: [],
  },
] as const;

export async function requestTestnetAusd(
  walletClient: WalletClient,
  recipient: Address,
): Promise<`0x${string}`> {
  const account = walletClient.account;
  if (!account) {
    throw new Error("Wallet account is not available.");
  }

  const client = walletClient.extend(publicActions);

  const { request } = await client.simulateContract({
    address: AUSD_FAUCET_MONAD_TESTNET,
    abi: ausdFaucetAbi,
    functionName: "requestFunds",
    args: [recipient],
    account,
  });

  return walletClient.writeContract(request);
}
