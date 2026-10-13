import type { Locale } from "@/lib/i18n";
import { buildJsonLd } from "@/lib/json-ld";

/**
 * Server Component. Emits the schema.org graph for one locale as a single
 * JSON-LD block. "<" is escaped so the payload can never close the script element.
 */
export function JsonLd({ locale }: { locale: Locale }) {
  const json = JSON.stringify(buildJsonLd(locale)).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
