import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { CURRENCIES } from "@/lib/currencies";
import { CurrencyPageBody } from "@/components/CurrencyPageBody";

export const dynamic = "force-dynamic";
const CODE = "COP" as const;

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const p = getDictionary(locale).pages[CODE];
  return pageMetadata({
    locale,
    path: CURRENCIES[CODE].slug,
    title: p.metaTitle,
    description: p.metaDescription,
  });
}

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <CurrencyPageBody locale={locale} code={CODE} />;
}
