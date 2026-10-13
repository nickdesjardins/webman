"use client";

import { useLocale } from "@/components/locale-provider";
import type { ExperienceItem } from "@/data/experience";
import { getContent } from "@/lib/content";
import { Section } from "@/components/section";
import { Reveal } from "@/components/motion/reveal";
import { Timeline } from "@/components/experience/timeline";
import { ResumeCard } from "@/components/experience/resume-card";
import { EducationCard } from "@/components/experience/education-card";
import { GlanceCard } from "@/components/experience/glance-card";
import { experienceStrings } from "@/components/experience/strings";

/** Fallback start year of the current role, used only if the data entry is missing. */
const NEW_ROOTS_START_YEAR = 2018;

/** Start year of the current role, read from the `new-roots-herbal` entry ("2018-11"). */
function currentRoleStartYear(items: ExperienceItem[]): number {
  const entry = items.find((item) => item.id === "new-roots-herbal");
  const year = entry ? Number.parseInt(entry.start.slice(0, 4), 10) : Number.NaN;
  return Number.isFinite(year) ? year : NEW_ROOTS_START_YEAR;
}

/**
 * "Experience & Career Evolution" section. Server Component: the year count
 * is evaluated once at build time during static prerender. `locale` arrives
 * from app/[locale]/page.tsx.
 */
export function ExperienceSection() {
  const locale = useLocale();
  const { experience, education, careerSummary } = getContent(locale).experience;
  const t = experienceStrings(locale);
  const yearsAtCurrent = new Date().getFullYear() - currentRoleStartYear(experience);

  return (
    <Section
      id="experience"
      eyebrow={t.eyebrow}
      title={careerSummary.heading}
      description={careerSummary.body}
      grid
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <Timeline items={experience} locale={locale} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start" aria-label={t.asideLabel}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <Reveal className="sm:col-span-2 lg:col-span-1">
              <ResumeCard locale={locale} />
            </Reveal>
            <Reveal index={1}>
              <EducationCard items={education} locale={locale} />
            </Reveal>
            <Reveal index={2}>
              <GlanceCard roles={experience.length} yearsAtCurrent={yearsAtCurrent} locale={locale} />
            </Reveal>
          </div>
        </aside>
      </div>
    </Section>
  );
}

export default ExperienceSection;
