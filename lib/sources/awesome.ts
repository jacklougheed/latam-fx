// Colombia (USD/COP) and Brazil (USD/BRL) — current + daily history.
// AwesomeAPI is a free, no-key public FX source with a daily-history endpoint.
import type { RatePoint } from "../types";

const BASE = "https://economia.awesomeapi.com.br/json";

export async function fetchAwesomeLast(
  pairs: string[],
): Promise<Record<string, number>> {
  const res = await fetch(`${BASE}/last/${pairs.join(",")}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("awesome last " + res.status);
  const json = (await res.json()) as Record<
    string,
    { bid?: string; ask?: string }
  >;
  const out: Record<string, number> = {};
  for (const pair of pairs) {
    const key = pair.replace("-", ""); // "USD-COP" -> "USDCOP"
    const node = json[key];
    if (!node) continue;
    const bid = parseFloat(node.bid ?? "");
    const ask = parseFloat(node.ask ?? "");
    const v = Number.isFinite(ask) && ask > 0 ? (bid + ask) / 2 : bid;
    if (Number.isFinite(v) && v > 0) out[pair] = v;
  }
  return out;
}

export async function fetchAwesomeDaily(
  pair: string,
  days = 40,
): Promise<RatePoint[]> {
  const res = await fetch(`${BASE}/daily/${pair}/${days}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("awesome daily " + res.status);
  const json = (await res.json()) as Array<{
    bid?: string;
    timestamp?: string;
  }>;
  if (!Array.isArray(json)) return [];
  return json
    .map((d) => ({ t: Number(d.timestamp) * 1000, v: parseFloat(d.bid ?? "") }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v) && p.v > 0)
    .sort((a, b) => a.t - b.t);
}
