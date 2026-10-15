import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { getContent } from "@/lib/content";
import { localePath, locales } from "@/lib/i18n";
import { CONTENT_UPDATED, languageAlternates } from "@/lib/seo";

/**
 * Every public page in both editions, each with its hreflang alternates
 * (en-CA, fr-CA, x-default), which Google treats like the HTML link tags.
 * lastModified is the real content date, not the build time; priority and
 * changefreq are omitted because Google ignores them.
 * Submit https://webman.dev/sitemap.xml in Search Console and Bing Webmaster Tools.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    getContent("en").automation.path,
    ...getContent("en")
      .projects.filter((project) => project.status === "live")
      .map((project) => `/projects/${project.slug}`),
  ];

  const absolute = (path: string) => (path === "/" ? `${site.url}/` : `${site.url}${path}`);

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absolute(localePath(locale, path)),
      lastModified: CONTENT_UPDATED,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, absolute(href)])
        ),
      },
    }))
  );
}
