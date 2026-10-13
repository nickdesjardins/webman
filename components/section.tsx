"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from "react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

interface SectionProps extends React.ComponentProps<"section"> {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Aligns the heading block. */
  align?: "left" | "center";
  /** Adds the subtle grid background used on alternating sections. */
  grid?: boolean;
  /** Wraps children in the site container. Disable for full-bleed content. */
  contained?: boolean;
  /**
   * Lets the browser skip rendering the section until it nears the viewport
   * (see the defer-render utility in globals.css). On by default because
   * every Section sits below the hero; pass false for a first-fold section.
   */
  defer?: boolean;
  /**
   * Leaves the server-rendered body untouched during hydration and mounts the
   * live React tree only as the section approaches the viewport (or on the
   * first click, focus or language switch inside it). Defaults to `defer`.
   * Pass false when the section manages its own deferral.
   */
  lazy?: boolean;
}

/** With this prop, hydration leaves the element's existing children untouched. */
const OPAQUE_HTML = { __html: "" };

/** Go live one and a half viewports ahead, so the section is interactive on arrival. */
const PRELOAD_MARGIN = "150% 0px";

const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";
function focusables(root: Element | null) {
  return root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
}

/**
 * Deferred hydration for one wrapper element. Below the hero, hydrating every
 * section at once is the largest main-thread cost of the page; nothing in
 * those sections can be interacted with before it scrolls into view anyway.
 * The wrapper is hydrated as opaque HTML and later remounted with the real
 * tree, which renders the same markup, so the swap is invisible.
 */
function useLazyHydration(enabled: boolean) {
  const [live, setLive] = useState(!enabled);
  const sectionRef = useRef<HTMLElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const ssrLocaleRef = useRef(locale);
  /** Position (among focusable descendants) of the control that triggered the swap; it gets focus back. */
  const pendingFocusRef = useRef<number | null>(null);

  /* Client-side mount without server HTML (a route change, for instance): render for real. */
  useLayoutEffect(() => {
    if (!live && ref.current && ref.current.childElementCount === 0) setLive(true);
  }, [live]);

  /* The untouched server HTML is in the language it was rendered in. */
  useLayoutEffect(() => {
    if (!live && locale !== ssrLocaleRef.current) setLive(true);
  }, [live, locale]);

  /*
   * Mount the live tree as the section approaches. The <section> is observed
   * rather than the body: while content-visibility skips the section's
   * contents they have no layout box, but the section's own placeholder does.
   */
  useEffect(() => {
    const element = sectionRef.current ?? ref.current;
    if (live || !element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setLive(true);
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [live]);

  /*
   * Keyboard focus survives the swap. The live tree renders the same markup in
   * the same order, so the control is found by its position; ids cannot be
   * used because useId values differ between hydration and a fresh mount.
   */
  useLayoutEffect(() => {
    const index = pendingFocusRef.current;
    if (!live || index === null) return;
    pendingFocusRef.current = null;
    focusables(ref.current)[index]?.focus();
  }, [live]);

  /* A click or focus inside the dormant section brings it up at once. */
  const activate = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
    const control = event.target instanceof Element ? event.target.closest<HTMLElement>(FOCUSABLE) : null;
    const index = control ? focusables(event.currentTarget).indexOf(control) : -1;
    pendingFocusRef.current = index >= 0 ? index : null;
    setLive(true);
  }, []);

  return { live, ref, sectionRef, activate };
}

/**
 * Shared section shell: consistent vertical rhythm, semantic landmark,
 * accessible heading association, and the eyebrow / title / description stack.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  grid = false,
  contained = true,
  defer = true,
  lazy = defer,
  className,
  children,
  ...props
}: SectionProps) {
  const headingId = title ? `${id}-heading` : undefined;
  const { live, ref, sectionRef, activate } = useLazyHydration(lazy);
  const bodyClass = cn(contained && "container-site");

  const body = (
    <>
      {(eyebrow || title || description) && (
        <header
          className={cn(
            "mb-12 max-w-3xl lg:mb-16",
            align === "center" && "mx-auto text-center"
          )}
        >
          {eyebrow && (
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              id={headingId}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </>
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={headingId}
      /*
       * The negative scroll margin cancels the section's own top padding, so an
       * anchor jump lands with the eyebrow just under the fixed header: the
       * global scroll-padding-top (5.5rem in globals.css) is the only offset.
       */
      className={cn(
        "relative isolate -scroll-mt-20 py-20 sm:-scroll-mt-24 sm:py-24 lg:-scroll-mt-32 lg:py-32",
        defer && "defer-render",
        className
      )}
      {...props}
    >
      {grid && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-y"
        />
      )}
      {live || typeof window === "undefined" ? (
        /* Server render, or the live tree once the section is needed. */
        <div key="live" ref={ref} className={bodyClass}>
          {body}
        </div>
      ) : (
        /* Hydrating: the server's markup stays as delivered, at zero hydration cost. */
        <div
          key="dormant"
          ref={ref}
          className={bodyClass}
          onClickCapture={activate}
          onFocusCapture={activate}
          suppressHydrationWarning
          dangerouslySetInnerHTML={OPAQUE_HTML}
        />
      )}
    </section>
  );
}
