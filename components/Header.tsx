"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavLabels {
  rates: string;
  bolivianBlue: string;
  about: string;
  contact: string;
}

export function Header({ locale, nav }: { locale: string; nav: NavLabels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";

  const links = [
    { href: `/${locale}`, label: nav.rates },
    { href: `/${locale}/bolivian-blue`, label: nav.bolivianBlue },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href={`/${locale}`}
          className="text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          Latam<span className="text-gradient">FX</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                isActive(l.href) ? "text-white" : "text-muted hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            className="rounded-lg border border-white/10 p-2 text-muted hover:text-white md:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-base/95 px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-2 py-2 text-sm ${
                isActive(l.href) ? "text-white" : "text-muted hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
