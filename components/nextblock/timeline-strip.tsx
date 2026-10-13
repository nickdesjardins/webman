import { nextblockStrings } from "@/components/nextblock/strings";
import { nextblockLabelClass } from "@/components/nextblock/styles";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  when: string;
  what: string;
}

interface TimelineStripProps {
  timeline: readonly TimelineEntry[];
  locale: Locale;
  className?: string;
}

const HEADING_ID = "nextblock-timeline-heading";

/** Compact vertical timeline with a left rail. Server Component. */
export function TimelineStrip({ timeline, locale, className }: TimelineStripProps) {
  const t = nextblockStrings(locale);

  return (
    <div className={className}>
      <h3 id={HEADING_ID} className={nextblockLabelClass}>
        {t.timeline}
      </h3>
      <ol
        aria-labelledby={HEADING_ID}
        className={cn(
          "relative mt-4 flex flex-col gap-4 pl-6",
          "before:absolute before:top-2 before:bottom-2 before:left-[3.5px] before:w-px before:bg-border before:content-['']"
        )}
      >
        {timeline.map((entry) => (
          <li key={`${entry.when}-${entry.what}`} className="relative min-w-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-6 size-2 rounded-full bg-primary ring-4 ring-background"
            />
            <p className="font-mono text-xs text-primary">{entry.when}</p>
            <p className="mt-0.5 text-sm leading-snug text-foreground/90">{entry.what}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default TimelineStrip;
