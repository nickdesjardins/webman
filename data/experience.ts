/**
 * Experience and education. Framed as 8+ years of production reliability
 * upgraded with modern Applied AI engineering.
 */

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  start: string;
  end?: string;
  kind: "work" | "founder" | "military";
  summary?: string;
  highlights: string[];
  stack?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export const experience: ExperienceItem[] = [
  {
    id: "nextblock",
    role: "Creator & Principal Engineer",
    company: "NextBlock CMS (open source)",
    location: "Greater Montreal Area, QC",
    period: "Oct 2025 to Present",
    start: "2025-10",
    kind: "founder",
    summary:
      "Designed and built an open-source, AI-native CMS for Next.js 16 and Supabase as an Nx monorepo: database schema and row-level security, block editor, commerce, MCP server, CLI, and the release pipeline for eight npm packages.",
    highlights: [
      "Architected the content model: every block is a JSONB row in PostgreSQL, custom block types are data (typed fields and layout schema guarded by CHECK constraints), and pages publish with no rebuild.",
      "Shipped Cortex AI: an MCP server over Streamable HTTP with scoped bearer tokens and 56 tools, confirmation-gated mutations, typed Zod tool calling with SSE streaming, OpenRouter routing with free-model fallback, and AES-256-GCM encrypted bring-your-own-key storage.",
      "Built the zero-environment-variable deployment path: Vercel's Supabase integration provisions the database and forward-only migrations apply during the first build, with a runtime fallback in the setup wizard.",
      "Maintain 8 published npm packages at one version (0.21.3), 146 Vitest test files, and a daily upstream-sync GitHub Action. The CLI has 191 releases and 11.5k downloads in the 30 days to 7 October 2026.",
      "Delivered 100/100 Lighthouse across all four categories on the production build: 0.8 s LCP, 0 ms Total Blocking Time, 0 Cumulative Layout Shift.",
    ],
    stack: ["Next.js 16", "React Server Components", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS v4", "Tiptap", "Nx", "Vitest", "Vercel AI SDK", "MCP", "Stripe", "Docker"],
  },
  {
    id: "new-roots-herbal",
    role: "Lead Web Developer & Applied AI Integration",
    company: "New Roots Herbal Inc.",
    location: "Vaudreuil-Dorion, QC",
    period: "Nov 2018 to Present",
    start: "2018-11",
    kind: "work",
    summary:
      "Own production reliability, data architecture, and infrastructure across the company's digital estate, and lead the integration of generative AI into day-to-day operations.",
    highlights: [
      "Architected and deployed an internal multi-model generative AI asset pipeline (Claude, OpenAI Codex, and Gemini), reducing product catalog asset turnaround from multiple weeks to 40 minutes per SKU: a 10x gain in production throughput.",
      "Engineered high-availability data ingestion architectures, consolidating relational databases and deploying hybrid retrieval (sparse lexical plus dense vector indexing) with strict Pydantic validation, eliminating legacy third-party vendor dependencies and saving $90,000+ in software licensing.",
      "Directed infrastructure modernization across 30+ production digital properties, executing zero-downtime server migrations and lowering cloud infrastructure costs by over 40%.",
      "Designed telemetry, attribution tracking, and rapid automated deployment funnels, capturing over $300,000 in incremental revenue in a single 30-day campaign.",
      "Built custom business microservices including an internal Store Locator and a real-time inventory management system with zero-failure database synchronization.",
    ],
    stack: ["Laravel", "PHP", "MySQL", "PostgreSQL", "Node.js", "Angular", "React", "Linux VPS", "cPanel/WHM", "Claude", "Codex", "Gemini", "Pydantic"],
  },
  {
    id: "pcsquad",
    role: "Technical Founder",
    company: "PcSquad",
    location: "Les Coteaux, QC",
    period: "2012 to 2018",
    start: "2012-01",
    end: "2018-12",
    kind: "founder",
    summary:
      "Founded and operated a regional IT solutions and web infrastructure consultancy.",
    highlights: [
      "Managed full-lifecycle client deliverables: scoping, custom software development, deployment, and ongoing support.",
      "Ran systems administration, network setup, and hardware diagnostics for small and mid-sized businesses.",
      "Owned the financial, legal, and marketing side of the business, including SEO and paid acquisition.",
    ],
    stack: ["PHP", "JavaScript", "WordPress", "Windows Server", "Linux", "Networking", "Hardware Diagnostics"],
  },
  {
    id: "rceme",
    role: "Armed Forces Veteran",
    company: "Royal Canadian Electrical and Mechanical Engineers (RCEME)",
    location: "CFB Valcartier, QC",
    period: "2013 to 2016",
    start: "2013-01",
    end: "2016-12",
    kind: "military",
    summary:
      "Military discipline, electro-mechanical diagnostics, precision systems maintenance, and calm execution under mission-critical conditions.",
    highlights: [
      "Diagnosed and repaired weapons systems, artillery, and electro-mechanical equipment to exacting tolerances.",
      "Trained in soldering, electrical systems, hydraulics, and first aid. Learned to work a checklist when it matters most.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    id: "concordia",
    degree: "Computer Science, General Program",
    institution: "Concordia University, Montreal",
    period: "2016 to 2018",
  },
  {
    id: "john-abbott",
    degree: "DEC in Computer Science",
    institution: "John Abbott College, Sainte-Anne-de-Bellevue",
    period: "2009 to 2012",
  },
];

export interface CareerSummary {
  heading: string;
  body: string;
}

export const careerSummary: CareerSummary = {
  heading: "Eight years of production reliability, upgraded with Applied AI engineering.",
  body:
    "The hard part of enterprise AI is not the model call. It is the data pipeline that feeds it, the schema that constrains it, the fallback that catches it, and the telemetry that proves it worked. That is the work I have been doing since 2018, now pointed at foundation models.",
};
