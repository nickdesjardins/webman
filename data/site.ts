/**
 * Single source of truth for identity, links, and availability.
 * Every section and the JSON-LD schema read from here.
 * The French edition lives in data/fr/site.ts and must satisfy SiteContent.
 */

export interface NavItem {
  id: string;
  label: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface SiteContent {
  name: string;
  shortName: string;
  handle: string;
  domain: string;
  url: string;
  title: string;
  tagline: string;
  description: string;
  keywords: string[];
  email: string;
  location: { label: string; city: string; region: string; country: string; note: string };
  availability: { status: "available" | "limited"; label: string; short: string };
  links: { github: string; linkedin: string; resume: string; resumeFileName: string };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    heading: string;
    /** The phrase inside heading that carries the text gradient. */
    headingAccent: string;
    subheading: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    proof: { value: string; label: string }[];
  };
  contact: { heading: string; body: string; responseTime: string };
  founded: number;
  businessOpened: Date;
}

export const site: SiteContent = {
  name: "Nicolas Desjardins",
  shortName: "Nick Desjardins",
  handle: "nickdesjardins",
  domain: "webman.dev",
  url: "https://webman.dev",
  title: "Lead Systems Engineer Turned Applied AI Architect",
  tagline:
    "Bridging frontier foundation models with deterministic enterprise infrastructure. Building production RAG engines, self-correcting agent state machines, and schema-enforced extraction services.",
  description:
    "Nicolas Desjardins is an Applied AI Engineer and Lead Systems Engineer in Montreal with 8+ years of production full-stack and infrastructure experience. He builds schema-enforced extraction services, hybrid retrieval engines, LangGraph agent pipelines, and LLMOps evaluation gateways.",
  keywords: [
    "Applied AI Engineer",
    "Forward Deployed Engineer",
    "AI Solutions Engineer",
    "RAG",
    "Retrieval-Augmented Generation",
    "pgvector",
    "LangGraph",
    "FastAPI",
    "Pydantic",
    "LLMOps",
    "Next.js",
    "Montreal",
    "Remote Canada",
    "Remote US",
  ],
  email: "nick.desjardins@live.com",
  location: {
    label: "Greater Montreal Area, QC, Canada",
    city: "Montreal",
    region: "QC",
    country: "CA",
    note: "Open to local, hybrid, and remote US/Canada engagements.",
  },
  availability: {
    status: "available",
    label:
      "Available for Senior Applied AI & Forward Deployed roles (Montreal / Remote US & CA)",
    short: "Available for Senior Applied AI roles",
  },
  links: {
    github: "https://github.com/nickdesjardins",
    linkedin: "https://www.linkedin.com/in/nicolas-desjardins/",
    resume: "/Nicolas-Desjardins-Resume.pdf",
    resumeFileName: "Nicolas-Desjardins-Resume.pdf",
  },
  nav: [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects" },
    { id: "nextblock", label: "NextBlock" },
    { id: "work", label: "Work" },
    { id: "arsenal", label: "Arsenal" },
    { id: "experience", label: "Experience" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    eyebrow: "Applied AI Engineering for production, not demos",
    heading: "Lead Systems Engineer Turned Applied AI Architect.",
    headingAccent: "Applied AI Architect",
    subheading:
      "Bridging frontier foundation models with deterministic enterprise infrastructure. Building production RAG engines, self-correcting agent state machines, and schema-enforced extraction services.",
    primaryCta: { label: "Explore Enterprise AI Projects", href: "#projects" },
    secondaryCta: { label: "Inspect Technical Stack", href: "#arsenal" },
    proof: [
      { value: "8+", label: "years owning production systems" },
      { value: "30+", label: "digital properties migrated with zero downtime" },
      { value: "200k+", label: "lines of TypeScript shipped as an open-source CMS" },
    ],
  },
  contact: {
    heading: "Let's build reliable AI systems that actually work in production.",
    body:
      "If you are shipping foundation models into a real business and you need someone who treats schema validation, latency budgets, and failure modes as first-class requirements, we should talk.",
    responseTime: "Replies within one business day.",
  },
  founded: 2004,
  businessOpened: new Date(2012, 0, 1),
};
