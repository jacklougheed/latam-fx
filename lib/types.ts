export type CurrencyCode = "COP" | "ARS" | "BRL" | "BOB";

/** A single historical data point: timestamp (ms) + value (local units per 1 USD). */
export interface RatePoint {
  t: number;
  v: number;
}

/** Last-known current value for a currency, persisted between restarts. */
export interface CurrentValue {
  perUsd: number | null;
  buy?: number | null;
  sell?: number | null;
  updatedAt: number | null;
  source: string;
  sourceUrl?: string;
  ok: boolean;
}

/** Fully assembled rate for rendering. */
export interface CurrencyRate {
  code: CurrencyCode;
  perUsd: number | null;
  buy: number | null;
  sell: number | null;
  change7d: number | null;
  change30d: number | null;
  updatedAt: number | null;
  source: string;
  sourceUrl?: string;
  history: RatePoint[];
  ok: boolean;
}

export interface RatesData {
  updatedAt: number;
  rates: Record<CurrencyCode, CurrencyRate>;
}
