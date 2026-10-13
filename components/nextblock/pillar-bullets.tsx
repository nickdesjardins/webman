"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fill, nextblockStrings } from "@/components/nextblock/strings";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PillarBulletsProps {
  bullets: readonly string[];
  /** Pillar title, appended for screen readers so the toggle has context. */
  title: string;
  locale: Locale;
  /** How many bullets stay visible before the toggle. */
  initial?: number;
  className?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Bullet({ children }: { children: string }) {
  return (
    <div className="flex gap-3 pt-2.5 text-sm leading-relaxed text-foreground/90">
      <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 bg-primary" />
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
    </div>
  );
}

/**
 * Bullet list with a "Show N more" disclosure. The hidden bullets stay in the
 * same <ul> so the list is one list for assistive technology; each extra item
 * animates its own height so the spacing collapses with it. The locale arrives
 * as a prop from the owning Server Component.
 */
export function PillarBullets({
  bullets,
  title,
  locale,
  initial = 2,
  className,
}: PillarBulletsProps) {
  const t = nextblockStrings(locale);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const listId = useId();
  const visible = bullets.slice(0, initial);
  const hidden = bullets.slice(initial);

  return (
    <div className={className}>
      <ul id={listId} className="-mt-2.5">
        {visible.map((bullet) => (
          <li key={bullet}>
            <Bullet>{bullet}</Bullet>
          </li>
        ))}
        <AnimatePresence initial={false}>
          {open &&
            hidden.map((bullet, i) => (
              <motion.li
                key={bullet}
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={
                  reduce
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { height: 0, opacity: 0, transition: { duration: 0.2, ease: EASE } }
                }
                transition={{ duration: 0.26, ease: EASE, delay: reduce ? 0 : i * 0.04 }}
                className="overflow-hidden"
              >
                <Bullet>{bullet}</Bullet>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>

      {hidden.length > 0 && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md font-mono text-xs text-primary underline-offset-4 transition-colors hover:underline"
        >
          {open ? t.showLess : fill(t.showMore, { count: hidden.length })}
          <span className="sr-only">{fill(t.aboutTitle, { title })}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform motion-reduce:transition-none",
              open && "rotate-180"
            )}
          />
        </button>
      )}
    </div>
  );
}

export default PillarBullets;
