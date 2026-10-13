import { ImageResponse } from "next/og";

import { getContent } from "@/lib/content";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { contentType as ogContentType, renderOgImage, size as ogSize } from "@/lib/og";

/** Static alt text is read at build time, so it uses the default (English) edition. */
const { site } = getContent(defaultLocale);

export const alt = `${site.name} | ${site.title}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return new ImageResponse(renderOgImage(isLocale(locale) ? locale : defaultLocale), { ...size });
}
