import { createPublicClient, formatUnits, http, isAddress } from "viem";
import { AUSD_DECIMALS, AUSD_MONAD_TESTNET_ADDRESS } from "@/lib/agora/constants";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { erc20Abi } from "@/lib/contracts/abis";

export type SettlementBalanceResult = {
  symbol: string;
  balance: string;
};

function rpcUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL ??
    monadTestnet.rpcUrls.default.http[0]
  );
}

async function readBalanceOnChain(
  holder: `0x${string}`,
  token: `0x${string}`,
  decimals: number,
  symbol: string,
): Promise<SettlementBalanceResult> {
  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(rpcUrl()),
  });
  const raw = await client.readContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [holder],
  });
  return { symbol, balance: formatUnits(raw, decimals) };
}

/** Server route when deployed; falls back to Agora status + public RPC read. */
export async function fetchSettlementBalance(
  holder: `0x${string}`,
): Promise<SettlementBalanceResult | null> {
  if (!isAddress(holder)) return null;

  try {
    const res = await fetch(
      `/api/wallet/settlement-balance?address=${encodeURIComponent(holder)}`,
    );
    if (res.ok) {
      const json = (await res.json()) as {
        configured?: boolean;
        symbol?: string;
        balance?: string;
        error?: string;
      };
      if (json.configured && json.balance !== undefined && !json.error) {
        return {
          symbol: json.symbol ?? "Token",
          balance: json.balance,
        };
      }
    }
  } catch {
    // fall through to client read
  }

  try {
    const status = (await fetch("/api/agora/status").then((r) => r.json())) as {
      settlement?: { tokenSymbol?: string; tokenAddress?: string };
    };
    const token = status.settlement?.tokenAddress;
    if (!token || !isAddress(token)) return null;

    const symbol = status.settlement?.tokenSymbol ?? "Token";
    const decimals =
      token.toLowerCase() === AUSD_MONAD_TESTNET_ADDRESS.toLowerCase()
        ? AUSD_DECIMALS
        : Number.parseInt(
            process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS ?? "18",
            10,
          );

    return readBalanceOnChain(holder, token, decimals, symbol);
  } catch {
    return null;
  }
}

export function friendlyAusdFaucetError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (
    msg.includes("0x20e5bc67") ||
    msg.includes("MaxFrequencyExceeded")
  ) {
    return "Faucet cooldown — you already received test AUSD recently. Your balance should still show ~10,000 AUSD; wait before requesting again.";
  }
  if (msg.includes("User rejected") || msg.includes("denied")) {
    return "Passkey approval was cancelled.";
  }
  return msg.length > 280 ? `${msg.slice(0, 277)}…` : msg;
}
