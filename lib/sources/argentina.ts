// Argentina — the "blue dollar" (parallel) rate that reflects what people
// actually pay on the ground. Current from dolarapi; history from Bluelytics.
import type { RatePoint } from "../types";

export interface ArgentinaCurrent {
  buy: number;
  sell: number;
  mid: number;
}

export async function fetchArgentinaBlue(): Promise<ArgentinaCurrent> {
  const res = await fetch("https://dolarapi.com/v1/dolares/blue", {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("dolarapi " + res.status);
  const j = (await res.json()) as { compra?: number; venta?: number };
  const buy = Number(j.compra);
  const sell = Number(j.venta);
  if (!Number.isFinite(buy) || !Number.isFinite(sell)) {
    throw new Error("dolarapi: bad payload");
  }
  return { buy, sell, mid: (buy + sell) / 2 };
}

export async function fetchArgentinaBlueHistory(): Promise<RatePoint[]> {
  const res = await fetch("https://api.bluelytics.com.ar/v2/evolution.json", {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("bluelytics " + res.status);
  const j = (await res.json()) as Array<{
    source?: string;
    date?: string;
    value_buy?: number;
    value_sell?: number;
  }>;
  if (!Array.isArray(j)) return [];
  return j
    .filter((d) => (d.source || "").toLowerCase() === "blue")
    .map((d) => {
      const t = Date.parse((d.date || "") + "T00:00:00Z");
      const buy = Number(d.value_buy);
      const sell = Number(d.value_sell);
      const v =
        Number.isFinite(buy) && Number.isFinite(sell)
          ? (buy + sell) / 2
          : NaN;
      return { t, v };
    })
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v) && p.v > 0)
    .sort((a, b) => a.t - b.t);
}
