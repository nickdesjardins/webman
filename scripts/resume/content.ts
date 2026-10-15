/**
 * Resume content, assembled per locale from the site's data modules plus
 * resume-only copy (tighter bullets, section titles, languages, phone).
 * Facts must match data/*.ts, except the earlier roles (PcSquad, Webman
 * Solutions, Zakiry Productions), whose names, periods, places, and the
 * "hundreds of client IT problems" figure come from the previous resume at
 * docs/Nicolas-Desjardins-Resume.pdf; this file only chooses and condenses.
 */
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export interface Bullet {
  text: string;
}

export interface Role {
  title: string;
  org: string;
  period: string;
  place: string;
  bullets: string[];
}

export interface ProjectBlock {
  title: string;
  status: string;
  summary: string;
  metrics?: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ResumeContent {
  locale: Locale;
  name: string;
  title: string;
  tagline: string;
  contact: { email: string; phone: string; site: string; github: string; linkedin: string; location: string; remote: string };
  availability: string;
  metrics: { value: string; label: string }[];
  profileTitle: string;
  profile: string;
  experienceTitle: string;
  roles: Role[];
  earlierTitle: string;
  earlier: Role[];
  stackTitle: string;
  stack: SkillGroup[];
  languagesTitle: string;
  languages: string[];
  educationTitle: string;
  education: { degree: string; school: string; period: string }[];
  serviceTitle: string;
  service: string[];
  projectsTitle: string;
  projectsNote: string;
  /** The live Applied AI services, in delivery order. */
  projects: ProjectBlock[];
  flagshipTitle: string;
  /** NextBlock CMS, printed on the page after the AI services so the four cards never strand one on a page of its own. */
  flagship: ProjectBlock;
  /** Planned work, printed after the live projects as a compact entry with its design targets. */
  milestones: { title: string; delivery: string; summary: string; metrics: string[] }[];
  webTitle: string;
  webNote: string;
  /** Running-head label of the page with the flagship product and the web work. */
  roadmapLabel: string;
  /** Prefix of the one-line target metrics under each milestone; it says that they are targets, not measurements. */
  targetsLabel: string;
  /** Separator after a label: ": " in English, no-break space then ": " in French. */
  colon: string;
  /** Running-head label of the page that opens with earlier experience and the selected projects. */
  earlierProjectsLabel: string;
  web: { title: string; detail: string; href?: string; stack?: string; list?: string[] }[];
  arsenalTitle: string;
  arsenalNote: string;
  arsenal: SkillGroup[];
  footer: string;
  pageLabel: (page: number, total: number) => string;
  generated: string;
}

const PHONE = "+1 514-318-8025";

const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    "applied-ai": "Applied AI & LLM orchestration",
    models: "Frontier & open models",
    retrieval: "Retrieval, vectors & data",
    languages: "Languages",
    fullstack: "Frameworks & modern web",
    infrastructure: "Infrastructure & systems",
    llmops: "LLMOps & evaluation",
    devtools: "Developer tooling",
    design: "Design & media",
    marketing: "Marketing & analytics",
    productivity: "Productivity & collaboration",
    itsupport: "IT support & security",
  },
  fr: {
    "applied-ai": "IA appliquée et orchestration de LLM",
    models: "Modèles frontières et ouverts",
    retrieval: "Recherche, vecteurs et données",
    languages: "Langages",
    fullstack: "Frameworks et web moderne",
    infrastructure: "Infrastructure et systèmes",
    llmops: "LLMOps et évaluation",
    devtools: "Outils de développement",
    design: "Design et médias",
    marketing: "Marketing et analytique",
    productivity: "Productivité et collaboration",
    itsupport: "Soutien TI et sécurité",
  },
};

export function buildResume(locale: Locale): ResumeContent {
  const c = getContent(locale);
  const { site, nextblock, projects } = c;
  const edu = c.experience.education;
  const fr = locale === "fr";

  // Arsenal: names are product names, so they are shared; labels are translated here.
  const arsenal: SkillGroup[] = getContent("en").arsenal.arsenal.map((cat) => ({
    label: CATEGORY_LABELS[locale][cat.id] ?? cat.label,
    items: cat.tools.map((t) => t.name),
  }));

  /** The live Applied AI services, by id; their metrics are condensed per locale below. */
  const project = (id: string) => {
    const found = projects.find((p) => p.id === id);
    if (!found) throw new Error(`Unknown project: ${id}`);
    return found;
  };
  /**
   * Project page and repository, printed as bare URLs so both fit one line
   * (github.io reads as the docs, github.com as the source). The live demo is
   * one click from the project page, so it is left out here.
   */
  const bareLinks = (p: (typeof projects)[number]) =>
    (["docs", "github"] as const)
      .map((kind) => p.links?.find((l) => l.kind === kind)?.href)
      .filter((url): url is string => Boolean(url))
      .map((url) => ({ label: url.replace(/^https?:\/\//, "").replace(/\/$/, ""), href: url }));
  const invoice = project("invoice-extraction-service");
  const retrieval = project("hybrid-compliance-retrieval-engine");
  const agents = project("multi-agent-operations-pipeline");
  const milestones = projects.filter((p) => p.status === "pipeline");
  const milestoneRows = milestones.map((p) => ({
    title: p.title,
    delivery: p.delivery ?? "",
    summary: p.summary,
    metrics: p.metrics.map((m) => `${m.value} ${m.label}`),
  }));
  /** No-break space: keeps "Linux VPS" on one line and never starts a wrapped line with the dot. */
  const NBSP = String.fromCharCode(160);
  const joinStack = (items: readonly string[]) =>
    items.map((item) => item.split(" ").join(NBSP)).join(`${NBSP}· `);
  /** French typography puts a (no-break) space before the colon. */
  const colon = fr ? `${NBSP}: ` : ": ";
  /** Stack of the independent item whose URL contains the host, as one mono line. */
  const stackFor = (...hosts: string[]) =>
    joinStack(
      Array.from(
        new Set(hosts.flatMap((host) => c.work.independent.find((w) => w.url.includes(host))?.stack ?? []))
      )
    );
  /** The 18 campaign sites grouped as subdomains, own domains, and platform pages. */
  const campaignUrls = c.work.campaigns.map((item) => new URL(item.url));
  const subdomains = campaignUrls
    .filter((u) => u.host.endsWith(".newrootsherbal.com"))
    .map((u) => u.host.split(".")[0]);
  const ownDomains = campaignUrls
    .filter((u) => !u.host.includes("newrootsherbal.com"))
    .map((u) => (u.host.startsWith("www.") ? u.host.slice(4) : u.host));
  const platformPages = campaignUrls.filter((u) => u.host === "newrootsherbal.com").map((u) => u.pathname);
  const campaignLines = [
    `${fr ? "Sous-domaines" : "Subdomains"}${colon}${subdomains.join(", ")} (.newrootsherbal.com)`,
    `${fr ? "Domaines propres" : "Own domains"}${colon}${ownDomains.join(", ")}`,
    `${fr ? "Pages de la plateforme" : "Platform pages"}${colon}newrootsherbal.com${platformPages.join(", ")}`,
  ];
  const campaignStack = joinStack(Array.from(new Set(c.work.campaigns.flatMap((item) => item.stack))));
  const platformStack = joinStack(c.work.platform.stack);

  const common = {
    locale,
    name: site.name,
    title: site.title,
    contact: {
      email: site.email,
      phone: PHONE,
      site: "webman.dev",
      github: "github.com/nickdesjardins",
      linkedin: "linkedin.com/in/nicolas-desjardins",
      location: site.location.label,
      remote: fr ? "Local, hybride ou à distance (Canada, É.-U.)" : "Local, hybrid, or remote US and Canada",
    },
    availability: site.availability.label,
    education: edu.map((e) => ({ degree: e.degree, school: e.institution, period: e.period })),
    arsenal,
    pageLabel: (page: number, total: number) => (fr ? `Page ${page} de ${total}` : `Page ${page} of ${total}`),
    generated: fr ? "Généré à partir des données de webman.dev, octobre 2026" : "Generated from webman.dev data, October 2026",
    footer: `${site.name} · webman.dev`,
  };

  if (!fr) {
    return {
      ...common,
      tagline:
        "Eight years owning production web platforms, now building deterministic AI systems: schema-enforced extraction, hybrid retrieval, agent state machines, and LLMOps.",
      metrics: [
        { value: "8+", label: "years in production" },
        { value: "30+", label: "properties migrated, zero downtime" },
        { value: "$90k+", label: "licensing eliminated" },
        { value: "40%+", label: "infrastructure cost cut" },
        { value: "200k+", label: "lines of TypeScript (NextBlock)" },
        { value: "56", label: "MCP tools for coding agents" },
      ],
      profileTitle: "Profile",
      profile:
        "Lead web developer and applied AI developer with 8+ years of production ownership across 30+ digital properties, and the creator of NextBlock CMS, an open-source AI-native CMS for Next.js 16 and Supabase (200k+ lines of TypeScript, 8 npm packages, an MCP server with 56 tools). I bring what production AI actually needs: typed schemas, fallbacks that are tested, telemetry, and evaluation gates. Open to full-time roles, contracts, and agency placements in Applied AI, AI Solutions, and Forward Deployed Engineer roles.",
      experienceTitle: "Experience",
      roles: [
        {
          title: "Creator & Lead Developer",
          org: "NextBlock CMS (open source)",
          period: "Oct 2025 to present",
          place: "Greater Montreal Area, QC",
          bullets: [
            "Designed and built an AI-native CMS as an Nx monorepo: Next.js 16 Server Components, Supabase Postgres with row-level security, a Tiptap block editor, a commerce module, a CLI, and the release pipeline for 8 npm packages (v0.21.3).",
            "Shipped Cortex AI: an MCP server over Streamable HTTP with scoped tokens and 56 tools, confirmation-gated mutations, typed Zod tool calling with SSE streaming, OpenRouter routing with free-model fallback, and AES-256-GCM key storage.",
            "Built a zero-environment-variable deployment: Vercel's Supabase integration provisions the database and forward-only migrations apply during the first build; one command self-hosts the full stack on Docker.",
            "100/100 Lighthouse on the production build, 146 Vitest files, 191 CLI releases, and 11.5k downloads in the 30 days to 7 October 2026.",
          ],
        },
        {
          title: "Lead Web Developer & Applied AI Integration",
          org: "New Roots Herbal Inc.",
          period: "Nov 2018 to present",
          place: "Vaudreuil-Dorion, QC",
          bullets: [
            "Rebuilt newrootsherbal.com on Laravel 13 with a custom CMS and e-commerce store written from scratch, a Google Maps store locator, a real-time inventory system, and 18 campaign microsites.",
            "Deployed an internal multi-model generative AI asset pipeline (Claude, OpenAI Codex, Gemini) that cut catalog asset turnaround from weeks to 40 minutes per SKU, a 10x gain in throughput.",
            "Consolidated relational databases and deployed hybrid retrieval (lexical plus vector) with strict Pydantic validation, retiring legacy vendors and saving $90,000+ in licensing.",
            "Directed infrastructure across 30+ properties with zero-downtime migrations and a 40%+ cloud cost reduction; telemetry and attribution funnels captured $300,000+ in incremental revenue in one 30-day campaign.",
          ],
        },
      ],
      earlierTitle: "Earlier experience",
      earlier: [
        {
          title: "Technical Founder",
          org: "PcSquad",
          period: "2012 to 2018",
          place: "Les Coteaux, QC",
          bullets: [
            "Founded and ran a regional IT solutions and web infrastructure consultancy: scoping, custom software, deployment, systems administration, networking, and hardware diagnostics for small and mid-sized businesses.",
            "Owned the financial, legal, and marketing side, including SEO and paid acquisition; resolved hundreds of client IT problems.",
          ],
        },
        {
          title: "Founder",
          org: "Webman Solutions",
          period: "2016 to 2018",
          place: "Greater Montreal Area, QC",
          bullets: ["Web studio: built client websites and handled their early SEO and SEM."],
        },
        {
          title: "Webmaster & Technician",
          org: "Zakiry Productions",
          period: "2005 to 2018",
          place: "Pincourt, QC",
          bullets: ["Website, CRM, and sound systems for an entertainment production house; webmaster and computer technician."],
        },
      ],
      stackTitle: "Core stack",
      stack: [
        { label: "Applied AI", items: ["Python", "FastAPI", "Pydantic v2", "LangGraph", "LangChain", "Anthropic SDK", "OpenAI SDK", "OpenRouter", "MCP", "Vercel AI SDK", "Ollama"] },
        { label: "Retrieval & data", items: ["PostgreSQL", "pgvector", "tsvector / BM25", "Cohere Rerank", "Redis", "Supabase", "MySQL"] },
        { label: "Web", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Laravel", "PHP", "Node.js", "Tiptap", "Nx"] },
        { label: "Infrastructure", items: ["Docker", "Linux", "cPanel / WHM", "VPS", "Vercel", "Cloudflare Workers", "GitHub Actions", "Tailscale"] },
        { label: "LLMOps & testing", items: ["Langfuse", "DeepEval", "Ragas", "Pytest", "Vitest"] },
      ],
      languagesTitle: "Languages",
      languages: ["French, full professional proficiency", "English, full professional proficiency"],
      educationTitle: "Education",
      serviceTitle: "Military service",
      service: ["RCEME Weapons Technician, Canadian Armed Forces", "2013 to 2016, CFB Valcartier, QC"],
      projectsTitle: "Selected projects",
      projectsNote: "Measured numbers come from saved benchmark records and recorded runs. The last entry is planned work: its figures are design targets, not measurements.",
      projects: [
        {
          title: invoice.title,
          status: "Production live, open source",
          summary: invoice.summary,
          metrics: ["21 / 21 fully correct, primary model", "10 failure classes, offline", "0 network calls in tests", "$0.00 per request"],
          links: bareLinks(invoice),
        },
        {
          title: retrieval.title,
          status: "Live demo, open source",
          summary:
            "Hybrid RAG over SOPs and regulatory manuals: pgvector and full-text search fused by Reciprocal Rank Fusion in one PostgreSQL statement, a cross-encoder keeps 3 passages, and every quote is verified against the stored text before it is shown. Runs at zero cost on free models.",
          metrics: ["6 / 6 answers with verified quotes", "1 / 1 out-of-corpus declined", "441 MB peak, 512 MB host", "$0.00 per question"],
          links: bareLinks(retrieval),
        },
        {
          title: agents.title,
          status: "Live demo, open source",
          summary:
            "A LangGraph state machine that turns one inventory SKU into channel marketing copy for a licensed health product: a read-only SQL lookup, a writer and a compliance auditor under strict JSON schemas, deterministic checks that overrule the model on mechanical rules, a bounded self-correction loop, then a pause on a PostgreSQL checkpoint until a person approves, edits or rejects. Only approval or an edit fires the HMAC-signed webhook. Runs at zero cost on free models.",
          metrics: ["3 / 3 dispatches behind a human decision", "9 / 9 correct, primary free model", "504 hermetic tests", "$0.00 per run"],
          links: bareLinks(agents),
        },
      ],
      flagshipTitle: "Flagship product",
      flagship: {
          title: "NextBlock CMS",
          status: "Flagship product, v0.21.3, AGPL core",
          summary: nextblock.tagline + " " + nextblock.positioning,
          bullets: [
            "Content engine: every block is a JSONB row in PostgreSQL, custom block types are data, pages publish with no rebuild, Live Draft Mode and revisions, EN/FR content, SEO graded as you type.",
            "Data and security: three roles enforced by a database trigger, RLS kept Supabase Advisor clean, 21 forward-only migrations applied at build time, encrypted bring-your-own-key storage.",
            "Cortex AI: MCP server listed in the official registry (56 tools), page-aware agent with typed tools, OpenRouter routing with fallback, no token markup.",
            "Commerce Pro: Stripe and Freemius checkout, multi-currency with rounding modes, scheduled sales, shipping zones, taxes, inventory.",
          ],
          links: [
            { label: "nextblock.dev", href: nextblock.links.site.href },
            { label: "GitHub", href: nextblock.links.repo.href },
            { label: "npm", href: nextblock.links.npm.href },
          ],
      },
      milestones: milestoneRows,
      webTitle: "Production web work",
      webNote: "Employer work is credited to New Roots Herbal Inc.; the rest is independent.",
      roadmapLabel: "Flagship product and web work",
      targetsLabel: "Targets, not measurements",
      colon,
      earlierProjectsLabel: "Earlier experience and selected projects",
      web: [
        { title: "newrootsherbal.com (employer)", detail: "Full platform revamp on Laravel 13: custom CMS and e-commerce store, store locator, inventory system.", href: "https://newrootsherbal.com/", stack: platformStack },
        { title: "18 campaign microsites (employer)", detail: "Next.js microsites and Laravel landing pages for product lines and health topics.", list: campaignLines, stack: campaignStack },
        { title: "MusiqueSD (client)", detail: "Bilingual marketing site for a Montreal recording studio, DJ and event business, with a quote-request flow.", href: "https://www.musiquesd.com/", stack: stackFor("musiquesd.com") },
        { title: "Ryūgū: Ten Nights to the Dragon Palace", detail: "Chaptered travel companion for an eleven-day voyage around Japan and Jeju.", href: "https://japan.webman.dev/", stack: stackFor("japan.webman.dev") },
        { title: "Thieves' Cant Translator", detail: "D&D 5e rogue's companion: English or French to Thieves' Cant, with dictionary and symbols.", href: "https://www.thethievescant.com/", stack: stackFor("thethievescant.com") },
        { title: "Experiments", detail: "Civalgo Punch, a real-time worker check-in system; an interactive React Hooks guide.", stack: stackFor("civalgo-punch", "react-hooks-delta-umber") },
        { title: "pcsquad.ca (own business, 2012)", detail: "The bilingual site of my first company, a computer repair and website shop I owned and ran from 2012 to 2018.", href: "https://pcsquad.ca/", stack: stackFor("pcsquad.ca") },
      ],
      arsenalTitle: "Technical arsenal",
      arsenalNote: "195 tools across 12 domains, from the 2012 consultancy years to the current Applied AI work. Full detail with usage context at webman.dev.",
    };
  }

  return {
    ...common,
    tagline:
      "Huit ans à la tête de plateformes web en production, maintenant tourné vers l'IA déterministe : extraction à schéma imposé, recherche hybride, agents à états et LLMOps.",
    metrics: [
      { value: "8+", label: "années en production" },
      { value: "30+", label: "propriétés migrées sans interruption" },
      { value: "90 k$+", label: "en licences éliminées" },
      { value: "40 %+", label: "de coûts d'infrastructure en moins" },
      { value: "200k+", label: "lignes de TypeScript (NextBlock)" },
      { value: "56", label: "outils MCP pour les agents" },
    ],
    profileTitle: "Profil",
    profile:
      "Développeur web principal et développeur en IA appliquée, plus de 8 ans de responsabilité en production sur plus de 30 propriétés, et créateur de NextBlock CMS, un CMS ouvert et natif IA pour Next.js 16 et Supabase (200k+ lignes de TypeScript, 8 paquets npm, serveur MCP de 56 outils). J'apporte ce dont l'IA en production a besoin : schémas typés, replis testés, télémétrie et barrières d'évaluation. Ouvert aux postes permanents, aux contrats et aux placements par agence en IA appliquée, en solutions IA et comme Forward Deployed Engineer.",
    experienceTitle: "Expérience",
    roles: [
      {
        title: "Créateur et développeur principal",
        org: "NextBlock CMS (code ouvert)",
        period: "Oct. 2025 à aujourd'hui",
        place: "Grand Montréal, QC",
        bullets: [
          "Conception d'un CMS natif IA en monorepo Nx : Next.js 16 (Server Components), Postgres Supabase avec sécurité au niveau des lignes, éditeur de blocs Tiptap, module commerce, CLI et publication de 8 paquets npm (v0.21.3).",
          "Cortex AI : serveur MCP (Streamable HTTP, jetons à portée limitée, 56 outils, mutations confirmées avant exécution), outils typés Zod en flux SSE, routage OpenRouter avec repli gratuit, clés chiffrées AES-256-GCM.",
          "Déploiement sans variable d'environnement : Vercel provisionne Supabase et les migrations s'appliquent au premier build; une commande auto-héberge la pile sur Docker.",
          "Lighthouse 100/100 en production, 146 fichiers de tests Vitest, 191 versions du CLI, 11,5 k téléchargements en 30 jours (7 octobre 2026).",
        ],
      },
      {
        title: "Développeur web principal et intégration de l'IA appliquée",
        org: "New Roots Herbal Inc.",
        period: "Nov. 2018 à aujourd'hui",
        place: "Vaudreuil-Dorion, QC",
        bullets: [
          "Refonte de newrootsherbal.com sur Laravel 13 : CMS et boutique écrits de zéro, localisateur de magasins Google Maps, inventaire en temps réel et 18 microsites de campagne.",
          "Pipeline interne d'actifs génératifs multimodèles (Claude, OpenAI Codex, Gemini) : actifs de catalogue livrés en 40 minutes par UGS au lieu de plusieurs semaines, débit multiplié par 10.",
          "Consolidation des bases relationnelles et recherche hybride (lexicale et vectorielle) avec validation Pydantic stricte : fournisseurs hérités retirés, plus de 90 000 $ de licences économisés.",
          "Infrastructure de plus de 30 propriétés : migrations sans interruption, coûts infonuagiques réduits de plus de 40 %; entonnoirs de télémétrie et d'attribution ayant généré plus de 300 000 $ en une campagne de 30 jours.",
        ],
      },
    ],
    earlierTitle: "Expérience antérieure",
    earlier: [
      {
        title: "Fondateur technique",
        org: "PcSquad",
        period: "2012 à 2018",
        place: "Les Coteaux, QC",
        bullets: [
          "Fondation et exploitation d'une firme régionale de solutions TI et d'infrastructure web : cadrage, logiciels sur mesure, déploiement, administration de systèmes, réseautique et diagnostics matériels pour PME.",
          "Responsable des volets financier, juridique et marketing, incluant le SEO et l'acquisition payante; des centaines de problèmes TI résolus pour les clients.",
        ],
      },
      {
        title: "Fondateur",
        org: "Webman Solutions",
        period: "2016 à 2018",
        place: "Grand Montréal, QC",
        bullets: ["Studio web : sites pour des clients et accompagnement en SEO et SEM à leurs débuts."],
      },
      {
        title: "Webmestre et technicien",
        org: "Zakiry Productions",
        period: "2005 à 2018",
        place: "Pincourt, QC",
        bullets: ["Site web, CRM et systèmes de son pour une maison de production événementielle; webmestre et technicien informatique."],
      },
    ],
    stackTitle: "Pile principale",
    stack: [
      { label: "IA appliquée", items: ["Python", "FastAPI", "Pydantic v2", "LangGraph", "LangChain", "Anthropic SDK", "OpenAI SDK", "OpenRouter", "MCP", "Vercel AI SDK", "Ollama"] },
      { label: "Recherche et données", items: ["PostgreSQL", "pgvector", "tsvector / BM25", "Cohere Rerank", "Redis", "Supabase", "MySQL"] },
      { label: "Web", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Laravel", "PHP", "Node.js", "Tiptap", "Nx"] },
      { label: "Infrastructure", items: ["Docker", "Linux", "cPanel / WHM", "VPS", "Vercel", "Cloudflare Workers", "GitHub Actions", "Tailscale"] },
      { label: "LLMOps et tests", items: ["Langfuse", "DeepEval", "Ragas", "Pytest", "Vitest"] },
    ],
    languagesTitle: "Langues",
    languages: ["Français, maîtrise professionnelle complète", "Anglais, maîtrise professionnelle complète"],
    educationTitle: "Formation",
    serviceTitle: "Service militaire",
    service: ["Technicien d'armement, GEMRC, Forces armées canadiennes", "2013 à 2016, BFC Valcartier, QC"],
    projectsTitle: "Projets choisis",
    projectsNote: "Chiffres mesurés : enregistrements de référence sauvegardés et exécutions enregistrées. Dernière entrée : travail planifié, cibles de conception.",
    projects: [
      {
        title: invoice.title,
        status: "En production, code ouvert",
        summary: invoice.summary,
        metrics: ["21 / 21 corrects, modèle principal", "10 défaillances testées hors ligne", "0 appel réseau en test", "0,00 $ par requête"],
        links: bareLinks(invoice),
      },
      {
        title: retrieval.title,
        status: "Démo en ligne, code ouvert",
        summary:
          "RAG hybride sur des procédures et manuels réglementaires : pgvector et recherche plein texte fusionnés par Reciprocal Rank Fusion dans une seule requête PostgreSQL, un cross-encoder retient 3 passages, et chaque citation est vérifiée contre le texte stocké avant d'être affichée. Modèles gratuits, coût nul.",
        metrics: ["6 / 6 réponses vérifiées", "1 / 1 question hors corpus déclinée", "441 Mo au pic, hôte de 512 Mo", "0,00 $ par question"],
        links: bareLinks(retrieval),
      },
      {
        title: agents.title,
        status: "Démo en ligne, code ouvert",
        summary:
          "Une machine à états LangGraph qui transforme un SKU d'inventaire en textes marketing par canal pour un produit de santé homologué : consultation SQL en lecture seule, rédacteur et auditeur de conformité sous schémas JSON stricts, vérifications déterministes qui l'emportent sur le modèle, boucle d'autocorrection bornée, puis pause sur un point de contrôle PostgreSQL jusqu'à la décision d'une personne. Seule une approbation ou une modification déclenche le webhook signé HMAC.",
        metrics: ["3 / 3 envois après décision humaine", "9 / 9 corrects, modèle principal", "504 tests hermétiques", "0,00 $ par exécution"],
        links: bareLinks(agents),
      },
    ],
    flagshipTitle: "Produit phare",
    flagship: {
        title: "NextBlock CMS",
        status: "Produit phare, v0.21.3, noyau AGPL",
        summary: nextblock.tagline + " " + nextblock.positioning,
        bullets: [
          "Moteur de contenu : chaque bloc est une ligne JSONB dans PostgreSQL, les types de blocs personnalisés sont des données, les pages se publient sans rebuild, mode brouillon en direct et révisions, contenu FR/EN, SEO évalué pendant la saisie.",
          "Données et sécurité : trois rôles imposés par un déclencheur de base de données, RLS conforme à Supabase Advisor, 21 migrations ascendantes appliquées au build, stockage chiffré des clés fournies par l'utilisateur.",
          "Cortex AI : serveur MCP inscrit au registre officiel (56 outils), agent conscient de la page avec outils typés, routage OpenRouter avec repli, aucune majoration sur les jetons.",
          "Commerce Pro : paiement Stripe et Freemius, multidevise avec modes d'arrondi, soldes planifiés, zones d'expédition, taxes, inventaire.",
        ],
        links: [
          { label: "nextblock.dev", href: nextblock.links.site.href },
          { label: "GitHub", href: nextblock.links.repo.href },
          { label: "npm", href: nextblock.links.npm.href },
        ],
    },
    milestones: milestoneRows,
    webTitle: "Réalisations web en production",
    webNote: "Le travail en emploi est crédité à New Roots Herbal Inc.; le reste est indépendant.",
    roadmapLabel: "Produit phare et réalisations web",
    targetsLabel: "Cibles, pas des mesures",
    colon,
    earlierProjectsLabel: "Expérience antérieure et projets choisis",
    web: [
      { title: "newrootsherbal.com (employeur)", detail: "Refonte complète de la plateforme sur Laravel 13 : CMS et boutique en ligne sur mesure, localisateur de magasins, système d'inventaire.", href: "https://newrootsherbal.com/", stack: platformStack },
      { title: "18 microsites de campagne (employeur)", detail: "Microsites Next.js et pages d'atterrissage Laravel pour des gammes de produits et des thèmes santé.", list: campaignLines, stack: campaignStack },
      { title: "MusiqueSD (client)", detail: "Site bilingue pour un studio d'enregistrement, DJ et animateur d'événements de Montréal, avec demande de soumission.", href: "https://www.musiquesd.com/", stack: stackFor("musiquesd.com") },
      { title: "Ryūgū : Dix nuits vers le palais du Dragon", detail: "Compagnon de voyage par chapitres pour onze jours autour du Japon et de Jeju.", href: "https://japan.webman.dev/", stack: stackFor("japan.webman.dev") },
      { title: "Traducteur de Thieves' Cant", detail: "Compagnon du roublard de D&D 5e : anglais ou français vers le Thieves' Cant, avec dictionnaire et symboles.", href: "https://www.thethievescant.com/", stack: stackFor("thethievescant.com") },
      { title: "Expérimentations", detail: "Civalgo Punch, un système de pointage en temps réel; un guide interactif des hooks React.", stack: stackFor("civalgo-punch", "react-hooks-delta-umber") },
      { title: "pcsquad.ca (entreprise personnelle, 2012)", detail: "Le site bilingue de ma première entreprise, un atelier de réparation d'ordinateurs et de création de sites web que j'ai dirigé de 2012 à 2018.", href: "https://pcsquad.ca/", stack: stackFor("pcsquad.ca") },
    ],
    arsenalTitle: "Arsenal technique",
    arsenalNote: "195 outils dans 12 domaines, des années de consultation en 2012 au travail actuel en IA appliquée. Détail complet avec contexte d'utilisation sur webman.dev.",
  };
}
