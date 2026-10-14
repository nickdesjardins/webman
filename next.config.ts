import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* One-page site: the 18 KB stylesheet rides in the HTML and saves a render-blocking round trip. */
  experimental: { inlineCss: true },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /*
   * Addresses from the pre-2026 site that search engines still list:
   * /assets/resume.pdf is in the index and returned 404 after the rebuild.
   */
  async redirects() {
    return [
      { source: "/assets/resume.pdf", destination: "/Nicolas-Desjardins-Resume.pdf", permanent: true },
      { source: "/assets/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
