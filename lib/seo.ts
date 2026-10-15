/**
 * Shared search metadata helpers: per-edition canonical URLs, hreflang
 * alternates, and the base Open Graph block every page extends.
 */
import type { Metadata } from "next";

import { getContent } from "@/lib/content";
import { hreflang, localePath, locales, ogLocale, otherLocale, type Locale } from "@/lib/i18n";

/**
 * Date of the last meaningful content change. The sitemap's lastmod reads
 * it, and search engines only trust lastmod when it is accurate, so bump it
 * when copy or projects change, not on every deploy.
 */
export const CONTENT_UPDATED = "2026-10-15";

/** "en-CA" and "fr-CA" alternates plus x-default (English), for one public path. */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[hreflang[locale]] = localePath(locale, path);
  languages["x-default"] = localePath("en", path);
  return languages;
}

/** Self-referencing canonical plus bidirectional hreflang for a page in one edition. */
export function pageAlternates(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return { canonical: localePath(locale, path), languages: languageAlternates(path) };
}

/** Open Graph fields every page shares; pages add url, title, description and type. */
export function baseOpenGraph(locale: Locale): NonNullable<Metadata["openGraph"]> {
  const { site } = getContent(locale);
  return {
    siteName: site.brand,
    locale: ogLocale[locale],
    alternateLocale: [ogLocale[otherLocale(locale)]],
  };
}
