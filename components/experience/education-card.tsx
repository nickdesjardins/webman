import { GraduationCap } from "lucide-react";

import type { EducationItem } from "@/data/experience";
import type { Locale } from "@/lib/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { experienceStrings } from "@/components/experience/strings";

interface EducationCardProps {
  items: EducationItem[];
  locale: Locale;
}

export function EducationCard({ items, locale }: EducationCardProps) {
  const t = experienceStrings(locale);

  return (
    <Card className="gap-4 border-border/70 py-5 sm:py-6">
      <CardHeader className="grid-rows-1 px-5 sm:px-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <GraduationCap className="size-4 shrink-0 text-primary" aria-hidden="true" />
          {t.education}
        </h3>
      </CardHeader>
      <CardContent className="px-5 sm:px-6">
        <ul className="divide-y divide-border/70">
          {items.map((item) => (
            <li key={item.id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold text-foreground">{item.degree}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.institution}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{item.period}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
