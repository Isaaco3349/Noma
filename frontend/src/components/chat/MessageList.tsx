import { MessageBubble } from "./MessageBubble";
import { PaymentPlanCard } from "./PaymentPlanCard";

const MOCK_MESSAGES = [
  {
    id: "1",
    role: "user" as const,
    body: "Send $100 to my mum in Lagos on the 2nd of every month.",
  },
  {
    id: "2",
    role: "assistant" as const,
    body: "Here’s the plan I understood. Please review and confirm before anything runs on Monad.",
    showPlan: true,
  },
];

export function MessageList() {
  return (
    <ul className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 sm:px-6">
      {MOCK_MESSAGES.map((message) => (
        <li key={message.id}>
          <MessageBubble role={message.role}>
            <p>{message.body}</p>
            {message.showPlan ? (
              <PaymentPlanCard
                amountUsd="$100.00 USD → NGN (rate at execution)"
                beneficiary="Mum"
                location="Lagos, Nigeria"
                schedule="Monthly on the 2nd"
              />
            ) : null}
          </MessageBubble>
        </li>
      ))}
    </ul>
  );
}
