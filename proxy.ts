import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, negotiateLocale, type Locale } from "@/lib/i18n";

/**
 * Both languages live at "/". The prerendered editions sit at the internal
 * paths /en and /fr; this proxy picks one per request (the "lang" cookie
 * written by the language switch wins, then Accept-Language, then English)
 * and rewrites "/" to it so the first paint is already in the right language.
 * The internal prefixes are never exposed: /en/* and /fr/* redirect to the
 * unprefixed path, except the social image routes Next resolves by segment.
 */
const IMAGE_ROUTES = new Set(["opengraph-image", "twitter-image"]);

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Static files (anything with an extension) are never locale-routed.
  if (pathname.includes(".")) return NextResponse.next();

  const [, first = "", ...rest] = pathname.split("/");

  if (isLocale(first)) {
    if (IMAGE_ROUTES.has(rest[0] ?? "")) return NextResponse.next();
    url.pathname = `/${rest.join("/")}`;
    return NextResponse.redirect(url, 308);
  }

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferred: Locale = isLocale(cookie)
    ? cookie
    : negotiateLocale(request.headers.get("accept-language"));

  url.pathname = pathname === "/" ? `/${preferred}` : `/${preferred}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes and Next internals; files are filtered above.
  matcher: ["/((?!api|_next).*)"],
};
