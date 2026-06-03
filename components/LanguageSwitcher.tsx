"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, isLocale } from "@/lib/locales";

// Swaps only the locale segment of the current path, so the page (and slug)
// stays the same across English / Spanish / Portuguese.
export function LanguageSwitcher({ current }: { current: string }) {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/");
  const rest = isLocale(parts[1]) ? "/" + parts.slice(2).join("/") : pathname;
  const base = rest === "/" ? "" : rest.replace(/\/$/, "");

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5 text-xs">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${base}`}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className={`rounded-full px-2 py-1 font-medium uppercase transition ${
            l === current
              ? "bg-secondary text-white"
              : "text-muted hover:text-white"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
