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
  contact: { heading: string; body: string; technical: string; responseTime: string };
  founded: number;
  businessOpened: Date;
}

export const site: SiteContent = {
  name: "Nicolas Desjardins",
  shortName: "Nick Desjardins",
  handle: "nickdesjardins",
  domain: "webman.dev",
  url: "https://webman.dev",
  title: "Applied AI Developer & Senior Full-Stack Developer",
  metaTitle: "Nicolas Desjardins | Applied AI Developer, Montreal",
  tagline:
    "I build AI that reads your documents, answers from your own files, and shows you the source.",
  description:
    "Nicolas (Nick) Desjardins, applied AI developer in Montreal. AI that reads your documents and answers with sources. Open to full-time, contract or agency work.",
  summary:
    "Nicolas (Nick) Desjardins is an applied AI developer and senior full-stack developer in the Greater Montreal Area, Quebec, working in English and French. He builds AI that reads documents, answers from a company's own files with the source quoted, and keeps working when a provider fails, backed by 8+ years running production web systems for New Roots Herbal Inc. He is open to full-time roles, contracts and agency placements, hybrid in Montreal or remote across Canada and the US.",
  email: "nick.desjardins@live.com",
  location: {
    label: "Greater Montreal Area, QC, Canada",
    city: "Montreal",
    region: "QC",
    country: "CA",
    note: "Full-time, contract or agency placement. Local, hybrid, or remote across Canada and the US.",
  },
  availability: {
    status: "available",
    label: "Open to full-time, contract and agency work · Montreal, hybrid or remote (Canada & US)",
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
      "8+ years running production web systems for New Roots Herbal Inc. Two AI services live, with public code you can read.",
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
