# webman.dev

Portfolio of **Nicolas Desjardins**, Lead Systems Engineer turned Applied AI Architect.
Live at [webman.dev](https://webman.dev).

Built with Next.js 16 (App Router, React Server Components), React 19, TypeScript (strict),
Tailwind CSS v4, shadcn/ui, Framer Motion, and Three.js via @react-three/fiber.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npm run resume   # regenerate the EN and FR resume PDFs
```

## Languages

The site is bilingual and both languages live at `/`. The proxy (`proxy.ts`) picks the
edition for the first paint from the `lang` cookie, then the browser's `Accept-Language`
(French browsers get French, everyone else gets English), and rewrites `/` to the matching
prerendered page (`/en` or `/fr`, which are internal and redirect to `/` if hit directly).
The header's EN/FR switch is a client state change: every section reads the live locale from
`LocaleProvider`, so switching is instant with no navigation, and the choice is stored in the
`lang` cookie for the next visit. Every data module has a French edition under `data/fr/` with
the same exports and types; components read copy through `getContent(locale)`, and UI labels
live in small per-component dictionaries with both languages.

## Resume

`npm run resume` renders both resumes from the same data modules as the site with
@react-pdf/renderer: `public/Nicolas-Desjardins-Resume.pdf` (English) and
`public/Nicolas-Desjardins-CV.pdf` (French). Copy specific to the resume (tighter bullets,
section titles) lives in `scripts/resume/content.ts`; the layout is `scripts/resume/build.tsx`.
The Geist fonts in `scripts/resume/fonts` have ligature substitution stripped so the PDF
text layer stays readable by applicant tracking systems.

## Contact form

`POST /api/contact` validates the payload with zod and sends an email over SMTP with nodemailer.
It returns `503 not_configured` until SMTP credentials exist. Copy `.env.example` to `.env.local`
(gitignored) and fill in:

```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM
```

Never put real credentials in `.env.example`; that file is tracked.

## Project structure

```
app/[locale]/         App Router: layout (metadata, fonts, JSON-LD), page, not-found,
                      opengraph-image, twitter-image; prerendered for en and fr
app/                  api/contact, sitemap, robots, manifest
proxy.ts              Locale negotiation and canonical URL handling (Next 16 proxy)
app/globals.css       Tailwind v4 design tokens (dark-first, oklch) and custom utilities
components/           One component per section, plus header, footer, hero simulation
components/ui/        shadcn/ui primitives (owned in-repo)
components/hero/      Three.js embedding field and the extraction pipeline simulator
components/nextblock/ Flagship product section (architecture diagram, metrics, pillars)
components/work/      Production web work (platform card, campaign mosaic, independent cards)
public/img/work/      800x506 site thumbnails captured 9 October 2026
data/                 English copy: site, projects, nextblock, work, arsenal, experience, about
data/fr/              French editions with identical exports and types
lib/i18n.ts, content  Locale primitives and the locale-aware content accessor
lib/                  utils (cn), curated brand icons, zod schemas, JSON-LD builder, OG card
public/               Resume PDF, the single personal photo, icons, llms.txt
docs/                 Career plan reference material (not shipped)
```

## Content rules

- No em dashes anywhere. Use hyphens, colons, commas, or parentheses.
- Copy lives in `data/*.ts`; components do not hard-code biographical facts or metrics.
- Project metrics are labelled `measured` (from saved benchmark records) or `target` (design SLOs).
