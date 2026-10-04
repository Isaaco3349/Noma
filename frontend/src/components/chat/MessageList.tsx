"use client";

import { findRecipientForPlan } from "@/lib/recipients/storage";
import type { SavedRecipient } from "@/lib/recipients/types";
import { ChatEmptyHints } from "./ChatEmptyHints";
import { MessageBubble } from "./MessageBubble";
import { PaymentPlanCard } from "./PaymentPlanCard";
import type { ChatMessage } from "./types";

type MessageListProps = {
  messages: ChatMessage[];
  recipients: SavedRecipient[];
  canConfirmPlans: boolean;
  confirmingPlanId: string | null;
  onPlanConfirm: (messageId: string) => void;
  onPlanCancel: (messageId: string) => void;
};

export function MessageList({
  messages,
  recipients,
  canConfirmPlans,
  confirmingPlanId,
  onPlanConfirm,
  onPlanCancel,
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-bg">
        <ChatEmptyHints />
      </div>
    );
  }

  return (
    <ul className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 overflow-y-auto bg-bg px-4 py-6 sm:px-6 lg:max-w-5xl lg:px-8">
      {messages.map((message) => {
        const matched =
          message.plan &&
          findRecipientForPlan(
            message.plan.beneficiary,
            message.plan.location,
            recipients,
          );
        const recipientReady = Boolean(matched);

        return (
          <li key={message.id}>
            <MessageBubble role={message.role}>
              <p>{message.body}</p>
              {message.plan ? (
                <PaymentPlanCard
                  plan={message.plan}
                  status={message.planStatus ?? "pending"}
                  canConfirm={canConfirmPlans}
                  recipientReady={recipientReady}
                  chain={message.chain}
                  offramp={message.offramp}
                  ngnEstimate={message.ngnEstimate}
                  chainHint={
                    message.planStatus === "confirmed"
                      ? message.chain?.hint
                      : undefined
                  }
                  confirmPending={confirmingPlanId === message.id}
                  onConfirm={() => onPlanConfirm(message.id)}
                  onCancel={() => onPlanCancel(message.id)}
                />
              ) : null}
            </MessageBubble>
          </li>
        );
      })}
    </ul>
  );
}
