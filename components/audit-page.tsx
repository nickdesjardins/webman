"use client";

import { ArrowLeft, ArrowRight, BookOpen, Check, FileText, Mail, Tag } from "lucide-react";

import { AuditFileViewer } from "@/components/audit/file-viewer";
import { AuditLinkButton } from "@/components/audit/link-button";
import { AuditPillarGrid } from "@/components/audit/pillar-grid";
import { AuditReferenceList } from "@/components/audit/reference-list";
import { auditStrings } from "@/components/audit/strings";
import { useLocale } from "@/components/locale-provider";
import { StatusDot, projectLabelClass } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const h2Class = "text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl";

/**
 * Body of /projects/applied-ai-audit (and /fr/projects/applied-ai-audit), the
 * open-source audit toolkit. A client component that reads the live locale,
 * like the project pages, so the header switch swaps the whole page
 * instantly; it is still fully server-rendered for crawlers.
 */
export function AuditPage() {
  const locale = useLocale();
  const t = auditStrings(locale);
  const { audit, projects, site } = getContent(locale);
  const home = localePath(locale, "/");
  const next = projects.find((p) => p.status === "live" && p.slug === audit.references.items[0]?.slug);

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
            <li>
              <a href={`${home}#projects`} className="transition-colors hover:text-foreground">
                {t.projects}
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {audit.plainTitle}
            </li>
          </ol>
        </nav>

        <header className="mt-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Badge
              variant="outline"
              className="max-w-full gap-2 py-1 pr-3 pl-2 font-mono text-[11px] font-medium tracking-wider whitespace-normal uppercase"
            >
              <StatusDot tone="success" />
              {audit.statusLabel}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{audit.released}</span>
          </div>
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground sm:text-6xl">
            {audit.plainTitle}
          </h1>
          <p className="mt-3 font-mono text-sm text-primary [overflow-wrap:anywhere]">{audit.title}</p>
          <p className="mt-6 text-lg leading-relaxed text-foreground/90 sm:text-xl">{audit.summary}</p>

          <ul aria-label={t.links} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <li>
              <AuditLinkButton
                href={audit.links.repo.href}
                label={audit.links.repo.label}
                icon="github"
                newTabHint={t.newTabHint}
                variant="default"
              />
            </li>
            <li>
              <AuditLinkButton
                href={audit.links.release.href}
                label={audit.links.release.label}
                icon={Tag}
                newTabHint={t.newTabHint}
              />
            </li>
            <li>
              <AuditLinkButton
                href={audit.links.raw.href}
                label={audit.links.raw.label}
                icon={FileText}
                newTabHint={t.newTabHint}
              />
            </li>
            <li>
              <AuditLinkButton
                href={audit.links.readme.href}
                label={audit.links.readme.label}
                icon={BookOpen}
                newTabHint={t.newTabHint}
              />
            </li>
          </ul>
        </header>

        <section aria-labelledby="audit-install-heading" className="mt-16 sm:mt-20">
          <div className="max-w-3xl">
            <h2 id="audit-install-heading" className={h2Class}>
              {audit.viewer.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{audit.viewer.intro}</p>
          </div>
          <div className="card-glow mt-8 min-w-0 rounded-2xl p-4 sm:p-6 lg:p-8">
            <AuditFileViewer audit={audit} locale={locale} />
          </div>
        </section>

        <section aria-labelledby="audit-problem-heading" className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-5">
            <h2 id="audit-problem-heading" className={projectLabelClass}>
              {audit.problemTitle}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/90 sm:text-lg">{audit.problem}</p>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <h2 className={projectLabelClass}>{audit.output.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/90">{audit.output.intro}</p>
            <ol className="mt-4 grid gap-3">
              {audit.output.items.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border/70 bg-background/40 p-4">
                  <span className="font-mono text-xs font-medium leading-6 text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">{item}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="min-w-0">{audit.output.closing}</span>
            </p>
          </div>
        </section>

        <section aria-labelledby="audit-pillars-heading" className="mt-16 sm:mt-20">
          <div className="max-w-3xl">
            <h2 id="audit-pillars-heading" className={h2Class}>
              {audit.pillarsTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{audit.pillarsIntro}</p>
            {audit.promptNote && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{audit.promptNote}</p>
            )}
          </div>
          <div className="mt-8">
            <AuditPillarGrid audit={audit} locale={locale} />
          </div>
        </section>

        <section aria-labelledby="audit-references-heading" className="mt-16 sm:mt-20">
          <div className="max-w-3xl">
            <h2 id="audit-references-heading" className={h2Class}>
              {audit.references.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{audit.references.intro}</p>
          </div>
          <div className="mt-8">
            <AuditReferenceList audit={audit} projects={projects} locale={locale} />
          </div>
        </section>

        <section
          aria-labelledby="audit-proportionality-heading"
          className="card-glow mt-16 grid gap-8 rounded-2xl p-6 sm:mt-20 sm:p-8 lg:grid-cols-12 lg:gap-12"
        >
          <div className="min-w-0 lg:col-span-5">
            <h2
              id="audit-proportionality-heading"
              className="text-2xl font-semibold tracking-tight text-balance text-foreground"
            >
              {audit.proportionality.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{audit.proportionality.body}</p>
          </div>
          <ul className="grid min-w-0 gap-4 sm:grid-cols-2 lg:col-span-7">
            {audit.proportionality.tiers.map((tier, index) => (
              <li key={tier.label} className="rounded-xl border border-border/70 bg-background/40 p-5">
                <p
                  lang="en"
                  className={cn(
                    "font-mono text-xs font-medium tracking-[0.18em] uppercase",
                    index === 0 ? "text-success" : "text-warning"
                  )}
                >
                  {tier.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{tier.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="card-glow mt-16 grid gap-6 rounded-2xl p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{audit.cta.title}</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{audit.cta.body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <a href={`${home}#contact`}>
                {audit.cta.contact}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`mailto:${site.email}`}>
                <Mail aria-hidden="true" />
                {audit.cta.email}
              </a>
            </Button>
          </div>
        </aside>

        <nav className="mt-12 flex flex-col justify-between gap-4 border-t border-border/70 pt-8 sm:flex-row">
          <a
            href={`${home}#projects`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {audit.nav.back}
          </a>
          {next && (
            <a
              href={localePath(locale, `/projects/${next.slug}`)}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {audit.nav.next}: {next.plainTitle}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </nav>
      </div>
    </main>
  );
}

export default AuditPage;
