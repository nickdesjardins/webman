import type { Locale } from "@/lib/i18n";

/**
 * UI chrome for the applied-ai-audit page and its home teaser: aria text,
 * sr-only hints and button labels. Page copy comes from
 * getContent(locale).audit and never lives here. Templates carry {label} and
 * {count} placeholders; fill() from components/nextblock/strings resolves them.
 */
export const AUDIT_STRINGS = {
  en: {
    breadcrumb: "Breadcrumb",
    projects: "AI projects",
    links: "Toolkit links",
    newTabHint: " (opens in a new tab)",
    copyFile: "Copy",
    copyFileHint: " the {label} file",
    fileCopied: "File copied",
    fileRegion: "{label}: file contents",
    pillar: "Pillar",
    pillarsList: "The seven pillars",
    referencesList: "Reference implementations by pillar",
  },
  fr: {
    breadcrumb: "Fil d'Ariane",
    projects: "Projets IA",
    links: "Liens de la trousse",
    newTabHint: " (s'ouvre dans un nouvel onglet)",
    copyFile: "Copier",
    copyFileHint: " le fichier {label}",
    fileCopied: "Fichier copié",
    fileRegion: "{label}\xa0: contenu du fichier",
    pillar: "Pilier",
    pillarsList: "Les sept piliers",
    referencesList: "Mises en œuvre de référence par pilier",
  },
} satisfies Record<Locale, Record<string, string>>;

export type AuditStrings = (typeof AUDIT_STRINGS)[Locale];

/** Resolves the dictionary for a locale. */
export function auditStrings(locale: Locale): AuditStrings {
  return AUDIT_STRINGS[locale];
}
