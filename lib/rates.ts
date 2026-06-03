import { CURRENCY_ORDER } from "./currencies";
import { REFRESH_MINUTES } from "./config";
import type {
  CurrencyCode,
  CurrencyRate,
  CurrentValue,
  RatePoint,
  RatesData,
} from "./types";
import {
  appendIntraday,
  downsample,
  loadStore,
  mergeDaily,
  pctChange,
  saveStore,
  type StoreShape,
} from "./store";
import { fetchBolivianBlue } from "./sources/binance";
import { fetchAwesomeDaily, fetchAwesomeLast } from "./sources/awesome";
import {
  fetchArgentinaBlue,
  fetchArgentinaBlueHistory,
} from "./sources/argentina";

const SRC: Record<CurrencyCode, { label: string; url: string }> = {
  COP: { label: "AwesomeAPI", url: "https://economia.awesomeapi.com.br" },
  BRL: { label: "AwesomeAPI", url: "https://economia.awesomeapi.com.br" },
  ARS: { label: "Bluelytics / dólar blue", url: "https://bluelytics.com.ar" },
  BOB: { label: "Binance P2P", url: "https://p2p.binance.com" },
};

interface CacheState {
  data: RatesData | null;
  lastRefresh: number;
  refreshing: Promise<RatesData> | null;
  started: boolean;
}

const g = globalThis as unknown as { __latamfx_state?: CacheState };
const state: CacheState =
  g.__latamfx_state ??
  (g.__latamfx_state = {
    data: null,
    lastRefresh: 0,
    refreshing: null,
    started: false,
  });

function buildFromStore(store: StoreShape, now: number): RatesData {
  const rates = {} as Record<CurrencyCode, CurrencyRate>;
  for (const code of CURRENCY_ORDER) {
    const c = store.current?.[code];
    const series = store.points?.[code] || [];
    rates[code] = {
      code,
      perUsd: c?.perUsd ?? null,
      buy: c?.buy ?? null,
      sell: c?.sell ?? null,
      change7d: pctChange(series, 7),
      change30d: pctChange(series, 30),
      updatedAt: c?.updatedAt ?? null,
      source: c?.source ?? SRC[code].label,
      sourceUrl: c?.sourceUrl ?? SRC[code].url,
      history: downsample(series, 60),
      ok: !!c && c.perUsd != null,
    };
  }
  return { updatedAt: now, rates };
}

async function doRefresh(): Promise<RatesData> {
  const store = await loadStore();
  const now = Date.now();

  const [bob, awesomeLast, awesomeCop, awesomeBrl, arsCur, arsHist] =
    await Promise.allSettled([
      fetchBolivianBlue(),
      fetchAwesomeLast(["USD-COP", "USD-BRL"]),
      fetchAwesomeDaily("USD-COP", 40),
      fetchAwesomeDaily("USD-BRL", 40),
      fetchArgentinaBlue(),
      fetchArgentinaBlueHistory(),
    ]);

  const cur = store.current as Record<CurrencyCode, CurrentValue>;
  const pts = store.points as Record<CurrencyCode, RatePoint[]>;

  // Colombia + Brazil (current)
  if (awesomeLast.status === "fulfilled") {
    const m = awesomeLast.value;
    if (m["USD-COP"]) {
      cur.COP = {
        perUsd: m["USD-COP"],
        buy: null,
        sell: null,
        updatedAt: now,
        source: SRC.COP.label,
        sourceUrl: SRC.COP.url,
        ok: true,
      };
      pts.COP = mergeDaily(pts.COP, [{ t: now, v: m["USD-COP"] }]);
    }
    if (m["USD-BRL"]) {
      cur.BRL = {
        perUsd: m["USD-BRL"],
        buy: null,
        sell: null,
        updatedAt: now,
        source: SRC.BRL.label,
        sourceUrl: SRC.BRL.url,
        ok: true,
      };
      pts.BRL = mergeDaily(pts.BRL, [{ t: now, v: m["USD-BRL"] }]);
    }
  }
  // Colombia + Brazil (history backfill)
  if (awesomeCop.status === "fulfilled" && awesomeCop.value.length)
    pts.COP = mergeDaily(pts.COP, awesomeCop.value);
  if (awesomeBrl.status === "fulfilled" && awesomeBrl.value.length)
    pts.BRL = mergeDaily(pts.BRL, awesomeBrl.value);

  // Argentina (current + history)
  if (arsCur.status === "fulfilled") {
    const a = arsCur.value;
    cur.ARS = {
      perUsd: a.mid,
      buy: a.buy,
      sell: a.sell,
      updatedAt: now,
      source: SRC.ARS.label,
      sourceUrl: SRC.ARS.url,
      ok: true,
    };
    pts.ARS = mergeDaily(pts.ARS, [{ t: now, v: a.mid }]);
  }
  if (arsHist.status === "fulfilled" && arsHist.value.length)
    pts.ARS = mergeDaily(pts.ARS, arsHist.value);

  // Bolivia (current + intraday history — Binance P2P has no free history feed,
  // so the 7d/30d change for Bolivia builds up after the site runs for a while).
  if (bob.status === "fulfilled") {
    const b = bob.value;
    cur.BOB = {
      perUsd: b.mid,
      buy: b.buy,
      sell: b.sell,
      updatedAt: now,
      source: SRC.BOB.label,
      sourceUrl: SRC.BOB.url,
      ok: true,
    };
    pts.BOB = appendIntraday(pts.BOB, { t: now, v: b.mid });
  }

  store.current = cur;
  store.points = pts;
  await saveStore(store);

  const data = buildFromStore(store, now);
  state.data = data;
  state.lastRefresh = now;
  return data;
}

/** Force a refresh (deduped if one is already in flight). */
export function refresh(): Promise<RatesData> {
  if (state.refreshing) return state.refreshing;
  state.refreshing = doRefresh().finally(() => {
    state.refreshing = null;
  });
  return state.refreshing;
}

/** Read rates — fresh from cache, stale-while-revalidate, or build from disk. */
export async function getRates(): Promise<RatesData> {
  const ttl = REFRESH_MINUTES * 60 * 1000;
  if (state.data && Date.now() - state.lastRefresh < ttl) return state.data;
  if (state.data) {
    // Serve stale immediately, refresh in the background.
    refresh().catch(() => {});
    return state.data;
  }
  try {
    return await refresh();
  } catch {
    const store = await loadStore();
    return buildFromStore(store, Date.now());
  }
}

/** Start the background refresher (called once from instrumentation.ts). */
export function startBackgroundRefresh(): void {
  if (state.started) return;
  state.started = true;
  refresh().catch((e) =>
    console.error("[refresh:init]", (e as Error)?.message ?? e),
  );
  const timer = setInterval(
    () => {
      refresh().catch((e) =>
        console.error("[refresh:interval]", (e as Error)?.message ?? e),
      );
    },
    REFRESH_MINUTES * 60 * 1000,
  );
  // Don't let the interval alone keep the process alive (safe during builds).
  (timer as { unref?: () => void }).unref?.();
}
