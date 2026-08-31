import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig, hreflangLocale } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl;

  const entries: MetadataRoute.Sitemap = [];

  const pages = [
    '',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-settings',
  ];

  for (const locale of routing.locales) {
    for (const page of pages) {
      const url = `${baseUrl}/${locale}${page}`;

      const languages: Record<string, string> = {};
      for (const loc of routing.locales) {
        languages[hreflangLocale[loc] || loc] = `${baseUrl}/${loc}${page}`;
      }
      languages['x-default'] = `${baseUrl}/${siteConfig.defaultLocale}${page}`;

      entries.push({
        url,
        lastModified: new Date(siteConfig.dateModified),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.5,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
