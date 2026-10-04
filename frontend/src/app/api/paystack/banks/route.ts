import { NextResponse } from "next/server";
import { DEMO_NIGERIAN_BANKS } from "@/lib/paystack/demoBanks";
import { isPaystackLive } from "@/lib/paystack/config";
import { listNigerianBanks } from "@/lib/paystack/server";

export async function GET() {
  try {
    if (!isPaystackLive()) {
      return NextResponse.json({
        mode: "demo",
        data: DEMO_NIGERIAN_BANKS,
      });
    }
    const banks = await listNigerianBanks();
    return NextResponse.json({ mode: "live", data: banks });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Failed to load banks",
        mode: "demo",
        data: DEMO_NIGERIAN_BANKS,
      },
      { status: 200 },
    );
  }
}
