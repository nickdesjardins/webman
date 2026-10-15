/**
 * The /ai-automation page: what a business buyer searches for ("AI
 * automation consultant", "custom AI agents", "MCP integration") answered in
 * plain words, each service tied to proof elsewhere on the site. The same
 * module feeds the page's FAQPage graph and the ProfessionalService offer
 * catalog in lib/json-ld.ts, so the structured data always matches the
 * visible copy. Status labels follow the site-wide rule (see data/services.ts).
 * The French edition lives in data/fr/automation.ts and must satisfy the same types.
 */
import type { ServiceIcon, ServiceStatus } from "@/data/services";

export interface AutomationService {
  id: string;
  icon: ServiceIcon;
  /** The h3: the name a buyer would search for. */
  title: string;
  /** What changes for the business, in plain words. */
  outcome: string;
  uses: string[];
  proof: string;
  status: ServiceStatus;
  /** "/projects/x" (edition-relative) or "#anchor" (a section of the home page). */
  href: string;
}

export interface AutomationStep {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** One entry of the ProfessionalService offer catalog (JSON-LD only). */
export interface AutomationOffer {
  name: string;
  description: string;
}

export interface AutomationContent {
  /** Public path of the page, without the edition prefix. */
  path: string;
  metaTitle: string;
  description: string;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  lead: string;
  servicesTitle: string;
  servicesIntro: string;
  usesLabel: string;
  proofCta: string;
  services: AutomationService[];
  connectTitle: string;
  connectIntro: string;
  connectSteps: AutomationStep[];
  areaTitle: string;
  areaBody: string;
  faqTitle: string;
  faq: FaqItem[];
  cta: { title: string; body: string; contact: string; email: string };
  /** Footer and services-section link label. */
  linkLabel: string;
  catalogName: string;
  offers: AutomationOffer[];
}

export const automation: AutomationContent = {
  path: "/ai-automation",
  metaTitle: "AI Automation Consultant in Montreal & Canada | Webman",
  description:
    "Custom AI agents, document processing and MCP integrations for Canadian businesses, by Nicolas Desjardins (Webman) in Montreal. On site or remote worldwide.",
  breadcrumb: "AI automation",
  eyebrow: "AI automation · Greater Montreal, Quebec and Canada",
  title: "AI automation for Canadian businesses",
  lead:
    "I'm Nicolas Desjardins, and Webman (webman.dev) is how I take on AI automation and full-stack work. I build AI agents, document processing and private knowledge-base search that connect to the tools your team already uses, so people stop retyping data, stop digging through manuals, and keep the final say on anything risky.",
  servicesTitle: "What AI automation services does Webman provide in Canada?",
  servicesIntro:
    "Five kinds of work, each with proof you can check. Measured results come from dated public records; the track record comes from my work at New Roots Herbal Inc.",
  usesLabel: "Typical uses",
  proofCta: "See the proof",
  services: [
    {
      id: "documents",
      icon: "file-text",
      title: "Document processing and data entry automation",
      outcome:
        "Invoices, purchase orders, forms and incoming emails become clean records in your accounting system, ERP or database, so nobody retypes them. Every total is re-added to the cent, and nothing comes out until it passes a validated schema.",
      uses: [
        "Supplier invoices and purchase orders",
        "Intake forms and applications",
        "Lead and support email triage",
        "Receipts and expense reports",
      ],
      proof: "Invoice reader: 21 of 21 test invoices fully correct on the 7 October 2026 benchmark.",
      status: "measured",
      href: "/projects/invoice-data-extraction",
    },
    {
      id: "knowledge",
      icon: "book-open",
      title: "Private knowledge base AI and internal copilots (RAG)",
      outcome:
        "Staff ask questions in plain language and get answers from your own procedures, manuals and regulatory documents, with the exact passage and page quoted. When the documents do not cover a question, the assistant says so instead of guessing.",
      uses: [
        "SOPs and quality manuals",
        "Regulatory and compliance documents",
        "Product dossiers and technical specifications",
        "HR policies and onboarding guides",
      ],
      proof:
        "Ask your manuals: 6 of 6 recorded questions answered with verified quotes, and the one question the documents did not cover was declined (14 October 2026).",
      status: "measured",
      href: "/projects/compliance-document-search",
    },
    {
      id: "agents",
      icon: "workflow",
      title: "Custom AI agents with human approval",
      outcome:
        "Multi-step back-office work, such as pulling data, drafting content and checking it against your rules, runs on its own up to the risky step. Then it waits for a person, and every decision is on record.",
      uses: [
        "Product listings for each sales channel",
        "Compliance checks before anything is published",
        "Order and inventory follow-ups",
        "Drafted replies for a person to approve",
      ],
      proof:
        "Supervised operations agents: 6 scenarios recorded on 15 October 2026, every dispatch behind a recorded human decision, and a swapped probiotic dosage caught by a deterministic check.",
      status: "measured",
      href: "/projects/multi-agent-operations",
    },
    {
      id: "mcp",
      icon: "plug",
      title: "MCP servers and LLM integration",
      outcome:
        "Your systems become tools that AI assistants such as Claude, ChatGPT or Cursor can use safely through the Model Context Protocol (MCP): scoped access tokens, typed actions, and a confirmation before anything changes.",
      uses: [
        "Safe AI access to your CMS, CRM or database",
        "Connecting models to internal APIs",
        "Routing between AI providers with automatic fallback",
        "API keys encrypted at rest",
      ],
      proof:
        "NextBlock CMS (Cortex AI): an MCP server with 56 tools, listed in the official MCP Registry as dev.nextblock/nextblock.",
      status: "measured",
      href: "#nextblock",
    },
    {
      id: "platforms",
      icon: "server",
      title: "Full-stack Next.js, Supabase and e-commerce development",
      outcome:
        "Websites, online stores and internal apps built to stay up: server migrations, headless CMS, custom API integrations, and the full-stack work an AI project needs around it.",
      uses: [
        "Next.js, React and TypeScript applications",
        "Supabase and PostgreSQL back ends",
        "E-commerce platforms and migrations",
        "Laravel and PHP platforms",
      ],
      proof:
        "30+ websites migrated with zero downtime and hosting costs cut by over 40%, at New Roots Herbal Inc.",
      status: "record",
      href: "#work",
    },
  ],
  connectTitle: "How do custom AI agents and MCP integrations connect to your existing tools?",
  connectIntro:
    "Through the doors your software already has. Most business tools expose an API, a database, an email inbox or a file export, and that is all an agent needs.",
  connectSteps: [
    {
      title: "Pick one workflow",
      body: "Start with the task that eats the most hours each week, and write down its inputs, its rules, and the steps a person must approve.",
    },
    {
      title: "Turn each action into a typed tool",
      body: "Every action the AI may take, such as looking up an order or drafting an update, becomes a tool with a strict schema. Read-only tools run freely; tools that change data ask for confirmation first.",
    },
    {
      title: "Give it only the access it needs",
      body: "The assistant connects through an MCP server or a direct API integration with a scoped token, so it reaches the records it needs and nothing else. Keys are encrypted at rest.",
    },
    {
      title: "Keep a person on the risky steps",
      body: "The workflow pauses before anything is sent, published or changed, and records who approved it. Every run can be traced afterwards.",
    },
    {
      title: "Measure it on your own cases",
      body: "Before rollout, the system runs against a set of your real documents or requests and you see the results, the same way every project on this site is measured.",
    },
  ],
  areaTitle: "AI automation in Montreal and Quebec, across Canada, and remote worldwide",
  areaBody:
    "I'm based in the Greater Montreal Area and work in English and French. Companies in Montreal, Salaberry-de-Valleyfield and elsewhere in Quebec can meet in person; teams across Canada, the US and the rest of the world work with me fully remotely. Full-time roles, contracts and agency placements are all welcome.",
  faqTitle: "Questions about AI automation",
  faq: [
    {
      question: "What is Webman?",
      answer:
        "Webman (webman.dev) is the name Nicolas Desjardins works under on the web. He is an applied AI developer and senior full-stack developer in the Greater Montreal Area, and the creator of NextBlock CMS and its Cortex AI MCP server. He first used the name for Webman Solutions, his web studio from 2016 to 2018.",
    },
    {
      question: "Can AI connect to the software we already use?",
      answer:
        "Usually, yes. If a system has an API, a database, an email inbox or a file export, an agent can read from it and, with your approval, write to it. When a tool has no API, a scheduled export or a shared folder is often enough to start.",
    },
    {
      question: "How do you keep the AI from making things up?",
      answer:
        "By design: answers quote the passage and page they come from, questions the documents do not cover are declined, extracted data must pass a validated schema before it is saved, and risky actions wait for a person. The projects on this site publish their measured results with dates.",
    },
    {
      question: "Where does our data go?",
      answer:
        "That is decided with you before anything is built: a commercial model API, a provider hosted in a region you choose, or an open model running on your own server. The search index can live in your own PostgreSQL database.",
    },
    {
      question: "Do you work outside Montreal, or outside Canada?",
      answer:
        "Yes. I work on site or hybrid in Montreal and the surrounding region, including Salaberry-de-Valleyfield, and fully remote anywhere in Canada, the US or elsewhere in the world, in English or French.",
    },
    {
      question: "Can you join our team instead of working on contract?",
      answer: "Yes. I'm open to full-time roles, contracts, and placements through an agency.",
    },
    {
      question: "How fast do you reply?",
      answer:
        "Within one business day. Describe the problem in your own words; you do not need to know the technical name.",
    },
  ],
  cta: {
    title: "Is a process eating hours every week?",
    body: "Describe it in your own words and I will tell you what it would take. I reply within one business day.",
    contact: "Get in touch",
    email: "Email me",
  },
  linkLabel: "AI automation services",
  catalogName: "AI automation and full-stack development services",
  offers: [
    {
      name: "Custom AI workflow and agent automation",
      description:
        "AI agents, document processing and private knowledge-base search that take manual data entry and multi-step back-office work off a team, with a person approving the risky steps.",
    },
    {
      name: "MCP server and LLM integration",
      description:
        "Model Context Protocol servers and LLM integrations that give AI assistants scoped, confirmation-gated access to a company's systems, with provider fallback and encrypted keys.",
    },
    {
      name: "Full-stack Next.js and e-commerce development",
      description:
        "Next.js, TypeScript and Supabase applications, e-commerce platforms, headless CMS, custom API integrations, and zero-downtime migrations.",
    },
  ],
};
