"use client";

import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { MetricTile, StatusDot, projectLabelClass } from "@/components/project-card";
import { HowItWorks, MetricLegend, ProjectLinkButton } from "@/components/projects-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

const STRINGS = {
  en: {
    breadcrumb: "Breadcrumb",
    projects: "AI projects",
    problem: "The problem it solves",
    metrics: "What was measured",
    ctaTitle: "Need something like this for your company?",
    ctaBody:
      "Describe the problem in your own words. I reply within one business day, and I am open to full-time roles, contracts and agency placements.",
    ctaContact: "Get in touch",
    ctaEmail: "Email me",
    next: "Next project",
    back: "All projects",
  },
  fr: {
    breadcrumb: "Fil d'Ariane",
    projects: "Projets IA",
    problem: "Le problème réglé",
    metrics: "Ce qui a été mesuré",
    ctaTitle: "Besoin de quelque chose de semblable pour votre entreprise?",
    ctaBody:
      "Décrivez le problème dans vos mots. Je réponds en moins d'un jour ouvrable, et je suis ouvert aux postes permanents, aux contrats et aux placements par agence.",
    ctaContact: "Me joindre",
    ctaEmail: "M'écrire",
    next: "Projet suivant",
    back: "Tous les projets",
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Body of a project page. A client component that reads the live locale, so
 * the header switch swaps the whole page instantly, like the home page.
 */
export function ProjectPage({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const { projects, site } = getContent(locale);
  const live = projects.filter((p) => p.status === "live");
  const index = live.findIndex((p) => p.slug === slug);
  const project = live[index];
  if (!project) return null;
  const next = live[(index + 1) % live.length];
  const home = localePath(locale, "/");

  return (
    <main id="main" className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-grid mask-fade-y" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-[40rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)] opacity-50"
      />

      <div className="container-site">
        <nav aria-label={t.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            <li>
              <a href={home} className="transition-colors hover:text-foreground">
                {site.name}
              </a>
            </li>
            <li aria-hidden>/</li>
            <li>
              <a href={`${home}#projects`} className="transition-colors hover:text-foreground">
                {t.projects}
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {project.plainTitle}
            </li>
          </ol>
        </nav>

        <header className="mt-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Badge
              variant="outline"
              className="gap-2 py-1 pr-3 pl-2 font-mono text-[11px] font-medium tracking-wider uppercase"
            >
              <StatusDot tone="success" pulse />
              {project.statusLabel}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {project.index} / {project.phase}
            </span>
          </div>
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-6xl">
            {project.plainTitle}
          </h1>
          <p className="mt-3 font-mono text-sm text-primary">{project.title}</p>
          <p className="mt-6 text-lg leading-relaxed text-foreground/90 sm:text-xl">{project.plain}</p>

          {project.links && project.links.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {project.links.map((link) => (
                <ProjectLinkButton key={link.href} link={link} locale={locale} />
              ))}
            </div>
          )}
        </header>

        <section aria-labelledby="problem-heading" className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 id="problem-heading" className={projectLabelClass}>
              {t.problem}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/90 sm:text-lg">{project.problem}</p>
          </div>
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={projectLabelClass}>{t.metrics}</h2>
              <MetricLegend locale={locale} />
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2" aria-label={t.metrics}>
              {project.metrics.map((metric) => (
                <MetricTile key={`${metric.value}-${metric.label}`} metric={metric} locale={locale} size="lg" />
              ))}
            </ul>
          </div>
        </section>

        <HowItWorks project={project} locale={locale} open />

        <aside className="card-glow mt-16 grid gap-6 rounded-2xl p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.ctaTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{t.ctaBody}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <a href={`${home}#contact`}>
                {t.ctaContact}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`mailto:${site.email}`}>
                <Mail aria-hidden="true" />
                {t.ctaEmail}
              </a>
            </Button>
          </div>
        </aside>

        <nav className="mt-12 flex flex-col justify-between gap-4 border-t border-border/70 pt-8 sm:flex-row">
          <a
            href={`${home}#projects`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t.back}
          </a>
          {next && next.slug !== project.slug && (
            <a
              href={localePath(locale, `/projects/${next.slug}`)}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t.next}: {next.plainTitle}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </nav>
      </div>
    </main>
  );
}

export default ProjectPage;
