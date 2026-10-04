import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { AUSD_MONAD_TESTNET_ADDRESS } from "@/lib/agora/constants";

function addrOk(name: string): boolean {
  const v = process.env[name]?.trim();
  return Boolean(v && isAddress(v));
}

export async function GET() {
  const registry = addrOk("NEXT_PUBLIC_NOMA_REGISTRY_ADDRESS");
  const adapter = addrOk("NEXT_PUBLIC_NOMA_SETTLEMENT_ADAPTER_ADDRESS");
  const token = addrOk("NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS");
  const sink = addrOk("NEXT_PUBLIC_PAYOUT_SINK_ADDRESS");
  const decimalsRaw = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS?.trim();
  const decimals = decimalsRaw ? Number.parseInt(decimalsRaw, 10) : NaN;
  const decimalsOk =
    Number.isFinite(decimals) && decimals >= 0 && decimals <= 18;

  const tokenAddr = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS?.trim();
  const usingAusd =
    tokenAddr?.toLowerCase() === AUSD_MONAD_TESTNET_ADDRESS.toLowerCase();

  const chainReady = registry && adapter && token && sink && decimalsOk;

  const missing: string[] = [];
  if (!registry) missing.push("NEXT_PUBLIC_NOMA_REGISTRY_ADDRESS");
  if (!adapter) missing.push("NEXT_PUBLIC_NOMA_SETTLEMENT_ADAPTER_ADDRESS");
  if (!token) missing.push("NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS");
  if (!sink) missing.push("NEXT_PUBLIC_PAYOUT_SINK_ADDRESS");
  if (!decimalsOk) missing.push("NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS");

  return NextResponse.json({
    chainReady,
    missing,
    usingAusd,
    hint: chainReady
      ? usingAusd
        ? "On-chain enabled with Agora AUSD — passkey must hold AUSD + MON."
        : "On-chain enabled with demo token — passkey must hold mock ERC-20 + MON."
      : missing.length > 0
        ? "Fill missing env vars in frontend/.env.local, then restart npm run dev."
        : undefined,
  });
}
