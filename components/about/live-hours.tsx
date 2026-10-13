"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";
import { numberLocale } from "@/components/about/strings";
import { cn } from "@/lib/utils";

const HOUR_MS = 3_600_000;
/** Placeholder rendered before hydration so the slot keeps its width. */
const NBSP = String.fromCharCode(0xa0);

/** The server never knows the client clock, so it renders a placeholder. */
function getServerSnapshot(): number | null {
  return null;
}

/** Re-evaluates once per second while the tab is visible. */
function subscribeTicking(onChange: () => void) {
  const id = window.setInterval(() => {
    if (!document.hidden) onChange();
  }, 1000);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onChange);
  };
}

/** Used while the counter is scrolled out of view: nothing to tick. */
function subscribeIdle() {
  return () => {};
}

interface LiveHoursProps {
  locale: Locale;
  /**
   * Epoch milliseconds of `site.businessOpened`. The server parent reads it
   * from getContent(locale) so this client leaf never imports a data module.
   */
  openedAt: number;
  className?: string;
}

/**
 * Whole hours elapsed since the business opened, formatted for the locale
 * (en-CA or fr-CA).
 *
 * Hydration-safe: the server (and the client's hydration pass) render a
 * non-breaking space; the real value appears right after hydration through
 * useSyncExternalStore, with no synchronous setState in an effect.
 * The interval pauses while the element is offscreen or the tab is hidden.
 */
export function LiveHours({ locale, openedAt, className }: LiveHoursProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(true);

  const getSnapshot = useCallback(
    () => Math.floor((Date.now() - openedAt) / HOUR_MS),
    [openedAt]
  );

  const hours = useSyncExternalStore<number | null>(
    inView ? subscribeTicking : subscribeIdle,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      setInView(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("inline-block min-w-[7ch] tabular-nums", className)}>
      {hours === null ? NBSP : hours.toLocaleString(numberLocale(locale))}
    </span>
  );
}

export default LiveHours;
