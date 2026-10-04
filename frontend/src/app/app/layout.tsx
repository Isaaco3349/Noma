import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSubnav } from "@/components/layout/AppSubnav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full flex-col bg-bg">
      <AppNavbar />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <AppSubnav />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-bg">
          {children}
        </main>
      </div>
      <SiteFooter compact />
    </div>
  );
}
