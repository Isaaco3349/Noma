import { keccak256, parseUnits, toBytes } from "viem";
import type { PaymentPlan } from "@/lib/intent/types";
import { ScheduleKind } from "./abis";

export function beneficiaryRefFromPlan(plan: PaymentPlan): `0x${string}` {
  const label = `${plan.beneficiary}-${plan.location}-NG`.toLowerCase();
  return keccak256(toBytes(label));
}

export function tokenAmountFromUsd(
  amountUsd: number,
  decimals: number,
): bigint {
  return parseUnits(amountUsd.toFixed(decimals > 6 ? 6 : 2), decimals);
}

export function scheduleKindFromPlan(plan: PaymentPlan): number {
  if (plan.schedule.kind === "one_time") return ScheduleKind.OneTime;
  if (plan.schedule.frequency === "weekly") return ScheduleKind.Weekly;
  return ScheduleKind.Monthly;
}

export function dayOfMonthFromPlan(plan: PaymentPlan): number {
  if (plan.schedule.kind === "recurring" && plan.schedule.frequency === "monthly") {
    return plan.schedule.dayOfMonth ?? 1;
  }
  return 0;
}
