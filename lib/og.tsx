/**
 * Shared Open Graph / Twitter card, rendered per locale. Satori (through
 * next/og) does the drawing, so every container that holds more than one
 * child declares display: flex and all styling is inline. No remote font is
 * fetched: the stack below resolves to the font bundled with next/og, whose
 * Latin coverage includes the accented characters of the French edition.
 */
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** UI strings that are not part of the data modules. */
const STRINGS = {
  en: { availability: "Available · Senior Applied AI · Montreal / Remote US & CA" },
  fr: {
    availability:
      "Disponible · IA appliquée senior · Montréal / Télétravail Canada et États-Unis",
  },
} satisfies Record<Locale, Record<string, string>>;

const palette = {
  background: "#0f1115",
  foreground: "#f4f5f7",
  muted: "#9aa3b2",
  accent: "#7fe3f0",
  success: "#34d399",
  grid: "rgba(244, 245, 247, 0.045)",
  accentBorder: "rgba(127, 227, 240, 0.35)",
  accentFill: "rgba(127, 227, 240, 0.08)",
  taglineInk: "rgba(244, 245, 247, 0.78)",
};

const sans = "ui-sans-serif, system-ui, sans-serif";
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** Splits the tagline into its sentences so each sits on its own line. */
function taglineLines(tagline: string): string[] {
  const [first, ...rest] = tagline.split(". ");
  const lines = [first ? `${first}.` : "", rest.join(". ")];
  return lines.filter((line) => line.length > 0);
}

export function renderOgImage(locale: Locale) {
  const { site } = getContent(locale);
  const t = STRINGS[locale];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        padding: "64px 72px",
        backgroundColor: palette.background,
        backgroundImage: `linear-gradient(to right, ${palette.grid} 1px, transparent 1px), linear-gradient(to bottom, ${palette.grid} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        color: palette.foreground,
        fontFamily: sans,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -180,
          width: 620,
          height: 620,
          borderRadius: 9999,
          display: "flex",
          backgroundImage:
            "radial-gradient(circle, rgba(127, 227, 240, 0.16) 0%, rgba(127, 227, 240, 0) 68%)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 4,
              borderRadius: 2,
              display: "flex",
              backgroundColor: palette.accent,
            }}
          />
          <div
            style={{
              fontFamily: mono,
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: palette.accent,
            }}
          >
            {site.hero.eyebrow}
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: palette.foreground,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 32,
            fontWeight: 500,
            lineHeight: 1.25,
            color: palette.muted,
          }}
        >
          {site.title}
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: 1000,
            fontSize: 22,
            lineHeight: 1.45,
            color: palette.taglineInk,
          }}
        >
          {taglineLines(site.tagline).map((line) => (
            <div key={line} style={{ display: "flex" }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 24,
            letterSpacing: "0.04em",
            color: palette.muted,
          }}
        >
          {site.domain}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 20px",
            borderRadius: 9999,
            border: `1px solid ${palette.accentBorder}`,
            backgroundColor: palette.accentFill,
            color: palette.accent,
            fontSize: 18,
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              display: "flex",
              backgroundColor: palette.success,
            }}
          />
          <div style={{ display: "flex" }}>{t.availability}</div>
        </div>
      </div>
    </div>
  );
}
