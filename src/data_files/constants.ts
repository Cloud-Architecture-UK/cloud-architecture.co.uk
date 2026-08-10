import ogImageSrc from '@images/social.png';

export const SITE = {
  title: 'Cloud Architecture',
  tagline: 'Secure Microsoft 365, properly',
  description:
    'Hands-on Azure and Microsoft 365 security: the portal steps, the reasoning behind them, and the PowerShell to automate it. Mapped to CIS, NIST, ISO 27001, NCSC and NIS2.',
  description_short:
    'Hands-on Azure and Microsoft 365 security: the portal steps, the reasoning behind them, and the PowerShell to automate it. Mapped to CIS, NIST, ISO 27001, NCSC and NIS2.',
  url: 'https://www.cloud-architecture.co.uk',
  author: 'Mark Hughes',
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    inLanguage: 'en-US',
    '@id': SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      '@type': 'WebSite',
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: 'en_US',
  type: 'website',
  url: SITE.url,
  title: 'Cloud Architecture: Secure Microsoft 365, properly',
  description:
    'Hands-on Azure and Microsoft 365 security. Every control three ways: the portal steps, the reasoning, and copy-paste PowerShell to automate it. Mapped to CIS, NIST, ISO 27001, NCSC and NIS2, and built for real tenants.',
  image: ogImageSrc,
};
