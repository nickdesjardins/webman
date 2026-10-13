import type { Locale } from "@/lib/i18n";

/** Every UI string the arsenal renders that does not come from the data modules. */
export interface ArsenalStrings {
  /** BCP 47 tag passed to toLocaleString for the chip and header counts. */
  numberLocale: string;
  all: string;
  allSummary: string;
  categories: string;
  search: string;
  clearSearch: string;
  toolCount: (count: number) => string;
  noMatch: string;
  reset: string;
  openWebsite: (name: string) => string;
  newTab: string;
}

/** French elides "de" before a vowel: "le site d'Ollama", "le site de Laravel". */
function frDe(name: string) {
  return /^[aeiouyàâäéèêëïîôöùûü]/i.test(name) ? `d'${name}` : `de ${name}`;
}

export const STRINGS = {
  en: {
    numberLocale: "en-CA",
    all: "All",
    allSummary: "All categories, grouped by domain.",
    categories: "Tool categories",
    search: "Search tools",
    clearSearch: "Clear search",
    toolCount: (count) => `${count.toLocaleString("en-CA")} ${count === 1 ? "tool" : "tools"}`,
    noMatch: "No tool matches that query.",
    reset: "Reset",
    openWebsite: (name) => `Open ${name} website`,
    newTab: "(opens in a new tab)",
  },
  fr: {
    numberLocale: "fr-CA",
    all: "Tous",
    allSummary: "Toutes les catégories, groupées par domaine.",
    categories: "Catégories d'outils",
    search: "Rechercher un outil",
    clearSearch: "Effacer la recherche",
    toolCount: (count) => `${count.toLocaleString("fr-CA")} ${count > 1 ? "outils" : "outil"}`,
    noMatch: "Aucun outil ne correspond à cette recherche.",
    reset: "Réinitialiser",
    openWebsite: (name) => `Ouvrir le site ${frDe(name)}`,
    newTab: "(s'ouvre dans un nouvel onglet)",
  },
} satisfies Record<Locale, ArsenalStrings>;
