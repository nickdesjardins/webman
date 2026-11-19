import { ArrowRight } from "lucide-react";
import { auditStrings } from "@/components/audit/strings";
import { Badge } from "@/components/ui/badge";
import type { AuditContent } from "@/data/audit";
import type { Project } from "@/data/projects";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Pillars mapped to the four shipped services. Titles come from the project
 * data by slug, so a renamed case study never drifts here; an unknown slug is
 * skipped rather than linked.
 */
export function AuditReferenceList({
  audit,
  projects,
  locale,
}: {
  audit: AuditContent;
  projects: Project[];
  locale: Locale;
}) {
  const t = auditStrings(locale);
  const { references, pillars } = audit;

  return (
    <ul aria-label={t.referencesList} className="grid gap-4 lg:grid-cols-2">
      {references.items.map((item) => {
        const project = projects.find((p) => p.status === "live" && p.slug === item.slug);
        if (!project) return null;
        return (
          <li key={item.slug} className="flex h-full min-w-0 flex-col rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
            <ul aria-label={references.pillarsLabel} className="flex flex-wrap gap-1.5">
              {item.pillars.map((number) => {
                const pillar = pillars.find((p) => p.number === number);
                if (!pillar) return null;
                return (
                  <li key={number} className="min-w-0 max-w-full">
                    <Badge
                      variant="secondary"
                      className="max-w-full font-mono text-[11px] font-normal whitespace-normal"
                    >
                      <span aria-hidden="true">{number} · </span>
                      <span className="sr-only">
                        {t.pillar} {number}:{" "}
                      </span>
                      {pillar.short}
                    </Badge>
                  </li>
                );
              })}
            </ul>
            <h3 className="mt-4 text-lg leading-snug font-semibold text-foreground">{project.plainTitle}</h3>
            <p className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground">{project.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{item.look}</p>
            <a
              href={localePath(locale, `/projects/${project.slug}`)}
              className="group mt-auto inline-flex items-center gap-1.5 self-start rounded-md pt-5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {references.cta}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
              <span className="sr-only">: {project.plainTitle}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default AuditReferenceList;
