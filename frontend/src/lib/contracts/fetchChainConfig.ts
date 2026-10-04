import type { NomaChainConfig } from "./config";

export type { NomaChainConfig };

/** Load contract addresses from server (reads .env.local at runtime). */
export async function fetchChainConfigFromServer(): Promise<NomaChainConfig | null> {
  const res = await fetch("/api/noma/chain-config", { cache: "no-store" });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    chainReady?: boolean;
    config?: NomaChainConfig;
  };
  if (!json.chainReady || !json.config) return null;
  return json.config;
}
