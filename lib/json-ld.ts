/**
 * JSON-LD structured data for https://webman.dev, one edition per locale.
 *
 * One @graph with stable @id anchors so every node can reference the
 * Person without repeating it: Person, the Webman ProfessionalService he
 * founded (areas served and offer catalog), WebSite, ProfilePage, and for
 * each live project a SoftwareApplication plus its SoftwareSourceCode.
 * The anchors are derived from the canonical (default locale) origin, so the
 * English and French editions describe the same entities; only the prose,
 * the page url and inLanguage change per locale.
 * Every fact is read through getContent(locale).
 */
import type { Project } from "@/data/projects";
import { getContent } from "@/lib/content";
import { defaultLocale, hreflang, localePath, type Locale } from "@/lib/i18n";
import { CONTENT_UPDATED } from "@/lib/seo";

type JsonLdNode = Record<string, unknown>;

export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
}

/**
 * Matches the visible role line. Not "Engineer" / "Ingénieur": both are
 * reserved titles in Quebec and Nicolas is not a member of the OIQ.
 */
const JOB_TITLE: Record<Locale, string> = {
  en: "Applied AI Developer",
  fr: "Développeur en IA appliquée",
};

/** A JPEG crop of the real portrait (structured data prefers JPEG/PNG over AVIF). */
const PORTRAIT_PATH = "/img/nicolas-desjardins-headshot.jpg";

/** Canonical origin shared by both editions; keeps the @id anchors identical across locales. */
const ORIGIN = getContent(defaultLocale).site.url;
const PERSON_ID = `${ORIGIN}/#person`;
const BUSINESS_ID = `${ORIGIN}/#business`;
const WEBSITE_ID = `${ORIGIN}/#website`;
const PROFILE_ID = `${ORIGIN}/#profile`;

/**
 * Accounts that belong to the Webman brand rather than to the person. The
 * Person's sameAs keeps only profiles of Nicolas himself: a product site in
 * sameAs would tell search engines the person and the product are one entity.
 */
const BUSINESS_SAME_AS = ["https://github.com/Webman-Dev"];

/** Places served, in the edition's spelling: Canada first for local search, then remote work anywhere. They match the visible copy on /ai-automation. */
const AREA_SERVED: Record<Locale, JsonLdNode[]> = {
  en: [
    { "@type": "Country", name: "Canada" },
    { "@type": "AdministrativeArea", name: "Quebec" },
    { "@type": "City", name: "Montreal" },
    { "@type": "City", name: "Salaberry-de-Valleyfield" },
    { "@type": "Place", name: "Worldwide (remote)" },
  ],
  fr: [
    { "@type": "Country", name: "Canada" },
    { "@type": "AdministrativeArea", name: "Québec" },
    { "@type": "City", name: "Montréal" },
    { "@type": "City", name: "Salaberry-de-Valleyfield" },
    { "@type": "Place", name: "Monde entier (à distance)" },
  ],
};

/** What the business is known for: the buyer-side names of the work. */
const BUSINESS_KNOWS_ABOUT = [
  "AI Workflow Automation",
  "Business Process Automation",
  "Custom AI Agents",
  "Model Context Protocol (MCP)",
  "LLM Integration",
  "RAG Pipelines",
  "Document Processing",
  "Next.js",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "E-Commerce Architecture",
];

/** Topics drawn from the arsenal and the project themes (technical nouns, not translated). */
const KNOWS_ABOUT = [
  "AI Automation",
  "Custom AI Agents",
  "LLM Integration",
  "Retrieval-Augmented Generation",
  "pgvector",
  "LangGraph",
  "FastAPI",
  "Pydantic",
  "LLMOps",
  "PostgreSQL",
  "Next.js",
  "TypeScript",
  "Docker",
  "Prompt Engineering",
  "Structured Outputs",
  "Model Context Protocol",
  "Supabase",
  "Row-Level Security",
  "Content Management Systems",
];

const AGPL_URL = "https://www.gnu.org/licenses/agpl-3.0.html";

/**
 * Webman, the working name behind webman.dev: founded and run by the Person,
 * serving Montreal, Quebec and Canada, with one Offer per service line. Emitted
 * on the home page and on /ai-automation, where the offers are described.
 */
function businessNode(locale: Locale): JsonLdNode {
  const { site, automation } = getContent(locale);
  const areaServed = AREA_SERVED[locale];
  return {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: site.brand,
    alternateName: site.brandAliases,
    description: automation.description,
    url: `${ORIGIN}${localePath(locale, automation.path)}`,
    logo: `${ORIGIN}/icon-512.png`,
    image: `${ORIGIN}${PORTRAIT_PATH}`,
    email: site.email,
    founder: { "@id": PERSON_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    areaServed,
    knowsAbout: BUSINESS_KNOWS_ABOUT,
    knowsLanguage: ["en", "fr"],
    sameAs: BUSINESS_SAME_AS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: automation.catalogName,
      itemListElement: automation.offers.map((offer) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: offer.name,
          serviceType: offer.name,
          description: offer.description,
          provider: { "@id": BUSINESS_ID },
          areaServed,
        },
      })),
    },
  };
}

export function buildJsonLd(locale: Locale): JsonLdGraph {
  const {
    site,
    projects,
    nextblock,
    experience: { experience, education },
  } = getContent(locale);

  const jobTitle = JOB_TITLE[locale];
  const inLanguage = hreflang[locale];
  /** The edition's canonical page: "https://webman.dev/" or "https://webman.dev/fr". */
  const pageUrl = `${site.url}${localePath(locale)}`;

  const employer = experience.find((item) => item.kind === "work" && !item.end);

  const person: JsonLdNode = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    alternateName: [site.shortName, site.brand],
    url: site.url,
    jobTitle,
    description: site.summary,
    image: `${ORIGIN}${PORTRAIT_PATH}`,
    email: `mailto:${site.email}`,
    knowsLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "French", alternateName: "fr" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    sameAs: [site.links.github, site.links.linkedin],
    knowsAbout: KNOWS_ABOUT,
    alumniOf: education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
    worksFor: employer ? { "@type": "Organization", name: employer.company } : undefined,
    brand: { "@id": BUSINESS_ID },
    hasOccupation: {
      "@type": "Occupation",
      name: jobTitle,
      occupationLocation: { "@type": "City", name: site.location.city },
    },
  };

  const website: JsonLdNode = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: pageUrl,
    name: site.brand,
    alternateName: [...site.brandAliases, site.name],
    description: site.description,
    publisher: { "@id": PERSON_ID },
    about: { "@id": BUSINESS_ID },
    inLanguage,
  };

  const profilePage: JsonLdNode = {
    "@type": "ProfilePage",
    "@id": PROFILE_ID,
    url: pageUrl,
    inLanguage,
    dateModified: CONTENT_UPDATED,
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };

  const graph: JsonLdNode[] = [person, businessNode(locale), website, profilePage];

  for (const project of projects.filter((p) => p.status === "live")) {
    const docsLink = project.links?.find((link) => link.kind === "docs")?.href;
    const githubLink = project.links?.find((link) => link.kind === "github")?.href;
    const appId = githubLink ? `${githubLink}#app` : `${ORIGIN}/#${project.id}`;

    graph.push({
      "@type": "SoftwareApplication",
      "@id": appId,
      name: project.title,
      description: project.summary,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux, Docker",
      url: docsLink ?? githubLink,
      author: { "@id": PERSON_ID },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      softwareHelp: docsLink,
      programmingLanguage: "Python",
    });

    if (githubLink) {
      graph.push({
        "@type": "SoftwareSourceCode",
        "@id": `${githubLink}#code`,
        name: project.title,
        description: project.summary,
        codeRepository: githubLink,
        programmingLanguage: "Python",
        runtimePlatform: "Python 3.12",
        targetProduct: { "@id": appId },
        author: { "@id": PERSON_ID },
      });
    }
  }

  const nextblockAppId = `${nextblock.links.repo.href}#app`;
  graph.push({
    "@type": "SoftwareApplication",
    "@id": nextblockAppId,
    name: nextblock.name,
    description: nextblock.tagline,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Content Management System",
    operatingSystem: "Web, Linux, Docker",
    url: nextblock.links.site.href,
    softwareVersion: nextblock.version,
    license: AGPL_URL,
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    softwareHelp: nextblock.links.docs.href,
    installUrl: nextblock.links.npm.href,
    programmingLanguage: "TypeScript",
  });
  graph.push({
    "@type": "SoftwareSourceCode",
    "@id": `${nextblock.links.repo.href}#code`,
    name: nextblock.name,
    description: nextblock.tagline,
    codeRepository: nextblock.links.repo.href,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Next.js 16, Node.js 22",
    license: AGPL_URL,
    targetProduct: { "@id": nextblockAppId },
    author: { "@id": PERSON_ID },
  });

  /* Cortex AI is NextBlock's AI module and MCP server; its own node ties the name to its creator. */
  const cortex = nextblock.pillars.find((pillar) => pillar.id === "ai");
  if (cortex) {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${nextblock.links.repo.href}#cortex`,
      name: "Cortex AI",
      alternateName: "NextBlock Cortex AI",
      description: cortex.description,
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "Model Context Protocol server",
      operatingSystem: "Web",
      url: nextblock.links.mcp.href,
      isPartOf: { "@id": nextblockAppId },
      creator: { "@id": PERSON_ID },
      author: { "@id": PERSON_ID },
      license: AGPL_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Graph for one project page: the page itself (a TechArticle by the Person),
 * its breadcrumb, and a pointer to the source code. The Person, WebSite and
 * ProfilePage nodes live on the home page and are referenced by @id.
 */
export function buildProjectJsonLd(locale: Locale, project: Project): JsonLdGraph {
  const { site } = getContent(locale);
  const path = `/projects/${project.slug}`;
  const pageUrl = `${ORIGIN}${localePath(locale, path)}`;
  const homeUrl = `${ORIGIN}${localePath(locale, "/")}`;
  const githubLink = project.links?.find((link) => link.kind === "github")?.href;

  const article: JsonLdNode = {
    "@type": "TechArticle",
    "@id": `${pageUrl}#article`,
    url: pageUrl,
    headline: `${project.plainTitle}: ${project.title}`,
    description: project.plain,
    inLanguage: hreflang[locale],
    dateModified: CONTENT_UPDATED,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    image: `${ORIGIN}${PORTRAIT_PATH}`,
    about: githubLink ? { "@id": `${githubLink}#code` } : undefined,
    keywords: project.stack.join(", "),
  };

  const breadcrumb: JsonLdNode = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: homeUrl },
      { "@type": "ListItem", position: 2, name: project.plainTitle, item: pageUrl },
    ],
  };

  const graph: JsonLdNode[] = [article, breadcrumb];
  if (githubLink) {
    graph.push({
      "@type": "SoftwareSourceCode",
      "@id": `${githubLink}#code`,
      name: project.title,
      description: project.summary,
      codeRepository: githubLink,
      programmingLanguage: "Python",
      author: { "@id": PERSON_ID },
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/**
 * Graph for /ai-automation: the page as an FAQPage (its questions are the
 * visible FAQ), its breadcrumb, and the full ProfessionalService node, since
 * this is the page that describes the offers. The Person is referenced by @id.
 */
export function buildAutomationJsonLd(locale: Locale): JsonLdGraph {
  const { site, automation } = getContent(locale);
  const pageUrl = `${ORIGIN}${localePath(locale, automation.path)}`;
  const homeUrl = `${ORIGIN}${localePath(locale, "/")}`;

  const page: JsonLdNode = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    name: automation.metaTitle,
    description: automation.description,
    inLanguage: hreflang[locale],
    dateModified: CONTENT_UPDATED,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    author: { "@id": PERSON_ID },
    mainEntity: automation.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumb: JsonLdNode = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: homeUrl },
      { "@type": "ListItem", position: 2, name: automation.breadcrumb, item: pageUrl },
    ],
  };

  return { "@context": "https://schema.org", "@graph": [page, breadcrumb, businessNode(locale)] };
}
