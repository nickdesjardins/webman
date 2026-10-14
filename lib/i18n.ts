/**
 * Locale primitives shared by the proxy, the route tree, and components.
 * English is the default and lives at "/"; French lives under "/fr".
 * Both editions are prerendered and reachable by URL, which is what lets
 * search engines index the French one.
 */
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Cookie written by the language switch; the proxy honours it before Accept-Language. */
export const LOCALE_COOKIE = "lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeNames: Record<Locale, string> = { en: "English", fr: "Français" };
export const localeShort: Record<Locale, string> = { en: "EN", fr: "FR" };
export const ogLocale: Record<Locale, string> = { en: "en_CA", fr: "fr_CA" };
export const htmlLang: Record<Locale, string> = { en: "en", fr: "fr" };
export const hreflang: Record<Locale, string> = { en: "en-CA", fr: "fr-CA" };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "fr";
}

/**
 * Public path for a locale: English is unprefixed ("/", "/projects/x"),
 * French lives under "/fr" ("/fr", "/fr/projects/x"). Each edition has its
 * own crawlable URL; the header switch still swaps instantly on the client
 * and rewrites the address bar with this function (see LocaleProvider).
 */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Removes a leading "/fr" (or "/en") so a public path can be re-prefixed for the other edition. */
export function stripLocale(pathname: string): string {
  const [, first = "", ...rest] = pathname.split("/");
  if (!isLocale(first)) return pathname || "/";
  return `/${rest.join("/")}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "fr" : "en";
}

/** Picks fr or en from an Accept-Language header; anything unrecognised falls back to English. */
export function negotiateLocale(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.toLowerCase(), weight: Number.isFinite(weight) ? weight : 0, index };
    })
    .filter((entry) => entry.tag && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (primary === "fr") return "fr";
    if (primary === "en") return "en";
  }
  return defaultLocale;
}
