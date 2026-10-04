import { NextResponse } from "next/server";
import {
  getDemoUsdNgnRate,
  getPaystackTransferMode,
  isPaystackBalanceOrFundingError,
  isPaystackLive,
  shouldAttemptPaystackTransfer,
} from "@/lib/paystack/config";
import { initiateTransfer } from "@/lib/paystack/server";

type Body = {
  amountUsd: number;
  paystackRecipientCode: string;
  recipientNickname?: string;
  monadPlanId?: string;
  reason?: string;
};

function demoDisburseResponse(input: {
  ngnAmount: number;
  rate: number;
  message: string;
  fallbackFromLive?: boolean;
}) {
  return NextResponse.json({
    mode: "demo" as const,
    status: "demo" as const,
    ngnAmount: input.ngnAmount,
    usdNgnRate: input.rate,
    paystackReference: `demo_${Date.now()}`,
    paystackTransferCode: `DEMO_TRF_${crypto.randomUUID().slice(0, 8)}`,
    message: input.message,
    fallbackFromLive: input.fallbackFromLive ?? false,
  });
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { amountUsd, paystackRecipientCode, recipientNickname, monadPlanId } =
    body;

  if (
    typeof amountUsd !== "number" ||
    amountUsd <= 0 ||
    !paystackRecipientCode?.trim()
  ) {
    return NextResponse.json(
      { error: "amountUsd and paystackRecipientCode required" },
      { status: 400 },
    );
  }

  const rate = getDemoUsdNgnRate();
  const ngnAmount = Math.round(amountUsd * rate * 100) / 100;
  const amountKobo = Math.round(ngnAmount * 100);

  const reason =
    body.reason ??
    `Noma NG corridor${monadPlanId ? ` plan ${monadPlanId}` : ""} → ${recipientNickname ?? "beneficiary"}`;

  if (!isPaystackLive() || !shouldAttemptPaystackTransfer()) {
    return demoDisburseResponse({
      ngnAmount,
      rate,
      message: isPaystackLive()
        ? "Paystack transfers disabled (NOMA_PAYSTACK_TRANSFER_MODE=demo). NGN leg recorded for demo."
        : "Demo disburse recorded. Set PAYSTACK_SECRET_KEY for live sandbox recipients; transfers use auto/demo when unfunded.",
    });
  }

  try {
    const transfer = await initiateTransfer({
      amountKobo,
      recipientCode: paystackRecipientCode.trim(),
      reason: reason.slice(0, 100),
    });

    return NextResponse.json({
      mode: "live",
      status: transfer.status === "success" ? "success" : "pending",
      ngnAmount,
      usdNgnRate: rate,
      paystackReference: transfer.reference,
      paystackTransferCode: transfer.transfer_code,
    });
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Paystack transfer failed";
    const mode = getPaystackTransferMode();

    if (
      mode === "auto" &&
      isPaystackBalanceOrFundingError(errorMessage)
    ) {
      return demoDisburseResponse({
        ngnAmount,
        rate,
        fallbackFromLive: true,
        message:
          "Paystack sandbox balance insufficient for transfer — recorded demo NGN orchestration. Production funds Paystack balance before disburse.",
      });
    }

    return NextResponse.json(
      {
        mode: "live",
        status: "failed",
        error: errorMessage,
        ngnAmount,
        usdNgnRate: rate,
      },
      { status: 502 },
    );
  }
}
