import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "./config";
import type { CurrencyCode, CurrentValue, RatePoint } from "./types";

const FILE = path.join(DATA_DIR, "history.json");

export interface StoreShape {
  points: Partial<Record<CurrencyCode, RatePoint[]>>;
  current: Partial<Record<CurrencyCode, CurrentValue>>;
}

// In-process cache so we don't hit disk on every request.
const g = globalThis as unknown as { __latamfx_store?: StoreShape };

export async function loadStore(): Promise<StoreShape> {
  if (g.__latamfx_store) return g.__latamfx_store;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreShape;
    g.__latamfx_store = {
      points: parsed.points || {},
      current: parsed.current || {},
    };
  } catch {
    g.__latamfx_store = { points: {}, current: {} };
  }
  return g.__latamfx_store;
}

export async function saveStore(store: StoreShape): Promise<void> {
  g.__latamfx_store = store;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(store), "utf8");
  } catch (e) {
    console.error("[store] save failed:", (e as Error).message);
  }
}

function dayKey(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

/** Merge daily series, keeping one (latest) value per calendar day. */
export function mergeDaily(
  existing: RatePoint[] = [],
  incoming: RatePoint[],
): RatePoint[] {
  const byDay = new Map<string, RatePoint>();
  for (const p of existing) byDay.set(dayKey(p.t), p);
  for (const p of incoming) byDay.set(dayKey(p.t), p); // incoming wins
  return Array.from(byDay.values())
    .sort((a, b) => a.t - b.t)
    .slice(-400);
}

/** Append an intraday point, trimming by age and count. */
export function appendIntraday(
  existing: RatePoint[] = [],
  point: RatePoint,
  maxAgeDays = 120,
  maxPoints = 4000,
): RatePoint[] {
  const cutoff = point.t - maxAgeDays * 86400000;
  const arr = [...existing.filter((p) => p.t >= cutoff), point];
  return arr.slice(-maxPoints);
}

/** Percentage change over `days`, computed from stored history. Null if insufficient. */
export function pctChange(
  points: RatePoint[] | undefined,
  days: number,
): number | null {
  if (!points || points.length < 2) return null;
  const sorted = [...points].sort((a, b) => a.t - b.t);
  const latest = sorted[sorted.length - 1];
  const target = latest.t - days * 86400000;

  let past: RatePoint | null = null;
  for (const p of sorted) {
    if (p.t <= target) past = p; // latest point at or before the target time
  }
  if (!past) {
    // Not enough history for the full window — only fall back to the earliest
    // point if it covers at least half the requested window.
    const earliest = sorted[0];
    if (latest.t - earliest.t >= days * 86400000 * 0.5) past = earliest;
    else return null;
  }
  if (!past.v) return null;
  return ((latest.v - past.v) / past.v) * 100;
}

/** Reduce a series to at most `max` evenly-spaced points for charting. */
export function downsample(
  points: RatePoint[] | undefined,
  max = 60,
): RatePoint[] {
  if (!points || points.length === 0) return [];
  const sorted = [...points].sort((a, b) => a.t - b.t);
  if (sorted.length <= max) return sorted;
  const step = (sorted.length - 1) / (max - 1);
  const out: RatePoint[] = [];
  for (let i = 0; i < max; i++) out.push(sorted[Math.round(i * step)]);
  return out;
}
