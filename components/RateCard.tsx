import Link from "next/link";
import { CURRENCIES } from "@/lib/currencies";
import type { CurrencyRate } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import type { CountryStat } from "@/lib/stats";
import { ChangeBadge } from "./ChangeBadge";
import { formatNumber } from "@/lib/format";

export function RateCard({
  locale,
  dict,
  rate,
  stat,
}: {
  locale: string;
  dict: Dictionary;
  rate: CurrencyRate;
  stat: CountryStat;
}) {
  const meta = CURRENCIES[rate.code];
  const c = dict.common;
  const name = dict.currencies[rate.code];
  const country = dict.countries[rate.code];

  return (
    <Link
      href={`/${locale}/${meta.slug}`}
      className="group block rounded-2xl border border-white/10 bg-card p-5 transition hover:border-secondary/40 hover:bg-card-hover sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden>
            {meta.flag}
          </span>
          <div>
            <div className="text-sm text-muted">{country}</div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              {name}
              {rate.code === "BOB" && (
                <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-xs font-medium text-secondary-bright">
                  {c.blue}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums sm:text-4xl">
            {rate.perUsd != null
              ? formatNumber(rate.perUsd, locale, meta.decimals)
              : "—"}
          </div>
          <div className="text-xs text-faint">
            {meta.symbol} · {c.perDollar}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ChangeBadge value={rate.change7d} locale={locale} label={c.d7} />
        <ChangeBadge value={rate.change30d} locale={locale} label={c.d30} />

        {rate.code === "ARS" && stat.inflationYoY != null && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted">
            {c.inflation}:{" "}
            <span className="font-semibold tabular-nums text-white">
              {formatNumber(stat.inflationYoY, locale, 1)}%
            </span>
          </span>
        )}

        {rate.code === "BOB" && rate.buy != null && rate.sell != null && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted">
            {c.spread}:{" "}
            <span className="font-semibold tabular-nums text-white">
              {formatNumber(rate.sell - rate.buy, locale, 2)}
            </span>
          </span>
        )}

        <span className="ml-auto text-sm text-muted transition group-hover:text-white">
          {c.viewDetails} →
        </span>
      </div>
    </Link>
  );
}
