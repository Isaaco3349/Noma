"use client";

import { readRecipients } from "@/lib/recipients/storage";
import type { SavedRecipient } from "@/lib/recipients/types";

type RecipientListProps = {
  recipients: SavedRecipient[];
};

export function RecipientList({ recipients }: RecipientListProps) {
  if (recipients.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No recipients yet. Add Mum or another beneficiary below.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {recipients.map((r) => (
        <li
          key={r.id}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        >
          <p className="font-medium text-text">
            {r.nickname}{" "}
            <span className="font-normal text-text-muted">· {r.location}</span>
          </p>
          <p className="text-xs text-text-muted">
            {r.accountName} · {r.bankName} · ****
            {r.accountNumber.slice(-4)}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function loadRecipientsFromStorage(): SavedRecipient[] {
  return readRecipients();
}
