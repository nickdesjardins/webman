import type { Locale } from "@/lib/i18n";
import type { ExperienceItem } from "@/data/experience";

/**
 * UI strings for the experience section that do not come from the data
 * modules: the eyebrow, card headings, button labels, badges, aria-labels
 * and sr-only hints. Career copy itself (roles, companies, highlights,
 * education) stays in data/experience.ts and data/fr/experience.ts.
 */
const STRINGS = {
  en: {
    eyebrow: "Experience & Career Evolution",
    asideLabel: "Resume, education and summary",
    timelineLabel: "Career timeline",
    current: "Current",
    stack: "Stack",
    kindWork: "Employment",
    kindFounder: "Founder",
    kindMilitary: "Military service",
    resume: "Resume",
    resumeTagline: "Four pages. No buzzword bingo.",
    downloadResume: "Download resume (PDF)",
    sayHello: "Or just say hello",
    education: "Education",
    atAGlance: "At a glance",
    role: "role",
    roles: "roles",
    yearsAtNewRoots: "years at New Roots Herbal",
    veteran: "Veteran, RCEME",
  },
  fr: {
    eyebrow: "Parcours et évolution de carrière",
    asideLabel: "CV, formation et résumé",
    timelineLabel: "Chronologie de carrière",
    current: "En poste",
    stack: "Technologies",
    kindWork: "Emploi",
    kindFounder: "Fondateur",
    kindMilitary: "Service militaire",
    resume: "CV",
    resumeTagline: "Quatre pages. Pas de bingo des mots à la mode.",
    downloadResume: "Télécharger le CV (PDF)",
    sayHello: "Ou simplement dire bonjour",
    education: "Formation",
    atAGlance: "En bref",
    role: "rôle",
    roles: "rôles",
    yearsAtNewRoots: "années chez New Roots Herbal",
    veteran: "Vétéran, GEMRC",
  },
} satisfies Record<Locale, Record<string, string>>;

export type ExperienceStrings = (typeof STRINGS)[Locale];

/** The experience section dictionary for one locale. */
export function experienceStrings(locale: Locale): ExperienceStrings {
  return STRINGS[locale];
}

/** Dictionary key for the screen-reader label of each timeline node kind. */
const KIND_KEY = {
  work: "kindWork",
  founder: "kindFounder",
  military: "kindMilitary",
} as const satisfies Record<ExperienceItem["kind"], keyof ExperienceStrings>;

/** Neutral screen-reader label for an icon-only timeline node. */
export function kindLabel(locale: Locale, kind: ExperienceItem["kind"]): string {
  return STRINGS[locale][KIND_KEY[kind]];
}

/** BCP 47 tag used for number formatting in this locale. */
export function numberLocale(locale: Locale): string {
  return locale === "fr" ? "fr-CA" : "en-CA";
}
