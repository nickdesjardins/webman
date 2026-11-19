import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuditPage } from "@/components/audit-page";
import { JsonLd } from "@/components/json-ld";
import { PageTitles } from "@/components/locale-provider";
import { getContent } from "@/lib/content";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { buildAuditJsonLd } from "@/lib/json-ld";
import { baseOpenGraph, pageAlternates } from "@/lib/seo";

function pageTitle(locale: Locale): string {
  const { audit, site } = getContent(locale);
  return `${audit.seoTitle} | ${site.name}`;
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/applied-ai-audit">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { audit, site } = getContent(locale);
  const title = pageTitle(locale);
  const { description, path } = audit;
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
    alternates: pageAlternates(locale, path),
    openGraph: {
      ...baseOpenGraph(locale),
      type: "article",
      url: localePath(locale, path),
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * The open-source applied-ai-audit toolkit: "/projects/applied-ai-audit" and
 * "/fr/projects/applied-ai-audit", prerendered for both editions. A static
 * segment beside [slug], so it never joins the live projects' cycle; the body
 * reads the live locale, so the header switch stays instant here too.
 */
export default async function AuditRoute({ params }: PageProps<"/[locale]/projects/applied-ai-audit">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <JsonLd graph={buildAuditJsonLd(locale)} />
      <PageTitles en={pageTitle("en")} fr={pageTitle("fr")} />
      <AuditPage />
    </>
  );
}
