import type { Locale } from "@/lib/i18n";
import type { NodeId } from "./scenarios";

/**
 * UI strings for the hero simulator that do not come from the data modules:
 * the caption bar, the scenario switcher, autoplay states, node tile labels,
 * the JSON panel header and every aria-label. Scenario copy (status lines,
 * notes, announcements) lives next to the timing in scenarios.ts.
 *
 * Node labels must stay short (8 characters or fewer) so neighbouring tiles
 * never overlap at 360px or at the 1024px breakpoint.
 */
const STRINGS = {
  en: {
    live: "live simulation",
    caption: "extraction pipeline · simulated · 0 external calls",
    scenarioGroup: "Scenario",
    autoplay: "autoplay",
    autoplayPaused: "autoplay paused · 30s",
    autoplayStatic: "static · reduced motion",
    panel:
      "Animated simulation of the invoice extraction pipeline: a document is hardened, sent to a primary model with a fallback lane, recovered, validated and emitted as JSON.",
    response: "response",
    nodeDocument: "Document",
    nodeHarden: "Harden",
    nodePrimary: "Primary",
    nodeFallback: "Fallback",
    nodeRecover: "Recover",
    nodeValidate: "Validate",
    nodeOutput: "JSON out",
  },
  fr: {
    live: "simulation en direct",
    caption: "pipeline d'extraction · simulé · 0 appel externe",
    scenarioGroup: "Scénario",
    autoplay: "lecture auto",
    autoplayPaused: "lecture auto en pause · 30\u00a0s",
    autoplayStatic: "statique · animations réduites",
    panel:
      "Simulation animée du pipeline d'extraction de factures: un document est blindé, envoyé à un modèle primaire avec une voie de repli, réparé, validé et émis en JSON.",
    response: "réponse",
    nodeDocument: "Document",
    nodeHarden: "Blinder",
    nodePrimary: "Primaire",
    nodeFallback: "Repli",
    nodeRecover: "Réparer",
    nodeValidate: "Valider",
    nodeOutput: "Sortie",
  },
} satisfies Record<Locale, Record<string, string>>;

export type HeroStrings = (typeof STRINGS)[Locale];

/** The hero simulator dictionary for one locale. */
export function heroStrings(locale: Locale): HeroStrings {
  return STRINGS[locale];
}

const NODE_KEY = {
  document: "nodeDocument",
  harden: "nodeHarden",
  primary: "nodePrimary",
  fallback: "nodeFallback",
  recover: "nodeRecover",
  validate: "nodeValidate",
  output: "nodeOutput",
} as const satisfies Record<NodeId, keyof HeroStrings>;

/** Label shown under a pipeline tile. */
export function nodeLabel(t: HeroStrings, id: NodeId): string {
  return t[NODE_KEY[id]];
}
