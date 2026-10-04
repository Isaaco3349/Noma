"use client";

import { COMMAND_KEYWORDS, EXAMPLE_PROMPTS } from "@/lib/intent/commandHints";

type ChatEmptyHintsProps = {
  onTryExample?: (text: string) => void;
};

/** Center hints when chat is empty — not stored as messages. */
export function ChatEmptyHints({ onTryExample }: ChatEmptyHintsProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <p className="max-w-lg font-display text-lg text-text sm:text-xl">
        Say who to pay, where in Nigeria, how much, and how often.
      </p>
      <p className="mt-2 max-w-md text-xs text-text-muted sm:text-sm">
        Use any name and any Nigerian city or state. If bank details are missing,
        Noma will send you to Recipients before confirm.
      </p>

      <dl className="mt-8 grid w-full max-w-lg gap-3 text-left sm:grid-cols-2">
        {COMMAND_KEYWORDS.map(({ label, example }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <dt className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
              {label}
            </dt>
            <dd className="mt-1 text-xs text-text sm:text-sm">{example}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-xs font-medium text-text-muted">
        Try an example
      </p>
      <ul className="mt-3 flex w-full max-w-xl flex-col gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => onTryExample?.(prompt)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-left text-xs text-text hover:bg-surface sm:text-sm"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
