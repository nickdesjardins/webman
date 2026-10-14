"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { getContent } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Availability pill floating just under the fixed header, right-aligned with
 * the page container. The hero already states availability in full, so the
 * pill stays hidden on the first screen and fades in (short label) once the
 * visitor has scrolled past most of it. Pages without the hero show it from
 * the start. Desktop only: the mobile sheet already carries the full badge.
 */
export function AvailabilityFloat() {
  const locale = useLocale();
  const { availability } = getContent(locale).site;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("overview");
      setVisible(!hero || window.scrollY > hero.offsetHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={`${localePath(locale, "/")}#contact`}
      aria-label={availability.label}
      title={availability.label}
      className={cn(
        "glass fixed top-[4.75rem] z-40 hidden items-center transition-[opacity,translate] duration-300 gap-2 rounded-full border border-success/30 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-success shadow-lg shadow-black/20 transition-colors hover:bg-success/10 lg:inline-flex",
        "right-[calc(max(0px,(100vw-80rem)/2)+2rem)] 3xl:right-[calc(max(0px,(100vw-96rem)/2)+2rem)]",
        visible ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      )}
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
    >
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      <span>{availability.short}</span>
    </a>
  );
}
