import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/locales";

function pickLocale(req: NextRequest): string {
  const header = req.headers.get("accept-language") || "";
  const langs = header.split(",").map((s) => s.split(";")[0].trim().toLowerCase());
  for (const l of langs) {
    const base = l.split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];

  // Already locale-prefixed: pass through, exposing the locale to the root layout.
  if ((LOCALES as readonly string[]).includes(seg)) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-next-locale", seg);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // No locale prefix: redirect to the best-matching locale, same path.
  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, the API, and files with an extension
  // (sitemap.xml, robots.txt, icon.svg, etc.).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
