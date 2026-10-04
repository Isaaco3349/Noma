import { NextResponse } from "next/server";
import { getSettlementLayerFromEnv } from "@/lib/agora/settlementLabel";
import {
  fetchAgoraMetrics,
  getAgoraApiKey,
  isAgoraApiKeyValid,
} from "@/lib/agora/server";

export async function GET() {
  const settlement = getSettlementLayerFromEnv();
  const hasApiKey = Boolean(getAgoraApiKey());

  let metricsOk = false;
  let monadCirculating: string | undefined;
  try {
    const metrics = await fetchAgoraMetrics();
    metricsOk = true;
    monadCirculating = metrics.monad?.circulatingSupply;
  } catch {
    metricsOk = false;
  }

  let apiAuthenticated = false;
  if (hasApiKey) {
    apiAuthenticated = await isAgoraApiKeyValid();
  }

  return NextResponse.json({
    settlement,
    agora: {
      metricsPublic: metricsOk,
      monadCirculatingSupply: monadCirculating,
      apiKeyConfigured: hasApiKey,
      apiKeyValid: apiAuthenticated,
      docsUrl: "https://docs.agora.finance/api",
    },
  });
}
