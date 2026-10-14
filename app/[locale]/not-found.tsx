"use client";

import Link from "next/link";

import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n";

const STRINGS = {
  en: {
    eyebrow: "HTTP status",
    body: "This route does not exist. The pipeline refused it with a 404.",
    back: "Back to the overview",
  },
  fr: {
    eyebrow: "Code HTTP",
    body: "Cette route n'existe pas. Le pipeline l'a refusée avec un 404.",
    back: "Retour à l'aperçu",
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Rendered inside the locale layout, so the live locale comes from the
 * provider. Reading cookies or headers here would opt the whole segment out
 * of prerendering, which is why this is a client component instead.
 */
export default function NotFound() {
  const locale = useLocale();
  const t = STRINGS[locale];

  return (
    <main
      id="main"
      lang={locale}
      className="container-site flex min-h-dvh flex-col items-center justify-center py-24 text-center"
    >
      <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
        {t.eyebrow}
      </p>
      <h1 className="mt-4 font-mono text-7xl font-semibold tracking-tight text-foreground sm:text-8xl">
        404
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t.body}
      </p>
      <Button asChild size="lg" className="mt-10">
        <Link href={localePath(locale, "/")}>{t.back}</Link>
      </Button>
    </main>
  );
}
