// Current USD exchange rates from ExchangeRate-API's free, keyless endpoint.
// Used as a fallback when AwesomeAPI cannot provide COP/BRL current values.

const BASE = "https://open.er-api.com/v6/latest/USD";

export async function fetchOpenExchangeRates(
  codes: string[],
): Promise<Record<string, number>> {
  const res = await fetch(BASE, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("open.er-api latest " + res.status);

  const json = (await res.json()) as {
    result?: string;
    rates?: Record<string, number>;
  };
  if (json.result && json.result !== "success") {
    throw new Error("open.er-api result " + json.result);
  }

  const out: Record<string, number> = {};
  for (const code of codes) {
    const v = json.rates?.[code];
    if (typeof v === "number" && Number.isFinite(v) && v > 0) {
      out[code] = v;
    }
  }
  return out;
}
