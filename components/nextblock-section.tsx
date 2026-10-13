"use client";

import { useLocale } from "@/components/locale-provider";
import { ExternalLink, Globe } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { Reveal } from "@/components/motion/reveal";
import { ArchitectureDiagram } from "@/components/nextblock/architecture-diagram";
import { InstallCommand } from "@/components/nextblock/install-command";
import { MetricStrip } from "@/components/nextblock/metric-strip";
import { PillarGrid } from "@/components/nextblock/pillar-grid";
import { ProofList } from "@/components/nextblock/proof-list";
import { nextblockStrings, type NextblockStrings } from "@/components/nextblock/strings";
import { nextblockLabelClass } from "@/components/nextblock/styles";
import { TimelineStrip } from "@/components/nextblock/timeline-strip";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NextblockContent } from "@/data/nextblock";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const STACK_HEADING_ID = "nextblock-stack-heading";

/* ------------------------------------------------------------------ */
/* Section chrome                                                      */
/* ------------------------------------------------------------------ */

/** Soft radial primary glow behind the intro row. Paints under the content. */
function FlagshipGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] overflow-hidden"
    >
      <div className="absolute top-[-18rem] left-1/2 h-[44rem] w-[88rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_70%)] opacity-30" />
    </div>
  );
}

/** Mono product label level with the title line, lg and up only. It sits below the eyebrow so an anchor jump never parks it under the fixed availability pill. */
function ProductLabel({ version }: { version: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-40 hidden lg:block">
      <div className="container-site flex justify-end">
        <span className="font-mono text-xs leading-4 tracking-wide text-muted-foreground">
          nextblock.dev · v{version}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Intro row                                                           */
/* ------------------------------------------------------------------ */

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-6 gap-y-0.5 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80 sm:pt-px">
        {label}
      </dt>
      <dd className="text-foreground/90 [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

interface IntroCopyProps {
  nextblock: NextblockContent;
  locale: Locale;
  t: NextblockStrings;
}

function IntroCopy({ nextblock, locale, t }: IntroCopyProps) {
  const { links } = nextblock;

  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-success" />
        {nextblock.role}
      </p>

      <p className="mt-4 text-lg font-medium leading-snug text-foreground sm:text-xl">
        {nextblock.tagline}
      </p>

      <div className="mt-5 space-y-4">
        {nextblock.thesis.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      <dl className="mt-6 space-y-2 font-mono text-xs">
        <MetaRow label={t.version}>v{nextblock.version}</MetaRow>
        <MetaRow label={t.license}>{nextblock.license}</MetaRow>
        <MetaRow label={t.since}>{nextblock.since}</MetaRow>
      </dl>

      <InstallCommand command={nextblock.install} locale={locale} className="mt-6" />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild className="w-full sm:w-auto">
          <a href={links.sandbox.href} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" />
            {links.sandbox.label}
            <span className="sr-only">{t.newTabHint}</span>
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a href={links.repo.href} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true" className="inline-flex shrink-0">
              <BrandIcon icon="siGithub" label="GitHub" className="size-4" />
            </span>
            {links.repo.label}
            <span className="sr-only">{t.newTabHint}</span>
          </a>
        </Button>
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <a href={links.site.href} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" />
            {links.site.label}
            <span className="sr-only">{t.newTabHint}</span>
          </a>
        </Button>
      </div>

      <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
        {links.sandbox.note}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */

function StackList({ stack, t }: { stack: readonly string[]; t: NextblockStrings }) {
  return (
    <div>
      <h3 id={STACK_HEADING_ID} className={nextblockLabelClass}>
        {t.stack}
      </h3>
      <ul aria-labelledby={STACK_HEADING_ID} className="mt-4 flex flex-wrap gap-1.5">
        {stack.map((item) => (
          <li key={item}>
            <Badge variant="secondary" className="font-mono text-xs font-normal">
              {item}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer bar                                                          */
/* ------------------------------------------------------------------ */

function FooterBar({ links, t }: { links: NextblockContent["links"]; t: NextblockStrings }) {
  const footerLinks = [links.docs, links.npm, links.mcp];

  return (
    <div className="card-glow flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {t.footer}
      </p>
      <ul className="flex flex-wrap gap-2">
        {footerLinks.map((link) => (
          <li key={link.href} className="min-w-0 max-w-full">
            <Badge
              asChild
              variant="outline"
              className="max-w-full gap-1.5 py-1 pr-2.5 pl-3 whitespace-normal font-mono text-[11px] font-normal [overflow-wrap:anywhere]"
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <ExternalLink aria-hidden="true" className="shrink-0 opacity-70" />
                <span className="sr-only">{t.newTabHint}</span>
              </a>
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/**
 * Flagship product section. Server Component: the only client leaves are the
 * install command copy button and the pillar bullet disclosures, which receive
 * the locale as a prop. Product copy comes from getContent(locale).nextblock;
 * UI chrome comes from components/nextblock/strings.ts.
 */
export function NextblockSection() {
  const locale = useLocale();
  const { nextblock } = getContent(locale);
  const t = nextblockStrings(locale);

  return (
    <Section
      id="nextblock"
      eyebrow={nextblock.eyebrow}
      title={nextblock.heading}
      description={nextblock.positioning}
      grid
      className="border-t border-border/60"
    >
      <FlagshipGlow />
      <ProductLabel version={nextblock.version} />

      {/* Intro: narrative and install path on the left, architecture on the right. */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <IntroCopy nextblock={nextblock} locale={locale} t={t} />
        </Reveal>
        <Reveal index={1} className="min-w-0 lg:col-span-5">
          <ArchitectureDiagram layers={nextblock.architecture} locale={locale} />
        </Reveal>
      </div>

      <Reveal className="mt-14 lg:mt-16">
        <MetricStrip metrics={nextblock.metrics} locale={locale} />
      </Reveal>

      <PillarGrid
        pillars={nextblock.pillars}
        lighthouse={nextblock.lighthouse}
        locale={locale}
        className="mt-14 lg:mt-16"
      />

      {/* Proof row: stack and timeline on the left, skill evidence on the right. */}
      <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="min-w-0 space-y-8 lg:col-span-5">
          <StackList stack={nextblock.stack} t={t} />
          <TimelineStrip timeline={nextblock.timeline} locale={locale} />
        </Reveal>
        <Reveal index={1} className="min-w-0 lg:col-span-7">
          <ProofList proves={nextblock.proves} locale={locale} />
        </Reveal>
      </div>

      <Reveal className="mt-14 lg:mt-16">
        <FooterBar links={nextblock.links} t={t} />
      </Reveal>
    </Section>
  );
}

export default NextblockSection;
