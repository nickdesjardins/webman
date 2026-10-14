import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutSection } from "@/components/about-section";
import { ArsenalGrid } from "@/components/arsenal-grid";
import { ContactSection } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { PageTitles } from "@/components/locale-provider";
import { NextblockSection } from "@/components/nextblock-section";
import { ProjectsSection } from "@/components/projects-section";
import { ServicesSection } from "@/components/services-section";
import { WorkSection } from "@/components/work-section";
import { getContent } from "@/lib/content";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { baseOpenGraph, pageAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { site } = getContent(locale);
  return {
    title: { absolute: site.metaTitle },
    description: site.description,
    alternates: pageAlternates(locale, "/"),
    openGraph: {
      ...baseOpenGraph(locale),
      type: "profile",
      url: localePath(locale, "/"),
      title: site.metaTitle,
      description: site.description,
    },
    twitter: { card: "summary_large_image", title: site.metaTitle, description: site.description },
  };
}

/**
 * The home page, prerendered once per edition: English at "/" (internal
 * path /en) and French at "/fr". Every section reads the live locale from
 * context, so the header switch re-renders them instantly while the
 * provider rewrites the address bar to the other edition's URL.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main id="main" className="relative">
      <JsonLd locale={locale} />
      <PageTitles en={getContent("en").site.metaTitle} fr={getContent("fr").site.metaTitle} />
      <Hero />
      <ServicesSection />
      <ProjectsSection />
      <NextblockSection />
      <WorkSection />
      <ArsenalGrid />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
