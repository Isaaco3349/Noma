import {
  getPaystackSecretKey,
  PAYSTACK_API_BASE,
  validatePaystackSecretKey,
} from "./config";

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

async function paystackFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<PaystackResponse<T>> {
  const secret = getPaystackSecretKey();
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }
  validatePaystackSecretKey(secret);

  const res = await fetch(`${PAYSTACK_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = (await res.json()) as PaystackResponse<T>;
  if (!res.ok || !json.status) {
    throw new Error(json.message || `Paystack error ${res.status}`);
  }
  return json;
}

export type PaystackBank = {
  name: string;
  code: string;
  slug: string;
};

export async function listNigerianBanks(): Promise<PaystackBank[]> {
  const json = await paystackFetch<PaystackBank[]>("/bank?country=nigeria");
  return json.data;
}

export async function resolveBankAccount(
  accountNumber: string,
  bankCode: string,
): Promise<{ account_name: string; account_number: string }> {
  const json = await paystackFetch<{
    account_name: string;
    account_number: string;
  }>(
    `/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
    { method: "GET" },
  );
  return json.data;
}

export type TransferRecipient = {
  recipient_code: string;
  name: string;
  details: { account_number: string; bank_code: string };
};

export async function createTransferRecipient(input: {
  name: string;
  accountNumber: string;
  bankCode: string;
}): Promise<TransferRecipient> {
  const json = await paystackFetch<TransferRecipient>("/transferrecipient", {
    method: "POST",
    body: JSON.stringify({
      type: "nuban",
      name: input.name,
      account_number: input.accountNumber,
      bank_code: input.bankCode,
      currency: "NGN",
    }),
  });
  return json.data;
}

export type TransferResult = {
  transfer_code: string;
  reference: string;
  status: string;
  amount: number;
};

export async function initiateTransfer(input: {
  amountKobo: number;
  recipientCode: string;
  reason: string;
}): Promise<TransferResult> {
  const json = await paystackFetch<TransferResult>("/transfer", {
    method: "POST",
    body: JSON.stringify({
      source: "balance",
      amount: input.amountKobo,
      recipient: input.recipientCode,
      reason: input.reason,
    }),
  });
  return json.data;
}
