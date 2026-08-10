# cloud-architecture.co.uk

Source for [cloud-architecture.co.uk](https://www.cloud-architecture.co.uk), my Microsoft 365 and Azure security blog. Astro, static, on Azure Static Web Apps. Posts live in a private submodule; this repo is the site.

## Stack

- [Astro](https://astro.build) (static output)
- [Tailwind CSS](https://tailwindcss.com) v4 and [Preline UI](https://preline.co)
- [Starlight](https://starlight.astro.build) for docs
- [Expressive Code](https://expressive-code.com) for script blocks
- Hosted on [Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/), deployed via GitHub Actions

Infrastructure (Terraform) lives in [iac-cloud-architecture](https://github.com/Cloud-Architecture-UK/iac-cloud-architecture).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # astro build + HTML post-processing + CSP hashing -> dist/
npm run preview
```

The build hashes every inline script into the Content-Security-Policy (`scripts/csp-hashes.mjs`), so `script-src` ships without `'unsafe-inline'`.

## Content

Posts are Markdown in `src/content/blog/en/`, validated against the schema in `src/content.config.ts`.

## Structure

- `src/pages` — routes
- `src/components` — UI components
- `src/content/blog` — blog posts (Markdown)
- `src/layouts` — page layouts
- `public/staticwebapp.config.json` — Static Web Apps config (security headers, CSP, 404)
- `scripts/` — build helpers

## Licence

Code is MIT (see [LICENSE](LICENSE)), derived from the [ScrewFast](https://github.com/mearashadowfax/ScrewFast) template. Blog content and images are © Mark Hughes, all rights reserved.
