/**
 * Édition française de data/audit.ts. Mêmes identifiants, mêmes liens, mêmes
 * commandes, mêmes nombres de vérifications (tenus au prompt par
 * `npm run audit-prompt`); seul le texte visible est traduit. Le prompt
 * lui-même reste en anglais, et la page le dit.
 */
import type { AuditContent } from "@/data/audit";
import { AUDIT_INSTALL_URL, AUDIT_REPO_URL, auditFileUrls, auditInstallCommand } from "@/data/audit-links";

const claude = auditFileUrls("integrations/claude-code/audit-ai.md");
const cursor = auditFileUrls("integrations/cursor/applied-ai-audit.mdc");
const copilot = auditFileUrls("integrations/copilot/audit-ai.prompt.md");
const universal = auditFileUrls("prompts/applied-ai-audit.md");

export const audit: AuditContent = {
  slug: "applied-ai-audit",
  path: "/projects/applied-ai-audit",
  name: "applied-ai-audit",
  seoTitle: "Prompt d'audit IA pour Claude Code et Cursor",
  description:
    "Prompt à code ouvert qui fait auditer votre code IA et votre base de données par Claude Code, Cursor ou Copilot\xa0: 7 piliers, 29 vérifications, licence MIT.",
  plainTitle: "Audit IA de votre code",
  title: "applied-ai-audit\xa0: un audit en 7 piliers de l'IA appliquée et des bases de données, pour agents de codage",
  statusLabel: "Trousse à code ouvert · MIT · v1.0.0",
  released: "Version publiée le 19 novembre 2026",
  version: "1.0.0",
  license: "MIT",
  installUrl: AUDIT_INSTALL_URL,
  keywords: [
    "Audit d'IA appliquée",
    "Mise en production des LLM",
    "Audit de base de données",
    "Claude Code",
    "Cursor",
    "GitHub Copilot",
    "Ingénierie de prompts",
    "Sorties structurées",
    "RAG",
    "LLMOps",
  ],
  summary:
    "Une liste de vérification que votre agent de codage applique à votre propre dépôt. Il lit le code et la couche de données, puis signale où les appels à l'IA sont fragiles, risqués, lents ou coûteux, avec le fichier et la ligne de chaque constat. Le prompt demande à l'agent de ne rien modifier tant que vous n'avez pas choisi les correctifs.",
  problemTitle: "Le problème réglé",
  problem:
    "La plupart des fonctions d'IA arrivent en production sous la forme d'un prompt et d'un appel de modèle. Les pannes arrivent plus tard, et elles viennent d'ailleurs\xa0: un analyseur qui casse dès que le modèle ajoute un bloc de code, une panne de fournisseur sans relève, du texte d'utilisateur collé tel quel dans le prompt, une requête que le modèle peut orienter, aucune trace de ce qu'un appel a coûté, et aucun test pour montrer qu'une modification de prompt a dégradé les réponses. Une revue de code ordinaire cherche rarement ces problèmes, et une revue par IA générique a tendance à recommander tous les patrons d'architecture d'entreprise qu'elle connaît.",
  proportionality: {
    title: "Proportionné dès la conception",
    body: "Avant de juger quoi que ce soit, l'audit établit le genre de projet qu'il examine\xa0: un simple robot conversationnel, une API d'extraction structurée, un moteur de connaissances RAG ou un flux multiagent. Les recommandations à la mesure de cette portée vont dans Fix Now (à corriger maintenant). L'infrastructure plus lourde, comme une cache sémantique Redis, un reclassement par cross-encoder ou un framework d'agents avec état, va dans Scale Later (pour plus tard), à moins que le code en ait déjà besoin.",
    tiers: [
      {
        label: "Fix Now",
        body: "Des changements adaptés au projet tel qu'il est aujourd'hui\xa0: paramètres du modèle, schémas, délais d'expiration, plafonds d'entrée, requêtes paramétrées, tests hors ligne.",
      },
      {
        label: "Scale Later",
        body: "Des capacités à ajouter quand le trafic, la taille du corpus ou les coûts le justifient\xa0: cache sémantique, reclassement, état d'agent durable, pipeline d'évaluation complet.",
      },
    ],
  },
  viewer: {
    title: "Installez-le là où vous travaillez déjà",
    intro:
      "Le même prompt existe sous quatre formes. Lancez l'installateur à la racine de votre projet et il y écrit le fichier de votre éditeur, ou copiez le fichier vous-même\xa0: c'est du Markdown ordinaire.",
    tabsLabel: "Intégrations par éditeur",
    installLabel: "Installation",
    invokeLabel: "Pour le lancer",
    fileLabel: "Contenu du fichier",
    rawLabel: "Fichier brut",
    sourceLabel: "Voir sur GitHub",
  },
  tabs: [
    {
      id: "claude",
      label: "Claude Code (/audit-ai)",
      targetLabel: "S'installe dans",
      target: ".claude/commands/audit-ai.md",
      install: auditInstallCommand("claude"),
      invoke: "Dans Claude Code, tapez /audit-ai.",
      ...claude,
    },
    {
      id: "cursor",
      label: "Cursor (.mdc)",
      targetLabel: "S'installe dans",
      target: ".cursor/rules/applied-ai-audit.mdc",
      install: auditInstallCommand("cursor"),
      invoke:
        "Dans la fenêtre de clavardage de Cursor, mentionnez la règle avec @applied-ai-audit. Ce n'est pas une règle toujours active (alwaysApply: false).",
      ...cursor,
    },
    {
      id: "copilot",
      label: "GitHub Copilot",
      targetLabel: "S'installe dans",
      target: ".github/prompts/audit-ai.prompt.md",
      install: auditInstallCommand("copilot"),
      invoke: "Dans VS Code, tapez /audit-ai dans Copilot Chat. Il s'exécute comme fichier de prompt, en mode ask.",
      ...copilot,
    },
    {
      id: "universal",
      label: "Prompt universel",
      targetLabel: "Fichier du dépôt",
      target: "prompts/applied-ai-audit.md",
      invoke:
        "Collez-le au début d'une nouvelle conversation, dans n'importe quel agent de codage qui peut lire votre dépôt.",
      ...universal,
    },
  ],
  pillarsTitle: "Sept piliers, 29 vérifications",
  pillarsIntro:
    "Chaque vérification pose une question précise sur le code ou la base de données. Celle qui ne s'applique pas est marquée N/A, avec la raison, au lieu d'être appliquée de force.",
  promptNote:
    "Le prompt lui-même est rédigé en anglais. Sous chaque pilier figure son titre tel qu'il apparaît dans le prompt.",
  checksLabel: "{count} vérifications",
  pillars: [
    {
      number: 1,
      name: "Inférence, déterminisme et contrats de sortie",
      heading: "Model Inference, Determinism & Output Contracts",
      short: "Contrats de sortie",
      checks: 5,
      plain:
        "Les paramètres du modèle sont fixés délibérément, les réponses sont validées contre un schéma strict, et les chiffres que les modèles ratent sont recalculés dans le code.",
    },
    {
      number: 2,
      name: "Architecture des prompts, fenêtre de contexte et sécurité",
      heading: "Prompt Architecture, Context Window & Security",
      short: "Prompts et sécurité",
      checks: 5,
      plain:
        "Les prompts sont ordonnés pour que le fournisseur puisse les mettre en cache, l'historique et la taille des entrées sont plafonnés, et un texte non fiable ne peut pas se faire passer pour une consigne.",
    },
    {
      number: 3,
      name: "Fiabilité, routage, latence et coûts",
      heading: "Reliability, Routing, Latency & Cost Economics",
      short: "Fiabilité et coûts",
      checks: 5,
      plain:
        "Les appels ont un délai d'expiration, passent à un autre modèle en cas d'échec, sont diffusés en continu quand quelqu'un attend, et vont à un modèle moins cher quand la tâche est simple.",
    },
    {
      number: 4,
      name: "Base de données, persistance et architecture des données",
      heading: "Database, Persistence & Data Architecture (Core DB Audit)",
      short: "Base de données",
      checks: 4,
      plain:
        "Les connexions passent par un pool, l'état de l'IA est modélisé avec clés et index, les requêtes sont paramétrées, et un enregistrement supprimé ne peut plus ressortir dans une recherche.",
    },
    {
      number: 5,
      name: "Recherche et optimisation de la base vectorielle",
      heading: "Retrieval & Vector Database Optimization (RAG Audit)",
      short: "Recherche (RAG)",
      checks: 4,
      plain:
        "Les documents sont découpés selon leur structure, la recherche combine vecteurs et mots-clés, et les citations sont vérifiées contre le texte stocké.",
    },
    {
      number: 6,
      name: "Appels d'outils, agents et orchestration",
      heading: "Tool Calling, Agents & Workflow Orchestration",
      short: "Agents et outils",
      checks: 3,
      plain:
        "Un framework d'agents n'entre en jeu que si le flux l'exige, les outils sont typés, les actions à risque attendent une personne, et chaque boucle a une limite.",
    },
    {
      number: 7,
      name: "Observabilité, évaluation et tests",
      heading: "Observability, Evaluation & Testing",
      short: "Observabilité et évaluations",
      checks: 3,
      plain:
        "Chaque requête est tracée avec son modèle, ses jetons et son coût, la couche IA se teste hors ligne, et une série fixe de questions encadre chaque changement.",
    },
  ],
  output: {
    title: "Ce que vous obtenez",
    intro: "Un rapport en lecture seule, en quatre parties\xa0:",
    items: [
      "Découverte du système\xa0: la pile, les SDK et les modèles d'IA, le moteur de base de données et l'ORM, et le niveau d'architecture détecté.",
      "Un tableau des constats\xa0: identifiant, gravité, domaine, fichier et ligne, problème et correctif concret.",
      "Un plan en trois phases\xa0: A pour les gains rapides dans la portée actuelle, B pour le durcissement, C pour les capacités à reporter.",
      "Un sommaire de la base de données\xa0: changements de schéma, index manquants, requêtes à corriger et modélisation de l'état à améliorer.",
    ],
    closing:
      "Il se termine par une question plutôt que par une pull request\xa0: quels éléments de la phase A mettre en œuvre en premier.",
  },
  references: {
    title: "Mises en œuvre de référence",
    intro:
      "La liste de vérification est née des quatre services d'IA de ce site. Chaque étude de cas montre certaines de ses vérifications en action, dans du code public qui fonctionne.",
    pillarsLabel: "Piliers",
    cta: "Lire l'étude de cas",
    items: [
      {
        slug: "invoice-data-extraction",
        pillars: [1, 2, 3, 7],
        look: "Décodage par schéma strict à température 0, totaux recalculés au cent près, corps de requête trop volumineux refusé avant lecture, bascule vers un second fournisseur en cas de limite de débit, de délai dépassé ou d'erreur de schéma, et une suite de tests qui ne peut pas atteindre le réseau.",
      },
      {
        slug: "compliance-document-search",
        pillars: [5, 1],
        look: "Segments découpés selon les titres avec préambule contextuel, recherche vectorielle et par mots-clés fusionnée dans une seule requête PostgreSQL, cross-encoder, chaque citation réancrée dans le texte stocké, et un verdict explicite de contexte insuffisant.",
      },
      {
        slug: "multi-agent-operations",
        pillars: [6, 4],
        look: "Un outil SQL paramétré en lecture seule, une boucle de révision bornée, et un point de contrôle PostgreSQL qui retient chaque exécution jusqu'à ce qu'une personne l'approuve, la modifie ou la rejette.",
      },
      {
        slug: "llmops-gateway",
        pillars: [2, 3, 7],
        look: "Une garde qui neutralise les jetons de gabarit et plafonne les jetons, une cache sémantique avec garde de contraste, un routeur de complexité avec relève, des traces Langfuse avec coûts, et une barrière d'évaluation en CI.",
      },
    ],
  },
  links: {
    repo: { label: "Code source sur GitHub", href: AUDIT_REPO_URL },
    release: { label: "Notes de version 1.0.0", href: `${AUDIT_REPO_URL}/releases/tag/v1.0.0` },
    raw: { label: "Prompt brut", href: universal.rawHref },
    readme: { label: "README", href: `${AUDIT_REPO_URL}/blob/main/README.md` },
  },
  cta: {
    title: "Vous voulez faire auditer votre système d'IA?",
    body: "Je peux le lancer avec votre équipe, passer les constats en revue et corriger les éléments de la phase A. Je réponds en moins d'un jour ouvrable, et je suis ouvert aux postes permanents, aux contrats et aux placements par agence.",
    contact: "Me joindre",
    email: "M'écrire",
  },
  teaser: {
    badge: "Outil de développement à code ouvert",
    title: "Audit IA du code pour agents de codage",
    body: "Un prompt gratuit sous licence MIT qui fait vérifier le code IA et la base de données d'un dépôt par Claude Code, Cursor ou Copilot selon 7 piliers et 29 vérifications, chaque constat avec son fichier et sa ligne. Le prompt demande à l'agent de ne rien modifier tant que vous n'avez pas choisi les correctifs.",
    installLabel: "Installer les trois intégrations",
    install: auditInstallCommand("all"),
    cta: "Voir la trousse",
  },
  linkLabel: "Audit IA du code (code ouvert)",
  nav: { back: "Tous les projets", next: "Mise en œuvre de référence" },
};
