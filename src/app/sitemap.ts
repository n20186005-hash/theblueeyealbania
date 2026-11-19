import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig, hreflangLocale } from '@/config/site';
import { guideSlugs } from '@/lib/guides';
import { nearbySlugs } from '@/lib/nearby';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl;

  const entries: MetadataRoute.Sitemap = [];

  const pages = [
    '',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-settings',
    ...guideSlugs.map(slug => `/guides/${slug}`),
    ...nearbySlugs.map(slug => `/nearby/${slug}`),
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
        priority: page === '' ? 1 : page.startsWith('/guides/') || page.startsWith('/nearby/') ? 0.8 : 0.5,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
