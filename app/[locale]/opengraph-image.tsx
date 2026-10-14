import { ImageResponse } from "next/og";

import { getContent } from "@/lib/content";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { contentType as ogContentType, renderOgImage, size as ogSize } from "@/lib/og";

/** One image per edition, with its alt text in that edition's language. */
export function generateImageMetadata({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const { site } = getContent(locale);
  return [{ id: "card", alt: `${site.name} | ${site.title}`, size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return new ImageResponse(renderOgImage(isLocale(locale) ? locale : defaultLocale), { ...ogSize });
}
