import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fill, workStrings } from "@/components/work/strings";
import { workBadgeClass } from "@/components/work/styles";
import type { WorkAttribution, WorkItem, WorkKind } from "@/data/work";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type WorkTone = "success" | "warning";

/**
 * Attribution tone follows the site's status semantics: employer work is amber
 * (owned elsewhere), independent work is emerald (live, mine).
 */
export const attributionTone: Record<WorkAttribution, WorkTone> = {
  employer: "warning",
  independent: "success",
};

interface ToneDotProps {
  tone: WorkTone;
  className?: string;
}

/** Small semantic dot. Decorative; the adjacent label carries the meaning. */
export function ToneDot({ tone, className }: ToneDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-2 shrink-0 rounded-full",
        tone === "success" ? "bg-success" : "bg-warning",
        className
      )}
    />
  );
}

interface AttributionBadgeProps {
  attribution: WorkAttribution;
  locale: Locale;
  className?: string;
}

/** Outline pill with a tone dot and the localized attribution label. */
export function AttributionBadge({ attribution: key, locale, className }: AttributionBadgeProps) {
  const { attribution } = getContent(locale).work;
  return (
    <Badge variant="outline" className={cn(workBadgeClass, className)}>
      <ToneDot tone={attributionTone[key]} />
      {attribution[key].label}
    </Badge>
  );
}

interface KindBadgeProps {
  kind: WorkKind;
  locale: Locale;
  className?: string;
}

/**
 * Outline pill naming the kind of work. Experiments are muted so they are not
 * mistaken for products.
 */
export function KindBadge({ kind, locale, className }: KindBadgeProps) {
  const { kindLabel } = getContent(locale).work;
  const experiment = kind === "experiment";
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider",
        experiment && "border-border/60 bg-muted text-muted-foreground",
        className
      )}
    >
      {kindLabel[kind]}
    </Badge>
  );
}

interface LangBadgeProps {
  lang: string;
  locale: Locale;
  className?: string;
}

/** Secondary pill for bilingual properties, e.g. "EN / FR". */
export function LangBadge({ lang, locale, className }: LangBadgeProps) {
  const t = workStrings(locale);
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5 px-2.5 py-1 font-mono text-[11px] font-normal tracking-wide", className)}
    >
      <Languages aria-hidden="true" />
      <span className="sr-only">{t.languages} </span>
      {lang}
    </Badge>
  );
}

interface SinceBadgeProps {
  since: string;
  locale: Locale;
  className?: string;
}

/** Outline pill with the founding year of a business Nicolas owned. */
export function SinceBadge({ since, locale, className }: SinceBadgeProps) {
  const t = workStrings(locale);
  return (
    <Badge
      variant="outline"
      className={cn("px-2.5 py-1 font-mono text-[11px] font-normal tracking-wide text-muted-foreground", className)}
    >
      {fill(t.since, { year: since })}
    </Badge>
  );
}

interface WorkBadgeRowProps {
  item: WorkItem;
  locale: Locale;
  className?: string;
}

/** Kind, attribution, and optional language badges in one wrapping row. */
export function WorkBadgeRow({ item, locale, className }: WorkBadgeRowProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <KindBadge kind={item.kind} locale={locale} />
      <AttributionBadge attribution={item.attribution} locale={locale} />
      {item.lang && <LangBadge lang={item.lang} locale={locale} />}
      {item.since && <SinceBadge since={item.since} locale={locale} />}
    </div>
  );
}

interface WorkStackChipsProps {
  stack: string[];
  locale: Locale;
  className?: string;
}

/** Secondary mono chips for the stack list. */
export function WorkStackChips({ stack, locale, className }: WorkStackChipsProps) {
  const t = workStrings(locale);
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label={t.stack}>
      {stack.map((item) => (
        <li key={item}>
          <Badge variant="secondary" className="font-mono text-xs font-normal">
            {item}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
