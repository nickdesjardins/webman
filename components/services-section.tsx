"use client";

import { ArrowRight, BookOpen, FileText, Gauge, LayoutTemplate, Plug, Server, Workflow } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { useLocale } from "@/components/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { projectLabelClass } from "@/components/project-card";
import { Section } from "@/components/section";
import type { ServiceIcon, ServiceItem, ServiceStatus } from "@/data/services";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const SERVICE_ICONS: Record<ServiceIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  "file-text": FileText,
  "book-open": BookOpen,
  workflow: Workflow,
  gauge: Gauge,
  server: Server,
  layout: LayoutTemplate,
  plug: Plug,
};

export const SERVICE_STATUS_TONE: Record<ServiceStatus, string> = {
  measured: "border-success/35 bg-success/10 text-success",
  target: "border-warning/35 bg-warning/10 text-warning",
  record: "border-primary/35 bg-primary/10 text-primary",
};

/** "#projects" stays an in-page anchor; "/projects/x" gets the edition prefix ("/fr/projects/x"). */
function serviceHref(href: string, locale: Locale): string {
  return href.startsWith("#") ? href : localePath(locale, href);
}

function ServiceCard({ item, locale }: { item: ServiceItem; locale: Locale }) {
  const { intro } = getContent(locale).services;
  const Icon = SERVICE_ICONS[item.icon];
  const titleId = `service-${item.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="card-glow group flex h-full flex-col rounded-2xl p-6 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase",
            SERVICE_STATUS_TONE[item.status]
          )}
        >
          {intro.status[item.status]}
        </span>
      </div>

      <h3 id={titleId} className="mt-5 text-lg leading-snug font-semibold text-balance text-foreground">
        {item.problem}
      </h3>

      <dl className="mt-5 space-y-4">
        <div>
          <dt className={projectLabelClass}>{intro.termLabel}</dt>
          <dd className="mt-1.5 font-mono text-[13px] leading-relaxed text-primary/90">{item.term}</dd>
        </div>
        <div>
          <dt className={projectLabelClass}>{intro.proofLabel}</dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.proof}</dd>
        </div>
      </dl>

      <a
        href={serviceHref(item.href, locale)}
        className="mt-auto inline-flex items-center gap-1.5 self-start rounded-md pt-6 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        {intro.cta}
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        <span className="sr-only">: {item.problem}</span>
      </a>
    </article>
  );
}

/**
 * The plain-language door into the site: problems in a buyer's words, then
 * the technical name, then proof. Sits right after the hero so a recruiter
 * or a CEO who does not know the jargon can still find what they need.
 */
export function ServicesSection() {
  const locale = useLocale();
  const {
    services: { intro, items },
    automation,
  } = getContent(locale);

  return (
    <Section id="services" eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id} className="h-full">
            <Reveal index={index % 3} className="h-full">
              <ServiceCard item={item} locale={locale} />
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <a
          href={localePath(locale, automation.path)}
          className="group inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {intro.more}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </a>
      </p>
    </Section>
  );
}

export default ServicesSection;
