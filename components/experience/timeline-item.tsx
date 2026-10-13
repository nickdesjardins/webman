import {
  Briefcase,
  CalendarDays,
  ChevronRight,
  MapPin,
  Rocket,
  Shield,
  type LucideIcon,
} from "lucide-react";

import type { ExperienceItem } from "@/data/experience";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { experienceStrings, kindLabel } from "@/components/experience/strings";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<ExperienceItem["kind"], LucideIcon> = {
  work: Briefcase,
  founder: Rocket,
  military: Shield,
};

interface TimelineItemProps {
  item: ExperienceItem;
  /** Position in the list; drives the reveal stagger. */
  index: number;
  locale: Locale;
}

/**
 * One entry on the career timeline: a node on the vertical rail plus the
 * role card. The current role (no `end`) gets a pulsing success dot on the
 * node and a "Current" badge in the card header.
 */
export function TimelineItem({ item, index, locale }: TimelineItemProps) {
  const Icon = KIND_ICON[item.kind];
  const isCurrent = !item.end;
  const t = experienceStrings(locale);

  return (
    <li className="relative pb-10 last:pb-0 sm:pb-12">
      <Reveal index={index} className="relative pl-8 sm:pl-10">
        {/* Node sitting on the rail. The background ring breaks the rail line around it. */}
        <span
          className={cn(
            "absolute top-0.5 -left-[1.125rem] flex size-9 items-center justify-center rounded-full border bg-card text-primary ring-4 ring-background",
            isCurrent ? "border-primary/50" : "border-border"
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="sr-only">{kindLabel(locale, item.kind)}</span>
          {isCurrent && (
            <span className="absolute -top-0.5 -right-0.5 flex size-3" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-background bg-success" />
            </span>
          )}
        </span>

        <Card className="gap-5 border-border/70 py-5 transition-colors hover:border-primary/40 sm:py-6">
          <CardHeader className="gap-3 px-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{item.period}</span>
                </span>
                {item.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{item.location}</span>
                  </span>
                )}
              </div>
              {isCurrent && (
                <Badge
                  variant="outline"
                  className="border-success/40 bg-success/10 font-mono text-[11px] tracking-wider text-success uppercase"
                >
                  <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                  {t.current}
                </Badge>
              )}
            </div>
            <div>
              <h3 className="text-lg leading-snug font-semibold text-foreground sm:text-xl">{item.role}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{item.company}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-5 sm:px-6">
            {item.summary && <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>}

            <ul className="space-y-2.5">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                  <ChevronRight className="mt-1 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {item.stack && item.stack.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label={t.stack}>
                {item.stack.map((tool) => (
                  <li key={tool}>
                    <Badge
                      variant="outline"
                      className="rounded-md border-border/80 bg-background/40 font-mono text-[11px] text-muted-foreground"
                    >
                      {tool}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </li>
  );
}
