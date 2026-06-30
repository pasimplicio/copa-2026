import { NextResponse } from "next/server";
import { parseOpenFootball, type OpenFootball } from "@/lib/openfootball";

export const dynamic = "force-dynamic";

// Fonte: openfootball (domínio público, sem chave) — Copa do Mundo 2026.
// Pode ser sobrescrita por WC_SOURCE_URL no .env.local.
const SOURCE =
  process.env.WC_SOURCE_URL ??
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export async function GET() {
  let data: OpenFootball;
  try {
    const res = await fetch(SOURCE, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ results: [], error: `source_status_${res.status}` });
    }
    data = await res.json();
  } catch {
    return NextResponse.json({ results: [], error: "fetch_failed" });
  }

  const results = parseOpenFootball(data);
  return NextResponse.json({ results, fetchedAt: new Date().toISOString() });
}
