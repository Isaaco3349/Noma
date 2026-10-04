import { NextResponse } from "next/server";
import { isPaystackLive } from "@/lib/paystack/config";
import {
  createTransferRecipient,
  resolveBankAccount,
} from "@/lib/paystack/server";

type Body = {
  nickname: string;
  location: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { nickname, location, accountNumber, bankCode, bankName } = body;
  if (!nickname?.trim() || !accountNumber?.trim() || !bankCode?.trim()) {
    return NextResponse.json(
      { error: "nickname, accountNumber, and bankCode are required" },
      { status: 400 },
    );
  }

  if (!isPaystackLive()) {
    return NextResponse.json({
      mode: "demo",
      accountName: `${nickname.trim()} (demo)`,
      paystackRecipientCode: `DEMO_RCP_${crypto.randomUUID().slice(0, 8)}`,
      message:
        "Set PAYSTACK_SECRET_KEY for live Paystack sandbox transfers.",
    });
  }

  try {
    const resolved = await resolveBankAccount(
      accountNumber.trim(),
      bankCode.trim(),
    );
    const recipient = await createTransferRecipient({
      name: resolved.account_name,
      accountNumber: accountNumber.trim(),
      bankCode: bankCode.trim(),
    });

    return NextResponse.json({
      mode: "live",
      accountName: resolved.account_name,
      paystackRecipientCode: recipient.recipient_code,
      nickname: nickname.trim(),
      location: location?.trim() || "Nigeria",
      accountNumber: accountNumber.trim(),
      bankCode: bankCode.trim(),
      bankName: bankName?.trim() || "",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Paystack recipient failed" },
      { status: 502 },
    );
  }
}
