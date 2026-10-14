import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, negotiateLocale, type Locale } from "@/lib/i18n";

/**
 * Each edition has its own public URL: English at "/" (and unprefixed
 * paths), French at "/fr". Both are prerendered under app/[locale].
 *
 * - "/fr/*" is served as is: it is the French edition's real URL.
 * - "/en/*" redirects to the unprefixed path (308), except the social image
 *   routes Next resolves by segment.
 * - Unprefixed paths are the English edition (internal rewrite to "/en/*"),
 *   unless the visitor's saved choice (the "lang" cookie written by the
 *   header switch) or, on a first visit, the browser language asks for
 *   French: then a 307 sends them to the "/fr" twin. Crawlers send neither
 *   a cookie nor Accept-Language, so they always get the English page at
 *   its own URL and find French through hreflang and the sitemap.
 *
 * The switch itself never navigates: it flips client state and rewrites
 * the address bar (LocaleProvider), so changing language stays instant.
 */
const IMAGE_ROUTES = new Set(["opengraph-image", "twitter-image"]);

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(cookie) ? cookie : negotiateLocale(request.headers.get("accept-language"));
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Static files (anything with an extension) are never locale-routed.
  if (pathname.includes(".")) return NextResponse.next();

  const [, first = "", ...rest] = pathname.split("/");

  if (first === "fr") return NextResponse.next();

  if (isLocale(first)) {
    if (IMAGE_ROUTES.has(rest[0] ?? "")) return NextResponse.next();
    url.pathname = `/${rest.join("/")}`;
    return NextResponse.redirect(url, 308);
  }

  if (preferredLocale(request) === "fr") {
    url.pathname = pathname === "/" ? "/fr" : `/fr${pathname}`;
    const response = NextResponse.redirect(url, 307);
    response.headers.set("Vary", "Cookie, Accept-Language");
    return response;
  }

  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes and Next internals; files are filtered above.
  matcher: ["/((?!api|_next).*)"],
};
