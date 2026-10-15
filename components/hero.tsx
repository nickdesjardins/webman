"use client";

import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";

import { HeroAiCanvas } from "@/components/hero-ai-canvas";
import { useLocale } from "@/components/locale-provider";
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
 * Highlights `accent` (the one phrase allowed a marker stroke) where it first
 * occurs inside `text`. Falls back to plain text when the phrase is absent,
 * so a copy edit can never break the promise line.
 */
function PromiseLine({ text, accent }: { text: string; accent: string }) {
  const index = accent ? text.indexOf(accent) : -1;
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span className="box-decoration-clone bg-[linear-gradient(transparent_58%,oklch(0.86_0.13_195/0.28)_58%,oklch(0.80_0.17_155/0.28)_92%,transparent_92%)] text-foreground">
        {accent}
      </span>
      {text.slice(index + accent.length)}
    </>
  );
}

/** "Nicolas Desjardins" becomes ["Nicolas", "Desjardins"]; the last name carries the gradient. */
function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return [name, ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

/**
 * First fold, written for a recruiter or a CEO first: a face, the name, one
 * plain sentence about what he builds, the two actions they came for (see the
 * work, get the resume), availability, and three sourced numbers. The live
 * extraction simulation on the right shows the same promise working, with a
 * plain caption. Owns the page's only h1, which is the name: this page is
 * the entity home for "Nicolas Desjardins".
 */
export function Hero() {
  const locale = useLocale();
  const { site } = getContent(locale);
  const { hero, availability, links } = site;
  const [first, last] = splitName(site.name);

  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className="relative isolate flex min-h-[calc(100dvh-4rem)] scroll-mt-24 items-center overflow-hidden pt-24 pb-16 sm:pt-28 lg:pt-28 lg:pb-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-y" />
      {/* Two light sources: cool behind the simulation, a softer green one behind the name. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -z-10 size-[36rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)] opacity-60 lg:size-[46rem] lg:translate-x-1/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[18%] left-[-12rem] -z-10 size-[30rem] rounded-full bg-[radial-gradient(closest-side,oklch(0.80_0.17_155/0.16),transparent_70%)] lg:left-[-6rem]"
      />

      <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
        <div className="min-w-0 lg:col-span-5">
          {/* Identity: face, role, place */}
          <div className={cn(ENTER, "flex items-center gap-4")}>
            <div className="relative shrink-0">
              <div className="rounded-full bg-[conic-gradient(from_200deg,var(--primary),var(--success),var(--primary))] p-[2px] shadow-[0_0_40px_-8px_var(--glow)]">
                <Image
                  src="/img/me.avif"
                  alt={hero.portraitAlt}
                  width={160}
                  height={160}
                  sizes="(min-width: 640px) 72px, 60px"
                  priority
                  className="size-[60px] rounded-full border-2 border-background object-cover sm:size-[72px]"
                />
              </div>
              <span
                aria-hidden
                className="absolute right-0.5 bottom-0.5 flex size-3.5 rounded-full border-2 border-background bg-success"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">{hero.role}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{hero.place}</p>
            </div>
          </div>

          {/* The LCP element: slides in but is never painted at opacity 0. */}
          <h1
            id="overview-heading"
            className="mt-7 animate-in text-[3.25rem] leading-[0.95] font-semibold tracking-[-0.035em] text-foreground duration-700 ease-out fill-mode-both slide-in-from-bottom-2 motion-reduce:animate-none sm:text-7xl lg:text-[4.5rem] xl:text-[5.25rem]"
          >
            <span className="block">{first}</span>
            {/* The spans are blocks, so this space is invisible, but it keeps the heading's text "Nicolas Desjardins". */}
            {last && " "}
            {last && <span className="block text-gradient pb-1">{last}</span>}
          </h1>

          <div className={cn(ENTER, "delay-150")}>
            <p className="mt-6 max-w-xl text-xl leading-snug font-medium text-balance text-foreground/85 sm:text-2xl sm:leading-snug">
              <PromiseLine text={hero.promise} accent={hero.promiseAccent} />
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{hero.support}</p>
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
                <a href={links.resume} download={links.resumeFileName}>
                  <Download aria-hidden="true" />
                  {hero.resumeCta}
                </a>
              </Button>
            </div>

            <a
              href="#contact"
              className="mt-6 inline-flex items-start gap-2.5 rounded-md text-sm leading-snug text-success transition-colors hover:text-success/80"
            >
              <span aria-hidden className="relative mt-1.5 flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span>{availability.label}</span>
            </a>
          </div>

          <div className={cn(ENTER, "delay-500")}>
            <ul className="mt-9 grid grid-cols-3 border-y border-border/70">
              {hero.proof.map((item, index) => (
                <li
                  key={item.label}
                  className={cn("py-4 pr-3", index > 0 && "border-l border-border/70 pl-3 sm:pl-4")}
                >
                  <span className="block font-mono text-xl font-semibold tabular-nums text-foreground sm:text-2xl">
                    {item.value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-muted-foreground">{item.label}</span>
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
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1">
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">{hero.demoLabel}</p>
              <p className="text-sm text-muted-foreground">{hero.demoCaption}</p>
            </div>
            <HeroAiCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
