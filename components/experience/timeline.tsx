import type { ExperienceItem } from "@/data/experience";
import type { Locale } from "@/lib/i18n";
import { TimelineItem } from "@/components/experience/timeline-item";
import { experienceStrings } from "@/components/experience/strings";

interface TimelineProps {
  items: ExperienceItem[];
  locale: Locale;
}

/**
 * Vertical career rail. Items render in data order; the rail fades out
 * below the last entry.
 */
export function Timeline({ items, locale }: TimelineProps) {
  const t = experienceStrings(locale);

  return (
    <ol
      className="relative ml-4 border-l border-border after:pointer-events-none after:absolute after:bottom-0 after:-left-px after:h-24 after:w-px after:bg-linear-to-b after:from-transparent after:to-background sm:ml-5"
      aria-label={t.timelineLabel}
    >
      {items.map((item, index) => (
        <TimelineItem key={item.id} item={item} index={index} locale={locale} />
      ))}
    </ol>
  );
}
