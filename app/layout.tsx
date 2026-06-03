import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { DEFAULT_LOCALE, isLocale } from "@/lib/locales";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Live USD Exchange Rates for Latin America`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Live US dollar exchange rates for Colombia, Argentina, Brazil and the Bolivian blue dollar.",
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
};

// The <html lang> is set from the locale that middleware resolved for this
// request (header `x-next-locale`), so it is always correct per language.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerLocale = headers().get("x-next-locale") || "";
  const lang = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;

  return (
    <html lang={lang} className="scroll-smooth">
      <body className="min-h-screen bg-base text-white antialiased selection:bg-secondary/40">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-glow" />
        {children}
      </body>
    </html>
  );
}
