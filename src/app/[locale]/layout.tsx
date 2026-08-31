import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';
import { siteConfig, hreflangLocale } from '@/config/site';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = siteConfig.baseUrl;
  const selfUrl = `${baseUrl}/${locale}`;

  const openGraphLocale =
    locale === 'zh' ? 'zh_CN' : locale === 'sq' ? 'sq_AL' : 'en_US';

  return {
    metadataBase: new URL(baseUrl),
    title: messages.meta.title,
    description: messages.meta.description,
    applicationName: siteConfig.name,
    alternates: {
      canonical: selfUrl,
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      siteName: siteConfig.name,
      locale: openGraphLocale,
      type: 'website',
      url: selfUrl,
      images: [
        {
          url: siteConfig.heroImage,
          width: 1200,
          height: 800,
          alt: siteConfig.name,
        },
      ],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ea' },
    { media: '(prefers-color-scheme: dark)', color: '#0b2d3a' },
  ],
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.baseUrl}/#organization`,
  name: siteConfig.name,
  alternateName: siteConfig.alternateName,
  url: siteConfig.baseUrl,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={hreflangLocale[locale] || locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HXM22WWPKP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HXM22WWPKP');
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
