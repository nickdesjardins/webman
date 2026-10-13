"use client";

import { useLocale } from "@/components/locale-provider";
import { ArrowRight } from "lucide-react";
import { HeroAiCanvas } from "@/components/hero-ai-canvas";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * CSS-only entrance so the hero never depends on hydration to become visible.
 * tw-animate-css utilities; disabled under prefers-reduced-motion.
 */
const ENTER =
  "animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out fill-mode-both motion-reduce:animate-none";

/**
 * Wraps `accent` (the one phrase allowed to carry the text gradient) where it
 * first occurs inside `text`. Falls back to plain text when the phrase is
 * absent, so a copy edit can never break the h1.
 */
function Heading({ text, accent }: { text: string; accent: string }) {
  const index = accent ? text.indexOf(accent) : -1;
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-gradient">{accent}</span>
      {text.slice(index + accent.length)}
    </>
  );
}

/**
 * First fold. Server-rendered copy from the locale's site data on the left,
 * the live extraction pipeline simulation (client, lazy) on the right. Owns
 * the page's only h1.
 */
export function Hero() {
  const locale = useLocale();
  const { hero } = getContent(locale).site;

  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className="relative isolate flex min-h-[calc(100dvh-4rem)] scroll-mt-24 items-center overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-y" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -z-10 size-[36rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)] opacity-60 lg:size-[46rem] lg:translate-x-1/5"
      />

      <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
        <div className="min-w-0 lg:col-span-5">
          <div className={cn(ENTER, "delay-0")}>
            <p className="flex items-start gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              <span aria-hidden className="relative mt-1 flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span className="min-w-0">{hero.eyebrow}</span>
            </p>
          </div>

          {/* The LCP element: slides in but is never painted at opacity 0. */}
          <h1
            id="overview-heading"
            className="mt-5 animate-in slide-in-from-bottom-2 text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground duration-700 ease-out fill-mode-both motion-reduce:animate-none sm:text-5xl lg:text-[3.25rem] xl:text-6xl"
          >
            <Heading text={hero.heading} accent={hero.headingAccent} />
          </h1>

          <div className={cn(ENTER, "delay-150")}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.subheading}
            </p>
          </div>

          <div className={cn(ENTER, "delay-300")}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="group">
                <a href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
              </Button>
            </div>
          </div>

          <div className={cn(ENTER, "delay-500")}>
            <ul className="mt-10 flex flex-wrap gap-3">
              {hero.proof.map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2"
                >
                  <span className="font-mono text-base font-semibold tabular-nums text-foreground">
                    {item.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative min-w-0 lg:col-span-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,var(--glow),transparent_70%)] opacity-50"
          />
          <div className={cn(ENTER, "delay-200")}>
            <HeroAiCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
