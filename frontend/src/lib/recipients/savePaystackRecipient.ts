import { upsertRecipient } from "./storage";
import type { SavedRecipient } from "./types";

export type SaveRecipientInput = {
  nickname: string;
  location: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
};

export async function savePaystackRecipient(
  input: SaveRecipientInput,
): Promise<{ entry: SavedRecipient; mode: "demo" | "live" }> {
  const res = await fetch("/api/paystack/recipient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as {
    error?: string;
    paystackRecipientCode?: string;
    accountName?: string;
    mode?: "demo" | "live";
  };

  if (!res.ok || !json.paystackRecipientCode) {
    throw new Error(json.error ?? "Failed to save recipient");
  }

  const entry: SavedRecipient = {
    id: crypto.randomUUID(),
    nickname: input.nickname.trim(),
    location: input.location.trim(),
    accountNumber: input.accountNumber.trim(),
    bankCode: input.bankCode,
    bankName: input.bankName,
    accountName: json.accountName ?? input.nickname,
    paystackRecipientCode: json.paystackRecipientCode,
    createdAt: Date.now(),
  };
  upsertRecipient(entry);
  return { entry, mode: json.mode ?? "demo" };
}
