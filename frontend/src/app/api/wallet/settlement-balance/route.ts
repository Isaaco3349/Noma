import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, formatUnits, http, isAddress } from "viem";
import { AUSD_MONAD_TESTNET_ADDRESS } from "@/lib/agora/constants";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { erc20Abi } from "@/lib/contracts/abis";
import { getSettlementTokenConfig } from "@/lib/contracts/config";

export async function GET(request: NextRequest) {
  const rawAddress = request.nextUrl.searchParams.get("address")?.trim();
  if (!rawAddress || !isAddress(rawAddress)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const tokenConfig = getSettlementTokenConfig();
  if (!tokenConfig) {
    return NextResponse.json({ configured: false as const });
  }

  const rpc =
    process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL?.trim() ??
    monadTestnet.rpcUrls.default.http[0];

  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(rpc),
  });

  try {
    const raw = await client.readContract({
      address: tokenConfig.settlementToken,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [rawAddress],
    });

    const symbol =
      tokenConfig.settlementToken.toLowerCase() ===
      AUSD_MONAD_TESTNET_ADDRESS.toLowerCase()
        ? "AUSD"
        : "Demo";

    return NextResponse.json({
      configured: true as const,
      symbol,
      balance: formatUnits(raw, tokenConfig.tokenDecimals),
      tokenAddress: tokenConfig.settlementToken,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Balance read failed";
    return NextResponse.json(
      { configured: true as const, error: message },
      { status: 502 },
    );
  }
}
