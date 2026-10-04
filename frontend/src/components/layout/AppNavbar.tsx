import Link from "next/link";
import { NomaLogo } from "@/components/brand/NomaLogo";
import { BrandTitleBlock } from "@/components/layout/BrandTitleBlock";
import { AgoraSettlementStrip } from "@/components/settlement/AgoraSettlementStrip";
import { WalletAuth } from "@/components/wallet/WalletAuth";

export function AppNavbar() {
  return (
    <header className="shrink-0 border-b border-border bg-surface">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 lg:items-center">
          <Link href="/" className="hover:opacity-90">
            <BrandTitleBlock size="sm" />
          </Link>
          <NomaLogo size="md" tone="dark" className="lg:opacity-80" />
        </div>
      </div>
      <div className="border-t border-border bg-bg px-4 py-3 sm:px-6 lg:px-8">
        <WalletAuth variant="appBar" />
        <AgoraSettlementStrip />
        <p className="mt-2 text-center text-[11px] leading-snug text-text-muted lg:text-left sm:text-xs">
          Orchestration only, not a money transmitter
        </p>
      </div>
    </header>
  );
}
