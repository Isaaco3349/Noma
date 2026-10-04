import { NextResponse } from "next/server";
import { fetchAgoraMetrics } from "@/lib/agora/server";

export async function GET() {
  try {
    const metrics = await fetchAgoraMetrics();
    return NextResponse.json({ ok: true, metrics });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Agora metrics unavailable",
      },
      { status: 502 },
    );
  }
}
