/**
 * Édition française de data/automation.ts. Mêmes identifiants, mêmes liens,
 * mêmes statuts; seul le texte visible est traduit. Les termes recherchés au
 * Québec (« automatisation IA », « consultant en intelligence artificielle »,
 * « automatisation des processus d'affaires ») figurent dans le texte visible.
 */
import type { AutomationContent } from "@/data/automation";

export const automation: AutomationContent = {
  path: "/ai-automation",
  metaTitle: "Consultant en automatisation IA à Montréal et au Québec | Webman",
  description:
    "Agents IA sur mesure, traitement de documents et intégrations MCP pour les entreprises du Québec et du Canada, par Nicolas Desjardins (Webman), Montréal.",
  breadcrumb: "Automatisation IA",
  eyebrow: "Automatisation IA · Grand Montréal, Québec et Canada",
  title: "Automatisation IA pour les entreprises du Québec et du Canada",
  lead:
    "Je suis Nicolas Desjardins, et Webman (webman.dev) est le nom sous lequel je réalise des mandats d'automatisation IA et de développement full-stack. Je conçois des agents IA, du traitement de documents et une recherche dans votre base de connaissances privée qui se branchent sur les outils que votre équipe utilise déjà : on arrête de ressaisir des données, on arrête de fouiller dans les manuels, et une personne garde le dernier mot sur tout ce qui est risqué.",
  servicesTitle: "Quels services d'automatisation IA Webman offre-t-il au Québec et au Canada?",
  servicesIntro:
    "Cinq types de mandats, chacun avec une preuve vérifiable. Les résultats mesurés viennent de registres publics datés; le bilan vient de mon travail chez New Roots Herbal Inc.",
  usesLabel: "Usages courants",
  proofCta: "Voir la preuve",
  services: [
    {
      id: "documents",
      icon: "file-text",
      title: "Traitement de documents et automatisation de la saisie de données",
      outcome:
        "Les factures, bons de commande, formulaires et courriels entrants deviennent des enregistrements propres dans votre logiciel comptable, votre ERP ou votre base de données, sans ressaisie. Chaque total est recalculé au cent près, et rien ne sort avant d'avoir passé un schéma validé.",
      uses: [
        "Factures et bons de commande de fournisseurs",
        "Formulaires d'inscription et demandes",
        "Tri des courriels de prospects et de soutien",
        "Reçus et comptes de dépenses",
      ],
      proof:
        "Lecteur de factures : 21 factures de test sur 21 entièrement exactes au banc d'essai du 7 octobre 2026.",
      status: "measured",
      href: "/projects/invoice-data-extraction",
    },
    {
      id: "knowledge",
      icon: "book-open",
      title: "IA sur votre base de connaissances privée et copilotes internes (RAG)",
      outcome:
        "Vos équipes posent leurs questions en langage courant et obtiennent des réponses tirées de vos propres procédures, manuels et documents réglementaires, avec le passage exact et la page cités. Quand les documents ne couvrent pas la question, l'assistant le dit au lieu de deviner.",
      uses: [
        "Procédures normalisées et manuels qualité",
        "Documents réglementaires et de conformité",
        "Dossiers de produits et fiches techniques",
        "Politiques RH et guides d'accueil",
      ],
      proof:
        "Interrogez vos manuels : 6 questions enregistrées sur 6 répondues avec des citations vérifiées, et la seule question hors des documents a été refusée (14 octobre 2026).",
      status: "measured",
      href: "/projects/compliance-document-search",
    },
    {
      id: "agents",
      icon: "workflow",
      title: "Agents IA sur mesure avec approbation humaine",
      outcome:
        "Les tâches administratives en plusieurs étapes, comme extraire des données, rédiger du contenu et le vérifier selon vos règles, s'exécutent seules jusqu'à l'étape à risque. Là, elles attendent une personne, et chaque décision est consignée.",
      uses: [
        "Fiches produits pour chaque canal de vente",
        "Vérifications de conformité avant publication",
        "Suivis de commandes et d'inventaire",
        "Réponses rédigées à faire approuver",
      ],
      proof:
        "Agents d'opérations supervisés : 6 scénarios enregistrés le 15 octobre 2026, chaque envoi précédé d'une décision humaine consignée, et un dosage de probiotiques interverti attrapé par une vérification déterministe.",
      status: "measured",
      href: "/projects/multi-agent-operations",
    },
    {
      id: "mcp",
      icon: "plug",
      title: "Serveurs MCP et intégration de LLM",
      outcome:
        "Vos systèmes deviennent des outils que des assistants IA comme Claude, ChatGPT ou Cursor peuvent utiliser en toute sécurité grâce au Model Context Protocol (MCP) : jetons d'accès à portée limitée, actions typées, et une confirmation avant toute modification.",
      uses: [
        "Accès IA sécurisé à votre CMS, CRM ou base de données",
        "Brancher des modèles sur vos API internes",
        "Routage entre fournisseurs d'IA avec relève automatique",
        "Clés d'API chiffrées au repos",
      ],
      proof:
        "NextBlock CMS (Cortex AI) : un serveur MCP de 56 outils, inscrit au registre MCP officiel sous dev.nextblock/nextblock.",
      status: "measured",
      href: "#nextblock",
    },
    {
      id: "platforms",
      icon: "server",
      title: "Développement full-stack Next.js, Supabase et commerce électronique",
      outcome:
        "Des sites web, des boutiques en ligne et des applications internes conçus pour rester en ligne : migrations de serveurs, CMS headless, intégrations d'API sur mesure, et tout le travail full-stack qu'un projet d'IA exige autour de lui.",
      uses: [
        "Applications Next.js, React et TypeScript",
        "Back-ends Supabase et PostgreSQL",
        "Plateformes et migrations de commerce électronique",
        "Plateformes Laravel et PHP",
      ],
      proof:
        "Plus de 30 sites web migrés sans interruption et des coûts d'hébergement réduits de plus de 40 %, chez New Roots Herbal Inc.",
      status: "record",
      href: "#work",
    },
  ],
  connectTitle: "Comment les agents IA et les intégrations MCP se branchent-ils sur vos outils actuels?",
  connectIntro:
    "Par les portes que vos logiciels ont déjà. La plupart des outils d'affaires offrent une API, une base de données, une boîte courriel ou une exportation de fichiers, et c'est tout ce dont un agent a besoin.",
  connectSteps: [
    {
      title: "Choisir un processus",
      body: "On commence par la tâche qui gruge le plus d'heures chaque semaine, et on note ses entrées, ses règles et les étapes qu'une personne doit approuver.",
    },
    {
      title: "Faire de chaque action un outil typé",
      body: "Chaque action permise à l'IA, comme consulter une commande ou rédiger une mise à jour, devient un outil au schéma strict. Les outils en lecture seule s'exécutent librement; ceux qui modifient des données demandent d'abord une confirmation.",
    },
    {
      title: "Donner seulement l'accès nécessaire",
      body: "L'assistant se connecte par un serveur MCP ou une intégration d'API directe avec un jeton à portée limitée : il atteint les données dont il a besoin, et rien d'autre. Les clés sont chiffrées au repos.",
    },
    {
      title: "Garder une personne sur les étapes à risque",
      body: "Le processus s'arrête avant tout envoi, toute publication ou toute modification, et consigne qui l'a approuvé. Chaque exécution peut être retracée après coup.",
    },
    {
      title: "Mesurer sur vos propres cas",
      body: "Avant le déploiement, le système est testé sur un ensemble de vos vrais documents ou de vos vraies demandes, et vous voyez les résultats, comme pour chaque projet de ce site.",
    },
  ],
  areaTitle: "Automatisation IA à Montréal et au Québec, partout au Canada et à distance dans le monde entier",
  areaBody:
    "Je suis établi dans le Grand Montréal et je travaille en français et en anglais. Les entreprises de Montréal, de Salaberry-de-Valleyfield et d'ailleurs au Québec peuvent me rencontrer en personne; les équipes du reste du Canada, des États-Unis et d'ailleurs dans le monde travaillent avec moi entièrement à distance. Postes permanents, contrats et placements par agence : tout est bienvenu.",
  faqTitle: "Questions sur l'automatisation IA",
  faq: [
    {
      question: "Qu'est-ce que Webman?",
      answer:
        "Webman (webman.dev) est le nom sous lequel Nicolas Desjardins travaille sur le Web. Il est développeur en IA appliquée et développeur full-stack senior dans le Grand Montréal, et le créateur de NextBlock CMS et de son serveur MCP Cortex AI. Il a d'abord utilisé ce nom pour Webman Solutions, son studio web de 2016 à 2018.",
    },
    {
      question: "L'IA peut-elle se brancher sur les logiciels que nous utilisons déjà?",
      answer:
        "En général, oui. Si un système offre une API, une base de données, une boîte courriel ou une exportation de fichiers, un agent peut y lire des données et, avec votre approbation, y écrire. Quand un outil n'a pas d'API, une exportation planifiée ou un dossier partagé suffit souvent pour commencer.",
    },
    {
      question: "Comment empêchez-vous l'IA d'inventer des réponses?",
      answer:
        "Par conception : les réponses citent le passage et la page d'où elles viennent, les questions que les documents ne couvrent pas sont refusées, les données extraites doivent passer un schéma validé avant d'être enregistrées, et les actions à risque attendent une personne. Les projets de ce site publient leurs résultats mesurés, avec leurs dates.",
    },
    {
      question: "Où vont nos données?",
      answer:
        "C'est décidé avec vous avant toute construction : l'API d'un modèle commercial, un fournisseur hébergé dans la région de votre choix, ou un modèle ouvert exécuté sur votre propre serveur. L'index de recherche peut résider dans votre propre base de données PostgreSQL.",
    },
    {
      question: "Travaillez-vous à l'extérieur de Montréal, ou du Canada?",
      answer:
        "Oui. Je travaille sur place ou en mode hybride à Montréal et dans la région, y compris Salaberry-de-Valleyfield, et entièrement à distance partout au Canada, aux États-Unis et ailleurs dans le monde, en français ou en anglais.",
    },
    {
      question: "Pouvez-vous vous joindre à notre équipe plutôt que travailler à contrat?",
      answer: "Oui. Je suis ouvert aux postes permanents, aux contrats et aux placements par agence.",
    },
    {
      question: "En combien de temps répondez-vous?",
      answer:
        "En moins d'un jour ouvrable. Décrivez le problème dans vos mots; pas besoin de connaître le terme technique.",
    },
  ],
  cta: {
    title: "Un processus vous gruge des heures chaque semaine?",
    body: "Décrivez-le dans vos mots et je vous dirai ce qu'il faudrait. Je réponds en moins d'un jour ouvrable.",
    contact: "Me joindre",
    email: "M'écrire",
  },
  linkLabel: "Services d'automatisation IA",
  catalogName: "Services d'automatisation IA et de développement full-stack",
  offers: [
    {
      name: "Automatisation des processus d'affaires par agents IA",
      description:
        "Agents IA, traitement de documents et recherche dans une base de connaissances privée qui libèrent une équipe de la saisie manuelle et des tâches administratives en plusieurs étapes, avec une personne qui approuve les étapes à risque.",
    },
    {
      name: "Serveurs MCP et intégration de LLM",
      description:
        "Serveurs Model Context Protocol et intégrations de LLM qui donnent aux assistants IA un accès limité et soumis à confirmation aux systèmes d'une entreprise, avec relève entre fournisseurs et clés chiffrées.",
    },
    {
      name: "Développement full-stack Next.js et commerce électronique",
      description:
        "Applications Next.js, TypeScript et Supabase, plateformes de commerce électronique, CMS headless, intégrations d'API sur mesure et migrations sans interruption.",
    },
  ],
};
