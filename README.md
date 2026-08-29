# cloud-architecture.co.uk

Source for [cloud-architecture.co.uk](https://www.cloud-architecture.co.uk), my hands-on Microsoft 365 and Azure security blog.

**This repository is public only so the site builds and deploys on GitHub's free tier for public repositories. It is not a template or a starting point, and it is not intended to be cloned, built, reused or contributed to.** The blog content lives in a private submodule, so a clone won't build without access to it in any case. Please don't redeploy it as your own.

## What it is

A static [Astro](https://astro.build) site hosted on [Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/), deployed from `master` via GitHub Actions. Infrastructure (Terraform) is managed in a separate private repository. The live site is currently behind a "coming soon" gate (`public/staticwebapp.config.json`) while it's built out.

Stack: Astro (static output), Tailwind CSS v4 + Preline UI, Starlight for docs, Expressive Code for script blocks. The build post-processes the HTML and hashes every inline script into the Content-Security-Policy (`scripts/csp-hashes.mjs`), so `script-src` ships without `'unsafe-inline'`.

## Licence

Code is MIT (see [LICENSE](LICENSE)), derived from the [ScrewFast](https://github.com/mearashadowfax/ScrewFast) template. Blog content and images are © Mark Hughes, all rights reserved.
