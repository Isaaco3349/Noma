"use client";

import Link from "next/link";
import { PlanRecipientSetup } from "@/components/recipients/PlanRecipientSetup";
import {
  formatAmountLabel,
  formatScheduleLabel,
} from "@/lib/intent/formatPlan";
import type { PaymentPlan } from "@/lib/intent/types";
import type { SavedRecipient } from "@/lib/recipients/types";
import type { OfframpState } from "@/lib/tracking/types";
import type { PlanChainState, PlanConfirmationStatus } from "./types";

const EXPLORER = "https://testnet.monadvision.com/tx/";

type PaymentPlanCardProps = {
  plan: PaymentPlan;
  status: PlanConfirmationStatus;
  canConfirm: boolean;
  recipientReady: boolean;
  chainHint?: string;
  chain?: PlanChainState;
  offramp?: OfframpState;
  ngnEstimate?: { amount: number; rate: number; disclaimer: string };
  confirmPending?: boolean;
  recipients?: SavedRecipient[];
  onRecipientSaved?: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PaymentPlanCard({
  plan,
  status,
  canConfirm,
  recipientReady,
  chainHint,
  chain,
  offramp,
  ngnEstimate,
  confirmPending,
  recipients = [],
  onRecipientSaved,
  onConfirm,
  onCancel,
}: PaymentPlanCardProps) {
  const isPending = status === "pending";
  const isConfirmed = status === "confirmed";
  const isCancelled = status === "cancelled";

  const confirmEnabled =
    canConfirm && recipientReady && !confirmPending;

  const recipientSetupHref = `/app/recipients?nickname=${encodeURIComponent(plan.beneficiary)}&location=${encodeURIComponent(plan.location)}&returnTo=${encodeURIComponent("/app")}`;

  return (
    <div className="mt-2 w-full max-w-md lg:max-w-lg rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-sm font-semibold text-text">
          Payment plan
        </p>
        {isConfirmed ? (
          <span className="text-xs font-medium text-semantic-success">
            Confirmed
          </span>
        ) : null}
        {isCancelled ? (
          <span className="text-xs font-medium text-text-muted">Cancelled</span>
        ) : null}
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Amount</dt>
          <dd className="font-medium text-text">
            {formatAmountLabel(plan.amountUsd)}
          </dd>
        </div>
        {ngnEstimate ? (
          <div className="flex justify-between gap-4">
            <dt className="text-text-muted">Est. NGN (Paystack)</dt>
            <dd className="text-right font-medium text-text">
              ₦{ngnEstimate.amount.toLocaleString()}
              <span className="block text-xs font-normal text-text-muted">
                Demo rate {ngnEstimate.rate}/USD
              </span>
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">To</dt>
          <dd className="text-right font-medium text-text">
            {plan.beneficiary}
            <span className="block text-xs font-normal text-text-muted">
              {plan.location}, Nigeria
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Schedule</dt>
          <dd className="font-medium text-text">
            {formatScheduleLabel(plan.schedule)}
          </dd>
        </div>
      </dl>
      {ngnEstimate ? (
        <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
          {ngnEstimate.disclaimer}
        </p>
      ) : null}
      {!recipientReady && isPending ? (
        <>
          <PlanRecipientSetup
            plan={plan}
            recipients={recipients}
            onSaved={() => onRecipientSaved?.()}
          />
          <p className="mt-2 text-[11px] text-text-muted">
            Or manage all beneficiaries in{" "}
            <Link
              href={recipientSetupHref}
              className="underline underline-offset-2"
            >
              Recipients
            </Link>
            .
          </p>
        </>
      ) : null}
      {chain?.error ? (
        <p className="mt-2 text-xs text-semantic-error">{chain.error}</p>
      ) : null}
      {isConfirmed && (chainHint || chain?.hint) ? (
        <p className="mt-2 text-xs text-semantic-success">
          {chainHint ?? chain?.hint}
        </p>
      ) : null}
      {offramp ? (
        <p
          className={`mt-2 text-xs ${
            offramp.status === "failed"
              ? "text-semantic-error"
              : "text-semantic-success"
          }`}
        >
          NGN (Paystack {offramp.mode}
          {offramp.fallbackFromLive ? ", sandbox unfunded → demo" : ""}):{" "}
          {offramp.status === "failed"
            ? offramp.error
            : offramp.ngnAmount
              ? `₦${offramp.ngnAmount.toLocaleString()} — ${offramp.status}`
              : offramp.status}
          {offramp.paystackReference
            ? ` (ref ${offramp.paystackReference})`
            : null}
          {offramp.message && offramp.status !== "failed" ? (
            <span className="mt-1 block text-[11px] font-normal text-text-muted">
              {offramp.message}
            </span>
          ) : null}
        </p>
      ) : null}
      {chain?.createTxHash ? (
        <p className="mt-2 text-xs">
          <a
            className="text-text underline underline-offset-2"
            href={`${EXPLORER}${chain.createTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View create tx
          </a>
          {chain.executeTxHash ? (
            <>
              {" · "}
              <a
                className="text-text underline underline-offset-2"
                href={`${EXPLORER}${chain.executeTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View settlement tx
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      {isPending ? (
        <>
          {!canConfirm ? (
            <p className="mt-3 text-xs text-text-muted">
              Sign in with your passkey (header) to confirm this plan.
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!confirmEnabled}
              onClick={onConfirm}
              className="rounded-lg bg-text px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {confirmPending ? "Confirming…" : "Confirm"}
            </button>
            <button
              type="button"
              disabled={confirmPending}
              onClick={onCancel}
              className="rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
