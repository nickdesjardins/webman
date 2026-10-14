import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { PageTitles } from "@/components/locale-provider";
import { ProjectPage } from "@/components/project-page";
import type { Project } from "@/data/projects";
import { getContent } from "@/lib/content";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { buildProjectJsonLd } from "@/lib/json-ld";
import { baseOpenGraph, pageAlternates } from "@/lib/seo";

/** Only live projects get a page; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getContent("en")
    .projects.filter((project) => project.status === "live")
    .map((project) => ({ slug: project.slug }));
}

function findProject(locale: Locale, slug: string): Project | undefined {
  return getContent(locale).projects.find((project) => project.status === "live" && project.slug === slug);
}

/** First sentence of the plain summary: a meta description of about 160 characters or less. */
function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](?=\s|$)/);
  return match ? match[0] : text;
}

function pageTitle(locale: Locale, project: Project): string {
  return `${project.seoTitle ?? project.plainTitle} | ${getContent(locale).site.name}`;
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const project = findProject(locale, slug);
  if (!project) return {};
  const title = pageTitle(locale, project);
  const description = firstSentence(project.plain);
  const { site } = getContent(locale);
  // A page-level openGraph block replaces the inherited one, file-based image included, so restate it.
  const image = {
    url: `/${locale}/opengraph-image/card`,
    width: 1200,
    height: 630,
    alt: `${site.name} | ${site.title}`,
  };
  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(locale, `/projects/${project.slug}`),
    openGraph: {
      ...baseOpenGraph(locale),
      type: "article",
      url: localePath(locale, `/projects/${project.slug}`),
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * A live project's own page: the plain story first, the measured numbers,
 * then the full technical write-up open by default. Prerendered for both
 * editions ("/projects/<slug>" and "/fr/projects/<slug>"); the body reads
 * the live locale, so the header switch stays instant here too.
 */
export default async function ProjectRoute({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = findProject(locale, slug);
  const en = findProject("en", slug);
  const fr = findProject("fr", slug);
  if (!project || !en || !fr) notFound();

  return (
    <>
      <JsonLd graph={buildProjectJsonLd(locale, project)} />
      <PageTitles en={pageTitle("en", en)} fr={pageTitle("fr", fr)} />
      <ProjectPage slug={slug} />
    </>
  );
}
