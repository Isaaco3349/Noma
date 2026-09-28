type PaymentPlanCardProps = {
  amountUsd: string;
  beneficiary: string;
  location: string;
  schedule: string;
  corridorNote?: string;
};

export function PaymentPlanCard({
  amountUsd,
  beneficiary,
  location,
  schedule,
  corridorNote = "NGN delivery via licensed partner (orchestration only — not live on Day 1).",
}: PaymentPlanCardProps) {
  return (
    <div className="mt-2 w-full max-w-md rounded-xl border border-border bg-surface p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        Payment plan
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Amount</dt>
          <dd className="font-medium text-text">{amountUsd}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">To</dt>
          <dd className="text-right font-medium text-text">
            {beneficiary}
            <span className="block text-xs font-normal text-text-muted">
              {location}
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Schedule</dt>
          <dd className="font-medium text-text">{schedule}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">{corridorNote}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-text px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
          aria-label="Confirm payment plan (placeholder)"
        >
          Confirm
        </button>
        <button
          type="button"
          className="rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface"
          aria-label="Cancel payment plan (placeholder)"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
