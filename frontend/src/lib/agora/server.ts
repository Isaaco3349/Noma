import { AGORA_API_BASE } from "./constants";

export type AgoraChainMetrics = {
  network: string;
  chainId: string;
  circulatingSupply: string;
  totalSupply: string;
};

export type AgoraMetricsSnapshot = {
  partial: boolean;
  circulatingSupply?: string;
  totalSupply?: string;
  chains: AgoraChainMetrics[];
  monad?: AgoraChainMetrics;
};

export function getAgoraApiKey(): string | undefined {
  const key = process.env.AGORA_API_KEY?.trim();
  return key && key.length > 0 ? key : undefined;
}

export async function fetchAgoraMetrics(): Promise<AgoraMetricsSnapshot> {
  const res = await fetch(`${AGORA_API_BASE}/v0/metrics`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Agora metrics HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    partial: boolean;
    circulatingSupply?: string;
    totalSupply?: string;
    chains: AgoraChainMetrics[];
  };
  const monad = json.chains.find((c) => c.network === "monad");
  return { ...json, monad };
}

/** Exchange Agora access key for session JWT (optional — mint/redeem/routes). */
export async function exchangeAgoraSessionJwt(
  apiKey: string,
): Promise<string> {
  const res = await fetch(`${AGORA_API_BASE}/v0/auth/token`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    throw new Error(`Agora auth HTTP ${res.status}`);
  }
  const json = (await res.json()) as { sessionJwt?: string };
  if (!json.sessionJwt) {
    throw new Error("Agora auth response missing sessionJwt");
  }
  return json.sessionJwt;
}

export async function isAgoraApiKeyValid(): Promise<boolean> {
  const key = getAgoraApiKey();
  if (!key) return false;
  try {
    await exchangeAgoraSessionJwt(key);
    return true;
  } catch {
    return false;
  }
}
