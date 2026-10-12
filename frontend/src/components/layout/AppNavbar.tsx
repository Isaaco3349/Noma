import Link from "next/link";
import { NomaLogo } from "@/components/brand/NomaLogo";
import { BrandTitleBlock } from "@/components/layout/BrandTitleBlock";
import { AgoraSettlementStrip } from "@/components/settlement/AgoraSettlementStrip";
import { WalletAuth } from "@/components/wallet/WalletAuth";

export function AppNavbar() {
  return (
    <header className="shrink-0 border-b border-border bg-surface">
      <div className="px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-start justify-between gap-4 lg:items-center">
          <Link href="/" className="hover:opacity-90">
            <BrandTitleBlock size="sm" />
          </Link>
          <NomaLogo size="md" tone="dark" className="lg:opacity-80" />
        </div>
      </div>
      <div className="border-t border-border bg-bg px-4 py-2 sm:px-6 sm:py-3 lg:px-10">
        <WalletAuth variant="appBar" />
        <AgoraSettlementStrip />
      </div>
    </header>
  );
}
