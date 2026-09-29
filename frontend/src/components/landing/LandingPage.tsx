"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NomaLogo } from "@/components/brand/NomaLogo";
import { BrandHeader } from "@/components/layout/BrandHeader";
import { WalletAuth } from "@/components/wallet/WalletAuth";
import { useWallet } from "@/components/wallet/WalletContext";

const FEATURES = [
  {
    n: "01",
    title: "Say it or type it",
    body: "Describe recurring sends to family in Nigeria without long forms.",
  },
  {
    n: "02",
    title: "Always confirm",
    body: "Every payment plan is shown for you to approve or cancel first.",
  },
  {
    n: "03",
    title: "One corridor",
    body: "Diaspora → Nigeria on Monad testnet, scope kept intentionally narrow.",
  },
] as const;

export function LandingPage() {
  const router = useRouter();
  const { auth } = useWallet();

  const goToApp = () => router.push("/app");

  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="border-b border-border">
        <BrandHeader
          trailing={
            <>
              {auth.status === "signed_in" ? (
                <Link
                  href="/app"
                  className="rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium text-text hover:opacity-90"
                >
                  Open app
                </Link>
              ) : null}
              <NomaLogo size="lg" tone="dark" />
            </>
          }
        />
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
        <section className="border-l-2 border-text pl-6 sm:pl-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Cross-border payments
          </p>
          <h1 className="mt-4 max-w-xl font-display text-[2rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.75rem]">
            Send to Nigeria in plain language.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
            Tell Noma who to pay and when. You review the plan before anything
            runs. Sign in with a passkey, no password to memorize.
          </p>
        </section>

        <section className="mt-14 rounded-lg border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Get started</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
            Create an account with your device passkey, or sign in if you already
            have one. You will open the chat where plans are built and confirmed.
          </p>
          <div className="mt-8 border-t border-border pt-6">
            {auth.status === "signed_in" ? (
              <Link
                href="/app"
                className="inline-block rounded-md bg-text px-5 py-2.5 text-sm font-medium text-surface hover:opacity-90"
              >
                Continue to Noma
              </Link>
            ) : (
              <WalletAuth variant="hero" onSignedIn={goToApp} />
            )}
          </div>
        </section>

        <ul className="mt-14 grid gap-5 sm:grid-cols-3">
          {FEATURES.map((item) => (
            <li
              key={item.n}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <p className="font-mono text-xs text-accent">{item.n}</p>
              <p className="mt-3 font-display text-lg font-semibold">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-14 border-t border-border pt-8 text-center text-xs leading-relaxed text-text-muted">
          Orchestration only, not a money transmitter. Fiat payout is intended
          through licensed partners.
        </p>
      </main>
    </div>
  );
}
