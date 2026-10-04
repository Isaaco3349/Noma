"use client";

import { useEffect, useState } from "react";
import { PlanHistoryList } from "@/components/tracking/PlanHistoryList";
import { readPlanHistory } from "@/lib/tracking/storage";
import type { TrackedPlan } from "@/lib/tracking/types";

export default function HistoryPage() {
  const [plans, setPlans] = useState<TrackedPlan[]>([]);

  useEffect(() => {
    setPlans(readPlanHistory());
  }, []);

  return (
    <div className="space-y-4 px-4 py-6 sm:px-6">
      <div>
        <h1 className="font-display text-lg font-semibold text-text">
          Plan history
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Monad testnet + Paystack orchestration status (stored in this
          browser).
        </p>
      </div>
      <PlanHistoryList plans={plans} />
    </div>
  );
}
