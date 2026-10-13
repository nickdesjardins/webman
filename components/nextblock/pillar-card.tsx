import Image from "next/image";
import {
  Bot,
  Gauge,
  Layers,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { PillarBullets } from "@/components/nextblock/pillar-bullets";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Nextblock, NextblockPillar } from "@/data/nextblock";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const pillarIcons: Record<NextblockPillar["lucide"], LucideIcon> = {
  layers: Layers,
  "shield-check": ShieldCheck,
  bot: Bot,
  "shopping-cart": ShoppingCart,
  rocket: Rocket,
  gauge: Gauge,
};

interface PillarCardProps {
  pillar: NextblockPillar;
  /** Zero-based position in the grid, shown as a mono numeral. */
  index: number;
  locale: Locale;
  /** Lighthouse report, rendered only by the performance pillar. */
  lighthouse?: Nextblock["lighthouse"];
  className?: string;
}

/**
 * One capability pillar. Server Component; the only client leaf is the
 * bullet disclosure, which receives the locale as a prop.
 */
export function PillarCard({ pillar, index, locale, lighthouse, className }: PillarCardProps) {
  const Icon = pillarIcons[pillar.lucide];
  const titleId = `nextblock-pillar-${pillar.id}`;

  return (
    <Card
      className={cn(
        "h-full gap-5 border-border/70 bg-card/80 transition-colors hover:border-primary/40",
        className
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span aria-hidden="true" className="font-mono text-xs tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{pillar.kicker}</p>
        <h3 id={titleId} className="text-lg font-semibold tracking-tight text-foreground">
          {pillar.title}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>

        {lighthouse && (
          <figure className="min-w-0">
            <div className="overflow-hidden rounded-lg border border-border/70 bg-background/40">
              <Image
                src={lighthouse.src}
                alt={lighthouse.alt}
                width={lighthouse.width}
                height={lighthouse.height}
                sizes="(min-width: 1280px) 30vw, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-2 text-xs leading-snug text-muted-foreground">
              {lighthouse.caption}
            </figcaption>
          </figure>
        )}

        <PillarBullets bullets={pillar.bullets} title={pillar.title} locale={locale} />
      </CardContent>
    </Card>
  );
}

export default PillarCard;
