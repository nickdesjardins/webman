"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Menu } from "lucide-react";

import { AvailabilityBadge } from "@/components/availability-badge";
import { useLocale } from "@/components/locale-provider";
import { LocaleSwitch } from "@/components/locale-switch";
import { getSocialLinks, NavLink } from "@/components/nav-link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/data/site";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    backToOverview: "back to overview",
    primaryNav: "Primary",
    sectionsNav: "Sections",
    resume: "Resume",
    openNav: "Open navigation",
    navigation: "Navigation",
    sheetDescription: "Jump to a section of this page.",
    newTab: "opens in a new tab",
  },
  fr: {
    backToOverview: "retour à l'aperçu",
    primaryNav: "Principale",
    sectionsNav: "Sections",
    resume: "CV",
    openNav: "Ouvrir la navigation",
    navigation: "Navigation",
    sheetDescription: "Aller à une section de cette page.",
    newTab: "s'ouvre dans un nouvel onglet",
  },
} satisfies Record<Locale, Record<string, string>>;

/** Two-letter monogram derived from site.name ("Nicolas Desjardins" becomes "ND"). */
function monogram(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/*
 * Scroll-derived state goes through useSyncExternalStore: no setState inside
 * effects and a deterministic server render (not scrolled).
 */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolled = () => window.scrollY > 8;
const getServerScrolled = () => false;

/**
 * Keeps the URL hash aligned with the section in view without triggering a
 * scroll. The first section maps to a clean URL (no hash), which also keeps
 * the locale path ("/" or "/fr") intact.
 */
function syncHash(id: string, firstId: string) {
  const { pathname, search, hash } = window.location;
  const target = id === firstId ? "" : `#${id}`;
  if (hash === target) return;
  window.history.replaceState(null, "", target || `${pathname}${search}`);
}

/**
 * Scrollspy. Observes every section listed in site.nav through a thin
 * horizontal band placed just above the vertical centre of the viewport
 * (rootMargin -40% / -55%), so exactly one section is current at a time.
 * A scroll listener covers the end of the document, where a short final
 * section may never cross the band. `nav` is the locale's module-level
 * array, so the effect only re-runs when the edition changes.
 */
function useActiveSection(nav: readonly NavItem[]) {
  const [active, setActive] = useState<string>(nav[0]?.id ?? "");

  useEffect(() => {
    const ids = nav.map((item) => item.id);
    const firstId = ids[0] ?? "";
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const activate = (id: string) => {
      setActive(id);
      syncHash(id, firstId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activate(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    for (const target of targets) observer.observe(target);

    const lastId = targets[targets.length - 1].id;
    const onScroll = () => {
      const { scrollHeight } = document.documentElement;
      if (window.innerHeight + window.scrollY >= scrollHeight - 2) activate(lastId);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [nav]);

  return active;
}

export function SiteHeader() {
  const locale = useLocale();
  const { site } = getContent(locale);
  const t = STRINGS[locale];
  const socialLinks = getSocialLinks(locale);
  const home = localePath(locale, "/");
  const homeHref = `${home}#overview`;
  const visibleNav = site.nav.filter((item) => !item.hidden);

  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);
  const active = useActiveSection(site.nav);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  // If the viewport grows past lg while the sheet is open, the trigger is
  // hidden; close the sheet so it cannot be orphaned.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  const underlineTransition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 500, damping: 40, mass: 0.8 };

  return (
    <header
      className={cn(
        "glass fixed inset-x-0 top-0 z-50 h-16 border-b border-border/60 transition-[box-shadow,border-color] duration-300",
        scrolled && "border-border shadow-lg shadow-black/30"
      )}
    >
      <div className="container-site flex h-full items-center justify-between gap-4">
        {/*
          Wordmark: locale root + overview anchor, so it stays a same-document
          jump on the home page. The name comes from the visible text plus a
          visually hidden suffix (no aria-label), so what is read matches what
          is seen (WCAG 2.5.3 Label in Name).
        */}
        <a href={homeHref} className="flex shrink-0 items-center gap-2.5 rounded-md">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">
            {monogram(site.name)}
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">{site.name}</span>
            <span className="mt-1 hidden font-mono text-[10px] tracking-wider text-muted-foreground sm:block">
              {site.domain}
            </span>
          </span>
          <span className="sr-only">, {t.backToOverview}</span>
        </a>

        {/* Primary navigation (lg and up) */}
        <nav aria-label={t.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {visibleNav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <NavLink id={item.id} base={home} label={item.label} active={isActive}>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        aria-hidden="true"
                        transition={underlineTransition}
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary xl:inset-x-3"
                      />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          <div className="hidden items-center md:flex lg:hidden xl:flex">
            {socialLinks.map(({ id, label, href, Icon }) => (
              <Button key={id} asChild variant="ghost" size="icon">
                <a
                  href={href}
                  aria-label={`${label} (${t.newTab})`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              </Button>
            ))}
          </div>

          {/* Language switch (lg and up); below lg it lives in the sheet */}
          <LocaleSwitch locale={locale} className="hidden lg:inline-flex" />

          <Button asChild size="sm">
            <a href={site.links.resume} download={site.links.resumeFileName}>
              <Download aria-hidden="true" />
              {t.resume}
            </a>
          </Button>

          {/* Mobile navigation (below lg) */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t.openNav}>
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[85vw] flex-col gap-0 overflow-y-auto sm:max-w-sm">
              {/* Row: title left, language switch right, clear of the absolute close button (right-4) */}
              <SheetHeader className="flex-row items-center justify-between gap-3 border-b border-border/60 py-3 pr-14 pl-6">
                <SheetTitle className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  {t.navigation}
                </SheetTitle>
                <SheetDescription className="sr-only">{t.sheetDescription}</SheetDescription>
                <LocaleSwitch locale={locale} variant="outline" />
              </SheetHeader>

              <nav aria-label={t.sectionsNav} className="px-3 py-4">
                <ul className="flex flex-col">
                  {visibleNav.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        id={item.id}
                        base={home}
                        label={item.label}
                        active={active === item.id}
                        onClick={() => setOpen(false)}
                        className="flex w-full px-3 py-3 text-lg aria-[current=true]:text-primary"
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto flex flex-col gap-4 border-t border-border/60 px-6 py-6">
                <AvailabilityBadge
                  variant="full"
                  className="items-start py-1.5 leading-relaxed whitespace-normal [&>span:first-child]:mt-1.5"
                />
                <div className="flex gap-2">
                  {socialLinks.map(({ id, label, href, Icon }) => (
                    <Button key={id} asChild variant="outline" size="sm" className="flex-1">
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        <Icon />
                        {label}
                        <span className="sr-only"> ({t.newTab})</span>
                      </a>
                    </Button>
                  ))}
                </div>
                <Button asChild>
                  <a href={site.links.resume} download={site.links.resumeFileName}>
                    <Download aria-hidden="true" />
                    {t.resume}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
