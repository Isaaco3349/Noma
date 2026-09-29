import { ChatShell } from "@/components/chat/ChatShell";
import { AppNavbar } from "@/components/layout/AppNavbar";

export default function AppPage() {
  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col bg-bg">
      <AppNavbar />
      <main className="flex min-h-0 flex-1 flex-col bg-bg">
        <ChatShell />
      </main>
    </div>
  );
}
