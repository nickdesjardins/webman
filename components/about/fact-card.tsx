import { BarChart3, GraduationCap, Headset, ShieldCheck, type LucideIcon } from "lucide-react";
import type { FactCard as FactCardData } from "@/data/about";
import type { Locale } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/about/count-up";
import { LiveHours } from "@/components/about/live-hours";
import { aboutStrings, localizeSuffix } from "@/components/about/strings";
import { cn } from "@/lib/utils";

const FACT_ICONS: Record<FactCardData["icon"], LucideIcon> = {
  graduation: GraduationCap,
  headset: Headset,
  shield: ShieldCheck,
  "bar-chart": BarChart3,
};

interface FactCardProps {
  fact: FactCardData;
  locale: Locale;
  /** Epoch milliseconds of `site.businessOpened`, consumed by the live hours counter. */
  openedAt: number;
  className?: string;
}

interface FactValueProps {
  fact: FactCardData;
  locale: Locale;
  openedAt: number;
}

function FactValue({ fact, locale, openedAt }: FactValueProps) {
  if (fact.live === "hours-since-business-opened") {
    return <LiveHours locale={locale} openedAt={openedAt} />;
  }
  if (typeof fact.value === "number") {
    return (
      <CountUp
        value={fact.value}
        locale={locale}
        decimals={fact.decimals}
        prefix={fact.prefix}
        suffix={localizeSuffix(fact.suffix, locale)}
      />
    );
  }
  return null;
}

/**
 * One "Unvarnished Truth" statistic: icon, big mono value, label, and the
 * methodology that keeps the number honest. Server Component; only the
 * animated value (CountUp or LiveHours) crosses into the client bundle.
 */
export function FactCard({ fact, locale, openedAt, className }: FactCardProps) {
  const Icon = FACT_ICONS[fact.icon];
  const isLive = Boolean(fact.live);
  const t = aboutStrings(locale);

  return (
    <Card className={cn("h-full gap-0 py-0", className)}>
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary"
            aria-hidden="true"
          >
            <Icon className="size-4" />
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-success">
              <span
                className="size-1.5 rounded-full bg-success animate-pulse motion-reduce:animate-none"
                aria-hidden="true"
              />
              {t.live}
            </span>
          )}
        </div>

        <p className="mt-5 font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          <FactValue fact={fact} locale={locale} openedAt={openedAt} />
        </p>

        <p className="mt-2 text-sm font-medium leading-snug text-foreground">{fact.label}</p>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{fact.methodology}</p>
      </CardContent>
    </Card>
  );
}

export default FactCard;
