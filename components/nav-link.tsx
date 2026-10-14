import type { ComponentProps, ReactNode } from "react";
import { siGithub } from "simple-icons";

import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/*
 * Shared navigation primitives used by the fixed header, its mobile sheet,
 * and the footer. This module has no "use client" directive on purpose so a
 * Server Component (footer) and a Client Component (header) can both import it.
 */

type GlyphProps = ComponentProps<"svg">;

/*
 * lucide-react 1.x removed its deprecated brand icons and simple-icons no
 * longer ships LinkedIn, so both glyphs are inlined here. The GitHub path is
 * the official simple-icons vector; the LinkedIn path is the standard
 * 24x24 "in" mark.
 */
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export function GitHubGlyph({ className, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("size-4 shrink-0 fill-current", className)}
      {...props}
    >
      <path d={siGithub.path} />
    </svg>
  );
}

export function LinkedInGlyph({ className, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("size-4 shrink-0 fill-current", className)}
      {...props}
    >
      <path d={LINKEDIN_PATH} />
    </svg>
  );
}

export interface SocialLink {
  id: "github" | "linkedin";
  /** Brand name; identical in both editions. */
  label: string;
  href: string;
  Icon: (props: GlyphProps) => ReactNode;
}

/** External profiles for a locale, sourced from that edition's site.links. */
export function getSocialLinks(locale: Locale): readonly SocialLink[] {
  const { links } = getContent(locale).site;
  return [
    { id: "github", label: "GitHub", href: links.github, Icon: GitHubGlyph },
    { id: "linkedin", label: "LinkedIn", href: links.linkedin, Icon: LinkedInGlyph },
  ];
}

interface NavLinkProps extends Omit<ComponentProps<"a">, "href" | "children"> {
  /** Section id; rendered as an anchor to that section of the home page. */
  id: string;
  /**
   * The edition's home path ("/" or "/fr"). The href is base + "#" + id, so
   * the link scrolls in place on the home page (same document, only the
   * fragment differs) and navigates home from a project page.
   */
  base?: string;
  label: string;
  active?: boolean;
  /** Optional indicator slot (the header renders its animated underline here). */
  children?: ReactNode;
}

/**
 * In-page anchor for the primary navigation. Relies on native anchor
 * navigation and the global smooth scroll-behavior; marks the active
 * section with aria-current for assistive tech and styling hooks.
 */
export function NavLink({ id, label, base = "", active = false, className, children, ...props }: NavLinkProps) {
  return (
    <a
      href={`${base}#${id}`}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative inline-flex items-center rounded-md px-2 py-2 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground aria-[current=true]:text-foreground xl:px-3 xl:text-sm",
        className
      )}
      {...props}
    >
      {label}
      {children}
    </a>
  );
}
