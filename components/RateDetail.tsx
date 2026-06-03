import Link from "next/link";
import { CURRENCIES } from "@/lib/currencies";
import type { CurrencyRate } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import type { CountryStat } from "@/lib/stats";
import { ChangeBadge } from "./ChangeBadge";
import { Sparkline } from "./Sparkline";
import { AdSlot } from "./AdSlot";
import { formatDateTimeUTC, formatNumber } from "@/lib/format";

interface DetailCopy {
  h1: string;
  intro: string;
  about: string;
}

export function RateDetail({
  locale,
  dict,
  rate,
  copy,
  stat,
  variant = "standard",
}: {
  locale: string;
  dict: Dictionary;
  rate: CurrencyRate;
  copy: DetailCopy;
  stat: CountryStat;
  variant?: "standard" | "blue";
}) {
  const meta = CURRENCIES[rate.code];
  const c = dict.common;
  const name = dict.currencies[rate.code];
  const country = dict.countries[rate.code];
  const dec = meta.detailDecimals;

  const fmt = (v: number | null | undefined, d = dec) =>
    v != null ? formatNumber(v, locale, d) : "—";

  const spanDays =
    rate.history.length > 1
      ? Math.round(
          (rate.history[rate.history.length - 1].t - rate.history[0].t) /
            86400000,
        )
      : 0;

  return (
    <article className="space-y-8">
      <nav className="text-sm text-faint">
        <Link href={`/${locale}`} className="hover:text-white">
          {c.home}
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-muted">{name}</span>
      </nav>

      <header className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden>
          {meta.flag}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {copy.h1}
          </h1>
          <p className="flex items-center gap-2 text-sm text-muted">
            {country} · {name}
            {(variant === "blue" || rate.code === "ARS") && (
              <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-xs font-medium text-secondary-bright">
                {c.blue}
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Headline */}
      {variant === "blue" && rate.buy != null && rate.sell != null ? (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-card p-6 text-center">
            <div className="text-sm uppercase tracking-wide text-muted">
              {c.buy}
            </div>
            <div className="mt-1 text-5xl font-bold tabular-nums text-up">
              {fmt(rate.buy, 2)}
            </div>
            <div className="mt-1 text-xs text-faint">
              {meta.symbol} · {c.perDollar}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-card p-6 text-center">
            <div className="text-sm uppercase tracking-wide text-muted">
              {c.sell}
            </div>
            <div className="mt-1 text-5xl font-bold tabular-nums text-down">
              {fmt(rate.sell, 2)}
            </div>
            <div className="mt-1 text-xs text-faint">
              {meta.symbol} · {c.perDollar}
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-card p-6 text-center sm:p-8">
          <div className="text-sm text-muted">1 USD =</div>
          <div className="mt-1 text-6xl font-extrabold tabular-nums sm:text-7xl">
            {fmt(rate.perUsd)}
          </div>
          <div className="mt-2 text-sm text-faint">
            {meta.symbol} · {name} · {c.perDollar}
          </div>
        </section>
      )}

      {/* Changes + secondary numbers */}
      <section className="flex flex-wrap items-center gap-2">
        <ChangeBadge value={rate.change7d} locale={locale} label={c.d7} />
        <ChangeBadge value={rate.change30d} locale={locale} label={c.d30} />

        {variant === "blue" && rate.perUsd != null && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted">
            {c.mid}:{" "}
            <span className="font-semibold tabular-nums text-white">
              {fmt(rate.perUsd, 2)}
            </span>
          </span>
        )}

        {variant !== "blue" && rate.buy != null && rate.sell != null && (
          <>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted">
              {c.buy}:{" "}
              <span className="font-semibold tabular-nums text-white">
                {fmt(rate.buy, 2)}
              </span>
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted">
              {c.sell}:{" "}
              <span className="font-semibold tabular-nums text-white">
                {fmt(rate.sell, 2)}
              </span>
            </span>
          </>
        )}

        {rate.updatedAt && (
          <span className="ml-auto text-xs text-faint">
            {c.updated}: {formatDateTimeUTC(rate.updatedAt, locale)}
          </span>
        )}
      </section>

      {/* Chart */}
      <section className="rounded-2xl border border-white/10 bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-muted">
          {c.history}
          {spanDays ? ` · ${spanDays}d` : ""}
        </h2>
        <Sparkline
          points={rate.history}
          idKey={rate.code}
          emptyLabel={c.notEnoughHistory}
          className="h-44 w-full"
        />
      </section>

      <AdSlot />

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-3">
        {stat.inflationYoY != null && (
          <StatPill
            label={`${c.inflation} (${c.yoy})`}
            value={`${formatNumber(stat.inflationYoY, locale, 1)}%`}
            note={`${c.asOf} ${stat.asOf} · ${c.indicative}`}
          />
        )}
        {stat.policyRate != null && (
          <StatPill
            label={c.policyRate}
            value={`${formatNumber(stat.policyRate, locale, 2)}%`}
            note={`${c.asOf} ${stat.asOf} · ${c.indicative}`}
          />
        )}
        {rate.change30d != null && (
          <StatPill
            label={c.purchasingPower}
            value={formatPercentSafe(rate.change30d, locale)}
            note={c.purchasingPowerNote}
          />
        )}
      </section>

      {/* Copy */}
      <section className="space-y-4 leading-relaxed text-muted">
        <p>{copy.intro}</p>
        <h2 className="text-lg font-semibold text-white">{c.aboutThisRate}</h2>
        <p>{copy.about}</p>
        <p className="text-xs text-faint">
          {c.source}:{" "}
          {rate.sourceUrl ? (
            <a
              className="underline hover:text-white"
              href={rate.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {rate.source}
            </a>
          ) : (
            rate.source
          )}
          . {c.disclaimerShort}
        </p>
      </section>
    </article>
  );
}

function formatPercentSafe(value: number, locale: string): string {
  const s = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "always",
  }).format(value);
  return `${s}%`;
}

function StatPill({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      {note && <div className="mt-1 text-[11px] text-faint">{note}</div>}
    </div>
  );
}
