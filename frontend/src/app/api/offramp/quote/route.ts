import { NextResponse } from "next/server";
import { getDemoUsdNgnRate } from "@/lib/paystack/config";

type Body = { amountUsd?: number };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amountUsd = body.amountUsd;
  if (typeof amountUsd !== "number" || amountUsd <= 0 || amountUsd > 1_000_000) {
    return NextResponse.json({ error: "Invalid amountUsd" }, { status: 400 });
  }

  const rate = getDemoUsdNgnRate();
  const ngnAmount = Math.round(amountUsd * rate * 100) / 100;

  return NextResponse.json({
    amountUsd,
    usdNgnRate: rate,
    ngnAmount,
    provider: "paystack",
    disclaimer:
      "Indicative demo rate for UI only. Live NGN payout uses Paystack transfer in kobo when configured.",
  });
}
