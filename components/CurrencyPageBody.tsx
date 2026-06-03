import { getRates } from "@/lib/rates";
import { getDictionary } from "@/lib/i18n";
import { CURRENCIES } from "@/lib/currencies";
import { COUNTRY_STATS } from "@/lib/stats";
import { RateDetail } from "./RateDetail";
import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/config";
import type { CurrencyCode } from "@/lib/types";

export async function CurrencyPageBody({
  locale,
  code,
  variant = "standard",
}: {
  locale: string;
  code: CurrencyCode;
  variant?: "standard" | "blue";
}) {
  const dict = getDictionary(locale);
  const data = await getRates();
  const p = dict.pages[code];
  const slug = CURRENCIES[code].slug;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: dict.common.home,
              item: `${SITE_URL}/${locale}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: dict.currencies[code],
              item: `${SITE_URL}/${locale}/${slug}`,
            },
          ],
        }}
      />
      <RateDetail
        locale={locale}
        dict={dict}
        rate={data.rates[code]}
        stat={COUNTRY_STATS[code]}
        copy={{ h1: p.h1, intro: p.intro, about: p.about }}
        variant={variant}
      />
    </>
  );
}
