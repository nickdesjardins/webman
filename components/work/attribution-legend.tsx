import { Badge } from "@/components/ui/badge";
import { workStrings } from "@/components/work/strings";
import { workBadgeClass } from "@/components/work/styles";
import { ToneDot, attributionTone } from "@/components/work/work-badges";
import type { WorkAttribution } from "@/data/work";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Employer first: it is the larger body of work and the one that needs the caveat. */
const order: WorkAttribution[] = ["employer", "independent"];

interface AttributionLegendProps {
  locale: Locale;
  className?: string;
}

/**
 * Two compact rows that teach the reader how to read the attribution badges
 * below: amber dot for employer work, emerald dot for independent work.
 */
export function AttributionLegend({ locale, className }: AttributionLegendProps) {
  const { attribution } = getContent(locale).work;
  const t = workStrings(locale);

  return (
    <dl aria-label={t.attributionLegend} className={cn("grid gap-3 lg:grid-cols-2 lg:gap-x-10", className)}>
      {order.map((key) => (
        <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          <dt className="shrink-0">
            <Badge variant="outline" className={cn(workBadgeClass, "text-muted-foreground")}>
              <ToneDot tone={attributionTone[key]} />
              {attribution[key].label}
            </Badge>
          </dt>
          <dd className="min-w-0 text-sm leading-relaxed text-muted-foreground sm:pt-0.5">
            {attribution[key].detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}
