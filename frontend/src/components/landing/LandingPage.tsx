"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NomaLogo } from "@/components/brand/NomaLogo";
import { BrandHeader } from "@/components/layout/BrandHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
    body: "Diaspora to Nigeria on Monad testnet. Scope kept intentionally narrow.",
  },
] as const;

export function LandingPage() {
  const router = useRouter();
  const { auth } = useWallet();

  const goToApp = () => router.push("/app");

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text">
      <header className="shrink-0 border-b border-border bg-surface">
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

      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-20">
            <section className="border-l-2 border-text pl-6 sm:pl-8 lg:max-w-xl lg:pl-10">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                Cross-border payments
              </p>
              <h1 className="mt-4 font-display text-[2rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.75rem] lg:text-[2.625rem] xl:text-[3rem]">
                Send to Nigeria in plain language.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
                Tell Noma who to pay and when. You review the plan before anything
                runs. Sign in with a passkey, no password to memorize.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:p-10">
              <h2 className="font-display text-xl font-semibold sm:text-2xl">
                Get started
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
                Create an account with your device passkey, or sign in if you
                already have one. You will open the chat where plans are built
                and confirmed.
              </p>
              <div className="mt-8 border-t border-border pt-8">
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
                <p className="mt-4 text-xs leading-relaxed text-text-muted">
                  By using Noma you agree to our{" "}
                  <Link href="/legal/terms" className="underline hover:text-text">
                    Terms of use
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy"
                    className="underline hover:text-text"
                  >
                    Privacy policy
                  </Link>
                  .
                </p>
              </div>
            </section>
          </div>

          <ul className="mt-16 grid gap-6 sm:grid-cols-3 lg:mt-24 xl:mt-28">
            {FEATURES.map((item) => (
              <li
                key={item.n}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm"
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
        </div>
      </main>

      <SiteFooter className="mt-auto shrink-0 bg-surface" />
    </div>
  );
}
