import Link from "next/link";
import { SITE_NAME } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n";
import { CURRENCIES, CURRENCY_ORDER } from "@/lib/currencies";

export function Footer({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const f = dict.footer;
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="text-base font-bold">
              Latam<span className="text-gradient">FX</span>
            </div>
            <p className="mt-2 max-w-xs text-muted">{f.tagline}</p>
          </div>

          <div>
            <div className="mb-2 font-semibold text-faint">{f.rates}</div>
            <ul className="space-y-1.5">
              {CURRENCY_ORDER.map((code) => (
                <li key={code}>
                  <Link
                    className="text-muted hover:text-white"
                    href={`/${locale}/${CURRENCIES[code].slug}`}
                  >
                    {dict.currencies[code]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2 font-semibold text-faint">{f.site}</div>
            <ul className="space-y-1.5">
              <li>
                <Link
                  className="text-muted hover:text-white"
                  href={`/${locale}/about`}
                >
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted hover:text-white"
                  href={`/${locale}/contact`}
                >
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted hover:text-white"
                  href={`/${locale}/terms`}
                >
                  {f.terms}
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted hover:text-white"
                  href={`/${locale}/privacy`}
                >
                  {f.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-faint">{f.disclaimer}</p>
        <p className="mt-3 text-xs text-faint">
          © {SITE_NAME} 2026. {f.rights}
        </p>
      </div>
    </footer>
  );
}
