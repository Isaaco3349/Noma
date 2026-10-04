"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  findRecipientForPlan,
  upsertRecipient,
} from "@/lib/recipients/storage";
import { savePaystackRecipient } from "@/lib/recipients/savePaystackRecipient";
import type { SavedRecipient } from "@/lib/recipients/types";
import type { PaymentPlan } from "@/lib/intent/types";

type Bank = { name: string; code: string };

type PlanRecipientSetupProps = {
  plan: PaymentPlan;
  recipients: SavedRecipient[];
  onSaved: () => void;
};

export function PlanRecipientSetup({
  plan,
  recipients,
  onSaved,
}: PlanRecipientSetupProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");

  useEffect(() => {
    void fetch("/api/paystack/banks")
      .then((r) => r.json())
      .then((json: { data: Bank[]; mode: "demo" | "live" }) => {
        setBanks(json.data ?? []);
        setMode(json.mode ?? "demo");
        if (json.data?.[0]) setBankCode(json.data[0].code);
      })
      .catch(() => setError("Could not load banks"));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(null);
    const bankName = banks.find((b) => b.code === bankCode)?.name ?? "";
    try {
      const { entry, mode: savedMode } = await savePaystackRecipient({
        nickname: plan.beneficiary,
        location: plan.location,
        accountNumber,
        bankCode,
        bankName,
      });
      setSuccess(
        savedMode === "live"
          ? `Saved ${entry.accountName}. You can confirm this plan below.`
          : `Saved ${entry.nickname}. You can confirm this plan below.`,
      );
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const matchingRecipients = recipients.filter(
    (r) => findRecipientForPlan(plan.beneficiary, plan.location, [r]) != null,
  );

  const otherRecipients = recipients.filter(
    (r) => !matchingRecipients.some((m) => m.id === r.id),
  );

  function linkSavedAccountToPlan(source: SavedRecipient) {
    setBusy(true);
    setError(null);
    try {
      const entry: SavedRecipient = {
        ...source,
        id: crypto.randomUUID(),
        nickname: plan.beneficiary.trim(),
        location: plan.location.trim(),
        createdAt: Date.now(),
      };
      upsertRecipient(entry);
      setSuccess(
        `Linked ${source.bankName} account to ${plan.beneficiary}. Confirm below.`,
      );
      onSaved();
    } catch {
      setError("Could not link saved account to this plan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-border bg-bg p-3">
      <p className="text-xs font-medium text-text">
        Payout details for {plan.beneficiary} ({plan.location})
      </p>
      <p className="text-[11px] leading-relaxed text-text-muted">
        Add bank details here, then confirm on this plan — no need to leave chat.
      </p>

      {matchingRecipients.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-text-muted">
            Saved profile for this plan
          </p>
          <ul className="flex flex-col gap-1.5">
            {matchingRecipients.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    onSaved();
                    setSuccess(
                      `Using ${r.nickname} · ${r.location}. Confirm below.`,
                    );
                    setError(null);
                  }}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-left text-xs hover:bg-bg disabled:opacity-50"
                >
                  <span className="font-medium text-text">
                    {r.nickname} · {r.location}
                  </span>
                  <span className="mt-0.5 block text-text-muted">
                    {r.accountName} · {r.bankName} · ****
                    {r.accountNumber.slice(-4)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : otherRecipients.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-text-muted">
            Or use a saved bank account for “{plan.beneficiary}”
          </p>
          <ul className="flex max-h-40 flex-col gap-1.5 overflow-y-auto">
            {otherRecipients.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => linkSavedAccountToPlan(r)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-left text-xs hover:bg-bg disabled:opacity-50"
                >
                  <span className="font-medium text-text">
                    {r.nickname} · {r.location}
                  </span>
                  <span className="mt-0.5 block text-text-muted">
                    {r.accountName} · {r.bankName} · ****
                    {r.accountNumber.slice(-4)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-3">
        <p className="text-[11px] text-text-muted">
          New bank account (Paystack API {mode})
        </p>
        <label className="block text-xs">
          <span className="text-text-muted">Bank</span>
          <select
            required
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            {banks.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="text-text-muted">Account number</span>
          <input
            required
            inputMode="numeric"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            placeholder="0123456789"
          />
        </label>
        {error ? <p className="text-xs text-semantic-error">{error}</p> : null}
        {success ? (
          <p className="text-xs text-semantic-success">{success}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-text px-4 py-2 text-sm font-medium text-surface disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save & continue to confirm"}
        </button>
      </form>
    </div>
  );
}
