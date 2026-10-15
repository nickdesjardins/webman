import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AutomationPage } from "@/components/automation-page";
import { JsonLd } from "@/components/json-ld";
import { PageTitles } from "@/components/locale-provider";
import { getContent } from "@/lib/content";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { buildAutomationJsonLd } from "@/lib/json-ld";
import { baseOpenGraph, pageAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/ai-automation">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { automation, site } = getContent(locale);
  const { metaTitle: title, description, path } = automation;
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
      type: "website",
      url: localePath(locale, path),
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * The buyer-facing services page: "/ai-automation" and "/fr/ai-automation",
 * prerendered for both editions. It carries the commercial search terms the
 * home page keeps light, plus the ProfessionalService and FAQPage graph.
 */
export default async function AutomationRoute({ params }: PageProps<"/[locale]/ai-automation">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <JsonLd graph={buildAutomationJsonLd(locale)} />
      <PageTitles en={getContent("en").automation.metaTitle} fr={getContent("fr").automation.metaTitle} />
      <AutomationPage />
    </>
  );
}
