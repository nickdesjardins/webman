import { nextblockStrings } from "@/components/nextblock/strings";
import type { NextblockMetric } from "@/data/nextblock";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface MetricStripProps {
  metrics: readonly NextblockMetric[];
  locale: Locale;
  className?: string;
}

/**
 * Eight sourced figures in one bordered strip: 2 columns at 360px, 4 at md,
 * 8 at 2xl. Every cell draws its own right and bottom hairline; the grid is
 * pulled 1px past the clipped container so the outer edges never double up.
 * The source line is always visible: the point is that every number is dated.
 */
export function MetricStrip({ metrics, locale, className }: MetricStripProps) {
  const t = nextblockStrings(locale);

  return (
    <div className={cn(className)}>
      <p className="mb-3 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-success" />
        {t.metricsNote}
      </p>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60">
        <ul
          aria-label={t.metricsLabel}
          className="-mr-px -mb-px grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-8"
        >
          {metrics.map((metric) => (
            <li
              key={`${metric.value}-${metric.label}`}
              className="min-w-0 border-r border-b border-border/60 p-4 sm:p-5"
            >
              <p className="font-mono text-2xl font-semibold leading-none tracking-tight text-foreground [overflow-wrap:anywhere] lg:text-3xl 2xl:text-2xl">
                {metric.value}
              </p>
              <p className="mt-2.5 text-sm leading-snug text-foreground/90">{metric.label}</p>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{metric.source}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MetricStrip;
