const HINTS = [
  "Send to family in Lagos on a schedule you choose",
  "Set an amount in dollars and confirm before anything runs",
  "One corridor: diaspora senders to Nigeria",
] as const;

/** Soft background copy — not chat messages. */
export function ChatEmptyHints() {
  return (
    <div
      className="pointer-events-none flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
      aria-hidden
    >
      <p className="max-w-sm font-display text-lg text-text/25 sm:text-xl">
        Start with who to pay and when.
      </p>
      <ul className="mt-6 max-w-md space-y-2 text-xs leading-relaxed text-text-muted/45 sm:text-sm">
        {HINTS.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
