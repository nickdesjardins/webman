/**
 * Édition française de data/services.ts. Mêmes identifiants, mêmes liens,
 * mêmes statuts; seul le texte visible est traduit.
 */
import type { ServiceItem, ServicesIntro } from "@/data/services";

export const servicesIntro: ServicesIntro = {
  eyebrow: "Ce que je peux construire pour votre entreprise",
  title: "Pas besoin de connaître le terme technique.",
  description:
    "Décrivez le problème dans vos mots. Chaque carte montre ce que je construis pour le régler, le nom que lui donnent les spécialistes, et la preuve vérifiable sur ce site.",
  termLabel: "Le terme technique",
  proofLabel: "Preuve",
  cta: "Voir comment ça marche",
  status: { measured: "Mesuré", target: "Planifié", record: "Bilan" },
};

export const services: ServiceItem[] = [
  {
    id: "invoices",
    icon: "file-text",
    problem: "Les factures, bons de commande et formulaires sont encore ressaisis à la main.",
    term: "Extraction de données de documents, avec schéma validé et modèle de relève",
    proof:
      "Lecteur de factures : 21 factures de test sur 21 entièrement exactes au banc d'essai du 7 octobre 2026.",
    status: "measured",
    href: "/projects/invoice-data-extraction",
  },
  {
    id: "manuals",
    icon: "book-open",
    problem: "Vos équipes ne trouvent pas les réponses dans vos procédures et vos manuels réglementaires.",
    term: "Recherche hybride (RAG) avec citations vérifiées",
    proof:
      "Interrogez vos manuels : 6 questions enregistrées sur 6 répondues avec des citations vérifiées, et la seule question hors des documents a été refusée (14 octobre 2026).",
    status: "measured",
    href: "/projects/compliance-document-search",
  },
  {
    id: "agents",
    icon: "workflow",
    problem: "Une tâche administrative en plusieurs étapes exige qu'une personne approuve les étapes à risque.",
    term: "Agents IA supervisés avec approbation humaine (LangGraph)",
    proof:
      "Agents d'opérations supervisés : 6 scénarios enregistrés le 15 octobre 2026, chaque envoi précédé d'une décision humaine consignée, et un dosage de probiotiques interverti attrapé par une vérification déterministe.",
    status: "measured",
    href: "/projects/multi-agent-operations",
  },
  {
    id: "quality",
    icon: "gauge",
    problem: "Vous avez modifié une consigne et personne ne sait si les réponses se sont dégradées.",
    term: "Évaluation en intégration continue, traçage et cache sémantique (LLMOps)",
    proof: "Contrôle qualité de l'IA : travail planifié, ses chiffres sont donc des cibles, pas des résultats.",
    status: "target",
    href: "#projects",
  },
  {
    id: "platforms",
    icon: "server",
    problem: "Vos sites web et votre boutique en ligne ne doivent pas tomber pendant un changement de serveur.",
    term: "Migration d'infrastructure et développement de plateformes web",
    proof:
      "Plus de 30 sites web migrés sans interruption et des coûts d'hébergement réduits de plus de 40 %, chez New Roots Herbal Inc.",
    status: "record",
    href: "#work",
  },
  {
    id: "cms",
    icon: "layout",
    problem: "Votre équipe veut un site qu'elle peut modifier elle-même, et que des outils d'IA peuvent aussi piloter en toute sécurité.",
    term: "CMS natif IA avec serveur MCP (NextBlock)",
    proof:
      "NextBlock CMS : 56 outils MCP, 8 paquets npm et 11,5 k téléchargements de la CLI en 30 jours (au 7 octobre 2026).",
    status: "measured",
    href: "#nextblock",
  },
];
