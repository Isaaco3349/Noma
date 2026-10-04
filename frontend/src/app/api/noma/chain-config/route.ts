import { NextResponse } from "next/server";
import { getNomaChainConfig } from "@/lib/contracts/config";

/** Server reads frontend/.env.local — use this instead of client-side process.env. */
export async function GET() {
  const config = getNomaChainConfig();
  if (!config) {
    return NextResponse.json({
      chainReady: false,
      error: "Monad contract env not configured",
    });
  }
  return NextResponse.json({ chainReady: true, config });
}
