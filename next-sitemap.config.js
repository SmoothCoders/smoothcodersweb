/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://smoothcoders.com',
  generateRobotsTxt: false, // We have a custom robots.txt
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom priority for specific pages
    const priorities = {
      '/': 1.0,
      '/services': 0.9,
      '/portfolio': 0.8,
      '/contact': 0.9,
      '/about': 0.8,
      '/blog': 0.7,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
