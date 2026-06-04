# LatamFX

Live US-dollar exchange rates for Latin America — Colombia, Argentina, Brazil and the **Bolivian blue** dollar. Big, clear numbers, refreshed automatically, in English / Spanish / Portuguese.

Built to be the quickest bookmark for "what's the dollar worth today" — fast to load, easy to read, easy for Google to rank.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** — server-rendered for SEO, trivial to self-host.
- **Tailwind CSS** — dark theme (blue + purple, muted hot-pink accent).
- **No database** — rate history is a small JSON file on disk.
- **No heavy dependencies** — charts are hand-rolled SVG, i18n is plain JSON dictionaries.

---

## Quick start (on your VPS)

```bash
# Node 20+ required (nvm: `nvm install 20`, or NodeSource for system-wide)
npm install
cp .env.example .env        # edit SITE_URL etc.
npm run dev                 # http://localhost:3000  (dev)
```

Production:

```bash
npm run build
npm run start               # serves on PORT (default 3000)
```

Then put nginx in front of it and add TLS — see [`deploy/`](./deploy).

---

## Environment variables (`.env`)

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | `https://latam-fx.com` | Canonical URLs, sitemap, hreflang. **Set this**, then rebuild. |
| `DATA_DIR` | `./data` | Where `history.json` is written. Use an absolute, writable path in prod. |
| `REFRESH_INTERVAL_MINUTES` | `30` | How often rates refresh (min 5). |
| `REFRESH_SECRET` | _(empty)_ | If set, protects `POST /api/refresh`. Recommended in prod. |

---

## How the data works

| Country | Rate shown | Source | History / change |
|---|---|---|---|
| 🇨🇴 Colombia | USD/COP (market) | AwesomeAPI (free, no key) | Backfilled — 7d/30d work immediately |
| 🇦🇷 Argentina | **Blue** dollar (parallel) | dolarapi.com + Bluelytics | Backfilled — 7d/30d work immediately |
| 🇧🇷 Brazil | USD/BRL (market) | AwesomeAPI (free, no key) | Backfilled — 7d/30d work immediately |
| 🇧🇴 Bolivia | **Blue** dollar (parallel) | **Binance P2P** (USDT/BOB bid/ask) | Accumulates after deploy (see note) |

- A background job fetches all four on boot and every `REFRESH_INTERVAL_MINUTES`, then writes `DATA_DIR/history.json`. Pages read the cached snapshot, so they're instant; a stale snapshot is served while a refresh runs in the background.
- **Bolivia's 7-day / 30-day change** builds up over time, because Binance P2P has no free historical feed. The live **buy / sell / spread** show immediately; the trend chart and % change fill in as the site runs (≈4 days for 7d, ≈2 weeks for 30d). The other three are backfilled from their sources and work on day one.
- **`GET /api/rates`** returns the current snapshot as JSON.
- **`POST /api/refresh`** forces a refresh (optionally protected by `REFRESH_SECRET`). Use it as a cron backup if you ever run the app without the in-process refresher:
  ```
  */30 * * * * curl -s -X POST -H "x-refresh-secret: YOUR_SECRET" https://latam-fx.com/api/refresh
  ```

> ⚠️ **Run a single Node instance** (or rely on the cron above). If you run multiple clustered instances, each will refresh independently — harmless but wasteful.

> ⚠️ **Binance reachability:** some hosts geo-block Binance. If the Bolivia card shows `—`, your VPS probably can't reach `p2p.binance.com`. Test from the box:
> ```
> curl -s -o /dev/null -w "%{http_code}\n" -X POST https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search \
>   -H 'content-type: application/json' -d '{"asset":"USDT","fiat":"BOB","tradeType":"BUY","page":1,"rows":1}'
> ```

---

## Editing the inflation / macro figures

There is no free real-time inflation API, so the inflation and policy-rate numbers are **manual, indicative** values in [`lib/stats.ts`](./lib/stats.ts). Update them monthly and bump `asOf`; the site shows the as-of date and labels them "indicative." Set any value to `null` to hide it.

The pages also show a **real, data-backed** "USD vs local (30d)" stat computed from the FX history (how much more local currency a dollar buys than 30 days ago) — that one needs no manual updates.

---

## Languages (i18n)

- URLs are locale-prefixed: `/en/...`, `/es/...`, `/pt/...`. The **slug stays the same** across languages (e.g. `/en/bolivian-blue`, `/es/bolivian-blue`).
- Content is swapped server-side from `dictionaries/{en,es,pt}.json`. **No Google Translate, no client-side hacks** — real translated HTML per URL, with `hreflang` alternates and per-language `<title>` / `<meta>` for clean SEO.
- `/` redirects to the visitor's best-match language (from `Accept-Language`), defaulting to English.
- The language switcher (top right) just swaps the locale segment of the current path.

To edit copy, edit the three JSON files — keep their structure identical (the English file is the source of truth).

---

## Pages

| Path | What |
|---|---|
| `/{lang}` | Home — four big rate cards |
| `/{lang}/colombian-peso-to-usd` | USD → Colombian peso |
| `/{lang}/argentine-peso-to-usd` | USD → Argentine peso (blue) |
| `/{lang}/brazilian-real-to-usd` | USD → Brazilian real |
| `/{lang}/bolivian-blue` | Bolivian blue dollar (buy/sell from Binance) |
| `/{lang}/about` · `/contact` · `/terms` · `/privacy` | Static pages |
| `/sitemap.xml` · `/robots.txt` | Auto-generated |

---

## Customizing the look

- **Colors:** [`tailwind.config.ts`](./tailwind.config.ts) — `primary` (blue), `purple`, `secondary` (muted hot-pink), `base`/`card` (dark surfaces), `up`/`down`.
- **Ambient glow & gradient text:** [`app/globals.css`](./app/globals.css).
- **Ads:** subtle placeholders (`<AdSlot />`) sit on the detail pages — drop your AdSense markup into [`components/AdSlot.tsx`](./components/AdSlot.tsx), or delete the usages.

---

## Deployment

See [`deploy/latam-fx.service`](./deploy/latam-fx.service) (systemd) and [`deploy/apache.conf.example`](./deploy/apache.conf.example) — or [`deploy/nginx.conf.example`](./deploy/nginx.conf.example) if you use nginx. Short version (Apache):

```bash
# build
npm install && npm run build

# run under systemd
sudo cp deploy/latam-fx.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now latam-fx

# reverse proxy (Apache) + TLS
sudo a2enmod proxy proxy_http headers
sudo cp deploy/apache.conf.example /etc/apache2/sites-available/latam-fx.conf
sudo a2ensite latam-fx && sudo apache2ctl configtest && sudo systemctl reload apache2
sudo certbot --apache -d latam-fx.com -d www.latam-fx.com
```

Make sure `DATA_DIR` is writable by the service user.

---

## Notes & assumptions

- Domain **latam-fx.com**, contact **info@latam-fx.com**. Set `SITE_URL` in `.env` and rebuild so `sitemap.xml`/`robots.txt`/canonical tags use it.
- Argentina & Bolivia use the **parallel / blue** rate on purpose (that's the "on the ground" rate). Colombia & Brazil float freely, so the market rate is shown.
- **Terms & Privacy are reasonable templates, not legal advice** — have a professional review them, especially once you enable ads/analytics.
- Footer copyright reads **© LatamFX 2026. All rights reserved.** (as requested).
