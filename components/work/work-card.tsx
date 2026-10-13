import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { fill, workStrings } from "@/components/work/strings";
import { WorkBadgeRow, WorkStackChips } from "@/components/work/work-badges";
import { WorkThumb } from "@/components/work/work-thumb";
import type { WorkItem } from "@/data/work";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface WorkCardProps {
  item: WorkItem;
  locale: Locale;
  className?: string;
}

/**
 * Card for one work item: flush thumbnail on top (or the "preview pending"
 * frame when no capture exists yet), then kind, attribution and language
 * badges, title, summary, stack, and the outbound link. The attribution badge
 * reads from the item, so employer and independent items share this card.
 * Server Component.
 */
export function WorkCard({ item, locale, className }: WorkCardProps) {
  const { kindLabel } = getContent(locale).work;
  const t = workStrings(locale);
  const titleId = `work-${item.id}-title`;

  return (
    <Card
      className={cn(
        "group/card h-full gap-5 overflow-hidden border-border/70 bg-card/80 py-0 pb-6 transition-colors hover:border-primary/40 focus-within:border-primary/40",
        className
      )}
    >
      <WorkThumb
        src={item.thumb}
        alt={fill(t.screenshotAlt, { title: item.title })}
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="rounded-none border-0 border-b border-border/70"
        imageClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover/card:scale-[1.03]"
      >
        {!item.thumb && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-dots font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span className="rounded-md border border-border/70 bg-card/80 px-2.5 py-1 text-foreground/80">
              {kindLabel[item.kind]}
            </span>
            <span>{t.previewPending}</span>
          </div>
        )}
      </WorkThumb>

      <CardHeader className="gap-3">
        <WorkBadgeRow item={item} locale={locale} />
        <h4
          id={titleId}
          className="text-lg leading-snug font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-xl"
        >
          {item.title}
        </h4>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
        <WorkStackChips stack={item.stack} locale={locale} />
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild variant="ghost" size="sm" className="-ml-2.5">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {t.openSite}
            {/* The title is part of the name, so links to different sites never share one. */}
            <span className="sr-only">: {item.title}</span>
            <ExternalLink aria-hidden="true" className="opacity-70" />
            <span className="sr-only"> {t.newTabHint}</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface WorkCardGridProps {
  /** Id of the group heading; the list is labelled by it. Unique per page. */
  id: string;
  heading: string;
  description: string;
  items: WorkItem[];
  locale: Locale;
  className?: string;
}

/**
 * One h3 group of work cards: heading, description, and a 1 / 2 / 3 column
 * grid of WorkCard in the given order. Renders nothing for an empty list so
 * the section keeps its rhythm when a group has no items yet.
 */
export function WorkCardGrid({ id, heading, description, items, locale, className }: WorkCardGridProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("min-w-0", className)}>
      <Reveal>
        <div className="max-w-3xl">
          <h3 id={id} className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {heading}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
        </div>
      </Reveal>

      <ul aria-labelledby={id} className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.id} className="min-w-0">
            <Reveal index={i} step={0.06} className="h-full">
              <WorkCard item={item} locale={locale} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
