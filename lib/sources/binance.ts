// Bolivian "blue" rate, sourced live from Binance P2P (USDT/BOB), the same way
// the popular Bolivian-blue trackers do it.

const URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

async function fetchSide(tradeType: "BUY" | "SELL"): Promise<number[]> {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      asset: "USDT",
      fiat: "BOB",
      tradeType,
      page: 1,
      rows: 10,
      payTypes: [],
      publisherType: null,
      countries: [],
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("binance " + res.status);
  const json = (await res.json()) as {
    data?: Array<{ adv?: { price?: string } }>;
  };
  return (json.data ?? [])
    .map((d) => parseFloat(d?.adv?.price ?? ""))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function median(nums: number[]): number | null {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export interface BinanceResult {
  buy: number; // bid — lower
  sell: number; // ask — higher
  mid: number;
}

export async function fetchBolivianBlue(): Promise<BinanceResult> {
  const [buyAds, sellAds] = await Promise.all([
    fetchSide("BUY"),
    fetchSide("SELL"),
  ]);
  // Use the best (top) handful of ads on each side to smooth out outliers.
  const a = median(buyAds.slice(0, 5));
  const b = median(sellAds.slice(0, 5));
  if (a == null || b == null) throw new Error("binance: no ads");
  const buy = Math.min(a, b);
  const sell = Math.max(a, b);
  return { buy, sell, mid: (buy + sell) / 2 };
}
