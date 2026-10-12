"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { createPublicClient, http } from "viem";
import { requestTestnetAusd } from "@/lib/agora/ausdFaucet";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { MONAD_TESTNET_FAUCET_URL } from "@/lib/wallet/constants";
import {
  fetchSettlementBalance,
  friendlyAusdFaucetError,
} from "@/lib/wallet/fetchSettlementBalance";
import { ExportRecoveryModal } from "./ExportRecoveryModal";
import { useWallet } from "./WalletContext";

const MONAD_EXPLORER_TX = "https://testnet.monadvision.com/tx/";

function formatSettlementBalance(raw: string): string {
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return raw;
  if (n >= 1000) {
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  if (n >= 1) {
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

type WalletAuthProps = {
  variant?: "appBar" | "hero";
  onSignedIn?: () => void;
};

export function WalletAuth({
  variant = "appBar",
  onSignedIn,
}: WalletAuthProps) {
  const { auth, busy, error, clearError, signUp, signIn, signOut, withWalletClient } =
    useWallet();
  const [balanceMon, setBalanceMon] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState(false);
  const [balanceSettlement, setBalanceSettlement] = useState<string | null>(
    null,
  );
  const [settlementBalanceError, setSettlementBalanceError] = useState(false);
  const [settlementSymbol, setSettlementSymbol] = useState<string | null>(null);
  const [balanceRefreshKey, setBalanceRefreshKey] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [ausdBusy, setAusdBusy] = useState(false);
  const [ausdStatus, setAusdStatus] = useState<string | null>(null);

  const isHero = variant === "hero";

  async function copyAddress() {
    if (auth.status !== "signed_in") return;
    try {
      await navigator.clipboard.writeText(auth.address);
      setAddressCopied(true);
      window.setTimeout(() => setAddressCopied(false), 2000);
    } catch {
      setAddressCopied(false);
    }
  }

  useEffect(() => {
    if (auth.status !== "signed_in") {
      setBalanceMon(null);
      setBalanceError(false);
      setBalanceSettlement(null);
      setSettlementBalanceError(false);
      setSettlementSymbol(null);
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

    setSettlementSymbol("AUSD");
    setBalanceSettlement(null);
    void fetchSettlementBalance(auth.address)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setBalanceSettlement(null);
          setSettlementSymbol(null);
          setSettlementBalanceError(false);
          return;
        }
        setBalanceSettlement(result.balance);
        setSettlementSymbol(result.symbol);
        setSettlementBalanceError(false);
      })
      .catch(() => {
        if (!cancelled) setSettlementBalanceError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [auth, balanceRefreshKey]);

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

  async function handleRequestAusd() {
    if (auth.status !== "signed_in") return;
    setAusdBusy(true);
    setAusdStatus(null);
    try {
      const client = await withWalletClient();
      if (!client) {
        setAusdStatus("Sign in with your passkey, then try again.");
        return;
      }
      const hash = await requestTestnetAusd(client, auth.address);
      setAusdStatus(`${MONAD_EXPLORER_TX}${hash}`);
      setBalanceRefreshKey((k) => k + 1);
    } catch (err) {
      setAusdStatus(friendlyAusdFaucetError(err));
    } finally {
      setAusdBusy(false);
    }
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

    const settlementBalanceLabel = !settlementSymbol
      ? null
      : settlementBalanceError
        ? `${settlementSymbol} unavailable`
        : balanceSettlement === null
          ? `Loading ${settlementSymbol}…`
          : `${formatSettlementBalance(balanceSettlement)} ${settlementSymbol}`;

    const monNumeric =
      balanceMon != null ? Number.parseFloat(balanceMon) : null;
    const needsMon =
      monNumeric != null &&
      Number.isFinite(monNumeric) &&
      monNumeric < 0.001;

    return (
      <>
        <div className="rounded-lg border border-border bg-surface p-3 lg:p-3">
          {/* Desktop: compact bar so chat keeps most of the viewport */}
          <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-2">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Wallet
            </span>
            <code className="max-w-[min(28rem,36vw)] truncate rounded-md border border-border bg-bg px-2 py-1 font-mono text-[11px] text-text">
              {auth.address}
            </code>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={buttonClass}
                onClick={() => void copyAddress()}
              >
                {addressCopied ? "Copied" : "Copy"}
              </button>
              <a
                href={MONAD_TESTNET_FAUCET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonClass} inline-flex border-accent bg-accent/20`}
              >
                MON
              </a>
              <button
                type="button"
                className={`${buttonClass} border-accent bg-accent/20`}
                disabled={ausdBusy || busy}
                onClick={() => void handleRequestAusd()}
              >
                {ausdBusy ? "Requesting…" : "Test AUSD"}
              </button>
            </div>
            <span className="text-xs text-text-muted">
              <span className="font-medium text-text">{balanceLabel}</span>
              {settlementBalanceLabel ? (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="font-medium text-text">
                    {settlementBalanceLabel}
                  </span>
                </>
              ) : null}
            </span>
            <button
              type="button"
              className="text-xs text-text-muted underline hover:text-text"
              onClick={() => setExportOpen(true)}
            >
              Recovery phrase
            </button>
            <button
              type="button"
              className={`${buttonClass} ml-auto`}
              onClick={signOut}
              disabled={busy}
            >
              Sign out
            </button>
          </div>

          {/* Mobile / tablet: stacked card */}
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:gap-x-8 lg:hidden">
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Wallet address (Monad testnet)
              </dt>
              <dd className="mt-2 flex flex-col gap-2">
                <code className="break-all rounded-md border border-border bg-bg px-2 py-2 font-mono text-[11px] leading-relaxed text-text sm:text-xs">
                  {auth.address}
                </code>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => void copyAddress()}
                  >
                    {addressCopied ? "Copied" : "Copy address"}
                  </button>
                  <a
                    href={MONAD_TESTNET_FAUCET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonClass} inline-flex items-center border-accent bg-accent/20`}
                  >
                    Get test MON
                  </a>
                  <button
                    type="button"
                    className={`${buttonClass} border-accent bg-accent/20`}
                    disabled={ausdBusy || busy}
                    onClick={() => void handleRequestAusd()}
                  >
                    {ausdBusy ? "Requesting…" : "Get test AUSD"}
                  </button>
                </div>
                {needsMon ? (
                  <p className="text-[11px] leading-relaxed text-text-muted sm:text-xs">
                    New accounts start at 0 MON. Copy the address above, open
                    the faucet, paste it, and request test MON. No seed phrase
                    or external wallet required.
                  </p>
                ) : null}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:block">
              <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Balance
              </dt>
              <dd className="text-sm font-medium text-text sm:mt-1">
                {balanceLabel}
                {settlementBalanceLabel ? (
                  <span className="mt-0.5 block text-text-muted sm:mt-1">
                    {settlementBalanceLabel}
                  </span>
                ) : null}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:hidden">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
              <button
                type="button"
                className="underline hover:text-text"
                onClick={() => setExportOpen(true)}
              >
                Export recovery phrase (optional backup)
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
          {ausdStatus ? (
            <p className="mt-2 text-[11px] sm:text-xs">
              {ausdStatus.startsWith("http") ? (
                <a
                  href={ausdStatus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-text underline underline-offset-2"
                >
                  Test AUSD requested. View transaction
                </a>
              ) : (
                <span className="text-semantic-error">{ausdStatus}</span>
              )}
            </p>
          ) : null}
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
