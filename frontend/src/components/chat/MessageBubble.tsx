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
        className={`max-w-[min(100%,36rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-accent/40 text-text"
            : "rounded-bl-md border border-border bg-surface text-text"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
