"use client";

import dynamic from "next/dynamic";
import { heroStrings } from "@/components/hero/strings";
import { useWhenIdle } from "@/components/hero/use-media";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

/** Fixed body height keeps layout stable between skeleton and simulation. */
const BODY_HEIGHT = "h-[460px] lg:h-[500px]";

function SimSkeleton() {
  return (
    <div aria-hidden className="relative h-full w-full bg-dots">
      <div className="flex items-center gap-1.5 border-b border-border/50 px-2 py-2">
        {[64, 84, 104, 96].map((width, index) => (
          <span
            key={index}
            className="h-6 animate-pulse rounded-md border border-border/50 bg-card/60"
            style={{ width, animationDelay: `${index * 90}ms` }}
          />
        ))}
      </div>
      <div className="absolute inset-x-[6%] top-[42%] flex items-center justify-between">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className="size-[30px] animate-pulse rounded-lg border border-border/60 bg-card/60 sm:size-9 lg:size-10"
            style={{ animationDelay: `${index * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

const PipelineSim = dynamic(() => import("@/components/hero/pipeline-sim"), {
  ssr: false,
  loading: () => <SimSkeleton />,
});

/**
 * Client boundary for the hero visual. The glass frame and caption render on
 * the server; the simulation (and Three.js behind it) is fetched only once the
 * page has loaded and gone idle, or at the first interaction, so its script
 * never competes with first paint and hydration. The skeleton holds the exact
 * same box meanwhile.
 */
export function HeroAiCanvas({ className }: { className?: string }) {
  const locale = useLocale();
  const t = heroStrings(locale);
  const simReady = useWhenIdle(500);

  return (
    <div className={cn("glass relative w-full min-w-0 overflow-hidden rounded-2xl border shadow-2xl", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="flex shrink-0 items-center gap-2">
          <span aria-hidden className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          {t.live}
        </span>
        <span className="truncate">{t.caption}</span>
      </div>
      <div className={cn("relative", BODY_HEIGHT)}>{simReady ? <PipelineSim /> : <SimSkeleton />}</div>
    </div>
  );
}

export default HeroAiCanvas;
