"use client";

import { useEffect, useState } from "react";

type StatusPayload = {
  settlement: {
    tokenSymbol: string;
    issuer: "agora" | "demo";
  };
  agora: {
    metricsPublic: boolean;
    monadCirculatingSupply?: string;
    apiKeyConfigured: boolean;
    apiKeyValid: boolean;
  };
};

function formatSupply(raw?: string): string | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M AUSD`;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} AUSD`;
}

type ChainConfigPayload = {
  chainReady: boolean;
  missing: string[];
  hint?: string;
};

export function AgoraSettlementStrip() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [chain, setChain] = useState<ChainConfigPayload | null>(null);

  useEffect(() => {
    void fetch("/api/agora/status")
      .then((r) => r.json())
      .then((json: StatusPayload) => setStatus(json))
      .catch(() => setStatus(null));
    void fetch("/api/noma/config-status")
      .then((r) => r.json())
      .then((json: ChainConfigPayload) => setChain(json))
      .catch(() => setChain(null));
  }, []);

  if (!status) return null;

  const monadSupply = formatSupply(status.agora.monadCirculatingSupply);
  const issuerLabel =
    status.settlement.issuer === "agora"
      ? "Agora AUSD on Monad"
      : "Demo token (swap to AUSD for production)";

  return (
    <p className="mt-2 text-center text-[11px] leading-snug text-text-muted sm:text-xs">
      Settlement:{" "}
      <span className="font-medium text-text">{issuerLabel}</span>
      {status.agora.metricsPublic && monadSupply ? (
        <>
          {" "}
          · live Agora metrics · ~{monadSupply} on Monad
        </>
      ) : null}
      {status.agora.apiKeyConfigured ? (
        <>
          {" "}
          · Agora API{" "}
          {status.agora.apiKeyValid ? "connected" : "key pending"}
        </>
      ) : null}
      {chain && !chain.chainReady ? (
        <>
          <span className="mt-1 block text-semantic-error">
            Monad contracts not configured
            {chain.missing.length > 0
              ? `: ${chain.missing.join(", ")}`
              : ""}
          </span>
        </>
      ) : null}
      {chain?.chainReady ? (
        <span className="mt-1 block text-semantic-success">
          Monad on-chain confirm enabled
        </span>
      ) : null}
    </p>
  );
}
