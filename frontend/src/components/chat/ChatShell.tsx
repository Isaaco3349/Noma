"use client";

import { useCallback, useState } from "react";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import type { ChatMessage } from "./types";

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSend = useCallback((text: string) => {
    const body = text.trim();
    if (!body) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        body,
      },
    ]);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
