// Locale constants — kept free of JSON/dictionary imports so this file is safe
// to import from middleware (edge runtime) and client components without bloat.

export const LOCALES = ["en", "es", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  pt: "PT",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
