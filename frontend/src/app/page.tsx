import { ChatShell } from "@/components/chat/ChatShell";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col bg-bg">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        <ChatShell />
      </main>
    </div>
  );
}
