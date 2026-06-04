import path from "path";

export const SITE_NAME = "LatamFX";

export const SITE_URL = (process.env.SITE_URL || "https://latam-fx.com").replace(
  /\/+$/,
  "",
);

export const CONTACT_EMAIL = "info@latam-fx.com";

// Refresh cadence in minutes (minimum 5 to avoid hammering the public APIs).
export const REFRESH_MINUTES = Math.max(
  5,
  Number(process.env.REFRESH_INTERVAL_MINUTES) || 30,
);

// Where the rate-history JSON lives on disk.
export const DATA_DIR =
  process.env.DATA_DIR || path.join(process.cwd(), "data");

// Optional shared secret protecting the manual /api/refresh endpoint.
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
