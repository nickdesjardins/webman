import type { ReactNode } from "react";
import { Clock, ExternalLink, Mail, MapPin } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    location: "Location",
    responseTime: "Response time",
    opensInNewTab: "(opens in a new tab)",
  },
  fr: {
    email: "Courriel",
    github: "GitHub",
    linkedin: "LinkedIn",
    location: "Emplacement",
    responseTime: "Délai de réponse",
    opensInNewTab: "(s'ouvre dans un nouvel onglet)",
  },
} satisfies Record<Locale, Record<string, string>>;

/** Strips protocol, "www." and a trailing slash so a URL reads as a label. */
function displayUrl(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

interface ContactLinkItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  note?: string;
  href?: string;
  /** Opens the link in a new tab; `newTabHint` is announced to screen readers. */
  external?: boolean;
  newTabHint?: string;
}

function ContactLinkItem({ icon, label, value, note, href, external, newTabHint }: ContactLinkItemProps) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border/70 bg-secondary text-foreground/90 transition-colors group-hover:border-primary/40 group-hover:text-primary [&_svg]:size-4"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "mt-0.5 block break-all text-sm font-medium text-foreground sm:break-normal",
            href && "transition-colors group-hover:text-primary"
          )}
        >
          {value}
        </span>
        {note && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{note}</span>}
      </span>
      {external && (
        <>
          <ExternalLink className="mt-1.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          {newTabHint && <span className="sr-only">{newTabHint}</span>}
        </>
      )}
    </>
  );

  const layout = "-mx-2 flex items-start gap-3 rounded-lg px-2 py-2";

  if (!href) {
    return (
      <li>
        <div className={layout}>{body}</div>
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(layout, "group transition-colors hover:bg-accent/40")}
      >
        {body}
      </a>
    </li>
  );
}

/**
 * Direct channels: email, profiles, location and response time.
 * Server Component; values come from the locale's site data, labels from STRINGS.
 */
export function ContactLinks({ locale }: { locale: Locale }) {
  const { site } = getContent(locale);
  const t = STRINGS[locale];

  return (
    <ul className="space-y-1">
      <ContactLinkItem
        icon={<Mail />}
        label={t.email}
        value={site.email}
        href={`mailto:${site.email}`}
      />
      <ContactLinkItem
        icon={<BrandIcon icon="siGithub" label={t.github} />}
        label={t.github}
        value={displayUrl(site.links.github)}
        href={site.links.github}
        external
        newTabHint={t.opensInNewTab}
      />
      <ContactLinkItem
        icon={
          <BrandIcon
            mono="in"
            label={t.linkedin}
            className="size-auto border-0 bg-transparent text-xs font-semibold"
          />
        }
        label={t.linkedin}
        value={displayUrl(site.links.linkedin)}
        href={site.links.linkedin}
        external
        newTabHint={t.opensInNewTab}
      />
      <ContactLinkItem
        icon={<MapPin />}
        label={t.location}
        value={site.location.label}
        note={site.location.note}
      />
      <ContactLinkItem icon={<Clock />} label={t.responseTime} value={site.contact.responseTime} />
    </ul>
  );
}

export default ContactLinks;
