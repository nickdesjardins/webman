/**
 * Édition française de data/experience.ts. Exporte exactement les mêmes noms,
 * typés avec les interfaces du module anglais. Les champs id, kind, start, end
 * et stack sont identiques à la source anglaise.
 */
import type { CareerSummary, EducationItem, ExperienceItem } from "@/data/experience";

export const experience: ExperienceItem[] = [
  {
    id: "nextblock",
    role: "Créateur et ingénieur principal",
    company: "NextBlock CMS (open source)",
    location: "Grand Montréal, QC",
    period: "Oct. 2025 à aujourd'hui",
    start: "2025-10",
    kind: "founder",
    summary:
      "Conception et développement d'un CMS open source natif IA pour Next.js 16 et Supabase, organisé en monorepo Nx: schéma de base de données et sécurité au niveau des lignes, éditeur de blocs, commerce, serveur MCP, CLI et pipeline de publication de huit paquets npm.",
    highlights: [
      "Architecture du modèle de contenu: chaque bloc est une ligne JSONB dans PostgreSQL, les types de blocs personnalisés sont des données (champs typés et schéma de mise en page protégés par des contraintes CHECK), et les pages se publient sans reconstruction.",
      "Livraison de Cortex AI: un serveur MCP sur Streamable HTTP avec jetons bearer à portée limitée et 56 outils, mutations soumises à confirmation, appels d'outils typés avec Zod et diffusion SSE, routage OpenRouter avec repli vers des modèles gratuits, et stockage chiffré en AES-256-GCM des clés fournies par l'utilisateur.",
      "Mise en place du parcours de déploiement sans aucune variable d'environnement: l'intégration Supabase de Vercel provisionne la base de données, les migrations unidirectionnelles s'appliquent lors de la première compilation, et l'assistant de configuration offre un repli à l'exécution.",
      "Maintenance de 8 paquets npm publiés sous une version unique (0.21.3), de 146 fichiers de tests Vitest et d'une GitHub Action de synchronisation quotidienne avec l'amont. La CLI compte 191 versions publiées et 11,5 k téléchargements dans les 30 jours précédant le 7 octobre 2026.",
      "Score Lighthouse de 100/100 dans les quatre catégories sur la version de production: LCP de 0,8 s, Total Blocking Time de 0 ms, Cumulative Layout Shift de 0.",
    ],
    stack: ["Next.js 16", "React Server Components", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS v4", "Tiptap", "Nx", "Vitest", "Vercel AI SDK", "MCP", "Stripe", "Docker"],
  },
  {
    id: "new-roots-herbal",
    role: "Développeur web principal et intégration de l'IA appliquée",
    company: "New Roots Herbal Inc.",
    location: "Vaudreuil-Dorion, QC",
    period: "Nov. 2018 à aujourd'hui",
    start: "2018-11",
    kind: "work",
    summary:
      "Responsable de la fiabilité en production, de l'architecture des données et de l'infrastructure de l'ensemble du parc numérique de l'entreprise, et chef de file de l'intégration de l'IA générative dans les opérations quotidiennes.",
    highlights: [
      "Architecture et déploiement d'un pipeline interne d'actifs générés par IA multimodèle (Claude, OpenAI Codex et Gemini), ramenant le délai de production des actifs du catalogue de produits de plusieurs semaines à 40 minutes par SKU: un gain de 10x en débit de production.",
      "Conception d'architectures d'ingestion de données à haute disponibilité, avec consolidation des bases de données relationnelles et déploiement d'une recherche hybride (indexation lexicale creuse et vectorielle dense) sous validation Pydantic stricte, éliminant des dépendances envers des fournisseurs tiers hérités et économisant plus de 90 000 $ en licences logicielles.",
      "Direction de la modernisation de l'infrastructure de plus de 30 propriétés numériques en production, avec des migrations de serveurs sans interruption de service et une réduction de plus de 40 % des coûts d'infrastructure infonuagique.",
      "Conception de la télémétrie, du suivi d'attribution et d'entonnoirs de déploiement automatisé rapide, générant plus de 300 000 $ de revenus additionnels en une seule campagne de 30 jours.",
      "Développement de microservices d'affaires sur mesure, dont un localisateur de magasins interne et un système de gestion des stocks en temps réel avec synchronisation de bases de données sans défaillance.",
    ],
    stack: ["Laravel", "PHP", "MySQL", "PostgreSQL", "Node.js", "Angular", "React", "Linux VPS", "cPanel/WHM", "Claude", "Codex", "Gemini", "Pydantic"],
  },
  {
    id: "pcsquad",
    role: "Fondateur technique",
    company: "PcSquad",
    location: "Les Coteaux, QC",
    period: "2012 à 2018",
    start: "2012-01",
    end: "2018-12",
    kind: "founder",
    summary:
      "Fondation et exploitation d'une firme-conseil régionale en solutions TI et en infrastructure web.",
    highlights: [
      "Gestion des livrables clients sur tout leur cycle de vie: cadrage, développement logiciel sur mesure, déploiement et soutien continu.",
      "Administration de systèmes, configuration de réseaux et diagnostics matériels pour des petites et moyennes entreprises.",
      "Responsable des volets financier, juridique et marketing de l'entreprise, y compris le référencement (SEO) et l'acquisition payante.",
    ],
    stack: ["PHP", "JavaScript", "WordPress", "Windows Server", "Linux", "Networking", "Hardware Diagnostics"],
  },
  {
    id: "rceme",
    role: "Vétéran des Forces armées",
    company: "Génie électrique et mécanique royal canadien (GEMRC)",
    location: "BFC Valcartier, QC",
    period: "2013 à 2016",
    start: "2013-01",
    end: "2016-12",
    kind: "military",
    summary:
      "Discipline militaire, diagnostics électromécaniques, maintenance de systèmes de précision et exécution posée dans des conditions critiques.",
    highlights: [
      "Diagnostic et réparation de systèmes d'armes, de pièces d'artillerie et d'équipement électromécanique selon des tolérances rigoureuses.",
      "Formation en soudure, en systèmes électriques, en hydraulique et en premiers soins. C'est là que j'ai appris à suivre une liste de vérification quand ça compte le plus.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    id: "concordia",
    degree: "Informatique, programme général",
    institution: "Université Concordia, Montréal",
    period: "2016 à 2018",
  },
  {
    id: "john-abbott",
    degree: "DEC en informatique",
    institution: "Collège John Abbott, Sainte-Anne-de-Bellevue",
    period: "2009 à 2012",
  },
];

export const careerSummary: CareerSummary = {
  heading: "Huit ans de fiabilité en production, rehaussés par l'ingénierie de l'IA appliquée.",
  body:
    "Le plus difficile en IA d'entreprise, ce n'est pas l'appel au modèle. C'est le pipeline de données qui l'alimente, le schéma qui le contraint, le repli qui le rattrape et la télémétrie qui prouve que ça a fonctionné. C'est le travail que je fais depuis 2018, désormais orienté vers les modèles de fondation.",
};
