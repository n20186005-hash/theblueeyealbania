import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} (${siteConfig.alternateName}) - Visitor Guide`,
    short_name: siteConfig.name,
    description:
      'Visitor guide to The Blue Eye (Syri i Kaltër) spring near Saranda, Albania: tickets, opening hours, transport and swimming rules.',
    start_url: `/${siteConfig.defaultLocale}`,
    display: 'standalone',
    background_color: '#0b2d3a',
    theme_color: '#0b2d3a',
    categories: ['travel', 'tourism'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
