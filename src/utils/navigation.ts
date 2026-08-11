// An array of links for navigation bar
const navBarLinks = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Frameworks', url: '/frameworks' },
  { name: 'Docs', url: '/docs/' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Content',
    links: [
      { name: 'Blog', url: '/blog' },
      { name: 'Frameworks', url: '/frameworks' },
      { name: 'Docs', url: '/docs/' },
      { name: 'RSS', url: '/rss.xml' },
    ],
  },
  {
    section: 'Cloud Architecture',
    links: [
      { name: 'About', url: '/about' },
      { name: 'Contact', url: '/contact' },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  github: 'https://github.com/Cloud-Architecture-UK',
  linkedin: 'https://www.linkedin.com/company/cloud-architecture-co-uk/',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
