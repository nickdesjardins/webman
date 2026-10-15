"use client";

import { ArrowRight, Check, Mail, MapPin } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { projectLabelClass } from "@/components/project-card";
import { SERVICE_ICONS, SERVICE_STATUS_TONE } from "@/components/services-section";
import { Button } from "@/components/ui/button";
import type { AutomationService } from "@/data/automation";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: { breadcrumb: "Breadcrumb", proof: "Proof" },
  fr: { breadcrumb: "Fil d'Ariane", proof: "Preuve" },
} satisfies Record<Locale, Record<string, string>>;

const h2Class = "text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl";

/** "/projects/x" gets the edition prefix; "#work" points at that section of the edition's home page. */
function proofHref(href: string, locale: Locale): string {
  return href.startsWith("#") ? `${localePath(locale, "/")}${href}` : localePath(locale, href);
}

function ServiceBlock({ item, locale }: { item: AutomationService; locale: Locale }) {
  const { automation, services } = getContent(locale);
  const t = STRINGS[locale];
  const Icon = SERVICE_ICONS[item.icon];
  const titleId = `automation-${item.id}`;

  return (
    <article aria-labelledby={titleId} className="card-glow flex h-full flex-col rounded-2xl p-6 sm:p-8">
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
          {services.intro.status[item.status]}
        </span>
      </div>

      <h3 id={titleId} className="mt-5 text-xl leading-snug font-semibold text-balance text-foreground">
        {item.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-foreground/85">{item.outcome}</p>

      <p className={cn(projectLabelClass, "mt-6")}>{automation.usesLabel}</p>
      <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        {item.uses.map((use) => (
          <li key={use} className="flex items-start gap-2">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{use}</span>
          </li>
        ))}
      </ul>

      <p className={cn(projectLabelClass, "mt-6")}>{t.proof}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.proof}</p>

      <a
        href={proofHref(item.href, locale)}
        className="group mt-auto inline-flex items-center gap-1.5 self-start rounded-md pt-6 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        {automation.proofCta}
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        <span className="sr-only">: {item.title}</span>
      </a>
    </article>
  );
}

/**
 * Body of /ai-automation (and /fr/ai-automation): the buyer-facing services
 * page. A client component that reads the live locale, like the home and
 * project pages, so the header switch stays instant; it is still fully
 * server-rendered, which is what crawlers read.
 */
export function AutomationPage() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const { automation: a, site } = getContent(locale);
  const home = localePath(locale, "/");

  return (
    <main id="main" className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-grid mask-fade-y" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-[40rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)] opacity-50"
      />

      <div className="container-site">
        <nav aria-label={t.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            <li>
              <a href={home} className="transition-colors hover:text-foreground">
                {site.name}
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {a.breadcrumb}
            </li>
          </ol>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">{a.eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground sm:text-6xl">
            {a.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/90 sm:text-xl">{a.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <a href={`${home}#contact`}>
                {a.cta.contact}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`mailto:${site.email}`}>
                <Mail aria-hidden="true" />
                {a.cta.email}
              </a>
            </Button>
          </div>
        </header>

        <section aria-labelledby="automation-services-heading" className="mt-20 sm:mt-24">
          <div className="max-w-3xl">
            <h2 id="automation-services-heading" className={h2Class}>
              {a.servicesTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{a.servicesIntro}</p>
          </div>
          <ul className="mt-10 grid gap-5 lg:grid-cols-2">
            {a.services.map((item) => (
              <li key={item.id} className="h-full">
                <ServiceBlock item={item} locale={locale} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="automation-connect-heading" className="mt-20 sm:mt-24">
          <div className="max-w-3xl">
            <h2 id="automation-connect-heading" className={h2Class}>
              {a.connectTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{a.connectIntro}</p>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {a.connectSteps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-border/70 bg-card/40 p-6">
                <span className="font-mono text-xs font-medium text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg leading-snug font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="automation-area-heading"
          className="card-glow mt-20 flex flex-col gap-5 rounded-2xl p-6 sm:mt-24 sm:flex-row sm:p-8"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
            <MapPin aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id="automation-area-heading" className="text-2xl font-semibold tracking-tight text-balance text-foreground">
              {a.areaTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">{a.areaBody}</p>
          </div>
        </section>

        <section aria-labelledby="automation-faq-heading" className="mt-20 sm:mt-24">
          <h2 id="automation-faq-heading" className={h2Class}>
            {a.faqTitle}
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            {a.faq.map((item) => (
              <div key={item.question} className="border-t border-border/70 pt-6">
                <h3 className="text-lg leading-snug font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="card-glow mt-20 grid gap-6 rounded-2xl p-6 sm:mt-24 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{a.cta.title}</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{a.cta.body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <a href={`${home}#contact`}>
                {a.cta.contact}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`mailto:${site.email}`}>
                <Mail aria-hidden="true" />
                {a.cta.email}
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default AutomationPage;
