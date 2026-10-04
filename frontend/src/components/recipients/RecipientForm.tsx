"use client";

import { FormEvent, useEffect, useState } from "react";
import { savePaystackRecipient } from "@/lib/recipients/savePaystackRecipient";

type Bank = { name: string; code: string };

type RecipientFormProps = {
  onSaved?: () => void;
  initialNickname?: string;
  initialLocation?: string;
};

export function RecipientForm({
  onSaved,
  initialNickname = "",
  initialLocation = "",
}: RecipientFormProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [nickname, setNickname] = useState(initialNickname);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    if (initialNickname) setNickname(initialNickname);
    if (initialLocation) setLocation(initialLocation);
  }, [initialNickname, initialLocation]);
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
        nickname,
        location,
        accountNumber,
        bankCode,
        bankName,
      });
      setSuccess(
        savedMode === "live"
          ? `Saved ${entry.accountName} (${entry.paystackRecipientCode}).`
          : `Saved demo recipient for “${nickname}”. Add PAYSTACK_SECRET_KEY for live sandbox.`,
      );
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-surface p-4"
    >
      <p className="text-xs text-text-muted">
        Paystack transfer recipient (API {mode} — banks/recipients only). Nickname should match chat
        (e.g. Mum, Sister) for auto-match on confirm.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-text-muted">Nickname</span>
          <input
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            placeholder="Mum"
          />
        </label>
        <label className="block text-sm">
          <span className="text-text-muted">City</span>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            placeholder="Lagos"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-text-muted">Bank</span>
        <select
          required
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        >
          {banks.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-text-muted">Account number</span>
        <input
          required
          inputMode="numeric"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          placeholder="0123456789"
        />
      </label>
      {error ? (
        <p className="text-xs text-semantic-error">{error}</p>
      ) : null}
      {success ? (
        <p className="text-xs text-semantic-success">{success}</p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-text px-4 py-2 text-sm font-medium text-surface disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save recipient"}
      </button>
    </form>
  );
}
