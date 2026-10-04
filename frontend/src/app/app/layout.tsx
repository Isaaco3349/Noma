import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSubnav } from "@/components/layout/AppSubnav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col bg-bg">
      <AppNavbar />
      <AppSubnav />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-bg">
        {children}
      </main>
      <SiteFooter compact />
    </div>
  );
}
