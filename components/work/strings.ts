import type { Locale } from "@/lib/i18n";

/**
 * UI strings for the work section that do not come from the data modules:
 * group headings not in data, button labels, aria-labels, sr-only hints.
 * Templates carry {name} placeholders; resolve them with `fill()`.
 */
const STRINGS = {
  en: {
    independentHeading: "Independent work",
    openSite: "Open site",
    visit: "Visit {host}",
    newTabHint: "(opens in a new tab)",
    liveCount: "{count} live pages",
    screenshotAlt: "Screenshot of {title}",
    languages: "Languages",
    since: "Est. {year}",
    attributionLegend: "Attribution legend",
    highlights: "Highlights",
    stack: "Stack",
    previewPending: "preview pending",
  },
  fr: {
    independentHeading: "Travail indépendant",
    openSite: "Ouvrir le site",
    visit: "Visiter {host}",
    newTabHint: "(s'ouvre dans un nouvel onglet)",
    liveCount: "{count} pages en ligne",
    screenshotAlt: "Capture d'écran de {title}",
    languages: "Langues",
    since: "Fondée en {year}",
    attributionLegend: "Légende des attributions",
    highlights: "Points saillants",
    stack: "Technologies",
    previewPending: "aperçu à venir",
  },
} satisfies Record<Locale, Record<string, string>>;

export type WorkStrings = (typeof STRINGS)[Locale];

/** The work section dictionary for one locale. */
export function workStrings(locale: Locale): WorkStrings {
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
