import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PipelineFlow } from "@/components/pipeline-flow";
import { ProjectDetailsDialog } from "@/components/project-details-dialog";
import type { Project, ProjectMetric } from "@/data/projects";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    measured: "measured",
    target: "target",
    metrics: "Metrics",
    stack: "Stack",
    more: "more",
  },
  fr: {
    measured: "mesuré",
    target: "cible",
    metrics: "Métriques",
    stack: "Pile technologique",
    more: "autres",
  },
} satisfies Record<Locale, Record<string, string>>;

const MAX_STACK_CHIPS = 5;

/** Mono eyebrow used for sub-labels across the projects section. */
export const projectLabelClass =
  "font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground";

interface StatusDotProps {
  tone: "success" | "warning";
  /** Adds a slow ping ring. Disabled automatically under prefers-reduced-motion. */
  pulse?: boolean;
  className?: string;
}

/** Semantic status dot: success = live, warning = in pipeline. */
export function StatusDot({ tone, pulse = false, className }: StatusDotProps) {
  const color = tone === "success" ? "bg-success" : "bg-warning";
  return (
    <span aria-hidden="true" className={cn("relative inline-flex size-2 shrink-0", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex size-full rounded-full opacity-70 motion-safe:animate-ping [animation-duration:2.4s]",
            color
          )}
        />
      )}
      <span className={cn("relative inline-flex size-2 rounded-full", color)} />
    </span>
  );
}

interface MetricKindTagProps {
  kind: ProjectMetric["kind"];
  locale: Locale;
  className?: string;
}

/** Tiny "measured" / "target" tag, coloured by provenance. */
export function MetricKindTag({ kind, locale, className }: MetricKindTagProps) {
  const t = STRINGS[locale];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-wider",
        kind === "measured" ? "text-success" : "text-warning",
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {t[kind]}
    </span>
  );
}

interface MetricTileProps {
  metric: ProjectMetric;
  locale: Locale;
  /** "lg" is the featured 2x2 grid, "sm" is the card mini grid. */
  size?: "sm" | "lg";
  className?: string;
}

/** One metric: big mono value, label, provenance tag. Renders as a list item. */
export function MetricTile({ metric, locale, size = "sm", className }: MetricTileProps) {
  const large = size === "lg";
  return (
    <li
      className={cn(
        "min-w-0",
        large ? "rounded-xl border border-border/70 bg-background/40 p-4" : "border-t border-border/70 pt-3",
        className
      )}
    >
      <p
        className={cn(
          "font-mono leading-none font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]",
          large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        )}
      >
        {metric.value}
      </p>
      <p className={cn("leading-snug text-muted-foreground", large ? "mt-2.5 text-xs sm:text-sm" : "mt-1.5 text-xs")}>
        {metric.label}
      </p>
      <div className={large ? "mt-2.5" : "mt-1.5"}>
        <MetricKindTag kind={metric.kind} locale={locale} />
      </div>
    </li>
  );
}

interface StackChipsProps {
  stack: string[];
  locale: Locale;
  /** Show at most this many chips, then a "+N" chip. Omit to show all. */
  limit?: number;
  className?: string;
}

/** Secondary mono chips for the stack list, optionally truncated. */
export function StackChips({ stack, locale, limit, className }: StackChipsProps) {
  const t = STRINGS[locale];
  const shown = limit ? stack.slice(0, limit) : stack;
  const hidden = stack.length - shown.length;
  const hiddenList = stack.slice(shown.length).join(", ");
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label={t.stack}>
      {shown.map((item) => (
        <li key={item}>
          <Badge variant="secondary" className="font-mono text-xs font-normal">
            {item}
          </Badge>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Badge
            variant="outline"
            className="font-mono text-xs font-normal text-muted-foreground"
            title={hiddenList}
          >
            +{hidden}
            <span className="sr-only">
              {" "}
              {t.more}: {hiddenList}
            </span>
          </Badge>
        </li>
      )}
    </ul>
  );
}

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  className?: string;
}

/**
 * Compact card for a scheduled milestone project. Server Component; the only
 * client leaf is the details dialog in the footer.
 */
export function ProjectCard({ project, locale, className }: ProjectCardProps) {
  const t = STRINGS[locale];
  const tone = project.status === "live" ? "success" : "warning";
  const titleId = `${project.id}-title`;

  return (
    <Card
      className={cn(
        "group/card h-full gap-5 border-border/70 bg-card/80 transition-colors hover:border-primary/40",
        className
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <span className="font-mono text-xs text-muted-foreground">
            {project.index} / {project.phase}
          </span>
          {project.delivery && (
            <span className="font-mono text-xs text-muted-foreground">{project.delivery}</span>
          )}
        </div>
        <div>
          <Badge
            variant="outline"
            className="gap-2 py-1 pr-3 pl-2 font-mono text-[11px] font-medium uppercase tracking-wider"
          >
            <StatusDot tone={tone} />
            {project.statusLabel}
          </Badge>
        </div>
        <h3 id={titleId} className="text-xl leading-snug font-semibold tracking-tight text-foreground">
          {project.title}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
        <StackChips stack={project.stack} locale={locale} limit={MAX_STACK_CHIPS} />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3" aria-label={t.metrics}>
          {project.metrics.map((metric) => (
            <MetricTile
              key={`${metric.value}-${metric.label}`}
              metric={metric}
              locale={locale}
              size="sm"
            />
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto">
        <ProjectDetailsDialog
          project={project}
          locale={locale}
          pipeline={<PipelineFlow stages={project.pipeline} locale={locale} compact />}
          triggerClassName="w-full justify-between"
        />
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;
