"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RecipientForm } from "@/components/recipients/RecipientForm";
import { RecipientList } from "@/components/recipients/RecipientList";
import { readRecipients } from "@/lib/recipients/storage";
import type { SavedRecipient } from "@/lib/recipients/types";

function RecipientsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillNickname = searchParams.get("nickname") ?? "";
  const prefillLocation = searchParams.get("location") ?? "";
  const returnTo = searchParams.get("returnTo");

  const [recipients, setRecipients] = useState<SavedRecipient[]>([]);

  const refresh = useCallback(() => {
    setRecipients(readRecipients());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
      <div>
        <h1 className="font-display text-lg font-semibold text-text">
          Recipients
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          Save bank details for anyone you pay in chat — use the same nickname
          and city or state (e.g. Chidi · Enugu).
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <RecipientList recipients={recipients} />
        <RecipientForm
          onSaved={() => {
            refresh();
            if (returnTo?.startsWith("/app")) {
              router.push(returnTo);
            }
          }}
          initialNickname={prefillNickname}
          initialLocation={prefillLocation}
        />
      </div>
    </div>
  );
}

export default function RecipientsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6 text-sm text-text-muted">Loading…</div>
      }
    >
      <RecipientsPageContent />
    </Suspense>
  );
}
