import type { PaymentPlan } from "@/lib/intent/types";
import type { PlanChainState } from "@/components/chat/types";

export type OfframpState = {
  status: "pending" | "success" | "demo" | "failed";
  mode: "live" | "demo";
  ngnAmount?: number;
  usdNgnRate?: number;
  paystackTransferCode?: string;
  paystackReference?: string;
  recipientNickname?: string;
  error?: string;
  message?: string;
  fallbackFromLive?: boolean;
};

export type TrackedPlan = {
  id: string;
  messageId: string;
  createdAt: number;
  userInstruction: string;
  plan: PaymentPlan;
  planStatus: "confirmed" | "cancelled";
  chain?: PlanChainState;
  offramp?: OfframpState;
};
