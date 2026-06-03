import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import pt from "@/dictionaries/pt.json";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

// English is the source of truth for the dictionary shape.
export type Dictionary = typeof en;

const DICTS: Record<Locale, Dictionary> = {
  en,
  es: es as unknown as Dictionary,
  pt: pt as unknown as Dictionary,
};

export function getDictionary(locale: string): Dictionary {
  return DICTS[isLocale(locale) ? locale : DEFAULT_LOCALE];
}

export { LOCALES, DEFAULT_LOCALE, isLocale } from "./locales";
export type { Locale } from "./locales";
