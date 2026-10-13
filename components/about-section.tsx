"use client";

import { useLocale } from "@/components/locale-provider";
import Image from "next/image";
import {
  Briefcase,
  Code2,
  Cpu,
  Crown,
  Dices,
  Flame,
  ServerCog,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { getContent, type Content } from "@/lib/content";
import { Section } from "@/components/section";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { UnvarnishedTruth } from "@/components/unvarnished-truth";
import { aboutStrings, fill, type AboutStrings } from "@/components/about/strings";

/** Icons for `about.outside.items`, matched by position. */
const OUTSIDE_ICONS: LucideIcon[] = [Dices, Flame, Crown, Cpu];

interface Milestone {
  id: string;
  icon: LucideIcon;
  label: string;
}

/**
 * "Since" chips. Every year comes from the data modules; the wording comes
 * from the locale dictionary. Years are rendered as plain digits on purpose
 * (fr-CA would otherwise group "2004" as "2 004").
 */
function buildMilestones(content: Content, t: AboutStrings): Milestone[] {
  const newRoots = content.experience.experience.find((item) => item.id === "new-roots-herbal");
  const newRootsYear = newRoots ? Number.parseInt(newRoots.start.slice(0, 4), 10) : Number.NaN;

  const milestones: Milestone[] = [
    { id: "web", icon: Code2, label: fill(t.sinceWeb, { year: content.site.founded }) },
    {
      id: "business",
      icon: Briefcase,
      label: fill(t.sinceBusiness, { year: content.site.businessOpened.getFullYear() }),
    },
  ];

  if (Number.isFinite(newRootsYear)) {
    milestones.push({
      id: "production",
      icon: ServerCog,
      label: fill(t.sinceProduction, { year: newRootsYear }),
    });
  }

  return milestones;
}

/**
 * About: the one section allowed a sense of humour. Photo, intro, the
 * Unvarnished Truth fact grid, and life outside terminal windows.
 * Server Component; `locale` arrives from app/[locale]/page.tsx.
 */
export function AboutSection() {
  const locale = useLocale();
  const content = getContent(locale);
  const { about } = content.about;
  const t = aboutStrings(locale);
  const milestones = buildMilestones(content, t);

  return (
    <Section id="about" eyebrow={about.eyebrow} title={about.heading}>
      {/* Row 1: photo + intro */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <figure className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="card-glow rounded-[1.75rem] p-2">
              <Image
                src={about.photo.src}
                alt={about.photo.alt}
                width={600}
                height={600}
                sizes="(min-width: 1024px) 33vw, (min-width: 420px) 24rem, 100vw"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
              {about.photo.caption}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal index={1} className="flex flex-col justify-center lg:col-span-8">
          <div className="space-y-5">
            {about.intro.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "text-lg leading-relaxed text-foreground sm:text-xl"
                    : "text-lg leading-relaxed text-muted-foreground sm:text-xl"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label={t.milestonesLabel}>
            {milestones.map(({ id, icon: Icon, label }) => (
              <li key={id}>
                <Badge
                  variant="outline"
                  className="h-auto gap-1.5 rounded-md px-2.5 py-1 text-left font-mono text-xs font-normal whitespace-normal text-muted-foreground"
                >
                  <Icon className="text-primary" aria-hidden="true" />
                  {label}
                </Badge>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Row 2: the Unvarnished Truth */}
      <UnvarnishedTruth locale={locale} className="mt-16 lg:mt-20" />

      {/* Row 3: outside of terminal windows */}
      <div className="mt-16 lg:mt-20">
        <Reveal>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {about.outside.heading}
          </h3>
        </Reveal>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {about.outside.items.map((item, index) => {
            const Icon = OUTSIDE_ICONS[index] ?? Sparkles;
            return (
              <li key={item.label} className="min-w-0">
                <Reveal index={index} className="h-full">
                  <div className="flex h-full gap-4 rounded-xl border border-border bg-card p-5 sm:p-6">
                    <span
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary"
                      aria-hidden="true"
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

export default AboutSection;
