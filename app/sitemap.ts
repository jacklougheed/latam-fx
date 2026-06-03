import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { LOCALES } from "@/lib/locales";
import { CURRENCIES, CURRENCY_ORDER } from "@/lib/currencies";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const ratePaths = CURRENCY_ORDER.map((c) => CURRENCIES[c].slug);
  const contentPaths = ["about", "contact", "terms", "privacy"];
  const paths = ["", ...ratePaths, ...contentPaths];

  const items: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    const suffix = path ? `/${path}` : "";
    const isRate = path === "" || ratePaths.includes(path);
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l, `${SITE_URL}/${l}${suffix}`]),
    );
    for (const locale of LOCALES) {
      items.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        changeFrequency: isRate ? "hourly" : "monthly",
        priority: path === "" ? 1 : isRate ? 0.8 : 0.4,
        alternates: { languages },
      });
    }
  }
  return items;
}
