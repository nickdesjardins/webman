/**
 * Production web work: platforms, campaign microsites, client and personal
 * sites, a PWA, and a couple of experiments kept online for show.
 *
 * Attribution matters. Work shipped as an employee is labelled "employer"
 * and credited to New Roots Herbal Inc.; everything else is "independent".
 * Descriptions are written from what each live site actually shows.
 * Thumbnails live in /public/img/work/<id>.jpg (captured 9 October 2026).
 */

export type WorkKind = "platform" | "campaign" | "pwa" | "client" | "personal" | "experiment" | "business";
export type WorkAttribution = "employer" | "independent";

export interface WorkItem {
  id: string;
  title: string;
  url: string;
  kind: WorkKind;
  attribution: WorkAttribution;
  summary: string;
  stack: string[];
  /** Public path to the thumbnail, 800x506. */
  thumb?: string;
  highlights?: string[];
  lang?: string;
  /** Founding year, for businesses Nicolas owned. */
  since?: string;
}

export interface WorkIntro {
  eyebrow: string;
  heading: string;
  description: string;
}

export interface SubIntro {
  heading: string;
  description: string;
}

export const workIntro: WorkIntro = {
  eyebrow: "Production Web Work",
  heading: "Shipped for the web since 2004.",
  description:
    "Before foundation models there were storefronts, content systems, and campaign pages that had to work on launch day. A selection, grouped by what it was for. Work done as an employee is attributed to the employer; everything else is independent.",
};

export const attribution: Record<WorkAttribution, { label: string; detail: string }> = {
  employer: {
    label: "Employer work",
    detail: "Built as Lead Web Developer at New Roots Herbal Inc. The company owns these properties.",
  },
  independent: {
    label: "Independent",
    detail: "Personal products, client work, and experiments. Mine, start to finish.",
  },
};

export const platform: WorkItem = {
  id: "newrootsherbal",
  title: "newrootsherbal.com: full platform revamp",
  url: "https://newrootsherbal.com/",
  kind: "platform",
  attribution: "employer",
  lang: "EN / FR",
  summary:
    "Complete rebuild of a 40-year-old natural health manufacturer's web presence on Laravel 13: a custom PHP CMS and an e-commerce store, both written from scratch to replace legacy third-party dependencies.",
  highlights: [
    "Custom content management system for products, pages, and campaigns, built for the marketing team that uses it every day.",
    "E-commerce store with catalog, cart, and checkout, plus the back-office tooling behind it.",
    "Store locator built on the Google Maps API and a real-time inventory system with zero-failure database synchronization.",
    "Zero-downtime migration to right-sized infrastructure, lowering hosting costs by over 40%.",
  ],
  stack: ["Laravel 13", "PHP", "MySQL", "Blade", "JavaScript", "Google Maps API", "Linux VPS"],
  thumb: "/img/work/newrootsherbal.jpg",
};

export const campaignsIntro: SubIntro = {
  heading: "Campaign and education microsites",
  description:
    "Eighteen landing pages for New Roots Herbal product lines and health topics: standalone Next.js microsites on their own subdomains, plus pages served by the Laravel platform. Each one is a tracked funnel built to launch fast and convert.",
};

export const campaigns: WorkItem[] = [
  { id: "vitamins", title: "Vitamins", url: "https://vitamins.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "B vitamins and multivitamins education and product funnel.", stack: ["Next.js"], thumb: "/img/work/vitamins.jpg" },
  { id: "aging", title: "Healthy Aging", url: "https://aging.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Healthy aging product line microsite.", stack: ["Next.js"], thumb: "/img/work/aging.jpg" },
  { id: "women", title: "Women's Health", url: "https://women.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Women's health product line microsite.", stack: ["Next.js"], thumb: "/img/work/women.jpg" },
  { id: "digestion", title: "Digestion", url: "https://digestion.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Digestive health education and product funnel.", stack: ["Next.js"], thumb: "/img/work/digestion.jpg" },
  { id: "cardiac-health", title: "Cardiac Health", url: "https://newrootsherbal.com/cardiac-health", kind: "campaign", attribution: "employer", summary: "Cardiac health landing page on the Laravel platform.", stack: ["Laravel"], thumb: "/img/work/cardiac-health.jpg" },
  { id: "coughandcold", title: "Cough and Cold", url: "https://www.coughandcold.ca/", kind: "campaign", attribution: "employer", summary: "Seasonal cough and cold campaign on its own domain.", stack: ["Next.js"], thumb: "/img/work/coughandcold.jpg" },
  { id: "omegas", title: "Omegas", url: "https://omegas.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Omega fatty acids product line microsite.", stack: ["Next.js"], thumb: "/img/work/omegas.jpg" },
  { id: "vitamin-d", title: "Vitamin D", url: "https://newrootsherbal.com/vitamin-d", kind: "campaign", attribution: "employer", summary: "Vitamin D awareness landing page on the Laravel platform.", stack: ["Laravel"], thumb: "/img/work/vitamin-d.jpg" },
  { id: "ukraine", title: "Support Ukraine", url: "https://newrootsherbal.com/ukraine", kind: "campaign", attribution: "employer", summary: "Humanitarian support campaign page.", stack: ["Laravel"], thumb: "/img/work/ukraine.jpg" },
  { id: "stress", title: "Manage Stress", url: "https://stress.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Stress management education and product funnel.", stack: ["Next.js"], thumb: "/img/work/stress.jpg" },
  { id: "prostateperform", title: "Prostate Perform", url: "https://prostateperform.ca/", kind: "campaign", attribution: "employer", summary: "Single-product campaign on its own domain.", stack: ["Next.js"], thumb: "/img/work/prostateperform.jpg" },
  { id: "probiotics", title: "Probiotics", url: "https://probiotics.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Probiotics product line microsite.", stack: ["Next.js"], thumb: "/img/work/probiotics.jpg" },
  { id: "pain-management", title: "Pain Management", url: "https://newrootsherbal.com/pain-management", kind: "campaign", attribution: "employer", summary: "Pain management landing page on the Laravel platform.", stack: ["Laravel"], thumb: "/img/work/pain-management.jpg" },
  { id: "mushrooms", title: "Medicinal Mushrooms", url: "https://mushrooms.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Medicinal mushrooms product line microsite.", stack: ["Next.js"], thumb: "/img/work/mushrooms.jpg" },
  { id: "magnesium", title: "Magnesium", url: "https://magnesium.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Magnesium education and product funnel.", stack: ["Next.js"], thumb: "/img/work/magnesium.jpg" },
  { id: "immune", title: "Immune Health", url: "https://immune.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Immune health product line microsite.", stack: ["Next.js"], thumb: "/img/work/immune.jpg" },
  { id: "oils", title: "Exotic Oils", url: "https://oils.newrootsherbal.com/", kind: "campaign", attribution: "employer", summary: "Exotic oils product line microsite.", stack: ["Next.js"], thumb: "/img/work/oils.jpg" },
  { id: "essential-oils", title: "Essential Oils", url: "https://newrootsherbal.com/essential-oils", kind: "campaign", attribution: "employer", summary: "Essential oils landing page on the Laravel platform.", stack: ["Laravel"], thumb: "/img/work/essential-oils.jpg" },
];

export const employerAppsIntro: SubIntro = {
  heading: "Apps and internal tools",
  description:
    "Product-adjacent software built for New Roots Herbal customers and staff, beyond the website and its campaigns.",
};

export const employerApps: WorkItem[] = [
  {
    id: "smartstack",
    title: "SmartStack",
    url: "https://smartstack.smartstack-worker.workers.dev/",
    kind: "pwa",
    attribution: "employer",
    summary:
      "A mobile-first progressive web app for tracking supplement schedules and daily intake, built for New Roots Herbal and deployed on Cloudflare Workers.",
    stack: ["PWA", "Cloudflare Workers", "TypeScript"],
  },
];

export const independent: WorkItem[] = [
  {
    id: "ryugu",
    title: "Ryūgū: Ten Nights to the Dragon Palace",
    url: "https://japan.webman.dev/",
    kind: "personal",
    attribution: "independent",
    summary:
      "A chaptered travel companion for an eleven-day voyage around Japan and Jeju: the route, dragon lore behind each port, a day-by-day itinerary, etiquette, phrases, and vocabulary. Built as a reading experience first.",
    stack: ["Next.js", "React"],
    thumb: "/img/work/ryugu.jpg",
  },
  {
    id: "thievescant",
    title: "Thieves' Cant Translator",
    url: "https://www.thethievescant.com/",
    kind: "personal",
    attribution: "independent",
    lang: "EN / FR",
    summary:
      "A D&D 5e rogue's companion: translate English or French into Thieves' Cant, with a dictionary, guild symbols, and hobo signs. Prototyped with v0, finished by hand.",
    stack: ["Next.js", "React", "v0"],
    thumb: "/img/work/thievescant.jpg",
  },
  {
    id: "civalgo-punch",
    title: "Civalgo Punch",
    url: "https://civalgo-punch.vercel.app/",
    kind: "experiment",
    attribution: "independent",
    summary:
      "A real-time check-in and check-out system for construction site workers: a worker portal plus a supervisor dashboard that shows who is on site right now. A technical exercise, kept online for show.",
    stack: ["Next.js", "React", "Vercel"],
    thumb: "/img/work/civalgo-punch.jpg",
  },
  {
    id: "react-hooks",
    title: "React Hooks Guide",
    url: "https://react-hooks-delta-umber.vercel.app/",
    kind: "experiment",
    attribution: "independent",
    summary:
      "An interactive reference for every React hook, from useState to useImperativeHandle, with live examples and a theme switcher. A teaching sandbox, kept online for show.",
    stack: ["Next.js", "React", "Vercel"],

    thumb: "/img/work/react-hooks.png",
  },
  {
    id: "musiquesd",
    title: "MusiqueSD",
    url: "https://www.musiquesd.com/",
    kind: "client",
    attribution: "independent",
    lang: "FR / EN",
    summary:
      "Bilingual marketing site for a Montreal recording studio that also does DJ and event animation, equipment rental, and online music lessons, with a quote-request flow and gallery.",
    stack: ["Next.js", "React"],
    thumb: "/img/work/musiquesd.jpg",
  },
  {
    id: "pcsquad",
    title: "PcSquad",
    url: "https://pcsquad.ca/",
    kind: "business",
    attribution: "independent",
    since: "2012",
    lang: "EN / FR",
    summary:
      "My first business: a regional computer repair and website shop I founded and ran as owner and CEO from 2012 to 2018, serving homes and small businesses around Les Coteaux. The site is still up, bilingual, and exactly as it was.",
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    thumb: "/img/work/pcsquad.jpg",
  },
];

export const kindLabel: Record<WorkKind, string> = {
  platform: "Platform",
  campaign: "Campaign",
  pwa: "PWA",
  client: "Client site",
  personal: "Personal",
  experiment: "Experiment",
  business: "Own business",
};
