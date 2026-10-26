/**
 * Single source of truth for identity, links, and availability.
 * Every section and the JSON-LD schema read from here.
 * The French edition lives in data/fr/site.ts and must satisfy SiteContent.
 *
 * Wording rule: Nicolas is not a member of the Ordre des ingénieurs du
 * Québec, and the reserved title covers "engineer" in English as well as
 * "ingénieur". Self-descriptions therefore say "developer". Employers' job
 * titles that contain "Engineer" may be named as roles he is open to.
 */

export interface NavItem {
  id: string;
  label: string;
  /** Tracked by the scrollspy (and the clean-URL hash sync) but not shown as a link. */
  hidden?: boolean;
}

export interface Cta {
  label: string;
  href: string;
}

export interface SiteContent {
  name: string;
  shortName: string;
  /**
   * The working name behind webman.dev: the WebSite and ProfessionalService
   * name in JSON-LD and the Open Graph site name. The person stays site.name.
   */
  brand: string;
  /** Other spellings of the brand that search engines should tie to it. */
  brandAliases: string[];
  handle: string;
  domain: string;
  url: string;
  /** Role line used in the footer, the share image and the resume header. */
  title: string;
  /** The home page's <title>: name first, then a searchable role and the city. */
  metaTitle: string;
  /** The plain promise; also the share image's tagline. */
  tagline: string;
  /** Meta description, about 160 characters. */
  description: string;
  /** Longer entity statement for JSON-LD and llms.txt: who, where, what, open to what. */
  summary: string;
  email: string;
  location: { label: string; city: string; region: string; country: string; note: string };
  availability: { status: "available" | "limited"; label: string; short: string; roles: string };
  links: { github: string; linkedin: string; resume: string; resumeFileName: string };
  nav: NavItem[];
  hero: {
    /** Small line above the name. */
    role: string;
    place: string;
    /** One plain sentence: what he builds, in a buyer's words. */
    promise: string;
    /** The phrase inside promise that carries the text gradient. */
    promiseAccent: string;
    /** One line of credibility under the promise. */
    support: string;
    primaryCta: Cta;
    resumeCta: string;
    /** Rendered as "8+ years running production systems". */
    proof: { value: string; label: string }[];
    /** Plain caption over the live simulation. */
    demoLabel: string;
    demoCaption: string;
    portraitAlt: string;
  };
  /**
   * Slim band under the hero for the readers who skip technical terms: a
   * business owner and a recruiter. Rendered by components/plain-words-strip.tsx
   * as a sibling of the hero, so nothing here touches the first fold.
   */
  doors: {
    /** Accessible name of the strip's <nav>, which wraps only the two links. */
    ariaLabel: string;
    /** Mono eyebrow over the sentence. Addresses every reader; names no audience. */
    eyebrow: string;
    /** One sentence: what the plain-words page covers, in a buyer's words. */
    lead: string;
    /** Question-first link to automation.path ("/ai-automation"); the component adds the edition prefix. */
    business: string;
    /** Question-first link to "#experience", where the resume card also lives. */
    hiring: string;
  };
  contact: { heading: string; body: string; technical: string; responseTime: string };
  founded: number;
  businessOpened: Date;
}

export const site: SiteContent = {
  name: "Nicolas Desjardins",
  shortName: "Nick Desjardins",
  brand: "Webman",
  brandAliases: ["Webman Dev", "webman.dev"],
  handle: "nickdesjardins",
  domain: "webman.dev",
  url: "https://webman.dev",
  title: "Applied AI Developer & Senior Full-Stack Developer",
  metaTitle: "Nicolas Desjardins (Webman) | AI Automation Developer, Montreal",
  tagline:
    "I build AI that reads your documents, answers from your own files, and shows you the source.",
  description:
    "Webman is Nicolas (Nick) Desjardins, AI automation developer in Montreal: custom AI agents, document processing and MCP integrations. Full-time or contract.",
  summary:
    "Nicolas (Nick) Desjardins, who works as Webman (webman.dev), is an applied AI developer and senior full-stack developer in the Greater Montreal Area, Quebec, working in English and French. He builds AI automation for businesses in Quebec and across Canada: document processing, custom AI agents with human approval, private knowledge-base search with cited answers, and MCP integrations. His AI reads documents, answers from a company's own files with the source quoted, and keeps working when a provider fails, backed by 8+ years running production web systems for New Roots Herbal Inc. He is open to full-time roles, contracts and agency placements, hybrid in Montreal, or fully remote across Canada, the US and the rest of the world.",
  email: "nick.desjardins@live.com",
  location: {
    label: "Greater Montreal Area, QC, Canada",
    city: "Montreal",
    region: "QC",
    country: "CA",
    note: "Full-time, contract or agency placement. Local, hybrid, or fully remote anywhere in the world.",
  },
  availability: {
    status: "available",
    label: "Open to full-time, contract and agency work · Montreal, hybrid or remote worldwide",
    short: "Open to full-time, contract & agency work",
    roles:
      "Roles I'm open to: Applied AI Engineer, Forward Deployed Engineer, AI Solutions, and Senior Full-Stack Developer with an AI focus.",
  },
  links: {
    github: "https://github.com/nickdesjardins",
    linkedin: "https://www.linkedin.com/in/nicolas-desjardins/",
    resume: "/Nicolas-Desjardins-Resume.pdf",
    resumeFileName: "Nicolas-Desjardins-Resume.pdf",
  },
  nav: [
    { id: "overview", label: "Home", hidden: true },
    { id: "services", label: "Services" },
    { id: "projects", label: "AI projects" },
    { id: "nextblock", label: "NextBlock" },
    { id: "work", label: "Web work" },
    { id: "arsenal", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    role: "Applied AI Developer",
    place: "Greater Montreal · English & French",
    promise:
      "I build AI that reads your documents, answers from your own files, and shows you the source.",
    promiseAccent: "shows you the source",
    support:
      "8+ years running production web systems for New Roots Herbal Inc. Four AI services shipped, with public code you can read.",
    primaryCta: { label: "See what I build", href: "#services" },
    resumeCta: "Resume (PDF)",
    proof: [
      { value: "8+", label: "years running production systems" },
      { value: "21/21", label: "test invoices read fully correct (7 Oct 2026)" },
      { value: "30+", label: "websites migrated with zero downtime" },
    ],
    demoLabel: "Watch it work",
    demoCaption: "A messy invoice goes in. Clean, checked data comes out.",
    portraitAlt: "Nicolas Desjardins",
  },
  /* The two questions echo contact.heading, so the page opens and closes on the same two readers. */
  doors: {
    ariaLabel: "Shortcuts for recruiters and business owners",
    eyebrow: "In plain words",
    lead:
      "One page explains what I can build for your company, how it connects to the tools your team already uses, and where your data goes.",
    business: "Work piling up? See what I can do for your company",
    hiring: "Hiring? See my experience",
  },
  contact: {
    heading: "Hiring, or is work piling up? Let's talk.",
    body:
      "A full-time role, a contract, or a placement through your agency: all welcome. If invoices, documents or customer emails are piling up, describe the problem in your own words and I will tell you what it would take.",
    technical:
      "For technical teams: I treat schema validation, latency budgets, and failure modes as requirements, not afterthoughts.",
    responseTime: "Replies within one business day.",
  },
  founded: 2004,
  businessOpened: new Date(2012, 0, 1),
};
