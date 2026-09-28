export function Navbar() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
      <div>
        <p className="text-lg font-semibold tracking-tight text-text">Noma</p>
        <p className="text-xs text-text-muted">
          Diaspora → Nigeria · Monad testnet
        </p>
      </div>
      <p className="max-w-[12rem] text-right text-[11px] leading-snug text-text-muted sm:max-w-none sm:text-xs">
        Orchestration only — not a money transmitter
      </p>
    </header>
  );
}
