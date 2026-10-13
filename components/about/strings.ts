import type { Locale } from "@/lib/i18n";

/**
 * UI strings for the about section that do not come from the data modules:
 * the "since" milestone chips, the live badge, the testing eyebrow and
 * aria-labels. The humour itself lives in data/about.ts and data/fr/about.ts.
 * Templates carry {name} placeholders; resolve them with `fill()`.
 */
const STRINGS = {
  en: {
    milestonesLabel: "Milestones",
    sinceWeb: "Building for the web since {year}",
    sinceBusiness: "Running a business since {year}",
    sinceProduction: "In production at New Roots Herbal since {year}",
    realWorldTesting: "Real-world testing",
    live: "Live",
  },
  fr: {
    milestonesLabel: "Jalons",
    sinceWeb: "Je construis pour le web depuis {year}",
    sinceBusiness: "En affaires depuis {year}",
    sinceProduction: "En production chez New Roots Herbal depuis {year}",
    realWorldTesting: "Tests en conditions réelles",
    live: "En direct",
  },
} satisfies Record<Locale, Record<string, string>>;

export type AboutStrings = (typeof STRINGS)[Locale];

/** The about section dictionary for one locale. */
export function aboutStrings(locale: Locale): AboutStrings {
  return STRINGS[locale];
}

/** Replaces every {name} placeholder in a template; unknown names are left as is. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}

/** BCP 47 tag used for number formatting in this locale. */
export function numberLocale(locale: Locale): string {
  return locale === "fr" ? "fr-CA" : "en-CA";
}

/**
 * Quebec French sets a non-breaking space before the percent sign
 * ("0,00 %"); English keeps it attached ("0.00%"). Other suffixes pass through.
 */
export function localizeSuffix(suffix: string | undefined, locale: Locale): string | undefined {
  if (!suffix) return suffix;
  if (locale === "fr" && suffix.startsWith("%")) return ` ${suffix}`;
  return suffix;
}
