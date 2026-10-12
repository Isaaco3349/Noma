import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSubnav } from "@/components/layout/AppSubnav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-bg">
      <AppNavbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <AppSubnav />
        <main className="min-w-0 flex-1 bg-bg">{children}</main>
      </div>
      <SiteFooter compact />
    </div>
  );
}
