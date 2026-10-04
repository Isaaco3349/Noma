import type { PaymentPlan } from "@/lib/intent/types";
import type { OfframpState } from "@/lib/tracking/types";

export type PlanConfirmationStatus = "pending" | "confirmed" | "cancelled";

export type PlanChainState = {
  pending?: boolean;
  planId?: string;
  createTxHash?: `0x${string}`;
  executeTxHash?: `0x${string}`;
  error?: string;
  hint?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  body: string;
  plan?: PaymentPlan;
  planStatus?: PlanConfirmationStatus;
  chain?: PlanChainState;
  offramp?: OfframpState;
  ngnEstimate?: { amount: number; rate: number; disclaimer: string };
};
