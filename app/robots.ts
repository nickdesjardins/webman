import type { MetadataRoute } from "next";

import { site } from "@/data/site";

/**
 * AI crawlers and answer engines that are explicitly welcome. A dedicated
 * group is required because a user-agent that matches a specific group
 * ignores the "*" group entirely, so each one repeats the /api/ exclusion.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
