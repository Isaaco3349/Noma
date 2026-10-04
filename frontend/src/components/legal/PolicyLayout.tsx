import Link from "next/link";
import type { ReactNode } from "react";

type PolicyLayoutProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function PolicyLayout({
  title,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="border-b border-border bg-surface px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href="/" className="font-display text-lg font-semibold hover:opacity-90">
            Noma
          </Link>
          <Link
            href="/app"
            className="text-sm text-text-muted underline hover:text-text"
          >
            Open app
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: {lastUpdated}</p>
        <article className="prose-policy mt-8 space-y-6 text-sm leading-relaxed text-text sm:text-base">
          {children}
        </article>
        <p className="mt-12 border-t border-border pt-6 text-xs text-text-muted">
          These documents describe the current demo product. They are not legal
          advice. Formal review is required before any production launch.
        </p>
      </main>
    </div>
  );
}
