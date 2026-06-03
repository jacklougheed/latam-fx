import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDictionary } from "@/lib/i18n";
import { LOCALES, isLocale } from "@/lib/locales";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} nav={dict.nav} />
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">{children}</main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
