"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project, ProjectMetric } from "@/data/projects";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    inspect: "Inspect architecture",
    close: "Close",
    problem: "Problem",
    architecture: "Architecture",
    pipeline: "Pipeline",
    proof: "Proof points",
    metrics: "Metrics",
    stack: "Stack",
    measured: "measured",
    target: "target",
  },
  fr: {
    inspect: "Inspecter l'architecture",
    close: "Fermer",
    problem: "Problème",
    architecture: "Architecture",
    pipeline: "Pipeline",
    proof: "Éléments de preuve",
    metrics: "Métriques",
    stack: "Pile technologique",
    measured: "mesuré",
    target: "cible",
  },
} satisfies Record<Locale, Record<string, string>>;

interface ProjectDetailsDialogProps {
  project: Project;
  locale: Locale;
  /**
   * Server-rendered pipeline (normally `<PipelineFlow stages={project.pipeline} locale={locale} compact />`)
   * passed in as a slot so PipelineFlow stays out of the client bundle.
   * When omitted, the pipeline block is not rendered.
   */
  pipeline?: ReactNode;
  /** Visible trigger text. Defaults to the localized "Inspect architecture". */
  triggerLabel?: string;
  triggerClassName?: string;
}

const labelClass =
  "font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground";

/* Mirrors the shadcn DialogContent close button so its sr-only text can be localized. */
const closeButtonClass =
  "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

function KindTag({ kind, locale }: { kind: ProjectMetric["kind"]; locale: Locale }) {
  const t = STRINGS[locale];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-wider",
        kind === "measured" ? "text-success" : "text-warning"
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {t[kind]}
    </span>
  );
}

/**
 * Architecture drill-down for a project card. Radix handles focus trapping,
 * Escape to close, and restoring focus to the trigger.
 */
export function ProjectDetailsDialog({
  project,
  locale,
  pipeline,
  triggerLabel,
  triggerClassName,
}: ProjectDetailsDialogProps) {
  const t = STRINGS[locale];
  const trigger = triggerLabel ?? t.inspect;
  const live = project.status === "live";
  const headingId = (part: string) => `${project.id}-dialog-${part}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("group", triggerClassName)}>
          {trigger}
          <span className="sr-only">: {project.shortTitle}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-h-[85dvh] overflow-y-auto gap-8 sm:max-w-2xl lg:max-w-4xl"
      >
        <DialogHeader className="text-left">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-8">
            <Badge
              variant="outline"
              className="gap-2 py-1 pr-3 pl-2 font-mono text-[11px] font-medium uppercase tracking-wider"
            >
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", live ? "bg-success" : "bg-warning")}
              />
              {project.statusLabel}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {project.index} / {project.phase}
            </span>
            {project.delivery && (
              <span className="font-mono text-xs text-muted-foreground">{project.delivery}</span>
            )}
          </div>
          <DialogTitle className="text-xl leading-tight font-semibold tracking-tight sm:text-2xl">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed sm:text-base">
            {project.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-labelledby={headingId("problem")} className="min-w-0">
            <h3 id={headingId("problem")} className={labelClass}>
              {t.problem}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{project.problem}</p>
          </section>
          <section aria-labelledby={headingId("architecture")} className="min-w-0">
            <h3 id={headingId("architecture")} className={labelClass}>
              {t.architecture}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{project.architecture}</p>
          </section>
        </div>

        {pipeline && (
          <section aria-labelledby={headingId("pipeline")} className="min-w-0">
            <h3 id={headingId("pipeline")} className={labelClass}>
              {t.pipeline}
            </h3>
            <div className="mt-3">{pipeline}</div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section aria-labelledby={headingId("proof")} className="min-w-0">
            <h3 id={headingId("proof")} className={labelClass}>
              {t.proof}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {project.proofPoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="min-w-0">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby={headingId("metrics")} className="min-w-0">
            <h3 id={headingId("metrics")} className={labelClass}>
              {t.metrics}
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
              {project.metrics.map((metric) => (
                <li
                  key={`${metric.value}-${metric.label}`}
                  className="min-w-0 border-t border-border/70 pt-3"
                >
                  <p className="font-mono text-lg leading-none font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-xl">
                    {metric.value}
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{metric.label}</p>
                  <div className="mt-1.5">
                    <KindTag kind={metric.kind} locale={locale} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby={headingId("stack")} className="min-w-0">
          <h3 id={headingId("stack")} className={labelClass}>
            {t.stack}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li key={item}>
                <Badge variant="secondary" className="font-mono text-xs font-normal">
                  {item}
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        {/* Localized close control; replaces the built-in one, same position and styling. */}
        <DialogClose className={closeButtonClass}>
          <X aria-hidden="true" />
          <span className="sr-only">{t.close}</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectDetailsDialog;
