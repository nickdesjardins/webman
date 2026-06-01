# Webman — Nicolas Desjardins

Personal resume / portfolio site, built with **Next.js (App Router) + TypeScript**.

This was originally the BootstrapMade "MyResume" static HTML template and has been
rewritten as idiomatic React components. The vendor jQuery-style libraries were
replaced with React equivalents:

| Original                        | Replacement                              |
| ------------------------------- | ---------------------------------------- |
| Isotope (portfolio filtering)   | React state filtering                    |
| GLightbox                       | Custom `Lightbox` component              |
| Waypoints (skill bars)          | `IntersectionObserver`                   |
| PureCounter (fact counters)     | `IntersectionObserver` + `requestAnimationFrame` |
| Typed.js                        | `typed.js` (initialized in a `useEffect`)|
| Swiper (testimonials/details)   | `swiper/react`                           |
| AOS                             | `aos` (initialized once on the client)   |
| `forms/contact.php`             | `/api/contact` route handler (nodemailer)|

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

## Contact form

`POST /api/contact` validates the payload and sends an email via SMTP. It stays
inert (returns `503`) until SMTP credentials are configured. Copy `.env.example`
to `.env.local` and fill in:

```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM
```

## Project structure

```
app/                 App Router (layout, home page, /portfolio-details, /api/contact)
app/template.css     Original template styles (ported, fonts wired to CSS variables)
components/          One component per section + Header / Footer / BackToTop / Lightbox
data/                tools.ts (180 tools) and portfolio.ts data
public/assets/       Images, favicons, resume.pdf
```
