import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fill, workStrings } from "@/components/work/strings";
import { WorkBadgeRow, WorkStackChips } from "@/components/work/work-badges";
import { WorkThumb } from "@/components/work/work-thumb";
import type { WorkItem } from "@/data/work";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  item: WorkItem;
  locale: Locale;
  className?: string;
}

/** "newrootsherbal.com" from "https://newrootsherbal.com/", for the button label. */
function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Full-width feature card for the employer platform rebuild: thumbnail on the
 * left, badges, highlights, stack and the outbound link on the right.
 * Server Component.
 */
export function PlatformCard({ item, locale, className }: PlatformCardProps) {
  const t = workStrings(locale);
  const titleId = `work-${item.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "card-glow rounded-2xl p-5 shadow-[0_0_120px_-48px_var(--glow)] sm:p-8 lg:p-10",
        className
      )}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="min-w-0 lg:col-span-6">
          <WorkThumb
            src={item.thumb}
            alt={fill(t.screenshotAlt, { title: item.title })}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="shadow-lg shadow-background/40"
          />
        </div>

        <div className="min-w-0 lg:col-span-6">
          <WorkBadgeRow item={item} locale={locale} />

          <h3
            id={titleId}
            className="mt-5 text-2xl leading-tight font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-3xl"
          >
            {item.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{item.summary}</p>

          {item.highlights && item.highlights.length > 0 && (
            <ul className="mt-6 space-y-3" aria-label={t.highlights}>
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="min-w-0">{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          <WorkStackChips stack={item.stack} locale={locale} className="mt-6" />

          <Button asChild variant="outline" className="mt-8 w-full sm:w-auto">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" />
              {fill(t.visit, { host: hostnameOf(item.url) })}
              <span className="sr-only"> {t.newTabHint}</span>
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
