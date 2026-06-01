export type PortfolioFilter = "filter-app" | "filter-card" | "filter-web";

export interface PortfolioItem {
  title: string;
  img: string;
  url: string;
  /** Some links open in a new tab in the original markup. */
  external: boolean;
  filter: PortfolioFilter;
  /** The caption shown in the lightbox. */
  caption: string;
  /** Optional separate image to open in the lightbox (defaults to img). */
  lightboxImg?: string;
  /** Optional shortened text for the link (defaults to url). */
  displayUrl?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    title: "PcSquad",
    img: "/assets/img/portfolio/pcsquad.jpg",
    url: "https://pcsquad.ca/",
    external: true,
    filter: "filter-web",
    caption: "Personal PME for IT services: PcSquad",
  },
  {
    title: "Webman Solutions",
    img: "/assets/img/portfolio/webman-solutions.jpg",
    url: "https://webman.solutions/",
    external: true,
    filter: "filter-web",
    caption: "Personal PME for website building: Webman Solutions",
  },
  {
    title: "New Roots Herbal inc.",
    img: "/assets/img/portfolio/nrh.jpg",
    url: "https://newrootsherbal.com/",
    external: true,
    filter: "filter-web",
    caption: "Maintained, modified and fully optimised this laravel website.",
  },
  {
    title: "Boost your immunity",
    img: "/assets/img/portfolio/immunity.jpg",
    url: "https://newrootsherbal.com/immune-health",
    external: true,
    filter: "filter-card",
    caption: "Quick little landing page with Amazon Affiliates / Associates links",
  },
  {
    title: "Vitazan",
    img: "/assets/img/portfolio/Vitazan.jpg",
    url: "https://vitazan.com/",
    external: true,
    filter: "filter-web",
    caption: "Revamped complete front end of Vitazan",
  },
  {
    title: "Naturopathic Currents",
    img: "/assets/img/portfolio/npc.jpg",
    url: "https://naturopathiccurrents.com/",
    external: true,
    filter: "filter-web",
    caption: "Naturopathic Currents complete makeover",
  },
  {
    title: "Store Locator",
    img: "/assets/img/portfolio/map.jpg",
    url: "https://newrootsherbal.com/store-locator",
    external: false,
    filter: "filter-app",
    caption: "Built a store locator from stratch using Google Maps API",
  },
  {
    title: "Inventory System",
    img: "/assets/img/portfolio/inventory.jpg",
    url: "https://jollyriverinventory.web.app/",
    external: true,
    filter: "filter-app",
    caption: "Full inventory system built from bottoms up with Angular on Firebase",
  },
  {
    title: "Paintball & Airsoft Companion",
    img: "/assets/img/portfolio/pac.jpg",
    lightboxImg: "/assets/img/portfolio/pacUp.jpg",
    url: "https://play.google.com/store/apps/details?id=ca.pcsquad.paintballairsoftcompanion&hl=en_US&gl=US",
    displayUrl: "https://play.google.com/...",
    external: false,
    filter: "filter-app",
    caption:
      "Paintball & Airsoft Companion: Android application in JAVA, created from scratch.",
  },
  {
    title: "NRH Content Management System",
    img: "/assets/img/portfolio/cms.jpg",
    url: "https://admin.newrootsherbal.com/",
    external: true,
    filter: "filter-app",
    caption: "Fully created content management system for NRH website.",
  },
  {
    title: "Construction Mathieu Clement",
    img: "/assets/img/portfolio/constructionmathieuclement.jpg",
    url: "https://constructionmathieuclement.com/",
    external: true,
    filter: "filter-web",
    caption: "MC Construction: Website built by Webman Solutions.",
  },
  {
    title: "NRH Probiotics",
    img: "/assets/img/portfolio/prob.jpg",
    url: "https://probiotics.newrootsherbal.com/",
    external: true,
    filter: "filter-card",
    caption: "Probiotics landing page created with Angular",
  },
  {
    title: "Animations Zakiry",
    img: "/assets/img/portfolio/Zakiry.jpg",
    url: "http://zakiry.com/",
    external: true,
    filter: "filter-web",
    caption: "Animations Zakiry. My aunt is the owner I've worked for her for years.",
  },
  {
    title: "NRH Prostate Perform",
    img: "/assets/img/portfolio/prostate.jpg",
    url: "https://prostateperform.ca/",
    external: true,
    filter: "filter-card",
    caption: "Prostate Perform landing page ported to Angular",
  },
];
