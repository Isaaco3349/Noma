import type { ReactNode } from "react";

type MessageBubbleProps = {
  role: "user" | "assistant";
  children: ReactNode;
};

export function MessageBubble({ role, children }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[min(100%,36rem)] lg:max-w-[min(100%,42rem)] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-2xl rounded-br-sm bg-text text-surface"
            : "rounded-2xl rounded-bl-sm border border-border bg-surface text-text shadow-[0_1px_0_0_var(--border)]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
