/**
 * NextBlock CMS, French edition. Same shape and the same export names as
 * data/nextblock.ts; only the prose is translated.
 *
 * Every identifier, href, src, dimension, version, metric value, lucide key
 * and tone is byte-identical to the English source. Figures were taken from
 * public sources on 9 October 2026 (see the English module for the list).
 */

import type {
  ArchitectureLayer,
  NextblockContent,
  NextblockMetric,
  NextblockPillar,
  NextblockTimelineItem,
  SkillProof,
} from "@/data/nextblock";

const links: NextblockContent["links"] = {
  site: { label: "nextblock.dev", href: "https://nextblock.dev" },
  repo: {
    label: "Code source sur GitHub",
    href: "https://github.com/nextblock-cms/nextblock",
  },
  sandbox: {
    label: "Bac à sable en ligne",
    href: "https://cms.nextblock.dev/",
    note: "Réinitialisé toutes les 15 minutes. Accès démo: demo@nextblock.dev / password",
  },
  npm: {
    label: "create-nextblock sur npm",
    href: "https://www.npmjs.com/package/create-nextblock",
  },
  docs: {
    label: "Documentation",
    href: "https://github.com/nextblock-cms/nextblock/tree/master/docs",
  },
  mcp: {
    label: "Registre MCP: dev.nextblock/nextblock",
    href: "https://cms.nextblock.dev/.well-known/mcp/server-card.json",
  },
};

const metrics: NextblockMetric[] = [
  {
    value: "200k+",
    label: "lignes de TypeScript",
    source:
      "Décompte des lignes du dépôt, instantané de juin 2026: 115 944 lignes de code TS et 88 666 lignes TSX",
  },
  {
    value: "8",
    label: "paquets npm à une seule version",
    source:
      "create-nextblock et @nextblock-cms/{ui, utils, db, editor, sdk, ecom, cortex} en 0.21.3",
  },
  {
    value: "191",
    label: "versions de la CLI depuis oct. 2025",
    source: "Historique des versions de create-nextblock sur le registre npm",
  },
  {
    value: "11.5k",
    label: "téléchargements de la CLI en 30 jours",
    source: "Décomptes de téléchargements npm, du 8 septembre au 7 octobre 2026",
  },
  {
    value: "100 / 100",
    label: "Lighthouse, les quatre catégories",
    source: "Build de production: 0,3 s FCP, 0,8 s LCP, 0 ms TBT, 0 CLS",
  },
  {
    value: "146",
    label: "fichiers de tests Vitest",
    source: "Arborescence du dépôt, octobre 2026",
  },
  {
    value: "56",
    label: "outils MCP exposés aux agents",
    source: "Fiche du serveur MCP en ligne sur cms.nextblock.dev, 9 octobre 2026",
  },
  {
    value: "620+",
    label: "commits",
    source: "GitHub, branche master, octobre 2026",
  },
];

const pillars: NextblockPillar[] = [
  {
    id: "content",
    title: "Moteur de contenu",
    kicker: "Des blocs comme données, pas comme code",
    lucide: "layers",
    description:
      "Chaque bloc est une ligne JSONB dans PostgreSQL. Les pages se publient directement depuis la base de données, sans rebuild, et les éditeurs peuvent définir de nouveaux types de blocs à l'exécution.",
    bullets: [
      "Éditeur Tiptap de style Notion avec commandes slash, glisser-déposer et IA intégrée dans chaque bloc de texte, publié sous @nextblock-cms/editor.",
      "13 types de blocs intégrés, dont des sections multicolonnes imbriquées, des formulaires, des grilles de produits, le panier et le passage à la caisse.",
      "Blocs personnalisés pilotés par les données: champs typés et schéma de mise en page récursif stockés en JSONB, protégés par des contraintes CHECK de Postgres, rendus par un moteur de mise en page dynamique.",
      "Live Draft Mode (brouillon en direct): cliquez sur n'importe quel élément du site public pour le modifier sur place; les brouillons vivent dans des tables distinctes et ne touchent jamais au contenu en ligne avant la publication.",
      "Révisions pour les pages, les articles et les produits avec restauration en un clic. Traductions EN / FR liées pour chaque page. SEO noté pendant la saisie.",
    ],
  },
  {
    id: "data",
    title: "Modèle de données et de sécurité",
    kicker: "Le schéma est la source de vérité",
    lucide: "shield-check",
    description:
      "Postgres Supabase avec une couche de sécurité au niveau des lignes consolidée, des migrations en avant seulement et des secrets chiffrés avant d'atteindre une ligne.",
    bullets: [
      "Trois rôles (ADMIN, WRITER, USER) appliqués par un déclencheur de base de données qui promeut la première inscription au rang d'administrateur, de sorte que chaque installation compte exactement un administrateur garanti.",
      "RLS sans avertissement dans Supabase Advisor: une politique permissive par rôle et par commande, appels auth enveloppés dans (select ...) pour n'être évalués qu'une fois par instruction, déclencheurs SECURITY DEFINER révoqués pour anon et authenticated.",
      "21 migrations en avant seulement avec une base de référence de génération 2 condensée; les migrations s'appliquent pendant le premier build Vercel, avec un repli à l'exécution dans l'assistant d'installation.",
      "Stockage de clés fournies par l'utilisateur pour OpenRouter, Pexels et Unsplash, chiffrées en AES-256-GCM et masquées des lectures publiques par politique.",
      "Routes d'exportation et de restauration de sauvegardes complètes, réinitialisation du bac à sable pilotée par cron, tâche de synchronisation des devises.",
    ],
  },
  {
    id: "ai",
    title: "Cortex AI et le serveur MCP",
    kicker: "Les agents comme éditeurs de plein droit",
    lucide: "bot",
    description:
      "Le CMS est un serveur MCP. Claude Code, Cursor, Codex ou tout autre client peut lire le schéma et écrire des pages par Streamable HTTP avec un jeton bearer à portée limitée.",
    bullets: [
      "56 outils sur la fiche du serveur en ligne, de create_page_layout et publish_content_draft à describe_database_schema et translate_content_bulk. Inscrit au registre MCP officiel sous dev.nextblock/nextblock; chaque site sert /llms.txt et /.well-known/mcp/server-card.json.",
      "Les outils de mutation renvoient d'abord une phrase de confirmation et ne s'exécutent qu'après l'accord de l'utilisateur. Les annotations d'outils déclarent les indices destructive, idempotent et read-only.",
      "Un agent de tableau de bord conscient de la page modifie la navigation, le pied de page, les champs et les blocs par des arguments d'outils Zod stricts, diffusés en SSE, les réécritures de page entière étant préparées dans le Live Draft Mode.",
      "Routage OpenRouter par le Vercel AI SDK avec un exécuteur de repli vers des modèles gratuits, détection des limites de débit et garde-fous contre les fuites d'appels d'outils bruts et les flux bloqués.",
      "Apportez votre propre abonnement IA. La licence paie la connexion, jamais les jetons. Des plugins d'agent sont livrés pour Claude Code (marketplace de plugins), Cursor et Codex.",
    ],
  },
  {
    id: "commerce",
    title: "Commerce Pro",
    kicker: "De l'argent réel, des cas limites réels",
    lucide: "shopping-cart",
    description:
      "Un module premium avec deux fournisseurs de paiement, tarification multidevise, soldes planifiées, zones d'expédition, taxes, inventaire et commandes, verrouillé par activation de paquet.",
    bullets: [
      "Les produits physiques passent à la caisse par Stripe, les produits numériques par Freemius; les paniers mixtes sont rejetés au niveau de l'API.",
      "Multidevise avec prix par devise, rafraîchissement des taux de change et cinq modes d'arrondi, dont le prix psychologique.",
      "Fenêtres de soldes planifiées et changements de prix permanents en attente, avec coupons Freemius à durée limitée générés automatiquement pour que la solde planifiée soit appliquée chez le fournisseur.",
      "Zones d'expédition, méthodes par zone, taux de taxe, articles d'inventaire, variantes avec correspondance d'attributs, catégories, coupons et accès aux commandes limité au client sous RLS.",
    ],
  },
  {
    id: "distribution",
    title: "Distribution et expérience développeur",
    kicker: "Zéro variable d'environnement",
    lucide: "rocket",
    description:
      "Un clic sur Vercel, une commande en local, ou laissez un agent de codage faire l'installation. Les mises à jour fusionnent l'amont sans casser les modifications locales.",
    bullets: [
      "Déploiement Vercel en un clic: l'intégration Supabase Marketplace provisionne la base de données et injecte les clés avant le premier build. L'utilisateur ne remplit rien d'autre qu'un compte administrateur.",
      "Le mode Docker autohébergé démarre Postgres, GoTrue, PostgREST, Kong, MinIO et l'application en une commande, sans aucun compte infonuagique.",
      "npm create nextblock@latest génère une application autonome qui dépend des bibliothèques publiées plutôt que d'un monorepo cloné.",
      "npm run update applique le nouveau code du framework par une fusion git à trois voies, de sorte que les modifications locales survivent; une GitHub Action quotidienne garde les forks synchronisés.",
      "Espace de travail Nx avec frontières de modules imposées, builds de bibliothèques Vite et un pipeline de publication unique pour les huit paquets.",
    ],
  },
  {
    id: "performance",
    title: "La performance par défaut",
    kicker: "100 / 100, pas un plugin",
    lucide: "gauge",
    description:
      "Des scores Lighthouse parfaits sur le build de production parce que les valeurs par défaut sont les bonnes: rendu côté serveur, AVIF/WebP avec cache d'un an, CSS critique intégré en ligne, imports élagués par tree-shaking.",
    bullets: [
      "Les routes publiques de pages, d'articles et de produits sont des React Server Components; les composants client sont réservés au panier, au passage à la caisse, aux formulaires et au tableau de bord du CMS.",
      "0,3 s de First Contentful Paint, 0,8 s de Largest Contentful Paint, 0 ms de Total Blocking Time, 0 de Cumulative Layout Shift.",
      "Les sections hero signalent un chargement d'image prioritaire; tout ce qui se trouve sous la ligne de flottaison se charge en différé.",
      "Données de mise en page en cache, pipeline d'optimisation des images et diffusion edge-first avec routes de revalidation à la demande.",
    ],
  },
];

const architecture: ArchitectureLayer[] = [
  {
    id: "clients",
    label: "Clients",
    tone: "muted",
    items: ["Navigateurs", "Rédacteurs dans le CMS", "Claude Code / Cursor / Codex par MCP"],
  },
  {
    id: "edge",
    label: "Application Next.js 16",
    tone: "primary",
    items: [
      "Routes RSC publiques: pages, articles, produits",
      "CMS: 59 écrans",
      "39 routes API: caisse, webhooks, brouillon, IA, MCP",
    ],
  },
  {
    id: "libs",
    label: "Bibliothèques publiées",
    tone: "success",
    items: ["editor", "sdk", "db", "ui", "utils", "cortex (IA)", "ecommerce"],
  },
  {
    id: "data",
    label: "Supabase PostgreSQL",
    tone: "warning",
    items: [
      "blocs en JSONB",
      "brouillons et révisions",
      "définitions de blocs personnalisés",
      "politiques RLS",
      "commandes, devises, inventaire",
    ],
  },
  {
    id: "infra",
    label: "Tourne sur",
    tone: "muted",
    items: ["Vercel en un clic", "Docker autohébergé", "Médias sur Cloudflare R2 ou MinIO"],
  },
];

const proves: SkillProof[] = [
  {
    skill: "Architecture de bases de données",
    evidence:
      "Migrations en avant seulement, base de référence condensée, RLS avec politiques validées par l'Advisor, tables de révisions et de brouillons, et stockage de blocs JSONB avec contraintes CHECK.",
  },
  {
    skill: "Ingénierie en IA appliquée",
    evidence:
      "Un serveur MCP avec outils de mutation soumis à confirmation, appels d'outils typés, diffusion SSE, routage de modèles avec repli vers des modèles gratuits et stockage chiffré des clés.",
  },
  {
    skill: "Expérience produit et développeur",
    evidence:
      "Un parcours de déploiement sans variables d'environnement, une CLI à 191 versions, une commande de mise à jour par fusion à trois voies et un bac à sable qui se réinitialise toutes les 15 minutes.",
  },
  {
    skill: "Paiements et surfaces de conformité",
    evidence:
      "Passage à la caisse Stripe et Freemius, webhooks, arrondi multidevise, soldes planifiées, taxes et zones d'expédition.",
  },
  {
    skill: "Ingénierie de la performance",
    evidence:
      "100 / 100 à Lighthouse sur le build de production, avec rendu côté serveur, optimisation des images et CSS critique par défaut.",
  },
  {
    skill: "Gouvernance de projet à code source ouvert",
    evidence:
      "Noyau AGPL, fichiers CONTRIBUTING, SECURITY et code de conduite, guides pour agents dans .agent/skills, et huit paquets publiés de concert.",
  },
];

const timeline: NextblockTimelineItem[] = [
  { when: "Oct. 2025", what: "Première version de create-nextblock sur npm" },
  { when: "Janv. 2026", what: "Dépôt public sous nextblock-cms" },
  { when: "Sept. 2026", what: "v0.21.3 sur les huit paquets" },
  { when: "Oct. 2026", what: "Fiche du serveur MCP en ligne, flux de publication au registre en place" },
];

export const nextblock: NextblockContent = {
  name: "NextBlock CMS",
  wordmark: "NextBlock",
  role: "Créateur, concepteur et développeur principal",
  eyebrow: "Produit phare · Code source ouvert",
  heading: "NextBlock CMS: un CMS full-stack natif IA, construit de bout en bout.",
  tagline:
    "Le CMS full-stack natif IA et à code source ouvert pour Next.js 16, Supabase et Tailwind CSS.",
  positioning:
    "Les générateurs par prompt vous remettent du code à héberger et à rapiécer. WordPress vous remet des plugins à surveiller. NextBlock transforme des blocs de contenu typés dans PostgreSQL en un site web qu'une équipe entière peut faire tourner: un éditeur de style Notion pour les rédacteurs, des React Server Components pour le site public et un serveur MCP pour que les agents de codage construisent des pages avec le protocole qu'ils parlent déjà.",
  thesis: [
    "C'est le projet qui compile tout le reste de cette page dans une seule base de code: conception de schéma relationnel et sécurité au niveau des lignes, un éditeur que des gens non techniques utilisent vraiment, du commerce où circule de l'argent réel, du routage de modèles avec solutions de repli, un serveur MCP aux outils typés, une CLI, un pipeline de publication pour huit paquets et un parcours de déploiement qui ne demande à l'utilisateur rien d'autre qu'un compte administrateur.",
    "C'est aussi là que la thèse de l'IA appliquée est mise à l'épreuve auprès d'utilisateurs réels. Cortex AI ne greffe pas un robot conversationnel sur un CMS. Les agents modifient le contenu par des arguments d'outils Zod stricts, les outils de mutation demandent confirmation avant de s'exécuter, les brouillons sont préparés de façon non destructive et les clés sont chiffrées au repos.",
  ],
  version: "0.21.3",
  license: "Noyau AGPL-3.0-or-later, modules premium à code source disponible",
  since: "Première publication npm en octobre 2025. Dépôt public en janvier 2026.",
  links,
  install: "npm create nextblock@latest",
  stack: [
    "Next.js 16",
    "React 19 Server Components",
    "TypeScript",
    "Supabase (Postgres, GoTrue, Storage)",
    "Tailwind CSS v4",
    "Tiptap 3",
    "Nx 23",
    "Vitest",
    "Zod 4",
    "Vercel AI SDK",
    "OpenRouter",
    "Model Context Protocol",
    "Stripe",
    "Freemius",
    "Cloudflare R2 / MinIO",
    "Docker",
    "Vercel",
    "GitHub Actions",
  ],
  metrics,
  lighthouse: {
    src: "/img/nextblock/lighthouse-scores.png",
    alt: "Rapport Lighthouse de NextBlock CMS affichant 100 en Performance, Accessibilité, Bonnes pratiques et SEO",
    width: 581,
    height: 506,
    caption:
      "Build de production. 0,3 s de First Contentful Paint, 0,8 s de Largest Contentful Paint, 0 ms de Total Blocking Time, 0 de Cumulative Layout Shift.",
  },
  banner: {
    src: "/img/nextblock/nextblock-banner.jpg",
    alt: "Bannière NextBlock CMS",
    width: 1672,
    height: 941,
  },
  pillars,
  architecture,
  proves,
  timeline,
};

export type Nextblock = NextblockContent;
