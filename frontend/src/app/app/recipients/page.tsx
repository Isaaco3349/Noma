"use client";

import { useCallback, useEffect, useState } from "react";
import { RecipientForm } from "@/components/recipients/RecipientForm";
import { RecipientList } from "@/components/recipients/RecipientList";
import { readRecipients } from "@/lib/recipients/storage";
import type { SavedRecipient } from "@/lib/recipients/types";

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<SavedRecipient[]>([]);

  const refresh = useCallback(() => {
    setRecipients(readRecipients());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="font-display text-lg font-semibold text-text">
          Recipients
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Nigeria payout details via Paystack transfer recipients. Nicknames
          match chat (Mum, Sister, …).
        </p>
      </div>
      <RecipientList recipients={recipients} />
      <RecipientForm onSaved={refresh} />
    </div>
  );
}
