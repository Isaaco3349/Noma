"use client";

import type { SavedRecipient } from "@/lib/recipients/types";

type PlanSelectedRecipientProps = {
  recipient: SavedRecipient;
  onChangeAccount: () => void;
};

export function PlanSelectedRecipient({
  recipient,
  onChangeAccount,
}: PlanSelectedRecipientProps) {
  return (
    <div className="mt-3 rounded-lg border border-semantic-success/50 bg-bg p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-text">
        Nigerian bank account (NGN payout)
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
        Verify this account before you confirm. On-chain settlement on Monad is
        separate from this Paystack payout rail.
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-xs text-text-muted">Account name</dt>
          <dd className="font-medium text-text">{recipient.accountName}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Bank</dt>
          <dd className="text-text">{recipient.bankName}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Account number</dt>
          <dd className="font-mono text-text">
            ••••••{recipient.accountNumber.slice(-4)}
            <span className="ml-2 font-sans text-xs text-text-muted">
              ({recipient.accountNumber.length} digits)
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Saved profile</dt>
          <dd className="text-text">
            {recipient.nickname}, {recipient.location}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onChangeAccount}
        className="mt-3 text-xs font-medium text-text underline underline-offset-2 hover:opacity-80"
      >
        Choose a different saved account or add a new one
      </button>
    </div>
  );
}
