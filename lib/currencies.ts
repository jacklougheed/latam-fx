import type { CurrencyCode } from "./types";

export interface CurrencyMeta {
  code: CurrencyCode;
  country: string;
  flag: string;
  slug: string;
  symbol: string;
  /** Decimals for the big headline number. */
  decimals: number;
  /** Decimals on the detail page (some pairs need more precision). */
  detailDecimals: number;
  /** Data source / presentation style. */
  kind: "fx" | "blue" | "binance";
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  COP: {
    code: "COP",
    country: "Colombia",
    flag: "🇨🇴",
    slug: "colombian-peso-to-usd",
    symbol: "$",
    decimals: 2,
    detailDecimals: 2,
    kind: "fx",
  },
  ARS: {
    code: "ARS",
    country: "Argentina",
    flag: "🇦🇷",
    slug: "argentine-peso-to-usd",
    symbol: "$",
    decimals: 2,
    detailDecimals: 2,
    kind: "blue",
  },
  BRL: {
    code: "BRL",
    country: "Brazil",
    flag: "🇧🇷",
    slug: "brazilian-real-to-usd",
    symbol: "R$",
    decimals: 2,
    detailDecimals: 4,
    kind: "fx",
  },
  BOB: {
    code: "BOB",
    country: "Bolivia",
    flag: "🇧🇴",
    slug: "bolivian-blue",
    symbol: "Bs",
    decimals: 2,
    detailDecimals: 2,
    kind: "binance",
  },
};

// Display order on the home page: Colombia, Argentina, Brazil, Bolivia.
export const CURRENCY_ORDER: CurrencyCode[] = ["COP", "ARS", "BRL", "BOB"];

export const SLUG_TO_CODE: Record<string, CurrencyCode> = Object.fromEntries(
  CURRENCY_ORDER.map((c) => [CURRENCIES[c].slug, c]),
) as Record<string, CurrencyCode>;
