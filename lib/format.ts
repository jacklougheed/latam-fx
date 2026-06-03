export function formatNumber(
  value: number,
  locale: string,
  decimals = 2,
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(
  value: number,
  locale: string,
  decimals = 2,
): string {
  const s = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: "always",
  }).format(value);
  return s + "%";
}

/**
 * Formats a timestamp in UTC. Using a fixed time zone keeps server and client
 * output identical (no hydration mismatch) regardless of where each runs.
 */
export function formatDateTimeUTC(ms: number, locale: string): string {
  return (
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(ms)) + " UTC"
  );
}
