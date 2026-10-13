import { notFound } from "next/navigation";

import { AboutSection } from "@/components/about-section";
import { ArsenalGrid } from "@/components/arsenal-grid";
import { ContactSection } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { Hero } from "@/components/hero";
import { NextblockSection } from "@/components/nextblock-section";
import { ProjectsSection } from "@/components/projects-section";
import { WorkSection } from "@/components/work-section";
import { isLocale } from "@/lib/i18n";

/**
 * The page is prerendered once per language at the internal /en and /fr
 * paths; the proxy serves one of them at "/". Every section reads the live
 * locale from context, so the header switch re-renders them instantly.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main id="main" className="relative">
      <Hero />
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
