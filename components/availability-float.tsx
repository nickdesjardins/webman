"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Availability pill floating just under the fixed header, right-aligned with
 * the page container. Lives outside the header so the eight-item navigation
 * fits in both languages. Collapses to the short label after a little scroll
 * so it never competes with section content. Desktop only: the mobile sheet
 * already carries the full badge.
 */
export function AvailabilityFloat() {
  const locale = useLocale();
  const { availability } = getContent(locale).site;
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#contact"
      aria-label={availability.label}
      title={availability.label}
      className={cn(
        "glass fixed top-[4.75rem] z-40 hidden items-center gap-2 rounded-full border border-success/30 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-success shadow-lg shadow-black/20 transition-colors hover:bg-success/10 lg:inline-flex",
        "right-[calc(max(0px,(100vw-80rem)/2)+2rem)] 3xl:right-[calc(max(0px,(100vw-96rem)/2)+2rem)]"
      )}
    >
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      <span>{compact ? availability.short : availability.label}</span>
    </a>
  );
}
