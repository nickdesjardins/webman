"use client";

import { ArrowRight } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { getContent } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Same CSS-only entrance as the hero blocks (tw-animate-css), one beat after
 * the proof row: the hero's cascade runs 0/150/200/300/500, this lands at 700.
 * Duplicated rather than exported from hero.tsx so that file stays untouched.
 */
const ENTER =
  "animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out fill-mode-both delay-700 motion-reduce:animate-none";

/**
 * House link pattern (text-primary plus ArrowRight, as in services-section).
 * py-3.5 lifts the 20px line to a 48px tap target. The links often wrap to
 * two rows even at lg (French does at 1280px), so the slimmer row is limited
 * to mouse-driven screens: a large tablet keeps the 48px targets.
 */
const doorClass =
  "group inline-flex max-w-full items-center gap-1.5 rounded-md py-3.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 lg:pointer-fine:py-1.5";

const arrowClass = "size-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none";

/**
 * Slim band under the hero for the two readers who skip technical terms: a
 * business owner and a recruiter. One sentence says what the plain-words page
 * holds; two question-first links open it or jump to the experience section.
 * A sibling of the hero, never a child, so the first fold's geometry does not
 * change, and outside Section so it is neither deferred nor lazily hydrated
 * (it is a dozen static nodes). On lg+ it reuses the hero grid (5/7 columns,
 * same gaps) so the links column starts where the simulator column starts.
 */
export function PlainWordsStrip() {
  const locale = useLocale();
  const { site, automation } = getContent(locale);
  const { doors } = site;

  return (
    <div className="container-site">
      <div
        className={cn(
          ENTER,
          "flex flex-col gap-4 border-t border-border/70 py-5 sm:py-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14"
        )}
      >
        <div className="min-w-0 lg:col-span-5">
          <p className="font-mono text-xs font-medium tracking-[0.2em] text-primary uppercase">{doors.eyebrow}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/85 sm:text-base">{doors.lead}</p>
        </div>

        {/* The landmark wraps only the links; the sentence above is prose, not navigation. */}
        <nav aria-label={doors.ariaLabel} className="min-w-0 lg:col-span-7">
          <ul className="flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1">
            <li>
              <a href={localePath(locale, automation.path)} className={doorClass}>
                <span>{doors.business}</span>
                <ArrowRight aria-hidden="true" className={arrowClass} />
              </a>
            </li>
            <li>
              {/* Only rendered on the home page, so a bare hash keeps the edition URL clean. */}
              <a href="#experience" className={doorClass}>
                <span>{doors.hiring}</span>
                <ArrowRight aria-hidden="true" className={arrowClass} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default PlainWordsStrip;
