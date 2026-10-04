import type { PaymentPlan, PaymentSchedule } from "./types";

export function formatScheduleLabel(schedule: PaymentSchedule): string {
  if (schedule.kind === "one_time") {
    return "One-time (after you confirm)";
  }
  if (schedule.frequency === "daily") {
    return "Every day (on-chain uses weekly cadence on testnet)";
  }
  if (schedule.frequency === "weekly") {
    return "Every week";
  }
  const day = schedule.dayOfMonth ?? 1;
  return `Monthly on the ${ordinal(day)}`;
}

export function formatAmountLabel(amountUsd: number): string {
  return `$${amountUsd.toFixed(2)} USD → NGN (rate at execution)`;
}

export function formatPlanSummary(plan: PaymentPlan): string {
  return `${formatAmountLabel(plan.amountUsd)} to ${plan.beneficiary} in ${plan.location}, ${formatScheduleLabel(plan.schedule).toLowerCase()}.`;
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
