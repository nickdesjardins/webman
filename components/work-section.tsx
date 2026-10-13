"use client";

import { useLocale } from "@/components/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { AttributionLegend } from "@/components/work/attribution-legend";
import { CampaignMosaic } from "@/components/work/campaign-mosaic";
import { PlatformCard } from "@/components/work/platform-card";
import { workStrings } from "@/components/work/strings";
import { WorkCardGrid } from "@/components/work/work-card";
import { getContent } from "@/lib/content";

/**
 * Production web work, in four groups: the employer platform rebuild, employer
 * apps and internal tools, employer campaign microsites, and independent work.
 * Attribution is shown on every item and explained once in the legend under
 * the header. All copy comes from getContent(locale).work; the few UI strings
 * live in components/work/strings.ts.
 *
 * Server Component. Reveal is the only client leaf.
 */
export function WorkSection() {
  const locale = useLocale();
  const { workIntro, attribution, platform, employerAppsIntro, employerApps, campaigns, independent } =
    getContent(locale).work;
  const t = workStrings(locale);

  return (
    <Section
      id="work"
      eyebrow={workIntro.eyebrow}
      title={workIntro.heading}
      description={workIntro.description}
    >
      <Reveal>
        <AttributionLegend locale={locale} className="-mt-4 mb-10 lg:-mt-6 lg:mb-12" />
      </Reveal>

      <Reveal>
        <PlatformCard item={platform} locale={locale} />
      </Reveal>

      {/* <WorkCardGrid
        id="work-employer-apps-heading"
        heading={employerAppsIntro.heading}
        description={employerAppsIntro.description}
        items={employerApps}
        locale={locale}
        className="mt-14 lg:mt-16"
      /> */}

      <CampaignMosaic items={campaigns} locale={locale} className="mt-14 lg:mt-16" />

      <WorkCardGrid
        id="work-independent-heading"
        heading={t.independentHeading}
        description={attribution.independent.detail}
        items={independent}
        locale={locale}
        className="mt-14 lg:mt-16"
      />
    </Section>
  );
}

export default WorkSection;
