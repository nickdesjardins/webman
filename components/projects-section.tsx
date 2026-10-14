"use client";

import { useLocale } from "@/components/locale-provider";
import type { ReactNode } from "react";
import { CheckCircle2, ExternalLink, FileText, MonitorPlay } from "lucide-react";
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
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    eyebrow: "Enterprise Applied AI Projects",
    title: "Deterministic AI systems, built for production.",
    description:
      "Two live open-source services and two scheduled milestone architectures from a 120-day delivery plan. Measured numbers come from saved benchmark records and recorded runs. Target numbers are explicit SLOs, and they are labelled as such.",
    legend: "Metric legend",
    measured: "Measured",
    target: "Target",
    newTab: "(opens in a new tab)",
    problem: "Problem",
    architecture: "Architecture",
    metrics: "Metrics",
    proof: "Proof points",
    requestPipeline: "Request pipeline",
    requestPipelineStages: "Request pipeline stages",
    scheduled: "Scheduled milestone architectures",
  },
  fr: {
    eyebrow: "Projets d'IA appliquée en entreprise",
    title: "Des systèmes d'IA déterministes, conçus pour la production.",
    description:
      "Deux services à code source ouvert en ligne et deux architectures de jalons planifiées, issues d'un plan de livraison de 120 jours. Les chiffres mesurés proviennent de bancs d'essai et d'exécutions enregistrés. Les chiffres cibles sont des SLO explicites, et ils sont identifiés comme tels.",
    legend: "Légende des métriques",
    measured: "Mesuré",
    target: "Cible",
    newTab: "(s'ouvre dans un nouvel onglet)",
    problem: "Problème",
    architecture: "Architecture",
    metrics: "Métriques",
    proof: "Éléments de preuve",
    requestPipeline: "Pipeline de requête",
    requestPipelineStages: "Étapes du pipeline de requête",
    scheduled: "Architectures de jalons planifiées",
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

function MetricLegend({ locale, className }: { locale: Locale; className?: string }) {
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

function ProjectLinkButton({ link, locale }: { link: ProjectLink; locale: Locale }) {
  const t = STRINGS[locale];
  return (
    <Button
      asChild
      variant={link.kind === "docs" ? "default" : "outline"}
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
          {/* Left column: narrative */}
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
              className="mt-5 text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {project.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {project.summary}
            </p>

            <div className="mt-8 grid gap-6">
              <LabelledBlock label={t.problem}>{project.problem}</LabelledBlock>
              <LabelledBlock label={t.architecture}>{project.architecture}</LabelledBlock>
            </div>

            <StackChips stack={project.stack} locale={locale} className="mt-8" />

            {project.links && project.links.length > 0 && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {project.links.map((link) => (
                  <ProjectLinkButton key={link.href} link={link} locale={locale} />
                ))}
              </div>
            )}
          </div>

          {/* Right column: evidence */}
          <div className="flex min-w-0 flex-col gap-8">
            <div>
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

            <div>
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
          </div>
        </div>

        {/* Full-width pipeline */}
        <div className="mt-10 border-t border-border/70 pt-8">
          <p className={projectLabelClass}>{t.requestPipeline}</p>
          <PipelineFlow
            stages={project.pipeline}
            locale={locale}
            className="mt-4"
            label={t.requestPipelineStages}
          />
        </div>
      </article>
    </Reveal>
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
