/**
 * applied-ai-audit: an open-source audit prompt for coding agents, shown on
 * /projects/applied-ai-audit and as a teaser in the projects section.
 *
 * It is a developer tool, not a fifth service, so it is deliberately not in
 * data/projects.ts: it never enters the case-study cycle, the project JSON-LD
 * loop, the sitemap's project loop or the resume. The only numbers here are
 * toolkit facts (7 pillars, 29 checks, 3 IDE integrations, v1.0.0, 2026); the
 * per-pillar check counts are held to the prompt by `npm run audit-prompt`
 * (scripts/sync-audit-prompt.mjs), which also generates data/audit-prompt.ts
 * with the file contents. That module is imported by the page's file viewer
 * only, never from here, so the prompt text stays out of every other bundle.
 * The French edition lives in data/fr/audit.ts and must satisfy the same types;
 * the repository URLs and install commands come from data/audit-links.ts.
 */
import { AUDIT_INSTALL_URL, AUDIT_REPO_URL, auditFileUrls, auditInstallCommand } from "@/data/audit-links";

/** Stable tab values: a language switch keeps the selected tab. */
export type AuditTabId = "claude" | "cursor" | "copilot" | "universal";

export interface AuditTab {
  id: AuditTabId;
  /** Tab trigger label. */
  label: string;
  /** Label in front of `target`. */
  targetLabel: string;
  /** Where the installer writes the file, relative to the project root (the repository file for the universal prompt). */
  target: string;
  /** One-line installer; absent for the universal prompt, which is pasted. */
  install?: string;
  /** How to run the audit once the file is in place. */
  invoke: string;
  /** The file in the toolkit repository: raw, and its GitHub page. */
  rawHref: string;
  sourceHref: string;
}

export interface AuditPillar {
  /** The prompt's own numbering, 1 to 7. */
  number: number;
  /** Visible name in this edition. */
  name: string;
  /** The heading exactly as the prompt writes it (the prompt is in English). */
  heading: string;
  /** Chip label for the reference implementations. */
  short: string;
  /** Checks under this pillar in the prompt; `npm run audit-prompt` fails if this drifts. */
  checks: number;
  /** What the pillar looks at, in one plain sentence. */
  plain: string;
}

export interface AuditReference {
  /** Slug of a live project in data/projects.ts; its titles are read from there. */
  slug: string;
  /** Pillar numbers the case study shows in working code. */
  pillars: number[];
  /** What to look at on that page. Restates the case study; adds no numbers. */
  look: string;
}

export interface AuditLink {
  label: string;
  href: string;
}

export interface AuditContent {
  /** URL segment: /projects/<slug>, /fr/projects/<slug>. */
  slug: string;
  /** Public path of the page, without the edition prefix. */
  path: string;
  /** Repository and package name. */
  name: string;
  /** Search title: the query a developer would type, about 40 characters. */
  seoTitle: string;
  /** Meta description, about 160 characters or less. */
  description: string;
  /** Plain name; also the breadcrumb and the H1. */
  plainTitle: string;
  /** Technical title, shown as the subtitle. */
  title: string;
  statusLabel: string;
  released: string;
  version: string;
  /** SPDX identifier. */
  license: string;
  /** The installer script (raw), for the SoftwareApplication's installUrl. */
  installUrl: string;
  /** Topics for the TechArticle's keywords, in the edition's language (product names stay as they are). */
  keywords: string[];
  /** What it does, in two or three plain sentences. */
  summary: string;
  problemTitle: string;
  problem: string;
  proportionality: {
    title: string;
    body: string;
    tiers: { label: string; body: string }[];
  };
  viewer: {
    title: string;
    intro: string;
    /** Accessible name of the tab list. */
    tabsLabel: string;
    installLabel: string;
    invokeLabel: string;
    fileLabel: string;
    rawLabel: string;
    sourceLabel: string;
  };
  tabs: AuditTab[];
  pillarsTitle: string;
  pillarsIntro: string;
  /** Shown under the intro when the edition's language is not the prompt's. */
  promptNote?: string;
  /** "{count} checks". */
  checksLabel: string;
  pillars: AuditPillar[];
  output: { title: string; intro: string; items: string[]; closing: string };
  references: { title: string; intro: string; pillarsLabel: string; cta: string; items: AuditReference[] };
  links: { repo: AuditLink; release: AuditLink; raw: AuditLink; readme: AuditLink };
  cta: { title: string; body: string; contact: string; email: string };
  /** The card in the home page's projects section. */
  teaser: { badge: string; title: string; body: string; installLabel: string; install: string; cta: string };
  /** Footer link label. */
  linkLabel: string;
  /** Back and next links at the foot of the page. */
  nav: { back: string; next: string };
}

const claude = auditFileUrls("integrations/claude-code/audit-ai.md");
const cursor = auditFileUrls("integrations/cursor/applied-ai-audit.mdc");
const copilot = auditFileUrls("integrations/copilot/audit-ai.prompt.md");
const universal = auditFileUrls("prompts/applied-ai-audit.md");

export const audit: AuditContent = {
  slug: "applied-ai-audit",
  path: "/projects/applied-ai-audit",
  name: "applied-ai-audit",
  seoTitle: "AI codebase audit prompt for Claude Code",
  description:
    "Open-source prompt that has Claude Code, Cursor or Copilot audit your AI code and database: 7 pillars, 29 checks, file:line evidence. MIT, one-line install.",
  plainTitle: "AI codebase audit",
  title: "applied-ai-audit: a 7-pillar Applied AI and database audit for coding agents",
  statusLabel: "Open-source toolkit · MIT · v1.0.0",
  released: "Released 19 November 2026",
  version: "1.0.0",
  license: "MIT",
  installUrl: AUDIT_INSTALL_URL,
  keywords: [
    "Applied AI audit",
    "LLM production readiness",
    "Database audit",
    "Claude Code",
    "Cursor",
    "GitHub Copilot",
    "Prompt engineering",
    "Structured outputs",
    "RAG",
    "LLMOps",
  ],
  summary:
    "A checklist your coding agent runs against your own repository. It reads the code and the database layer, then reports where AI calls are fragile, unsafe, slow or expensive, with the file and line of every finding. The prompt tells the agent to change nothing until you say which fixes to make.",
  problemTitle: "The problem it solves",
  problem:
    "Most AI features reach production as a prompt and a model call. The failures come later, and from elsewhere: a parser that breaks when the model adds a code fence, a provider outage with no fallback, user text pasted straight into the prompt, a query the model can steer, no record of what a call cost, and no test that shows a prompt change made the answers worse. A generic code review rarely looks for these, and a generic AI review tends to recommend every enterprise pattern it knows.",
  proportionality: {
    title: "Proportionate by design",
    body: "Before it judges anything, the audit decides what kind of project it is looking at: a simple chatbot, a structured extraction API, a RAG knowledge engine or a multi-agent workflow. Recommendations that fit that scope go in Fix Now. Heavier infrastructure, such as a Redis semantic cache, a reranker or a stateful agent framework, goes in Scale Later unless the code already needs it.",
    tiers: [
      {
        label: "Fix Now",
        body: "Changes that fit the project as it is today: model parameters, schemas, timeouts, input ceilings, parameterized queries, offline tests.",
      },
      {
        label: "Scale Later",
        body: "Capabilities to add once traffic, corpus size or cost justifies them: semantic caching, reranking, durable agent state, a full evaluation pipeline.",
      },
    ],
  },
  viewer: {
    title: "Install it where you already work",
    intro:
      "The same prompt ships in four forms. Run the installer from the root of your project and it writes the file for your editor, or copy the file yourself: it is plain Markdown.",
    tabsLabel: "Editor integrations",
    installLabel: "Install",
    invokeLabel: "Run it",
    fileLabel: "File contents",
    rawLabel: "Raw file",
    sourceLabel: "View on GitHub",
  },
  tabs: [
    {
      id: "claude",
      label: "Claude Code (/audit-ai)",
      targetLabel: "Installs to",
      target: ".claude/commands/audit-ai.md",
      install: auditInstallCommand("claude"),
      invoke: "In Claude Code, type /audit-ai.",
      ...claude,
    },
    {
      id: "cursor",
      label: "Cursor (.mdc)",
      targetLabel: "Installs to",
      target: ".cursor/rules/applied-ai-audit.mdc",
      install: auditInstallCommand("cursor"),
      invoke:
        "In Cursor chat, reference the rule as @applied-ai-audit. It is not an always-on rule (alwaysApply: false).",
      ...cursor,
    },
    {
      id: "copilot",
      label: "GitHub Copilot",
      targetLabel: "Installs to",
      target: ".github/prompts/audit-ai.prompt.md",
      install: auditInstallCommand("copilot"),
      invoke: "In VS Code, type /audit-ai in Copilot Chat. It runs as a prompt file in ask mode.",
      ...copilot,
    },
    {
      id: "universal",
      label: "Universal prompt",
      targetLabel: "File in the repository",
      target: "prompts/applied-ai-audit.md",
      invoke: "Paste it at the start of a new conversation in any coding agent that can read your repository.",
      ...universal,
    },
  ],
  pillarsTitle: "Seven pillars, 29 checks",
  pillarsIntro:
    "Each check asks one question about the code or the database. A check that does not apply is marked N/A with a reason, instead of being forced to fit.",
  checksLabel: "{count} checks",
  pillars: [
    {
      number: 1,
      name: "Model Inference, Determinism & Output Contracts",
      heading: "Model Inference, Determinism & Output Contracts",
      short: "Output contracts",
      checks: 5,
      plain:
        "Model settings are chosen on purpose, answers are parsed against a strict schema, and the numbers models get wrong are recomputed in code.",
    },
    {
      number: 2,
      name: "Prompt Architecture, Context Window & Security",
      heading: "Prompt Architecture, Context Window & Security",
      short: "Prompts and security",
      checks: 5,
      plain:
        "Prompts are laid out so the provider can cache them, history and input sizes are capped, and untrusted text cannot pass itself off as instructions.",
    },
    {
      number: 3,
      name: "Reliability, Routing, Latency & Cost Economics",
      heading: "Reliability, Routing, Latency & Cost Economics",
      short: "Reliability and cost",
      checks: 5,
      plain:
        "Calls time out, fail over to another model, stream when a person is waiting, and go to a cheaper model when the task is easy.",
    },
    {
      number: 4,
      name: "Database, Persistence & Data Architecture",
      heading: "Database, Persistence & Data Architecture (Core DB Audit)",
      short: "Database",
      checks: 4,
      plain:
        "Connections are pooled, AI state is modelled with keys and indexes, queries are parameterized, and a deleted record cannot stay searchable.",
    },
    {
      number: 5,
      name: "Retrieval & Vector Database Optimization",
      heading: "Retrieval & Vector Database Optimization (RAG Audit)",
      short: "Retrieval (RAG)",
      checks: 4,
      plain:
        "Documents are split along their structure, search combines vectors and keywords, and quotes are checked against the stored text.",
    },
    {
      number: 6,
      name: "Tool Calling, Agents & Workflow Orchestration",
      heading: "Tool Calling, Agents & Workflow Orchestration",
      short: "Agents and tools",
      checks: 3,
      plain:
        "Agent frameworks appear only where the workflow needs them, tools are typed, risky actions wait for a person, and every loop has a limit.",
    },
    {
      number: 7,
      name: "Observability, Evaluation & Testing",
      heading: "Observability, Evaluation & Testing",
      short: "Observability and evals",
      checks: 3,
      plain:
        "Each request is traced with its model, tokens and cost, the AI layer is tested offline, and a fixed set of questions guards every change.",
    },
  ],
  output: {
    title: "What you get back",
    intro: "A read-only report in four parts:",
    items: [
      "System discovery: the stack, AI SDKs and models, the database engine and ORM, and the architecture tier it detected.",
      "A findings table: ID, severity, domain, file and line, the issue, and a concrete fix.",
      "A plan in three phases: A for quick wins in the current scope, B for hardening, C for capabilities to defer.",
      "A database summary: schema changes, missing indexes, query fixes and state-modelling upgrades.",
    ],
    closing: "It ends with a question instead of a pull request: which Phase A items to implement first.",
  },
  references: {
    title: "Reference implementations",
    intro:
      "The checklist comes out of the four AI services on this site. Each case study shows some of its checks passing in working, public code.",
    pillarsLabel: "Pillars",
    cta: "Read the case study",
    items: [
      {
        slug: "invoice-data-extraction",
        pillars: [1, 2, 3, 7],
        look: "Strict schema decoding at temperature 0, totals recomputed to the cent, oversized request bodies refused before they are read, a cascade to a second provider on rate limits, timeouts or schema errors, and a test suite that cannot reach the network.",
      },
      {
        slug: "compliance-document-search",
        pillars: [5, 1],
        look: "Heading-aware chunks with a contextual preamble, vector and keyword search fused in one PostgreSQL statement, a cross-encoder, every quote re-anchored to the stored text, and an explicit insufficient-context answer.",
      },
      {
        slug: "multi-agent-operations",
        pillars: [6, 4],
        look: "A read-only, parameterized SQL tool, a bounded revision loop, and a PostgreSQL checkpoint that holds every run until a person approves, edits or rejects it.",
      },
      {
        slug: "llmops-gateway",
        pillars: [2, 3, 7],
        look: "A guard that neutralizes chat-template tokens and caps tokens, a semantic cache with a contrast guard, a complexity router with failover, Langfuse traces with cost, and an evaluation gate in CI.",
      },
    ],
  },
  links: {
    repo: { label: "Source on GitHub", href: AUDIT_REPO_URL },
    release: { label: "v1.0.0 release notes", href: `${AUDIT_REPO_URL}/releases/tag/v1.0.0` },
    raw: { label: "Raw prompt", href: universal.rawHref },
    readme: { label: "README", href: `${AUDIT_REPO_URL}/blob/main/README.md` },
  },
  cta: {
    title: "Want this audit run on your AI system?",
    body: "I can run it with your team, walk through the findings and fix the Phase A items. I reply within one business day, and I am open to full-time roles, contracts and agency placements.",
    contact: "Get in touch",
    email: "Email me",
  },
  teaser: {
    badge: "Open-source developer tool",
    title: "AI codebase audit for coding agents",
    body: "A free, MIT-licensed prompt that has Claude Code, Cursor or Copilot check a repository's AI code and database against 7 pillars and 29 checks, each finding with its file and line. The prompt tells the agent to change nothing until you choose the fixes.",
    installLabel: "Install all three integrations",
    install: auditInstallCommand("all"),
    cta: "See the toolkit",
  },
  linkLabel: "AI codebase audit (open source)",
  nav: { back: "All projects", next: "Reference implementation" },
};
