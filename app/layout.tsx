import type { Metadata, Viewport } from "next";
import { Open_Sans, Raleway, Poppins } from "next/font/google";

// Vendor styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/pagination";
// Template styles (must come last so it overrides the vendor styles)
import "./template.css";

import AosInit from "@/components/AosInit";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Nicolas Desjardins",
  description:
    "Nicolas Desjardins — Digital Marketer & Fullstack Developer. Portfolio, resume and tools.",
  manifest: "/assets/img/site.webmanifest",
  icons: {
    icon: [
      { url: "/assets/img/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/img/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/assets/img/apple-touch-icon.png", sizes: "180x180" },
    shortcut: "/assets/img/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} ${raleway.variable} ${poppins.variable}`}>
        <AosInit />
        <Header />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
