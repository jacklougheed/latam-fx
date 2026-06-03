import type { CurrencyCode } from "./types";

export interface CountryStat {
  /** Year-over-year consumer inflation, percent. Null = hide. */
  inflationYoY: number | null;
  /** Central-bank policy rate, percent. Null = hide. */
  policyRate: number | null;
  /** When these figures were last valid, e.g. "2025-12". */
  asOf: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  EDIT ME.  These are INDICATIVE macro figures shown as context next to the
// FX rates. There is no free real-time inflation API, so update these manually
// (monthly is plenty) and bump `asOf`. The site clearly labels them "indicative"
// and shows the as-of date. Set a value to `null` to hide that stat.
// ─────────────────────────────────────────────────────────────────────────────
export const COUNTRY_STATS: Record<CurrencyCode, CountryStat> = {
  COP: { inflationYoY: 5.2, policyRate: 9.25, asOf: "2025-12" },
  ARS: { inflationYoY: 40.0, policyRate: 32.0, asOf: "2025-12" },
  BRL: { inflationYoY: 4.5, policyRate: 12.25, asOf: "2025-12" },
  BOB: { inflationYoY: null, policyRate: null, asOf: "2025-12" },
};
