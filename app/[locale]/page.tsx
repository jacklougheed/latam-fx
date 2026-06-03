import type { Metadata } from "next";
import { getRates } from "@/lib/rates";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { CURRENCY_ORDER } from "@/lib/currencies";
import { COUNTRY_STATS } from "@/lib/stats";
import { RateCard } from "@/components/RateCard";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const h = getDictionary(locale).home;
  return pageMetadata({
    locale,
    path: "",
    title: h.metaTitle,
    description: h.metaDescription,
  });
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const dict = getDictionary(locale);
  const data = await getRates();
  const h = dict.home;

  return (
    <div className="space-y-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/${locale}`,
          inLanguage: locale,
          description: h.metaDescription,
        }}
      />

      <section className="pt-6 text-center sm:pt-10">
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
          {h.heroTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          {h.heroSubtitle}
        </p>
        <a
          href="#rates"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-secondary-bright"
        >
          {h.viewRates} ↓
        </a>
      </section>

      <section id="rates" className="scroll-mt-24 space-y-4">
        {CURRENCY_ORDER.map((code) => (
          <RateCard
            key={code}
            locale={locale}
            dict={dict}
            rate={data.rates[code]}
            stat={COUNTRY_STATS[code]}
          />
        ))}
      </section>

      <p className="text-center text-xs text-faint">{h.refreshNote}</p>
    </div>
  );
}
