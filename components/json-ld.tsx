import type { Locale } from "@/lib/i18n";
import { buildJsonLd, type JsonLdGraph } from "@/lib/json-ld";

/**
 * Server Component. Emits a schema.org graph as a single JSON-LD block: the
 * home page's Person graph for a locale, or any prebuilt graph (project
 * pages). "<" is written as the JSON escape < so the payload can never
 * close the script element.
 */
export function JsonLd({ locale, graph }: { locale?: Locale; graph?: JsonLdGraph }) {
  const data = graph ?? buildJsonLd(locale ?? "en");
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
