"use client";

import { useLocale } from "@/components/locale-provider";
import { Section } from "@/components/section";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { ContactLinks } from "@/components/contact-links";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const STRINGS = {
  en: {
    eyebrow: "Contact",
    directChannels: "Direct channels",
    formTitle: "Send a message",
    formHint: "All fields except company are required.",
  },
  fr: {
    eyebrow: "Contact",
    directChannels: "Canaux directs",
    formTitle: "Envoyer un message",
    formHint: "Tous les champs sauf l'entreprise sont requis.",
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Contact and action footer: availability, direct channels, and the
 * validated message form. Server Component; the form is the only client leaf.
 * The form receives the two site strings it shows as props so lib/content
 * (both locales' full data) stays out of the client bundle.
 */
export function ContactSection() {
  const locale = useLocale();
  const { site } = getContent(locale);
  const t = STRINGS[locale];

  return (
    <Section
      id="contact"
      eyebrow={t.eyebrow}
      title={site.contact.heading}
      description={site.contact.body}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal index={0} className="space-y-8 lg:col-span-5">
          <p className="flex items-start gap-3">
            <span className="relative mt-1 flex size-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            <span className="font-mono text-xs leading-relaxed text-foreground sm:text-sm">
              {site.availability.label}
            </span>
          </p>

          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>{site.availability.roles}</p>
            <p>{site.contact.technical}</p>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t.directChannels}
            </h3>
            <ContactLinks locale={locale} />
          </div>
        </Reveal>

        <Reveal index={1} className="lg:col-span-7">
          <Card className="card-glow bg-transparent">
            <CardHeader>
              <h3 data-slot="card-title" className="font-semibold leading-none">
                {t.formTitle}
              </h3>
              <CardDescription>{t.formHint}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm email={site.email} responseTime={site.contact.responseTime} />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}

export default ContactSection;
