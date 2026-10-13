"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { numberLocale } from "@/components/about/strings";
import { cn } from "@/lib/utils";

interface CountUpProps {
  /** Final value. The animation always lands exactly on this number. */
  value: number;
  /** Drives the number format: en-CA renders "0.00", fr-CA renders "0,00". */
  locale: Locale;
  /** Fixed number of fraction digits, e.g. 2 renders 0 as "0.00". */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Animation length in milliseconds. */
  duration?: number;
  className?: string;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function format(n: number, decimals: number, locale: Locale) {
  return n.toLocaleString(numberLocale(locale), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Counts from 0 to `value` the first time the element is at least 40%
 * visible. Hydration-safe: server and client both render the formatted
 * zero state, and the animation starts only after mount.
 *
 * Reduced motion: jumps straight to the final value.
 * Screen readers: the animating text is aria-hidden; the final value is
 * exposed once through a visually hidden sibling.
 */
export function CountUp({
  value,
  locale,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || doneRef.current) return;

    let frame = 0;

    const finish = () => {
      doneRef.current = true;
      setCurrent(value);
    };

    const run = () => {
      if (doneRef.current) return;
      if (reduce) {
        finish();
        return;
      }
      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        if (progress >= 1) {
          finish();
          return;
        }
        setCurrent(value * easeOutCubic(progress));
        frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value, duration, reduce]);

  const finalText = `${prefix}${format(value, decimals, locale)}${suffix}`;
  const shownText = `${prefix}${format(current, decimals, locale)}${suffix}`;

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span aria-hidden="true">{shownText}</span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}

export default CountUp;
