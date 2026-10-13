import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { FactCard } from "@/components/about/fact-card";
import { aboutStrings } from "@/components/about/strings";
import { cn } from "@/lib/utils";

interface UnvarnishedTruthProps {
  locale: Locale;
  className?: string;
}

/**
 * "The Unvarnished Truth": the fact-card grid with its methodology notes
 * and the real-world testing statement. Server Component: it reads the
 * locale bundle here so the data modules stay out of the client bundle;
 * only CountUp and LiveHours, two leaves below, run on the client.
 */
export function UnvarnishedTruth({ locale, className }: UnvarnishedTruthProps) {
  const content = getContent(locale);
  const { about, facts } = content.about;
  const openedAt = content.site.businessOpened.getTime();
  const t = aboutStrings(locale);

  return (
    <div className={cn(className)}>
      <Reveal>
        <div className="max-w-3xl">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {about.truth.heading}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {about.truth.body}
          </p>
        </div>
      </Reveal>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact, index) => (
          <li key={fact.id} className="min-w-0">
            <Reveal index={index} className="h-full">
              <FactCard fact={fact} locale={locale} openedAt={openedAt} />
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal index={facts.length} className="mt-10">
        <div className="border-l-2 border-primary pl-5 sm:pl-6">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {t.realWorldTesting}
          </p>
          <p className="mt-2 max-w-3xl text-lg font-medium leading-relaxed text-foreground">
            {about.truth.statement}
          </p>
        </div>
      </Reveal>
    </div>
  );
}

export default UnvarnishedTruth;
