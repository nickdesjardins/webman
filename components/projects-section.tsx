"use client";

import { useLocale } from "@/components/locale-provider";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, ExternalLink, FileText, MonitorPlay } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { Reveal } from "@/components/motion/reveal";
import { PipelineFlow } from "@/components/pipeline-flow";
import {
  MetricTile,
  ProjectCard,
  StackChips,
  StatusDot,
  projectLabelClass,
} from "@/components/project-card";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project, ProjectLink } from "@/data/projects";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    eyebrow: "AI projects",
    title: "AI tools that check their own work.",
    description:
      "Three services are live, with public code you can read. One more is planned. Numbers marked Measured were recorded in dated tests. Numbers marked Target are goals, not results.",
    legend: "Metric legend",
    measured: "Measured",
    target: "Target",
    newTab: "(opens in a new tab)",
    problem: "The problem it solves",
    architecture: "Architecture",
    technicalSummary: "In technical terms",
    stack: "Stack",
    metrics: "Metrics",
    proof: "Proof points",
    howItWorks: "How it works",
    howItWorksHint: "for engineers and technical reviewers",
    caseStudy: "Read the case study",
    requestPipeline: "Request pipeline",
    requestPipelineStages: "Request pipeline stages",
    scheduled: "Planned next",
  },
  fr: {
    eyebrow: "Projets IA",
    title: "Des outils d'IA qui vérifient leur propre travail.",
    description:
      "Trois services sont en ligne, au code public. Un autre est planifié. Les chiffres marqués Mesuré ont été enregistrés lors de tests datés. Les chiffres marqués Cible sont des objectifs, pas des résultats.",
    legend: "Légende des métriques",
    measured: "Mesuré",
    target: "Cible",
    newTab: "(s'ouvre dans un nouvel onglet)",
    problem: "Le problème réglé",
    architecture: "Architecture",
    technicalSummary: "En termes techniques",
    stack: "Pile technique",
    metrics: "Métriques",
    proof: "Éléments de preuve",
    howItWorks: "Comment ça marche",
    howItWorksHint: "pour les équipes techniques",
    caseStudy: "Lire l'étude de cas",
    requestPipeline: "Pipeline de requête",
    requestPipelineStages: "Étapes du pipeline de requête",
    scheduled: "Prochaines étapes planifiées",
  },
} satisfies Record<Locale, Record<string, string>>;

/* ------------------------------------------------------------------ */
/* Legend                                                              */
/* ------------------------------------------------------------------ */

function LegendChip({ tone, label }: { tone: "success" | "warning"; label: string }) {
  return (
    <Badge
      variant="outline"
      className="gap-2 py-1 pr-3 pl-2 font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
    >
      <StatusDot tone={tone} />
      {label}
    </Badge>
  );
}

export function MetricLegend({ locale, className }: { locale: Locale; className?: string }) {
  const t = STRINGS[locale];
  return (
    <ul aria-label={t.legend} className={cn("flex flex-wrap items-center gap-2", className)}>
      <li>
        <LegendChip tone="success" label={t.measured} />
      </li>
      <li>
        <LegendChip tone="warning" label={t.target} />
      </li>
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Live project                                                        */
/* ------------------------------------------------------------------ */

function LinkIcon({ kind }: { kind: ProjectLink["kind"] }) {
  if (kind === "docs") return <FileText aria-hidden="true" />;
  if (kind === "demo") return <MonitorPlay aria-hidden="true" />;
  if (kind === "github") {
    // The link text already names the destination, so the glyph is decorative.
    return (
      <span aria-hidden="true" className="inline-flex shrink-0">
        <BrandIcon icon="siGithub" label="GitHub" className="size-4" />
      </span>
    );
  }
  return <ExternalLink aria-hidden="true" />;
}

export function ProjectLinkButton({
  link,
  locale,
  variant,
}: {
  link: ProjectLink;
  locale: Locale;
  /** Forces a variant; by default the docs link is primary and the rest are outlined. */
  variant?: "default" | "outline";
}) {
  const t = STRINGS[locale];
  return (
    <Button
      asChild
      variant={variant ?? (link.kind === "docs" ? "default" : "outline")}
      className="w-full sm:w-auto"
    >
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        <LinkIcon kind={link.kind} />
        {link.label}
        <ExternalLink aria-hidden="true" className="size-3.5 opacity-70" />
        <span className="sr-only">{t.newTab}</span>
      </a>
    </Button>
  );
}

function LabelledBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h4 className={projectLabelClass}>{label}</h4>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">{children}</p>
    </div>
  );
}

function LiveProject({ project, locale }: { project: Project; locale: Locale }) {
  const t = STRINGS[locale];
  const titleId = `${project.id}-title`;

  return (
    <Reveal>
      <article
        aria-labelledby={titleId}
        className="card-glow rounded-2xl p-5 shadow-[0_0_120px_-48px_var(--glow)] sm:p-8 lg:p-10"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          {/* Left column: what it does, in plain words */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Badge
                variant="outline"
                className="gap-2 py-1 pr-3 pl-2 font-mono text-[11px] font-medium uppercase tracking-wider"
              >
                <StatusDot tone="success" pulse />
                {project.statusLabel}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                {project.index} / {project.phase}
              </span>
            </div>

            <h3
              id={titleId}
              className="mt-5 text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {project.plainTitle}
            </h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">{project.title}</p>
            <p className="mt-5 text-base leading-relaxed text-foreground/90 sm:text-lg">{project.plain}</p>

            <div className="mt-8">
              <LabelledBlock label={t.problem}>{project.problem}</LabelledBlock>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="group w-full sm:w-auto">
                <a href={localePath(locale, `/projects/${project.slug}`)}>
                  {t.caseStudy}
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </a>
              </Button>
              {project.links?.map((link) => (
                <ProjectLinkButton key={link.href} link={link} locale={locale} variant="outline" />
              ))}
            </div>
          </div>

          {/* Right column: evidence */}
          <div className="min-w-0">
            <p className={projectLabelClass}>{t.metrics}</p>
            <ul className="mt-3 grid grid-cols-2 gap-3" aria-label={t.metrics}>
              {project.metrics.map((metric) => (
                <MetricTile
                  key={`${metric.value}-${metric.label}`}
                  metric={metric}
                  locale={locale}
                  size="lg"
                />
              ))}
            </ul>
          </div>
        </div>

        <HowItWorks project={project} locale={locale} />
      </article>
    </Reveal>
  );
}

/**
 * The technical layer, one click down: the engineering summary, architecture,
 * stack, proof points and the request pipeline. A native <details> element,
 * so it works without JavaScript and its text stays in the HTML for search
 * engines and screen readers. The project page renders it open.
 */
export function HowItWorks({
  project,
  locale,
  open = false,
}: {
  project: Project;
  locale: Locale;
  open?: boolean;
}) {
  const t = STRINGS[locale];
  return (
    <details
      open={open}
      className="group/how mt-10 rounded-xl border border-border/70 bg-background/40 open:bg-background/60"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 transition-colors hover:bg-card/60 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-base font-semibold text-foreground">{t.howItWorks}</span>
          <span className="font-mono text-xs text-muted-foreground">{t.howItWorksHint}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground transition-transform group-open/how:rotate-180 motion-reduce:transition-none"
        />
      </summary>

      <div className="grid gap-8 border-t border-border/70 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        <div className="grid min-w-0 content-start gap-6">
          <LabelledBlock label={t.technicalSummary}>{project.summary}</LabelledBlock>
          <LabelledBlock label={t.architecture}>{project.architecture}</LabelledBlock>
          <div>
            <p className={projectLabelClass}>{t.stack}</p>
            <StackChips stack={project.stack} locale={locale} className="mt-3" />
          </div>
        </div>

        <div className="min-w-0">
          <p className={projectLabelClass}>{t.proof}</p>
          <ul className="mt-3 space-y-3">
            {project.proofPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                <span className="min-w-0">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <p className={projectLabelClass}>{t.requestPipeline}</p>
          <PipelineFlow
            stages={project.pipeline}
            locale={locale}
            className="mt-4"
            label={t.requestPipelineStages}
          />
        </div>
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function ProjectsSection() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const { projects } = getContent(locale);
  const liveProjects = projects.filter((p) => p.status === "live");
  const pipelineProjects = projects.filter((p) => p.status !== "live");

  return (
    <Section
      id="projects"
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
    >
      <Reveal>
        <MetricLegend locale={locale} className="-mt-4 mb-8 lg:-mt-6 lg:mb-10" />
      </Reveal>

      <div className="grid gap-8 lg:gap-10">
        {liveProjects.map((project) => (
          <LiveProject key={project.id} project={project} locale={locale} />
        ))}
      </div>

      {pipelineProjects.length > 0 && (
        <>
          <Reveal>
            <p className={cn(projectLabelClass, "mt-14 lg:mt-16")}>{t.scheduled}</p>
          </Reveal>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {pipelineProjects.map((project, i) => (
              <Reveal key={project.id} index={i} className="h-full">
                <ProjectCard project={project} locale={locale} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

export default ProjectsSection;
