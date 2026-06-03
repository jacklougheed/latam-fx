import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./config";
import { LOCALES } from "./locales";

interface PageMetaInput {
  locale: string;
  /** Path after the locale, e.g. "colombian-peso-to-usd" or "" for home. */
  path: string;
  title: string;
  description: string;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
}: PageMetaInput): Metadata {
  const clean = path ? `/${path.replace(/^\/+/, "")}` : "";
  const url = `${SITE_URL}/${locale}${clean}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${clean}`;
  languages["x-default"] = `${SITE_URL}/en${clean}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale,
    },
    twitter: { card: "summary", title, description },
  };
}
