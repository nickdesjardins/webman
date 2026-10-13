"use client";

import { useLocale } from "@/components/locale-provider";
import { Download, Mail, MapPin } from "lucide-react";

import { getSocialLinks } from "@/components/nav-link";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const STRINGS = {
  en: {
    footerNav: "Footer",
    navigate: "Navigate",
    connect: "Connect",
    resume: "Resume",
    newTab: "opens in a new tab",
    rights: "All rights reserved.",
    built: "Built with Next.js, Tailwind CSS, and zero hallucinations.",
  },
  fr: {
    footerNav: "Pied de page",
    navigate: "Naviguer",
    connect: "Joindre",
    resume: "CV",
    newTab: "s'ouvre dans un nouvel onglet",
    rights: "Tous droits réservés.",
    built: "Construit avec Next.js, Tailwind CSS et zéro hallucination.",
  },
} satisfies Record<Locale, Record<string, string>>;

const linkClass =
  "inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground";

const headingClass =
  "mb-4 font-mono text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground";

/**
 * Site footer. Server Component: identity, section links, and contact
 * channels, all sourced from the locale's site content.
 */
export function SiteFooter() {
  const locale = useLocale();
  const { site } = getContent(locale);
  const t = STRINGS[locale];
  const socialLinks = getSocialLinks(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="container-site py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Identity */}
          <div className="space-y-3">
            <p className="text-base font-semibold text-foreground">{site.name}</p>
            <p className="text-sm text-muted-foreground">{site.title}</p>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{site.location.label}</span>
            </p>
          </div>

          {/* Section links (pure in-page anchors, locale-agnostic) */}
          <nav aria-label={t.footerNav}>
            <h2 className={headingClass}>{t.navigate}</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
              {site.nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact channels */}
          <div>
            <h2 className={headingClass}>{t.connect}</h2>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  <Mail aria-hidden="true" className="size-4 shrink-0" />
                  <span className="break-all">{site.email}</span>
                </a>
              </li>
              {socialLinks.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <Icon />
                    {label}
                    <span className="sr-only"> ({t.newTab})</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={site.links.resume} download={site.links.resumeFileName} className={linkClass}>
                  <Download aria-hidden="true" className="size-4 shrink-0" />
                  {t.resume}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. {t.rights}
          </p>
          <p className="font-mono">{t.built}</p>
        </div>
      </div>
    </footer>
  );
}
