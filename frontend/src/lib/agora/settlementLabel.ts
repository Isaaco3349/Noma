import { isAddress } from "viem";
import { AUSD_MONAD_TESTNET_ADDRESS } from "./constants";

export type SettlementLayerInfo = {
  tokenSymbol: string;
  issuer: "agora" | "demo";
  tokenAddress?: `0x${string}`;
};

export function getSettlementLayerFromEnv(): SettlementLayerInfo {
  const raw = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS?.trim();
  if (raw && isAddress(raw)) {
    const normalized = raw.toLowerCase();
    const ausd = AUSD_MONAD_TESTNET_ADDRESS.toLowerCase();
    if (normalized === ausd) {
      return {
        tokenSymbol: "AUSD",
        issuer: "agora",
        tokenAddress: AUSD_MONAD_TESTNET_ADDRESS,
      };
    }
    return {
      tokenSymbol: "ERC-20",
      issuer: "demo",
      tokenAddress: raw as `0x${string}`,
    };
  }
  return { tokenSymbol: "AUSD (planned)", issuer: "agora" };
}
