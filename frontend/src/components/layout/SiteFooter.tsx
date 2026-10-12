import Link from "next/link";

type SiteFooterProps = {
  compact?: boolean;
  className?: string;
};

export function SiteFooter({ compact = false, className = "" }: SiteFooterProps) {
  return (
    <footer
      className={
        compact
          ? `border-t border-border bg-surface px-4 py-3 text-center sm:px-6 ${className}`.trim()
          : `border-t border-border px-4 py-10 text-center sm:px-8 lg:py-12 ${className}`.trim()
      }
    >
      <nav
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-text-muted sm:text-sm"
        aria-label="Legal"
      >
        <Link href="/legal/terms" className="underline hover:text-text">
          Terms of use
        </Link>
        <Link href="/legal/privacy" className="underline hover:text-text">
          Privacy policy
        </Link>
      </nav>
      <p className="mx-auto mt-3 max-w-xl text-[11px] leading-relaxed text-text-muted sm:text-xs">
        Orchestration only, not a money transmitter. Fiat payout to Nigeria is
        intended through licensed partners. Monad testnet demo.
      </p>
    </footer>
  );
}
