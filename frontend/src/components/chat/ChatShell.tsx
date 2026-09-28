import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export function ChatShell() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageList />
      <ChatInput />
    </div>
  );
}
