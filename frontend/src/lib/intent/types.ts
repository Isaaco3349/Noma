/** Structured payment plan for Nigeria corridor (USD source → NGN at execution). */
export type PaymentPlan = {
  amountUsd: number;
  beneficiary: string;
  location: string;
  schedule: PaymentSchedule;
  corridor: "NG";
};

export type PaymentSchedule =
  | { kind: "one_time" }
  | {
      kind: "recurring";
      frequency: "weekly" | "monthly" | "daily";
      dayOfMonth?: number;
    };

export type ParseSuccess = {
  ok: true;
  plan: PaymentPlan;
};

export type ParseFailure = {
  ok: false;
  message: string;
  missingFields: Array<"amount" | "beneficiary" | "location" | "schedule">;
};

export type ParseResult = ParseSuccess | ParseFailure;
