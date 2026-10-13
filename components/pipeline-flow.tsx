import type { CSSProperties } from "react";
import { ChevronRight, GitBranch } from "lucide-react";
import type { PipelineStage } from "@/data/projects";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    stages: "Pipeline stages",
    branch: "branch",
  },
  fr: {
    stages: "Étapes du pipeline",
    branch: "branche",
  },
} satisfies Record<Locale, Record<string, string>>;

interface PipelineFlowProps {
  stages: PipelineStage[];
  locale: Locale;
  /**
   * Tighter spacing and type for use inside dialogs. In compact mode the
   * horizontal layout starts at `lg` instead of `md` because the host is
   * narrower than the page container.
   */
  compact?: boolean;
  /** Accessible name for the stage list. Defaults to the localized "Pipeline stages". */
  label?: string;
  className?: string;
}

/**
 * A stage whose name reads as a fallback is drawn as a branch off the main
 * path. The pattern also accepts the usual French renderings of "fallback"
 * so the French data module keeps the same visual branch.
 */
const BRANCH_PATTERN = /fallback|repli|secours|rechange/i;

function isBranch(stage: PipelineStage) {
  return BRANCH_PATTERN.test(stage.name);
}

/**
 * Request pipeline as a horizontal flow with chevron connectors on wider
 * viewports, and as a vertical list with a left rail on mobile. One markup
 * tree serves both layouts so screen readers hear the stages exactly once.
 */
export function PipelineFlow({
  stages,
  locale,
  compact = false,
  label,
  className,
}: PipelineFlowProps) {
  const t = STRINGS[locale];
  const listLabel = label ?? t.stages;
  const count = stages.length;
  const style = { "--stages": count } as CSSProperties;

  return (
    <ol
      aria-label={listLabel}
      style={style}
      className={cn(
        // Mobile: vertical list with a rail drawn by the ::before pseudo-element.
        "relative flex flex-col gap-4 pl-7 before:absolute before:top-3 before:bottom-3 before:left-[4.5px] before:w-px before:bg-border before:content-['']",
        // Wider viewports: horizontal flow. The page layout wraps to three
        // columns at md and becomes a single row of N columns at lg.
        compact
          ? "lg:grid lg:grid-cols-[repeat(var(--stages),minmax(0,1fr))] lg:gap-x-4 lg:gap-y-0 lg:pl-0 lg:before:hidden"
          : "md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-4 md:pl-0 md:before:hidden lg:grid-cols-[repeat(var(--stages),minmax(0,1fr))] lg:gap-y-0",
        className
      )}
    >
      {stages.map((stage, i) => {
        const branch = isBranch(stage);
        const last = i === count - 1;
        const number = String(i + 1).padStart(2, "0");
        // In the md three-column wrap, the last item of a row has no neighbour to point at.
        const endOfMdRow = i % 3 === 2;

        return (
          <li key={`${i}-${stage.name}`} className="relative min-w-0">
            {/* Rail marker, mobile only. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-3.5 -left-7 size-2.5 rounded-full ring-4 ring-background",
                branch ? "bg-warning" : "bg-primary",
                compact ? "lg:hidden" : "md:hidden"
              )}
            />

            {/* Connector into the next stage, wider viewports only. */}
            {!last && (
              <ChevronRight
                aria-hidden="true"
                className={cn(
                  "absolute top-3.5 hidden size-3.5 text-muted-foreground/70",
                  compact
                    ? "-right-[15px] lg:block"
                    : endOfMdRow
                      ? "-right-[17px] lg:block"
                      : "-right-[17px] md:block"
                )}
              />
            )}

            <div
              className={cn(
                "h-full rounded-lg border bg-background/40",
                compact ? "p-2.5" : "p-3 lg:p-2.5 xl:p-3",
                branch
                  ? cn(
                      "border-dashed border-warning/60 bg-warning/5",
                      compact ? "lg:mt-3 lg:h-[calc(100%-0.75rem)]" : "md:mt-3 md:h-[calc(100%-0.75rem)]"
                    )
                  : "border-border/70"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "font-mono tabular-nums text-muted-foreground",
                    compact ? "text-[10px]" : "text-[11px]"
                  )}
                >
                  {number}
                </span>
                {branch && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-wider text-warning">
                    <GitBranch aria-hidden="true" className="size-3" />
                    {t.branch}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "mt-1 font-mono font-medium leading-snug text-foreground break-words",
                  compact ? "text-xs" : "text-sm",
                  branch && "text-warning"
                )}
              >
                {stage.name}
              </p>
              <p
                className={cn(
                  "mt-1.5 leading-snug text-muted-foreground break-words",
                  compact ? "text-[11px]" : "text-xs lg:text-[11px] xl:text-xs"
                )}
              >
                {stage.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default PipelineFlow;
