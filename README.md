# cloud-architecture.co.uk

Source for [cloud-architecture.co.uk](https://www.cloud-architecture.co.uk), my hands-on Microsoft 365 and Azure security blog. A static Astro site on Azure Static Web Apps. Blog posts live in a private submodule; this repo is the site itself.

> The live site is currently behind a "coming soon" gate while it's built out (see [Access](#access)).

## Stack

- [Astro](https://astro.build) (static output)
- [Tailwind CSS](https://tailwindcss.com) v4 and [Preline UI](https://preline.co)
- [Starlight](https://starlight.astro.build) for docs
- [Expressive Code](https://expressive-code.com) for script blocks
- [Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/), deployed via GitHub Actions

Infrastructure (Terraform) lives in [iac-cloud-architecture](https://github.com/Cloud-Architecture-UK/iac-cloud-architecture).

## Develop

Posts are a private submodule, so clone with it, then install:

```bash
git clone --recurse-submodules https://github.com/Cloud-Architecture-UK/web-cloud-architecture.git
cd web-cloud-architecture
npm install
npm run dev        # http://localhost:4321
```

Already cloned without it? Run `git submodule update --init --recursive` (needs read access to the private content repo).

## Build

```bash
npm run build      # astro build -> process-html.mjs -> scripts/csp-hashes.mjs -> dist/
npm run preview
```

The build post-processes the HTML and hashes every inline script into the Content-Security-Policy (`scripts/csp-hashes.mjs`), so `script-src` ships without `'unsafe-inline'`.

## Access

The site is gated in `public/staticwebapp.config.json`: anonymous visitors get the `/coming-soon` holding page, and every other route requires the `preview` role (Entra sign-in, assigned by invitation in Static Web Apps Role management). To go fully public, set the `/*` route's `allowedRoles` back to `["anonymous"]`.

## Content

Posts are Markdown in `src/content/blog/en/` (the private submodule), validated against the schema in `src/content.config.ts`.

## Structure

- `src/pages`: routes
- `src/components`: UI components
- `src/content/blog`: blog posts (private submodule)
- `src/layouts`: page layouts
- `public/coming-soon/`: the holding page served while gated
- `public/staticwebapp.config.json`: Static Web Apps config (auth gate, security headers, CSP, 404)
- `scripts/`: build helpers

## Deploy

Pushes to `master` deploy via GitHub Actions ([`azure-static-web-apps.yml`](.github/workflows/azure-static-web-apps.yml)). The workflow checks out the private content submodule with a PAT and skips Dependabot PRs, which don't have access to that token.

## Licence

Code is MIT (see [LICENSE](LICENSE)), derived from the [ScrewFast](https://github.com/mearashadowfax/ScrewFast) template. Blog content and images are © Mark Hughes, all rights reserved.
