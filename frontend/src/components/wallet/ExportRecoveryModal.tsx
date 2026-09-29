"use client";

import { useState } from "react";
import { useWallet } from "./WalletContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ExportRecoveryModal({ open, onClose }: Props) {
  const { exportRecoveryPhrase, busy } = useWallet();
  const [step, setStep] = useState<"warn" | "phrase">("warn");
  const [confirmed, setConfirmed] = useState(false);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function resetAndClose() {
    setStep("warn");
    setConfirmed(false);
    setPhrase(null);
    onClose();
  }

  async function handleReveal() {
    if (!confirmed) return;
    setLoading(true);
    try {
      const words = await exportRecoveryPhrase();
      setPhrase(words);
      setStep("phrase");
    } catch {
      // error surfaced via WalletContext
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-recovery-title"
    >
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-surface p-5 shadow-lg">
        {step === "warn" ? (
          <>
            <h2
              id="export-recovery-title"
              className="text-base font-semibold text-text"
            >
              Export recovery phrase
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Anyone with these 24 words can move your funds. Do not share them,
              store them in email or cloud notes, or enter them on unfamiliar
              sites.
            </p>
            <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-text">
              <input
                type="checkbox"
                className="mt-0.5 accent-accent"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span>I understand and will write the phrase down offline.</span>
            </label>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-bg"
                onClick={resetAndClose}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!confirmed || loading || busy}
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-text disabled:opacity-50"
                onClick={() => void handleReveal()}
              >
                {loading ? "Verifying passkey…" : "Show phrase"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-base font-semibold text-text">
              Your recovery phrase
            </h2>
            <p className="mt-2 text-xs text-semantic-error">
              Copy once, then close this screen. We never store these words.
            </p>
            <p className="mt-3 rounded-md border border-border bg-bg p-3 font-mono text-xs leading-relaxed text-text">
              {phrase}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-text"
                onClick={resetAndClose}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
