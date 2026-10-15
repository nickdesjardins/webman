/**
 * "What I can build for your company": the plain-language entry point.
 * Each card starts from a problem in the buyer's own words, then names what
 * engineers call it, then points at proof on this site. Status follows the
 * site-wide rule: "measured" comes from dated records, "target" marks
 * planned work, "record" is an employment outcome attributed to the employer.
 * The French edition lives in data/fr/services.ts and must satisfy the same types.
 */

export type ServiceStatus = "measured" | "target" | "record";
export type ServiceIcon = "file-text" | "book-open" | "workflow" | "gauge" | "server" | "layout";

export interface ServiceItem {
  id: string;
  icon: ServiceIcon;
  /** The problem, as a CEO or office manager would say it. */
  problem: string;
  /** What engineers call the solution. */
  term: string;
  /** The checkable evidence on this site. */
  proof: string;
  status: ServiceStatus;
  /** A path relative to the edition root ("/projects/x") or an in-page anchor ("#projects"). */
  href: string;
}

export interface ServicesIntro {
  eyebrow: string;
  title: string;
  description: string;
  termLabel: string;
  proofLabel: string;
  cta: string;
  status: Record<ServiceStatus, string>;
}

export const servicesIntro: ServicesIntro = {
  eyebrow: "What I can build for your company",
  title: "You don't need to know the technical name.",
  description:
    "Describe the problem in your own words. Each card shows what I build for it, what engineers call it, and the proof you can check on this site.",
  termLabel: "What it's called",
  proofLabel: "Proof",
  cta: "See how it works",
  status: { measured: "Measured", target: "Planned", record: "Track record" },
};

export const services: ServiceItem[] = [
  {
    id: "invoices",
    icon: "file-text",
    problem: "Invoices, purchase orders and forms are still retyped by hand.",
    term: "Document data extraction with a validated schema and model fallback",
    proof: "Invoice reader: 21 of 21 test invoices fully correct on the 7 October 2026 benchmark.",
    status: "measured",
    href: "/projects/invoice-data-extraction",
  },
  {
    id: "manuals",
    icon: "book-open",
    problem: "Staff can't find answers in your procedures and regulatory manuals.",
    term: "Hybrid retrieval (RAG) with verified citations",
    proof:
      "Ask your manuals: 6 of 6 recorded questions answered with verified quotes, and the one question the documents did not cover was declined (14 October 2026).",
    status: "measured",
    href: "/projects/compliance-document-search",
  },
  {
    id: "agents",
    icon: "workflow",
    problem: "A multi-step back-office task needs a person to approve the risky steps.",
    term: "Supervised AI agents with human approval (LangGraph)",
    proof:
      "Supervised operations agents: 6 scenarios recorded on 15 October 2026, every dispatch behind a recorded human decision, and a swapped probiotic dosage caught by a deterministic check.",
    status: "measured",
    href: "/projects/multi-agent-operations",
  },
  {
    id: "quality",
    icon: "gauge",
    problem: "You changed a prompt and nobody knows whether the answers got worse.",
    term: "Evaluation in CI, tracing and semantic caching (LLMOps)",
    proof: "AI quality gate: planned work, so its numbers are targets, not results.",
    status: "target",
    href: "#projects",
  },
  {
    id: "platforms",
    icon: "server",
    problem: "Your websites and online store must not go down when servers change.",
    term: "Infrastructure migration and web platform development",
    proof:
      "30+ websites migrated with zero downtime and hosting costs cut by over 40%, at New Roots Herbal Inc.",
    status: "record",
    href: "#work",
  },
  {
    id: "cms",
    icon: "layout",
    problem: "Your team wants a website it can edit itself, which AI tools can also operate safely.",
    term: "AI-native CMS with an MCP server (NextBlock)",
    proof:
      "NextBlock CMS: 56 MCP tools, 8 npm packages, and 11.5k CLI downloads in the 30 days to 7 October 2026.",
    status: "measured",
    href: "#nextblock",
  },
];
