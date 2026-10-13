import type { Locale } from "@/lib/i18n";

/**
 * UI chrome for the NextBlock section: sub-headings, aria text, sr-only hints
 * and button labels. Product copy comes from getContent(locale).nextblock and
 * never lives here. Templates carry {count} and {title} placeholders; fill()
 * resolves them at render time.
 */
export const NEXTBLOCK_STRINGS = {
  en: {
    stack: "Stack",
    timeline: "Timeline",
    proves: "What this project proves",
    footer: "Open source. Live. Documented.",
    version: "version",
    license: "license",
    since: "since",
    copyInstall: "Copy install command",
    copied: "Install command copied",
    metricsNote: "Every figure is public and dated. Nothing here is estimated.",
    metricsLabel: "Metrics",
    architectureCaption: "architecture · request and agent flow",
    architectureSummary: "Architecture diagram, request and agent flow from top to bottom.",
    newTabHint: " (opens in a new tab)",
    showLess: "Show less",
    showMore: "Show {count} more",
    aboutTitle: " about {title}",
  },
  fr: {
    stack: "Pile technologique",
    timeline: "Chronologie",
    proves: "Ce que ce projet démontre",
    footer: "Code ouvert. En ligne. Documenté.",
    version: "version",
    license: "licence",
    since: "depuis",
    copyInstall: "Copier la commande d'installation",
    copied: "Commande d'installation copiée",
    metricsNote: "Chaque chiffre est public et daté. Rien ici n'est estimé.",
    metricsLabel: "Indicateurs",
    architectureCaption: "architecture · flux des requêtes et des agents",
    architectureSummary: "Schéma d'architecture, flux des requêtes et des agents de haut en bas.",
    newTabHint: " (s'ouvre dans un nouvel onglet)",
    showLess: "Réduire",
    showMore: "Afficher {count} de plus",
    aboutTitle: " à propos de {title}",
  },
} satisfies Record<Locale, Record<string, string>>;

export type NextblockStrings = (typeof NEXTBLOCK_STRINGS)[Locale];

/** Resolves the dictionary for a locale. */
export function nextblockStrings(locale: Locale): NextblockStrings {
  return NEXTBLOCK_STRINGS[locale];
}

/** Replaces {name} placeholders in a template with the matching value. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match: string, key: string) =>
    key in values ? String(values[key]) : match
  );
}
