/** Server-only Paystack config. Never expose secret key to the client. */

export type PaystackTransferMode = "auto" | "live" | "demo";

export function getPaystackSecretKey(): string | undefined {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  return key && key.length > 0 ? key : undefined;
}

/** Paystack API (banks, resolve, transfer recipients) when secret key is set. */
export function isPaystackLive(): boolean {
  return Boolean(getPaystackSecretKey());
}

/**
 * How NGN disbursement behaves when PAYSTACK_SECRET_KEY is set.
 * - auto (default): call Paystack transfer; on insufficient sandbox balance → demo disburse
 * - live: always call Paystack; surface errors (production / funded sandbox)
 * - demo: never call /transfer even if key is set (recipients API still live)
 */
export function getPaystackTransferMode(): PaystackTransferMode {
  const raw = process.env.NOMA_PAYSTACK_TRANSFER_MODE?.trim().toLowerCase();
  if (raw === "live" || raw === "demo" || raw === "auto") return raw;
  return "auto";
}

export function shouldAttemptPaystackTransfer(): boolean {
  if (!isPaystackLive()) return false;
  return getPaystackTransferMode() !== "demo";
}

/** True when a Paystack transfer error should fall back to demo orchestration. */
export function isPaystackBalanceOrFundingError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("balance") ||
    lower.includes("not enough") ||
    lower.includes("insufficient")
  );
}

/** Demo USD→NGN for quotes when no licensed FX feed is wired. */
export function getDemoUsdNgnRate(): number {
  const raw = process.env.NOMA_DEMO_USD_NGN_RATE ?? "1550";
  const rate = Number.parseFloat(raw);
  return Number.isFinite(rate) && rate > 0 ? rate : 1550;
}

export const PAYSTACK_API_BASE = "https://api.paystack.co";
