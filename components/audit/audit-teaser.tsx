"use client";

import { ArrowRight, SquareTerminal } from "lucide-react";
import { AuditLinkButton } from "@/components/audit/link-button";
import { auditStrings } from "@/components/audit/strings";
import { InstallCommand } from "@/components/nextblock/install-command";
import { projectLabelClass } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AuditContent } from "@/data/audit";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Home-page card for the applied-ai-audit toolkit, under the shipped
 * services. Deliberately not shaped like a service card: a dashed outline, a
 * terminal glyph instead of a live status dot, no metrics, and an aside
 * rather than an article, because it is a developer tool, not a fifth service.
 */
export function AuditTeaser({ audit, locale }: { audit: AuditContent; locale: Locale }) {
  const t = auditStrings(locale);
  const { teaser, links } = audit;
  const titleId = "applied-ai-audit-teaser-title";

  return (
    <aside
      aria-labelledby={titleId}
      className="rounded-2xl border border-dashed border-primary/30 bg-background/40 p-5 sm:p-6 lg:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
        <div className="min-w-0">
          <Badge
            variant="outline"
            className="max-w-full gap-2 py-1 pr-3 pl-2 font-mono text-[11px] font-medium tracking-wider whitespace-normal uppercase"
          >
            <SquareTerminal aria-hidden="true" className="size-3.5 text-primary" />
            {teaser.badge}
          </Badge>
          <h3 id={titleId} className="mt-4 text-xl leading-snug font-semibold tracking-tight text-foreground sm:text-2xl">
            {teaser.title}
          </h3>
          <p className="mt-1.5 font-mono text-xs text-muted-foreground">
            {audit.name} · v{audit.version} · {audit.license}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-base">{teaser.body}</p>
        </div>

        <div className="min-w-0">
          <p className={projectLabelClass}>{teaser.installLabel}</p>
          <InstallCommand command={teaser.install} locale={locale} className="mt-3" />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="group w-full sm:w-auto">
              <a href={localePath(locale, audit.path)}>
                {teaser.cta}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </a>
            </Button>
            <AuditLinkButton href={links.repo.href} label={links.repo.label} icon="github" newTabHint={t.newTabHint} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AuditTeaser;
