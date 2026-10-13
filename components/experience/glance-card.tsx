import { Briefcase, CalendarDays, Shield } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { experienceStrings, numberLocale } from "@/components/experience/strings";

interface GlanceCardProps {
  /** Number of roles on the timeline (experience.length). */
  roles: number;
  /** Years since the current role started; computed at build time by the section. */
  yearsAtCurrent: number;
  locale: Locale;
}

/**
 * Compact summary derived from the experience data. Values arrive as props
 * so this component stays free of date logic.
 */
export function GlanceCard({ roles, yearsAtCurrent, locale }: GlanceCardProps) {
  const t = experienceStrings(locale);
  const tag = numberLocale(locale);

  return (
    <Card className="gap-4 border-border/70 py-5 sm:py-6">
      <CardHeader className="grid-rows-1 px-5 sm:px-6">
        <h3 className="text-base font-semibold text-foreground">{t.atAGlance}</h3>
      </CardHeader>
      <CardContent className="px-5 sm:px-6">
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <Briefcase className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="font-mono font-semibold text-foreground">{roles.toLocaleString(tag)}</span>{" "}
              <span className="text-muted-foreground">{roles === 1 ? t.role : t.roles}</span>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="font-mono font-semibold text-foreground">
                {yearsAtCurrent.toLocaleString(tag)}
              </span>{" "}
              <span className="text-muted-foreground">{t.yearsAtNewRoots}</span>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <Shield className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="font-semibold text-foreground">{t.veteran}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
