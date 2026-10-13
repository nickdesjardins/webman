/**
 * Renders the bilingual resume PDFs from the site's data modules.
 *
 *   npx tsx scripts/resume/build.tsx
 *
 * Outputs public/Nicolas-Desjardins-Resume.pdf (EN) and
 * public/Nicolas-Desjardins-CV.pdf (FR). Letter size, Geist fonts.
 */
import path from "node:path";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";
import type { Locale } from "@/lib/i18n";
import { buildResume, type ProjectBlock, type ResumeContent, type Role, type SkillGroup } from "./content";

const FONT_DIR = path.join(process.cwd(), "scripts", "resume", "fonts");
const font = (file: string) => path.join(FONT_DIR, file);

Font.register({
  family: "Geist",
  fonts: [
    { src: font("Geist-400.ttf"), fontWeight: 400 },
    { src: font("Geist-500.ttf"), fontWeight: 500 },
    { src: font("Geist-600.ttf"), fontWeight: 600 },
    { src: font("Geist-700.ttf"), fontWeight: 700 },
    { src: font("Geist-800.ttf"), fontWeight: 800 },
  ],
});
Font.register({
  family: "GeistMono",
  fonts: [
    { src: font("GeistMono-400.ttf"), fontWeight: 400 },
    { src: font("GeistMono-500.ttf"), fontWeight: 500 },
    { src: font("GeistMono-600.ttf"), fontWeight: 600 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const C = {
  ink: "#111827",
  body: "#1f2937",
  muted: "#6b7280",
  faint: "#9ca3af",
  line: "#e5e7eb",
  panel: "#f6f7f9",
  band: "#0f1115",
  bandText: "#e5e7eb",
  bandMuted: "#9aa3ad",
  cyan: "#7fe3f0",
  accent: "#0f766e",
  accentSoft: "#e6f6f4",
  chip: "#f1f5f9",
};

const s = StyleSheet.create({
  page: { fontFamily: "Geist", fontSize: 9, color: C.body, paddingBottom: 46, backgroundColor: "#ffffff" },
  band: { backgroundColor: C.band, paddingHorizontal: 40, paddingTop: 26, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between" },
  bandRule: { height: 3, backgroundColor: C.cyan },
  name: { fontSize: 27, fontWeight: 800, color: "#ffffff", letterSpacing: -0.6 },
  title: { fontSize: 11, fontWeight: 600, color: C.cyan, marginTop: 5, lineHeight: 1.25 },
  tagline: { fontSize: 8.8, color: C.bandMuted, marginTop: 7, lineHeight: 1.4 },
  contact: { width: 215, flexShrink: 0, alignItems: "flex-end", justifyContent: "flex-start", gap: 3.5, paddingTop: 2 },
  contactLine: { fontFamily: "GeistMono", fontSize: 8, color: C.bandText },
  contactMuted: { fontFamily: "GeistMono", fontSize: 7.5, color: C.bandMuted },
  metrics: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.line, paddingHorizontal: 40 },
  metric: { flex: 1, paddingVertical: 8, paddingRight: 8 },
  metricValue: { fontFamily: "GeistMono", fontSize: 13.5, fontWeight: 600, color: C.ink },
  metricLabel: { fontSize: 7.2, color: C.muted, marginTop: 2, lineHeight: 1.3 },
  body: { flexDirection: "row", paddingHorizontal: 40, paddingTop: 13, gap: 20 },
  side: { width: 168, gap: 10 },
  main: { flex: 1, gap: 9 },
  h2: { fontFamily: "GeistMono", fontSize: 7.3, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, marginBottom: 4 },
  h2Rule: { height: 1, backgroundColor: C.line, marginBottom: 6 },
  para: { fontSize: 8.6, lineHeight: 1.42, color: C.body },
  roleTitle: { fontSize: 11, fontWeight: 700, color: C.ink },
  roleMeta: { fontFamily: "GeistMono", fontSize: 7.3, color: C.muted, marginTop: 2, marginBottom: 4 },
  bullet: { flexDirection: "row", gap: 6, marginBottom: 2.6 },
  bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent, marginTop: 4.2 },
  bulletText: { flex: 1, fontSize: 8.3, lineHeight: 1.36, color: C.body },
  groupLabel: { fontSize: 7.8, fontWeight: 600, color: C.ink, marginBottom: 2.5 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 3 },
  chip: { fontFamily: "GeistMono", fontSize: 6.5, color: C.body, backgroundColor: C.chip, borderRadius: 3, paddingHorizontal: 3.5, paddingVertical: 1.5 },
  sideText: { fontSize: 8.1, lineHeight: 1.4, color: C.body },
  sideMuted: { fontFamily: "GeistMono", fontSize: 7.2, color: C.muted },
  footer: { position: "absolute", left: 40, right: 40, bottom: 18, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: C.line, paddingTop: 6 },
  footerText: { fontFamily: "GeistMono", fontSize: 7, color: C.faint },
  pageHead: { paddingHorizontal: 40, paddingTop: 26, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  pageHeadName: { fontSize: 12, fontWeight: 700, color: C.ink },
  pageHeadMeta: { fontFamily: "GeistMono", fontSize: 7.5, color: C.muted },
  section: { paddingHorizontal: 40, paddingTop: 14 },
  note: { fontSize: 7.8, color: C.muted, marginBottom: 8, lineHeight: 1.4 },
  card: { borderWidth: 1, borderColor: C.line, borderRadius: 6, padding: 11, marginBottom: 9 },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 4 },
  cardTitle: { fontSize: 10.5, fontWeight: 700, color: C.ink, flex: 1 },
  status: { fontFamily: "GeistMono", fontSize: 6.8, color: C.accent, backgroundColor: C.accentSoft, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2 },
  cardText: { fontSize: 8.6, lineHeight: 1.45, color: C.body },
  metricRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 },
  metricPill: { fontFamily: "GeistMono", fontSize: 6.8, color: C.ink, borderWidth: 1, borderColor: C.line, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2 },
  links: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  link: { fontFamily: "GeistMono", fontSize: 7.2, color: C.accent, textDecoration: "none" },
  twoCol: { flexDirection: "row", gap: 14 },
  col: { flex: 1 },
  milestone: { borderLeftWidth: 2, borderLeftColor: C.accent, paddingLeft: 9, marginBottom: 9, paddingBottom: 1 },
  milestoneHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 3 },
  milestoneTitle: { fontSize: 9.5, fontWeight: 700, color: C.ink, flex: 1 },
  milestoneMeta: { fontFamily: "GeistMono", fontSize: 7.3, color: C.muted, flexShrink: 0 },
  milestoneTargets: { fontFamily: "GeistMono", fontSize: 7, color: C.body, marginTop: 4, lineHeight: 1.4 },
  webRow: { flexDirection: "row", gap: 10, marginBottom: 7 },
  webTitleCol: { width: 150 },
  webTitle: { fontSize: 8.6, fontWeight: 600, color: C.ink },
  webStack: { fontFamily: "GeistMono", fontSize: 6.8, color: C.muted, marginTop: 2, lineHeight: 1.35 },
  webBody: { flex: 1 },
  webDetail: { fontSize: 8.4, lineHeight: 1.4, color: C.body },
  webList: { marginTop: 3, gap: 1.5 },
  webListLine: { fontFamily: "GeistMono", fontSize: 6.9, color: C.body, lineHeight: 1.35 },
  arsenalGroup: { marginBottom: 6 },
  arsenalCols: { flexDirection: "row", gap: 18, marginTop: 2 },
  arsenalCol: { flex: 1 },
  arsenalBlock: { marginBottom: 10 },
  arsenalHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", borderBottomWidth: 1, borderBottomColor: C.line, paddingBottom: 3, marginBottom: 5 },
  arsenalLabel: { fontSize: 8.6, fontWeight: 700, color: C.ink },
  arsenalCount: { fontFamily: "GeistMono", fontSize: 7, color: C.faint },
  arsenalChip: { fontFamily: "GeistMono", fontSize: 7.2, color: C.body, backgroundColor: C.chip, borderRadius: 3, paddingHorizontal: 4.5, paddingVertical: 2.2 },
  arsenalText: { fontSize: 7.9, lineHeight: 1.45, color: C.body },
});

/** Splits groups into two columns with roughly equal chip counts, keeping order. */
function splitBalanced(groups: SkillGroup[]): [SkillGroup[], SkillGroup[]] {
  const total = groups.reduce((sum, g) => sum + g.items.length + 3, 0);
  let running = 0;
  let cut = groups.length;
  for (let i = 0; i < groups.length; i += 1) {
    running += groups[i].items.length + 3;
    if (running >= total / 2) {
      cut = i + 1;
      break;
    }
  }
  return [groups.slice(0, cut), groups.slice(cut)];
}

function H2({ children, keepWith = 0 }: { children: string; keepWith?: number }) {
  return (
    <View minPresenceAhead={keepWith}>
      <Text style={s.h2}>{children}</Text>
      <View style={s.h2Rule} />
    </View>
  );
}

/** Section heading plus its note, never separated from the first block below. */
function SectionHead({ title, note }: { title: string; note?: string }) {
  return (
    <View minPresenceAhead={110}>
      <H2>{title}</H2>
      {note && <Text style={s.note}>{note}</Text>}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((b, i) => (
        <View key={i} style={s.bullet} wrap={false}>
          <View style={s.bulletDot} />
          <Text style={s.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

function RoleBlock({ role }: { role: Role }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={s.roleTitle}>{role.title}</Text>
      <Text style={s.roleMeta}>
        {role.org} · {role.period} · {role.place}
      </Text>
      <Bullets items={role.bullets} />
    </View>
  );
}

function Chips({ group }: { group: SkillGroup }) {
  return (
    <View style={{ marginBottom: 5 }}>
      <Text style={s.groupLabel}>{group.label}</Text>
      <View style={s.chips}>
        {group.items.map((item) => (
          <Text key={item} style={s.chip}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

function ProjectCard({ p, colon }: { p: ProjectBlock; colon: string }) {
  return (
    <View style={s.card} wrap={false}>
      <View style={s.cardHead}>
        <Text style={s.cardTitle}>{p.title}</Text>
        <Text style={s.status}>{p.status}</Text>
      </View>
      <Text style={s.cardText}>{p.summary}</Text>
      {p.bullets && (
        <View style={{ marginTop: 6 }}>
          <Bullets items={p.bullets} />
        </View>
      )}
      {p.metrics && (
        <View style={s.metricRow}>
          {p.metrics.map((m) => (
            <Text key={m} style={s.metricPill}>
              {m}
            </Text>
          ))}
        </View>
      )}
      {p.links && (
        <View style={s.links}>
          {p.links.map((l) => (
            <Link key={l.href} src={l.href} style={s.link}>
              {linkText(l.label, l.href, colon)}
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}

function Footer({ r }: { r: ResumeContent }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        {r.footer} · {r.generated}
      </Text>
      <Text style={s.footerText} render={({ pageNumber, totalPages }) => r.pageLabel(pageNumber, totalPages)} />
    </View>
  );
}

/** "Label: host/path", or just the stripped href when the label already is the host. */
function linkText(label: string, href: string, colon: string): string {
  const schemeEnd = href.indexOf("://");
  const withoutScheme = schemeEnd >= 0 ? href.slice(schemeEnd + 3) : href;
  const shown = withoutScheme.endsWith("/") ? withoutScheme.slice(0, -1) : withoutScheme;
  return label === shown ? shown : `${label}${colon}${shown}`;
}

function PageHead({ r, label }: { r: ResumeContent; label: string }) {
  return (
    <View style={s.pageHead} fixed>
      <Text style={s.pageHeadName}>{r.name}</Text>
      <Text style={s.pageHeadMeta}>
        {label} · {r.contact.site} · {r.contact.email}
      </Text>
    </View>
  );
}

function Resume({ r }: { r: ResumeContent }) {
  return (
    <Document
      title={`${r.name} | ${r.title}`}
      author={r.name}
      subject={r.title}
      language={r.locale === "fr" ? "fr-CA" : "en-CA"}
      creator="webman.dev resume builder"
      producer="react-pdf"
    >
      {/* Page 1: designed first page */}
      <Page size="LETTER" style={s.page}>
        <View style={s.band}>
          <View style={{ flex: 1, paddingRight: 18 }}>
            <Text style={s.name}>{r.name}</Text>
            <Text style={s.title}>{r.title}</Text>
            <Text style={s.tagline}>{r.tagline}</Text>
          </View>
          <View style={s.contact}>
            <Text style={s.contactLine}>{r.contact.email}</Text>
            <Text style={s.contactLine}>{r.contact.phone}</Text>
            <Link src={`https://${r.contact.site}`} style={s.contactLine}>
              {r.contact.site}
            </Link>
            <Link src={`https://${r.contact.github}`} style={s.contactLine}>
              {r.contact.github}
            </Link>
            <Link src={`https://${r.contact.linkedin}`} style={s.contactLine}>
              {r.contact.linkedin}
            </Link>
            <Text style={s.contactMuted}>{r.contact.location}</Text>
            <Text style={s.contactMuted}>{r.contact.remote}</Text>
          </View>
        </View>
        <View style={s.bandRule} />

        <View style={s.metrics}>
          {r.metrics.map((m) => (
            <View key={m.label} style={s.metric}>
              <Text style={s.metricValue}>{m.value}</Text>
              <Text style={s.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.body}>
          <View style={s.side}>
            <View>
              <H2>{r.stackTitle}</H2>
              {r.stack.map((g) => (
                <Chips key={g.label} group={g} />
              ))}
            </View>
            <View>
              <H2>{r.languagesTitle}</H2>
              {r.languages.map((l) => (
                <Text key={l} style={s.sideText}>
                  {l}
                </Text>
              ))}
            </View>
            <View>
              <H2>{r.educationTitle}</H2>
              {r.education.map((e) => (
                <View key={e.degree} style={{ marginBottom: 5 }}>
                  <Text style={[s.sideText, { fontWeight: 600 }]}>{e.degree}</Text>
                  <Text style={s.sideText}>{e.school}</Text>
                  <Text style={s.sideMuted}>{e.period}</Text>
                </View>
              ))}
            </View>
            <View>
              <H2>{r.serviceTitle}</H2>
              {r.service.map((line, i) => (
                <Text key={i} style={i === 0 ? [s.sideText, { fontWeight: 600 }] : s.sideMuted}>
                  {line}
                </Text>
              ))}
            </View>
          </View>

          <View style={s.main}>
            <View>
              <H2>{r.profileTitle}</H2>
              <Text style={s.para}>{r.profile}</Text>
            </View>
            <View>
              <H2>{r.experienceTitle}</H2>
              {r.roles.map((role) => (
                <RoleBlock key={role.title} role={role} />
              ))}
            </View>
          </View>
        </View>
        <Footer r={r} />
      </Page>

      {/* Page 2+: flows */}
      <Page size="LETTER" style={s.page} wrap>
        <PageHead r={r} label={r.earlierProjectsLabel} />

        <View style={s.section}>
          <SectionHead title={r.earlierTitle} />
          <View style={s.twoCol}>
            <View style={s.col}>
              <RoleBlock role={r.earlier[0]} />
            </View>
            <View style={s.col}>
              {r.earlier.slice(1).map((role) => (
                <RoleBlock key={role.title} role={role} />
              ))}
            </View>
          </View>
        </View>

        <View style={s.section}>
          <View wrap={false}>
            <SectionHead title={r.projectsTitle} note={r.projectsNote} />
            <ProjectCard p={r.projects[0]} colon={r.colon} />
          </View>
          {r.projects.slice(1).map((p) => (
            <ProjectCard key={p.title} p={p} colon={r.colon} />
          ))}
        </View>

        <Footer r={r} />
      </Page>

      {/* Page 3: milestone architectures and production web work */}
      <Page size="LETTER" style={s.page} wrap>
        <PageHead r={r} label={r.roadmapLabel} />

        <View style={s.section}>
          {r.milestones.map((m, i) => (
            <View key={m.title} wrap={false}>
              {i === 0 && <SectionHead title={r.milestonesTitle} note={r.milestonesNote} />}
              <View style={s.milestone}>
                <View style={s.milestoneHead}>
                  <Text style={s.milestoneTitle}>{m.title}</Text>
                  <Text style={s.milestoneMeta}>{m.delivery}</Text>
                </View>
                <Text style={s.cardText}>{m.summary}</Text>
                {m.metrics.length > 0 && (
                  <Text style={s.milestoneTargets}>
                    {r.targetsLabel}
                    {r.colon}
                    {m.metrics.join(" · ")}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={s.section}>
          {r.web.map((w, i) => (
            <View key={w.title} wrap={false}>
              {i === 0 && <SectionHead title={r.webTitle} note={r.webNote} />}
              <View style={s.webRow}>
              <View style={s.webTitleCol}>
                {w.href ? (
                  <Link src={w.href} style={[s.webTitle, { color: C.accent, textDecoration: "none" }]}>
                    {w.title}
                  </Link>
                ) : (
                  <Text style={s.webTitle}>{w.title}</Text>
                )}
                {w.stack && <Text style={s.webStack}>{w.stack}</Text>}
              </View>
              <View style={s.webBody}>
                <Text style={s.webDetail}>{w.detail}</Text>
                {w.list && (
                  <View style={s.webList}>
                    {w.list.map((entry) => (
                      <Text key={entry} style={s.webListLine}>
                        {entry}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
              </View>
            </View>
          ))}
        </View>

        <Footer r={r} />
      </Page>

      {/* Last page: the full arsenal as a chip wall, two columns */}
      <Page size="LETTER" style={s.page}>
        <PageHead r={r} label={r.arsenalTitle} />
        <View style={s.section}>
          <SectionHead title={r.arsenalTitle} note={r.arsenalNote} />
          <View style={s.arsenalCols}>
            {splitBalanced(r.arsenal).map(
              (column, index) => (
                <View key={index} style={s.arsenalCol}>
                  {column.map((g) => (
                    <View key={g.label} style={s.arsenalBlock} wrap={false}>
                      <View style={s.arsenalHead}>
                        <Text style={s.arsenalLabel}>{g.label}</Text>
                        <Text style={s.arsenalCount}>{g.items.length}</Text>
                      </View>
                      <View style={s.chips}>
                        {g.items.map((item) => (
                          <Text key={item} style={s.arsenalChip}>
                            {item}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )
            )}
          </View>
        </View>
        <Footer r={r} />
      </Page>
    </Document>
  );
}

const OUTPUTS: Record<Locale, string> = {
  en: "Nicolas-Desjardins-Resume.pdf",
  fr: "Nicolas-Desjardins-CV.pdf",
};

async function main() {
  for (const locale of ["en", "fr"] as const) {
    const content = buildResume(locale);
    const out = path.join(process.cwd(), "public", OUTPUTS[locale]);
    await renderToFile(<Resume r={content} />, out);
    console.log(`wrote ${out}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
