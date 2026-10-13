import { Reveal } from "@/components/motion/reveal";
import { PillarCard } from "@/components/nextblock/pillar-card";
import type { Nextblock, NextblockPillar } from "@/data/nextblock";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PillarGridProps {
  pillars: readonly NextblockPillar[];
  lighthouse: Nextblock["lighthouse"];
  locale: Locale;
  className?: string;
}

/** Six pillars: 1 column on phones, 2 at md, 3 at xl, revealed with a stagger. */
export function PillarGrid({ pillars, lighthouse, locale, className }: PillarGridProps) {
  return (
    <ul className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-3", className)}>
      {pillars.map((pillar, i) => (
        <li key={pillar.id} className="min-w-0">
          <Reveal index={i} className="h-full">
            <PillarCard
              pillar={pillar}
              index={i}
              locale={locale}
              lighthouse={pillar.id === "performance" ? lighthouse : undefined}
            />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default PillarGrid;
