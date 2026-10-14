# ECOINTL — Official Website

Corporate product website for **ECO International (ECOINTL)** — solar inverters, lithium battery systems, and complete energy-storage solutions. Built as a single-page marketing experience with a full product catalogue, datasheets, and enquiry flow.

**Live site:** https://ecointl.vercel.app

---

## Tech Stack

| Layer      | Technology                                                          |
|------------|---------------------------------------------------------------------|
| Framework  | [TanStack Start](https://tanstack.com/start) (SSR) on React 19      |
| Build      | [Vite 8](https://vite.dev)                                           |
| Styling    | Tailwind CSS 4 + shadcn/ui (Radix primitives)                       |
| Routing    | [TanStack Router](https://tanstack.com/router) (file-based, typed)  |
| Forms      | React Hook Form + Zod validation                                     |
| Testing    | Vitest + Testing Library                                             |
| Lint/Format| ESLint 9 + Prettier                                                  |
| Hosting    | Vercel (Build Output API via Nitro)                                  |

## Features

- **Homepage** — hero, product-family showcase, featured-products carousel, Our Members (Instagram), FAQ, and enquiry section
- **Product catalogue** — solar inverters, lithium batteries, and all-in-one systems, each with dedicated listing and detail pages
- **Downloadable datasheets** — 25+ PDF datasheets served from `/public/product-datasheets`
- **Centralised content** — all catalogue data, contacts, media, and visibility flags live in a single module ([`src/lib/eco-content.ts`](src/lib/eco-content.ts)); verified information replaces placeholders without layout changes
- **Graceful media fallbacks** — unavailable images/videos render as neutral reserved spaces; absent videos, articles, and credentials are hidden rather than faked
- **Responsive & accessible** — mobile-first layouts, keyboard-friendly carousels, favicons and PWA icons
- **SEO** — server-rendered routes, per-page metadata, `robots.txt`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+ and npm (or [bun](https://bun.sh))

### Installation

```sh
git clone https://github.com/AhmedAbbasiofficial/ecointernational.git
cd ecointernational
npm install
```

### Development

```sh
npm run dev        # start dev server (http://localhost:8080)
```

### Quality Checks

```sh
npm run lint       # ESLint
npm run format     # Prettier write
npm test           # Vitest suite
```

### Production Build

```sh
npm run build      # production build
npm run preview    # preview the build locally
```

## Project Structure

```
├── public/                  # static assets (images, favicons, datasheet PDFs)
├── src/
│   ├── components/          # UI components (home sections, layout, shadcn/ui)
│   ├── lib/
│   │   └── eco-content.ts   # single source of truth: catalogue, contacts, media
│   ├── routes/              # file-based routes (/, /products/*, /about-us, /contact-us)
│   ├── styles.css           # design tokens & global styles
│   └── test/                # Vitest setup & tests
├── vercel.json              # Vercel build configuration
└── vite.config.ts           # Vite / TanStack Start configuration
```

## Content Management

Product data — names, models, specs, datasheet URLs, and section visibility — is defined in **`src/lib/eco-content.ts`**. To update the catalogue or swap media, edit that module only; the UI picks up changes without markup edits. Absent entries are omitted gracefully.

> **Note:** the enquiry form is currently frontend-only (client-side validation, no data is transmitted or stored) until a backend endpoint is connected.

## Deployment

The project deploys to **Vercel** using the [Build Output API](https://vercel.com/docs/build-output-api) through Nitro:

- `vercel.json` pins `npm run build` with `NITRO_PRESET=vercel`
- One-time deploy: `vercel deploy --prod` (requires [Vercel CLI](https://vercel.com/docs/cli))
- Any git provider can be connected in the Vercel dashboard for automatic deployments on push to `main`

## License

All rights reserved © ECO International.
