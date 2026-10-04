import { formatPlanSummary } from "@/lib/intent/formatPlan";
import type { ChatMessage } from "@/components/chat/types";

/** Plain-language script for text-to-speech (no UI-only symbols). */
export function messageToSpeakable(message: ChatMessage): string {
  let script = message.body;

  if (message.plan) {
    const summary = formatPlanSummary(message.plan)
      .replace("→", " to ")
      .replace("USD", "U S D");
    script = `${script} ${summary}`;
    if (message.planStatus === "confirmed") {
      script += " This plan is confirmed.";
      if (message.chain?.hint) script += ` ${message.chain.hint}`;
    } else if (message.planStatus === "cancelled") {
      script += " This plan was cancelled.";
    } else {
      script +=
        " Sign in and tap Confirm when you are ready. Nothing runs until you confirm.";
    }
  }

  return script;
}
