import { isAddress } from "viem";

function readAddress(name: string): `0x${string}` | undefined {
  const value = process.env[name]?.trim();
  if (!value || !isAddress(value)) return undefined;
  return value;
}

export type NomaChainConfig = {
  registry: `0x${string}`;
  settlementAdapter: `0x${string}`;
  settlementToken: `0x${string}`;
  payoutSink: `0x${string}`;
  tokenDecimals: number;
};

export function getNomaChainConfig(): NomaChainConfig | undefined {
  const registry = readAddress("NEXT_PUBLIC_NOMA_REGISTRY_ADDRESS");
  const settlementAdapter = readAddress(
    "NEXT_PUBLIC_NOMA_SETTLEMENT_ADAPTER_ADDRESS",
  );
  const settlementToken = readAddress(
    "NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS",
  );
  const payoutSink = readAddress("NEXT_PUBLIC_PAYOUT_SINK_ADDRESS");
  const decimalsRaw = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS ?? "6";
  const tokenDecimals = Number.parseInt(decimalsRaw, 10);

  if (!registry || !settlementAdapter || !settlementToken || !payoutSink) {
    return undefined;
  }
  if (!Number.isFinite(tokenDecimals) || tokenDecimals < 0 || tokenDecimals > 18) {
    return undefined;
  }

  return {
    registry,
    settlementAdapter,
    settlementToken,
    payoutSink,
    tokenDecimals,
  };
}

export function isNomaChainConfigured(): boolean {
  return getNomaChainConfig() !== undefined;
}
