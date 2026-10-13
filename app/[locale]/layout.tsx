import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

import { AvailabilityFloat } from "@/components/availability-float";
import { BackToTop } from "@/components/back-to-top";
import { JsonLd } from "@/components/json-ld";
import { LocaleProvider } from "@/components/locale-provider";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getContent } from "@/lib/content";
import { htmlLang, isLocale, locales, ogLocale, type Locale } from "@/lib/i18n";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Both editions are prerendered; any other locale segment is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0f1115",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { site } = getContent(locale);
  const pageTitle = `${site.name} | ${site.title}`;
  return {
    metadataBase: new URL(site.url),
    title: {
      default: pageTitle,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [...site.keywords],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "technology",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: `${site.url}/`,
      siteName: site.name,
      title: pageTitle,
      description: site.description,
      locale: ogLocale[locale],
      alternateLocale: locale === "en" ? [ogLocale.fr] : [ogLocale.en],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={htmlLang[locale]}
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground">
        <LocaleProvider locale={locale}>
          <JsonLd locale={locale} />
          <a
            href="#overview"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            {locale === "fr" ? "Aller au contenu" : "Skip to content"}
          </a>
          <TooltipProvider delayDuration={150}>
            <ScrollProgress />
            <SiteHeader />
            <AvailabilityFloat />
            {children}
            <SiteFooter />
            <BackToTop />
          </TooltipProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
