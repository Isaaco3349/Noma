import type { OfframpState } from "@/lib/tracking/types";

export async function fetchNgnQuote(amountUsd: number): Promise<{
  ngnAmount: number;
  usdNgnRate: number;
  disclaimer: string;
}> {
  const res = await fetch("/api/offramp/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountUsd }),
  });
  const json = (await res.json()) as {
    error?: string;
    ngnAmount: number;
    usdNgnRate: number;
    disclaimer: string;
  };
  if (!res.ok) throw new Error(json.error ?? "Quote failed");
  return json;
}

type DisburseResponse = {
  mode?: "live" | "demo";
  status?: string;
  ngnAmount?: number;
  usdNgnRate?: number;
  paystackTransferCode?: string;
  paystackReference?: string;
  error?: string;
  message?: string;
  fallbackFromLive?: boolean;
};

export async function requestDisburse(input: {
  amountUsd: number;
  paystackRecipientCode: string;
  recipientNickname?: string;
  monadPlanId?: string;
}): Promise<OfframpState> {
  const res = await fetch("/api/offramp/disburse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as DisburseResponse;

  const mode = json.mode ?? "demo";
  let status: OfframpState["status"] = "demo";
  if (json.status === "success") status = "success";
  else if (json.status === "failed") status = "failed";
  else if (json.status === "pending" || json.status === "otp")
    status = "pending";
  else if (json.status === "demo") status = "demo";

  if (!res.ok && status !== "failed") {
    return {
      status: "failed",
      mode,
      error: json.error ?? "Disburse failed",
    };
  }

  return {
    status,
    mode,
    ngnAmount: json.ngnAmount,
    usdNgnRate: json.usdNgnRate,
    paystackTransferCode: json.paystackTransferCode,
    paystackReference: json.paystackReference,
    recipientNickname: input.recipientNickname,
    error: json.error,
    message: json.message,
    fallbackFromLive: json.fallbackFromLive,
  };
}
