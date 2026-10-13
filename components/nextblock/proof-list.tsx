import { nextblockStrings } from "@/components/nextblock/strings";
import { nextblockLabelClass } from "@/components/nextblock/styles";
import type { SkillProof } from "@/data/nextblock";
import type { Locale } from "@/lib/i18n";

interface ProofListProps {
  proves: readonly SkillProof[];
  locale: Locale;
  className?: string;
}

const HEADING_ID = "nextblock-proves-heading";

/**
 * Skill to evidence map as a definition list: one hairline-separated row per
 * skill, two columns from sm up. Server Component.
 */
export function ProofList({ proves, locale, className }: ProofListProps) {
  const t = nextblockStrings(locale);

  return (
    <div className={className}>
      <h3 id={HEADING_ID} className={nextblockLabelClass}>
        {t.proves}
      </h3>
      <dl className="mt-4 divide-y divide-border/70 border-y border-border/70">
        {proves.map((proof) => (
          <div
            key={proof.skill}
            className="grid gap-1 py-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-6"
          >
            <dt className="font-medium leading-snug text-foreground">{proof.skill}</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">{proof.evidence}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default ProofList;
