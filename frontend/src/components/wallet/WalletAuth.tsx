"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { MONAD_TESTNET_FAUCET_URL } from "@/lib/wallet/constants";
import { ExportRecoveryModal } from "./ExportRecoveryModal";
import { useWallet } from "./WalletContext";

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

type WalletAuthProps = {
  variant?: "appBar" | "hero";
  onSignedIn?: () => void;
};

export function WalletAuth({
  variant = "appBar",
  onSignedIn,
}: WalletAuthProps) {
  const { auth, busy, error, clearError, signUp, signIn, signOut } =
    useWallet();
  const [balanceMon, setBalanceMon] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const isHero = variant === "hero";

  useEffect(() => {
    if (auth.status !== "signed_in") {
      setBalanceMon(null);
      setBalanceError(false);
      return;
    }

    let cancelled = false;
    const rpc =
      process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL ??
      monadTestnet.rpcUrls.default.http[0];
    const client = createPublicClient({
      chain: monadTestnet,
      transport: http(rpc),
    });

    void client
      .getBalance({ address: auth.address })
      .then((wei) => {
        if (!cancelled) {
          setBalanceMon(formatEther(wei));
          setBalanceError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setBalanceError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [auth]);

  const buttonClass = isHero
    ? "rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-bg disabled:opacity-50"
    : "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:bg-bg disabled:opacity-50 sm:text-sm";
  const primaryHeroClass =
    "rounded-md bg-text px-5 py-2.5 text-sm font-medium text-surface hover:opacity-90 disabled:opacity-50";

  async function handleSignIn() {
    const ok = await signIn();
    if (ok) onSignedIn?.();
  }

  async function handleSignUp() {
    const ok = await signUp();
    if (ok) onSignedIn?.();
  }

  const errorBlock = error ? (
    <div
      className={`w-full rounded-md border border-semantic-error/30 bg-surface p-3 text-left ${isHero ? "text-sm" : "text-[11px] sm:text-xs"}`}
      role="alert"
    >
      <p className="font-medium text-semantic-error">{error.title}</p>
      <p className="mt-1 text-text-muted">{error.message}</p>
      {error.learnMoreHref ? (
        <a
          href={error.learnMoreHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-text-muted underline hover:text-text"
        >
          Compatible passkey setups
        </a>
      ) : null}
      <button
        type="button"
        className="mt-2 text-text-muted underline hover:text-text"
        onClick={clearError}
      >
        Dismiss
      </button>
    </div>
  ) : null;

  if (auth.status === "signed_in" && !isHero) {
    const balanceLabel = balanceError
      ? "Unavailable"
      : balanceMon === null
        ? "Loading…"
        : `${balanceMon} MON`;

    return (
      <>
        <div className="rounded-lg border border-border bg-surface p-3 sm:p-4">
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-x-8">
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Account
              </dt>
              <dd className="font-mono text-sm text-text sm:mt-1">
                {shortenAddress(auth.address)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Balance
              </dt>
              <dd className="text-sm font-medium text-text sm:mt-1">
                {balanceLabel}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
              <a
                href={MONAD_TESTNET_FAUCET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-text"
              >
                Get test MON
              </a>
              <button
                type="button"
                className="underline hover:text-text"
                onClick={() => setExportOpen(true)}
              >
                Export recovery phrase
              </button>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={signOut}
              disabled={busy}
            >
              Sign out
            </button>
          </div>
        </div>
        <ExportRecoveryModal
          open={exportOpen}
          onClose={() => setExportOpen(false)}
        />
      </>
    );
  }

  const passkeyNote = (
    <p
      className={
        isHero
          ? "max-w-md text-sm leading-relaxed text-text-muted"
          : "text-[11px] leading-snug text-text-muted sm:text-xs"
      }
    >
      A passkey lets you sign in with your face, fingerprint, or device PIN, with
      no password to remember.
    </p>
  );

  const actions = (
    <div
      className={
        isHero
          ? "flex flex-col gap-3 sm:flex-row sm:items-center"
          : "flex flex-wrap justify-end gap-2"
      }
    >
      <button
        type="button"
        className={buttonClass}
        disabled={busy}
        onClick={() => void handleSignIn()}
      >
        {busy ? "Working…" : "Sign in"}
      </button>
      <button
        type="button"
        className={isHero ? primaryHeroClass : `${buttonClass} border-accent bg-accent/30`}
        disabled={busy}
        onClick={() => void handleSignUp()}
      >
        Create account with passkey
      </button>
    </div>
  );

  if (isHero) {
    return (
      <div className="flex max-w-lg flex-col gap-4">
        {passkeyNote}
        {errorBlock}
        {actions}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-3 sm:p-4">
      <p className="text-sm font-medium text-text">Wallet</p>
      <p className="mt-1 max-w-prose text-xs leading-relaxed text-text-muted">
        A passkey lets you sign in with your face, fingerprint, or device PIN,
        with no password to remember.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {errorBlock}
        {actions}
      </div>
    </div>
  );
}
