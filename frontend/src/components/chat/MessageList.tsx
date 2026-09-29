import { ChatEmptyHints } from "./ChatEmptyHints";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "./types";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-bg">
        <ChatEmptyHints />
      </div>
    );
  }

  return (
    <ul className="flex flex-1 flex-col gap-4 overflow-y-auto bg-bg px-4 py-6 sm:px-6">
      {messages.map((message) => (
        <li key={message.id}>
          <MessageBubble role={message.role}>
            <p>{message.body}</p>
          </MessageBubble>
        </li>
      ))}
    </ul>
  );
}
