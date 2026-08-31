// Central site configuration for The Blue Eye (Syri i Kaltër), Albania.
// Single source of truth for domain, maps links, coordinates and structured data facts.

export const siteConfig = {
  name: 'The Blue Eye',
  alternateName: 'Syri i Kaltër',
  baseUrl: 'https://theblueeyealbania.com',
  // Default locale: Albanian (sq); visitors can switch to Chinese (zh) / English (en).
  defaultLocale: 'sq' as const,
  mapsUrl: 'https://maps.app.goo.gl/s9TJ3BS1FCPETXSe6',
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5442.452395684582!2d20.1874873!3d39.921581!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135b0f01c1bca3b5%3A0x4b23574d1579d66b!2sThe%20Blue%20Eye!5e1!3m2!1szh-CN!2s!4v1788180080932!5m2!1szh-CN!2s',
  coordinates: {
    latitude: 39.921581,
    longitude: 20.1874873,
  },
  // IANA time zone used by the weather module (Open-Meteo).
  timezone: 'Europe/Tirane',
  plusCode: 'W5FV+G4',
  address: {
    streetAddress: 'Sarande SHA22',
    addressLocality: 'Saranda',
    postalCode: '9701',
    addressCountry: 'AL',
  },
  openingHours: {
    opens: '07:00',
    closes: '19:00',
  },
  heroImage: 'https://theblueeyealbania.com/gallery/the-blue-eye-01.jpg',
  // Official tourism authority of Albania (Ministry of Tourism, Culture and Sport).
  govtTourismUrl: 'https://mtks.gov.al/en/',
  // Content revision date; keep in sync with visible "last updated" texts.
  dateModified: '2026-08-31',
};

// Maps a next-intl locale to its hreflang / <html lang> value.
export const hreflangLocale: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN',
  sq: 'sq',
};
