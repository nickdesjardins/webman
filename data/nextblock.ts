/**
 * NextBlock CMS: the flagship product. An open-source, AI-native CMS for
 * Next.js 16 and Supabase, designed and built by Nicolas as an Nx monorepo.
 *
 * Every figure here is taken from public sources on 9 October 2026: the
 * repository (github.com/nextblock-cms/nextblock), its docs folder, the npm
 * registry, and the live sandbox's MCP server card. Figures that will drift
 * (downloads, commits) carry an explicit "as of" note.
 */

export interface NextblockMetric {
  value: string;
  label: string;
  source: string;
}

export interface NextblockPillar {
  id: string;
  title: string;
  kicker: string;
  description: string;
  bullets: string[];
  lucide:
    | "layers"
    | "shield-check"
    | "bot"
    | "shopping-cart"
    | "rocket"
    | "gauge";
}

export interface ArchitectureLayer {
  id: string;
  label: string;
  items: string[];
  tone: "primary" | "success" | "warning" | "muted";
}

export interface SkillProof {
  skill: string;
  evidence: string;
}

export interface NextblockLink {
  label: string;
  href: string;
  note?: string;
}

export interface NextblockTimelineItem {
  when: string;
  what: string;
}

export interface NextblockContent {
  name: string;
  wordmark: string;
  role: string;
  eyebrow: string;
  heading: string;
  tagline: string;
  positioning: string;
  thesis: string[];
  version: string;
  license: string;
  since: string;
  links: {
    site: NextblockLink;
    repo: NextblockLink;
    sandbox: NextblockLink;
    npm: NextblockLink;
    docs: NextblockLink;
    mcp: NextblockLink;
  };
  install: string;
  stack: string[];
  metrics: NextblockMetric[];
  lighthouse: { src: string; alt: string; width: number; height: number; caption: string };
  banner: { src: string; alt: string; width: number; height: number };
  pillars: NextblockPillar[];
  architecture: ArchitectureLayer[];
  proves: SkillProof[];
  timeline: NextblockTimelineItem[];
}

export const nextblock: NextblockContent = {
  name: "NextBlock CMS",
  wordmark: "NextBlock",
  role: "Creator, architect, and principal engineer",
  eyebrow: "Flagship product · Open source",
  heading: "NextBlock CMS: a full-stack, AI-native CMS, built end to end.",
  tagline:
    "The open-source, full-stack AI-native CMS for Next.js 16, Supabase, and Tailwind CSS.",
  positioning:
    "Prompt builders hand you code to host and patch. WordPress hands you plugins to babysit. NextBlock turns typed content blocks in PostgreSQL into a website a whole team can run: a Notion-style editor for writers, React Server Components for the public site, and an MCP server so coding agents can build pages over the protocol they already speak.",
  thesis: [
    "This is the project that compiles everything else on this page into one codebase: relational schema design and row-level security, an editor that non-technical people actually use, commerce with real money moving through it, model routing with fallbacks, an MCP server with typed tools, a CLI, a release pipeline for eight packages, and a deployment path that asks the user for nothing but an admin account.",
    "It is also where the Applied AI thesis gets tested against users. Cortex AI does not bolt a chatbot onto a CMS. Agents mutate content through strict Zod tool arguments, mutating tools confirm before they execute, drafts are staged non-destructively, and keys are encrypted at rest.",
  ],
  version: "0.21.3",
  license: "AGPL-3.0-or-later core, source-available premium modules",
  since: "First npm release October 2025. Public repository January 2026.",
  links: {
    site: { label: "nextblock.dev", href: "https://nextblock.dev" },
    repo: {
      label: "Source on GitHub",
      href: "https://github.com/nextblock-cms/nextblock",
    },
    sandbox: {
      label: "Live sandbox",
      href: "https://cms.nextblock.dev/",
      note: "Resets every 15 minutes. Demo login: demo@nextblock.dev / password",
    },
    npm: {
      label: "create-nextblock on npm",
      href: "https://www.npmjs.com/package/create-nextblock",
    },
    docs: {
      label: "Documentation",
      href: "https://github.com/nextblock-cms/nextblock/tree/master/docs",
    },
    mcp: {
      label: "MCP registry: dev.nextblock/nextblock",
      href: "https://cms.nextblock.dev/.well-known/mcp/server-card.json",
    },
  },
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
  metrics: [
    {
      value: "200k+",
      label: "lines of TypeScript",
      source: "Repository line count, June 2026 snapshot: 115,944 TS and 88,666 TSX code lines",
    },
    {
      value: "8",
      label: "npm packages at one version",
      source: "create-nextblock and @nextblock-cms/{ui, utils, db, editor, sdk, ecom, cortex} at 0.21.3",
    },
    {
      value: "191",
      label: "CLI releases since Oct 2025",
      source: "create-nextblock version history on the npm registry",
    },
    {
      value: "11.5k",
      label: "CLI downloads in 30 days",
      source: "npm download counts, 8 September to 7 October 2026",
    },
    {
      value: "100 / 100",
      label: "Lighthouse, all four categories",
      source: "Production build: 0.3 s FCP, 0.8 s LCP, 0 ms TBT, 0 CLS",
    },
    {
      value: "146",
      label: "Vitest test files",
      source: "Repository tree, October 2026",
    },
    {
      value: "56",
      label: "MCP tools exposed to agents",
      source: "Live MCP server card at cms.nextblock.dev, 9 October 2026",
    },
    {
      value: "620+",
      label: "commits",
      source: "GitHub, master branch, October 2026",
    },
  ],
  lighthouse: {
    src: "/img/nextblock/lighthouse-scores.png",
    alt: "Lighthouse report for NextBlock CMS showing 100 for Performance, Accessibility, Best Practices and SEO",
    width: 581,
    height: 506,
    caption: "Production build. 0.3 s First Contentful Paint, 0.8 s Largest Contentful Paint, 0 ms Total Blocking Time, 0 Cumulative Layout Shift.",
  },
  banner: {
    src: "/img/nextblock/nextblock-banner.jpg",
    alt: "NextBlock CMS banner",
    width: 1672,
    height: 941,
  },
  pillars: [
    {
      id: "content",
      title: "Content engine",
      kicker: "Blocks as data, not as code",
      lucide: "layers",
      description:
        "Every block is a JSONB row in PostgreSQL. Pages publish straight from the database with no rebuild, and editors can define new block types at runtime.",
      bullets: [
        "Notion-style Tiptap editor with slash commands, drag and drop, and inline AI in every text block, published as @nextblock-cms/editor.",
        "13 built-in block types including nested multi-column sections, forms, product grids, cart and checkout.",
        "Data-driven custom blocks: typed fields and a recursive layout schema stored as JSONB, guarded by Postgres CHECK constraints, rendered by a dynamic layout engine.",
        "Live Draft Mode: click any element on the public site to edit it in place; drafts live in separate tables and never touch live content until publish.",
        "Revisions for pages, posts, and products with one-click restore. Linked EN / FR translations for every page. SEO graded as you type.",
      ],
    },
    {
      id: "data",
      title: "Data and security model",
      kicker: "The schema is the source of truth",
      lucide: "shield-check",
      description:
        "Supabase Postgres with a consolidated row-level security layer, forward-only migrations, and secrets that are encrypted before they reach a row.",
      bullets: [
        "Three roles (ADMIN, WRITER, USER) enforced by a database trigger that promotes the first sign-up to admin, so every install has exactly one guaranteed administrator.",
        "RLS kept Supabase Advisor clean: one permissive policy per role and command, auth calls wrapped in (select ...) so they evaluate once per statement, SECURITY DEFINER triggers revoked from anon and authenticated.",
        "21 forward-only migrations with a squashed generation-2 baseline; migrations apply during the first Vercel build with a runtime fallback in the setup wizard.",
        "Bring-your-own-key storage for OpenRouter, Pexels and Unsplash encrypted with AES-256-GCM and hidden from public reads by policy.",
        "Full backup export and restore routes, cron-driven sandbox reset, currency sync job.",
      ],
    },
    {
      id: "ai",
      title: "Cortex AI and the MCP server",
      kicker: "Agents as first-class editors",
      lucide: "bot",
      description:
        "The CMS is an MCP server. Claude Code, Cursor, Codex, or any client can read the schema and write pages over Streamable HTTP with a scoped bearer token.",
      bullets: [
        "56 tools on the live server card, from create_page_layout and publish_content_draft to describe_database_schema and translate_content_bulk. Listed in the official MCP Registry as dev.nextblock/nextblock; every site serves /llms.txt and /.well-known/mcp/server-card.json.",
        "Mutating tools return a confirmation phrase first and execute only after the user confirms. Tool annotations declare destructive, idempotent, and read-only hints.",
        "A page-aware dashboard agent mutates navigation, footer, fields, and blocks through strict Zod tool arguments, streamed over SSE, with whole-page rewrites staged into Live Draft Mode.",
        "OpenRouter routing through the Vercel AI SDK with a free-model fallback runner, rate-limit detection, and guards against raw tool-call leakage and stuck streams.",
        "Bring your own AI subscription. The license buys the connection, never the tokens. Agent plugins ship for Claude Code (plugin marketplace), Cursor, and Codex.",
      ],
    },
    {
      id: "commerce",
      title: "Commerce Pro",
      kicker: "Real money, real edge cases",
      lucide: "shopping-cart",
      description:
        "A premium module with two payment providers, multi-currency pricing, scheduled sales, shipping zones, taxes, inventory, and orders, gated by package activation.",
      bullets: [
        "Physical products check out through Stripe, digital products through Freemius; mixed-provider carts are rejected at the API.",
        "Multi-currency with per-currency prices, exchange-rate refresh, and five rounding modes including charm pricing.",
        "Scheduled sale windows and pending permanent price changes, with auto-generated time-bounded Freemius coupons so a scheduled sale is enforced at the provider.",
        "Shipping zones, zone methods, tax rates, inventory items, variants with attribute mapping, categories, coupons, and customer-scoped order access under RLS.",
      ],
    },
    {
      id: "distribution",
      title: "Distribution and developer experience",
      kicker: "Zero environment variables",
      lucide: "rocket",
      description:
        "One click on Vercel, one command locally, or let a coding agent do the install. Updates merge upstream without breaking local edits.",
      bullets: [
        "One-click Vercel deploy: the Supabase Marketplace integration provisions the database and injects keys before the first build. The user fills in nothing but an admin account.",
        "Self-hosted Docker mode boots Postgres, GoTrue, PostgREST, Kong, MinIO, and the app with one command, no cloud accounts.",
        "npm create nextblock@latest scaffolds a standalone app that depends on the published libraries instead of a cloned monorepo.",
        "npm run update applies new framework code as a git three-way merge so local edits survive; a daily GitHub Action keeps forks in sync.",
        "Nx workspace with enforced module boundaries, Vite library builds, and a single release pipeline for all eight packages.",
      ],
    },
    {
      id: "performance",
      title: "Performance by default",
      kicker: "100 / 100, not a plugin",
      lucide: "gauge",
      description:
        "Perfect Lighthouse scores on the production build because the defaults are right: server rendering, AVIF/WebP with a one-year cache, critical CSS inlined, imports tree-shaken.",
      bullets: [
        "Public page, article, and product routes are React Server Components; client components are reserved for cart, checkout, forms, and the CMS dashboard.",
        "0.3 s First Contentful Paint, 0.8 s Largest Contentful Paint, 0 ms Total Blocking Time, 0 Cumulative Layout Shift.",
        "Hero sections flag prioritized image loading; everything below the fold lazy-loads.",
        "Cached layout data, image optimization pipeline, and edge-first delivery with on-demand revalidation routes.",
      ],
    },
  ],
  architecture: [
    {
      id: "clients",
      label: "Clients",
      tone: "muted",
      items: ["Browsers", "Writers in the CMS", "Claude Code / Cursor / Codex over MCP"],
    },
    {
      id: "edge",
      label: "Next.js 16 application",
      tone: "primary",
      items: [
        "Public RSC routes: pages, articles, products",
        "CMS: 59 screens",
        "39 API routes: checkout, webhooks, draft, AI, MCP",
      ],
    },
    {
      id: "libs",
      label: "Published libraries",
      tone: "success",
      items: ["editor", "sdk", "db", "ui", "utils", "cortex (AI)", "ecommerce"],
    },
    {
      id: "data",
      label: "Supabase PostgreSQL",
      tone: "warning",
      items: [
        "blocks as JSONB",
        "drafts and revisions",
        "custom block definitions",
        "RLS policies",
        "orders, currencies, inventory",
      ],
    },
    {
      id: "infra",
      label: "Runs on",
      tone: "muted",
      items: ["Vercel one-click", "Docker self-hosted", "Cloudflare R2 or MinIO media"],
    },
  ],
  proves: [
    {
      skill: "Database architecture",
      evidence:
        "Forward-only migrations, a squashed baseline, RLS with advisor-clean policies, revision and draft tables, and JSONB block storage with CHECK constraints.",
    },
    {
      skill: "Applied AI engineering",
      evidence:
        "An MCP server with confirmation-gated mutating tools, typed tool calling, SSE streaming, model routing with free-model fallback, and encrypted key storage.",
    },
    {
      skill: "Product and developer experience",
      evidence:
        "A deployment path with no environment variables, a CLI with 191 releases, a three-way-merge update command, and a sandbox that resets itself every 15 minutes.",
    },
    {
      skill: "Payments and compliance surfaces",
      evidence:
        "Stripe and Freemius checkout, webhooks, multi-currency rounding, scheduled sales, taxes, and shipping zones.",
    },
    {
      skill: "Performance engineering",
      evidence:
        "100 / 100 Lighthouse on the production build with server rendering, image optimization, and critical CSS as defaults.",
    },
    {
      skill: "Open-source stewardship",
      evidence:
        "AGPL core, CONTRIBUTING, SECURITY and Code of Conduct files, agent playbooks in .agent/skills, and eight packages released in lockstep.",
    },
  ],
  timeline: [
    { when: "Oct 2025", what: "First create-nextblock release on npm" },
    { when: "Jan 2026", what: "Public repository under nextblock-cms" },
    { when: "Sep 2026", what: "v0.21.3 across all eight packages" },
    { when: "Oct 2026", what: "MCP server card live, registry publish workflow in place" },
  ],
};

export type Nextblock = NextblockContent;
