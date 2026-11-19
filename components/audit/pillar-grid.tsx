import { auditStrings } from "@/components/audit/strings";
import { fill } from "@/components/nextblock/strings";
import type { AuditContent } from "@/data/audit";
import type { Locale } from "@/lib/i18n";

/**
 * The seven pillars: number, name, check count and one plain sentence each.
 * When the edition is a translation (it carries a promptNote), each card also
 * shows the pillar's heading as the English prompt writes it.
 */
export function AuditPillarGrid({ audit, locale }: { audit: AuditContent; locale: Locale }) {
  const t = auditStrings(locale);
  const translated = Boolean(audit.promptNote);

  return (
    <ol aria-label={t.pillarsList} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {audit.pillars.map((pillar) => (
        <li key={pillar.number} className="flex min-w-0 flex-col rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs font-medium text-primary">
              <span className="sr-only">{t.pillar} </span>
              {String(pillar.number).padStart(2, "0")}
            </span>
            <span className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              {fill(audit.checksLabel, { count: pillar.checks })}
            </span>
          </div>
          <h3 className="mt-3 text-lg leading-snug font-semibold text-balance text-foreground">{pillar.name}</h3>
          {translated && (
            <p lang="en" className="mt-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
              {pillar.heading}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.plain}</p>
        </li>
      ))}
    </ol>
  );
}

export default AuditPillarGrid;
