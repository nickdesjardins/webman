/**
 * JSON-LD structured data for https://webman.dev, one edition per locale.
 *
 * One @graph with stable @id anchors so every node can reference the
 * Person without repeating it: Person, WebSite, ProfilePage, and for the
 * live featured project a SoftwareApplication plus its SoftwareSourceCode.
 * The anchors are derived from the canonical (default locale) origin, so the
 * English and French editions describe the same entities; only the prose,
 * the page url and inLanguage change per locale.
 * Every fact is read through getContent(locale).
 */
import { getContent } from "@/lib/content";
import { defaultLocale, hreflang, localePath, type Locale } from "@/lib/i18n";

type JsonLdNode = Record<string, unknown>;

export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
}

const JOB_TITLE: Record<Locale, string> = {
  en: "Applied AI Engineer",
  fr: "Ingénieur en IA appliquée",
};

/** Canonical origin shared by both editions; keeps the @id anchors identical across locales. */
const ORIGIN = getContent(defaultLocale).site.url;
const PERSON_ID = `${ORIGIN}/#person`;
const WEBSITE_ID = `${ORIGIN}/#website`;
const PROFILE_ID = `${ORIGIN}/#profile`;

/** Topics drawn from the arsenal and the project themes (technical nouns, not translated). */
const KNOWS_ABOUT = [
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

export function buildJsonLd(locale: Locale): JsonLdGraph {
  const {
    site,
    featuredProject,
    nextblock,
    experience: { experience, education },
  } = getContent(locale);

  const jobTitle = JOB_TITLE[locale];
  const inLanguage = hreflang[locale];
  /** The edition's canonical page: "https://webman.dev/" or "https://webman.dev/fr". */
  const pageUrl = `${site.url}${localePath(locale)}`;

  const employer = experience.find((item) => item.kind === "work" && !item.end);
  const docsLink = featuredProject.links?.find((link) => link.kind === "docs")?.href;
  const githubLink = featuredProject.links?.find((link) => link.kind === "github")?.href;
  const appId = githubLink ? `${githubLink}#app` : `${ORIGIN}/#${featuredProject.id}`;

  const person: JsonLdNode = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    jobTitle,
    description: site.description,
    email: `mailto:${site.email}`,
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
    name: site.name,
    description: site.description,
    publisher: { "@id": PERSON_ID },
    inLanguage,
  };

  const profilePage: JsonLdNode = {
    "@type": "ProfilePage",
    "@id": PROFILE_ID,
    url: pageUrl,
    inLanguage,
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };

  const graph: JsonLdNode[] = [person, website, profilePage];

  if (featuredProject.status === "live") {
    graph.push({
      "@type": "SoftwareApplication",
      "@id": appId,
      name: featuredProject.title,
      description: featuredProject.summary,
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
        name: featuredProject.title,
        description: featuredProject.summary,
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

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
