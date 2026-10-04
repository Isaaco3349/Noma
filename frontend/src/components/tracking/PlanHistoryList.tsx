"use client";

import Link from "next/link";
import { formatPlanSummary } from "@/lib/intent/formatPlan";
import type { TrackedPlan } from "@/lib/tracking/types";

const EXPLORER = "https://testnet.monadvision.com/tx/";

type PlanHistoryListProps = {
  plans: TrackedPlan[];
};

export function PlanHistoryList({ plans }: PlanHistoryListProps) {
  if (plans.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No confirmed plans yet.{" "}
        <Link href="/app" className="underline underline-offset-2">
          Start in chat
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {plans.map((entry) => (
        <li
          key={entry.id}
          className="rounded-xl border border-border bg-surface p-4 text-sm"
        >
          <p className="text-xs text-text-muted">
            {new Date(entry.createdAt).toLocaleString()}
          </p>
          <p className="mt-1 font-medium text-text">
            {formatPlanSummary(entry.plan)}
          </p>
          <p className="mt-1 text-xs text-text-muted">{entry.userInstruction}</p>
          {entry.chain?.planId ? (
            <p className="mt-2 text-xs text-semantic-success">
              Monad plan #{entry.chain.planId}
              {entry.chain.executeTxHash ? (
                <>
                  {" · "}
                  <a
                    className="underline"
                    href={`${EXPLORER}${entry.chain.executeTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    settlement tx
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
          {entry.offramp ? (
            <p className="mt-2 text-xs text-text">
              Paystack ({entry.offramp.mode}):{" "}
              {entry.offramp.status === "failed"
                ? entry.offramp.error
                : entry.offramp.ngnAmount
                  ? `₦${entry.offramp.ngnAmount.toLocaleString()} NGN`
                  : entry.offramp.status}
              {entry.offramp.paystackReference
                ? ` · ref ${entry.offramp.paystackReference}`
                : null}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
