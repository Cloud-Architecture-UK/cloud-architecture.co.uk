import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: 'https://www.cloud-architecture.co.uk',
  image: {
    domains: ['images.unsplash.com'],
  },
  prefetch: true,
  integrations: [
    // Rich code blocks (copy button, titles, line numbers/highlighting) across
    // the blog. Must precede mdx; Starlight shares this instance for the docs.
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) =>
        theme.type === 'dark' ? '.dark' : ':root:not(.dark)',
      styleOverrides: {
        borderRadius: '0.6rem',
        borderColor: '#aad5d5',
        frames: {
          shadowColor: 'transparent',
        },
      },
    }),
    sitemap(),
    starlight({
      title: 'Cloud Architecture Docs',
      sidebar: [
        { label: 'Overview', link: '/welcome-to-docs/' },
        { label: 'Start here', link: '/start-here/' },
        {
          label: 'Reference',
          items: [
            { label: 'Framework map', link: '/framework-mapping/' },
            { label: 'Licensing map', link: '/licensing/' },
          ],
        },
      ],
      social: [
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/company/cloud-architecture-co-uk/',
        },
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Cloud-Architecture-UK',
        },
      ],
      disable404Route: true,
      customCss: ['./src/assets/styles/starlight.css'],
      favicon: '/favicon.ico',
      components: {
        SiteTitle: './src/components/ui/starlight/SiteTitle.astro',
        Head: './src/components/ui/starlight/Head.astro',
        MobileMenuFooter:
          './src/components/ui/starlight/MobileMenuFooter.astro',
        ThemeSelect: './src/components/ui/starlight/ThemeSelect.astro',
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://www.cloud-architecture.co.uk' + '/social.webp',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'twitter:image',
            content: 'https://www.cloud-architecture.co.uk' + '/social.webp',
          },
        },
      ],
    }),
    mdx(),
  ],
  build: {
    // Inline the (small) page CSS so it isn't a render-blocking request,
    // which was costing ~110ms of FCP on throttled mobile.
    inlineStylesheets: 'always',
  },
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
