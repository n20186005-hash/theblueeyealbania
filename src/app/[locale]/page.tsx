import { setRequestLocale, getMessages } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig, hreflangLocale } from '@/config/site';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Breadcrumb from '@/components/Breadcrumb';
import Intro from '@/components/Intro';
import TableOfContents from '@/components/TableOfContents';
import InfoSection from '@/components/InfoSection';
import BasicInfo from '@/components/BasicInfo';
import HoursSection from '@/components/HoursSection';
import WeatherWidget from '@/components/WeatherWidget';
import TicketsSection from '@/components/TicketsSection';
import SwimmingSection from '@/components/SwimmingSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import HistorySection from '@/components/HistorySection';
import LegendsSection from '@/components/LegendsSection';
import TransportSection from '@/components/TransportSection';
import RouteSection from '@/components/RouteSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import MapEmbed from '@/components/MapEmbed';
import FAQSection from '@/components/FAQSection';
import SourcesSection from '@/components/SourcesSection';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = siteConfig.baseUrl;
  const selfUrl = `${baseUrl}/${locale}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[hreflangLocale[loc] || loc] = `${baseUrl}/${loc}`;
  }
  languages['x-default'] = `${baseUrl}/${siteConfig.defaultLocale}`;

  return {
    alternates: {
      canonical: selfUrl,
      languages,
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      type: 'website',
      url: selfUrl,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as any;

  const baseUrl = siteConfig.baseUrl;
  const selfUrl = `${baseUrl}/${locale}`;
  const inLanguage = hreflangLocale[locale] || locale;

  const faqItems = (messages?.faq?.items || []) as Array<{
    question: string;
    answer: string;
  }>;

  const breadcrumbItems = (messages?.breadcrumb?.items || [
    siteConfig.name,
    'Saranda',
    'Vlorë County',
    'Albania',
  ]) as string[];

  const graph = [
    {
      '@type': 'TouristAttraction',
      '@id': `${baseUrl}/#attraction`,
      name: siteConfig.name,
      alternateName: [
        siteConfig.alternateName,
        'Blue Eye Albania',
        'Blue Eye Saranda',
      ],
      description: messages?.intro?.description,
      url: selfUrl,
      image: siteConfig.heroImage,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.streetAddress,
        addressLocality: siteConfig.address.addressLocality,
        postalCode: siteConfig.address.postalCode,
        addressCountry: siteConfig.address.addressCountry,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.coordinates.latitude,
        longitude: siteConfig.coordinates.longitude,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: siteConfig.openingHours.opens,
          closes: siteConfig.openingHours.closes,
        },
      ],
      isAccessibleForFree: false,
      hasMap: siteConfig.mapsUrl,
      sameAs: [siteConfig.mapsUrl, siteConfig.govtTourismUrl],
      touristType: [
        'Nature and wildlife enthusiasts',
        'Families',
        'Photographers',
        'Hikers and walkers',
      ],
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Public restrooms',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Paid parking',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Food and drink outlets',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Waymarked walking trails and viewing platforms',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Wheelchair accessible route',
          value: 'Partial',
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Accommodation on site',
          value: false,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Electric vehicle charging on site',
          value: false,
        },
      ],
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Spring altitude',
          value: '152 m above sea level',
        },
        {
          '@type': 'PropertyValue',
          name: 'Average discharge',
          value: 'approximately 18,400 litres per second',
        },
        {
          '@type': 'PropertyValue',
          name: 'Explored depth',
          value: '50 m; total depth unmeasured',
        },
        {
          '@type': 'PropertyValue',
          name: 'Water temperature',
          value: 'approximately 10 °C year-round',
        },
        {
          '@type': 'PropertyValue',
          name: 'Protected area',
          value: '1.8 km² (180 ha), IUCN category III Natural Monument, designated 1996',
        },
        {
          '@type': 'PropertyValue',
          name: 'Outflow',
          value: 'Bistricë river, approximately 25 km to the Ionian Sea',
        },
        {
          '@type': 'PropertyValue',
          name: 'Plus Code',
          value: `${siteConfig.plusCode} Sarandë, Albania`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Entrance fee',
          value:
            'Approximately 50 Albanian lek (ALL) per person; parking approximately 200 ALL per vehicle; cash only',
        },
        {
          '@type': 'PropertyValue',
          name: 'Swimming',
          value: 'Prohibited — protected Nature Monument (IUCN category III)',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: breadcrumbItems[0],
          item: selfUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: breadcrumbItems[1],
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: breadcrumbItems[2],
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: breadcrumbItems[3],
          item: `${baseUrl}/${locale}`,
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${selfUrl}#webpage`,
      url: selfUrl,
      name: messages?.meta?.title,
      description: messages?.meta?.description,
      inLanguage,
      dateModified: siteConfig.dateModified,
      isPartOf: { '@id': `${baseUrl}/#website` },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: siteConfig.name,
      inLanguage: 'en',
      publisher: { '@id': `${baseUrl}/#organization` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Breadcrumb />
        <Intro />
        <TableOfContents />
        <InfoSection />
        <BasicInfo />
        <HoursSection />
        <WeatherWidget />
        <TicketsSection />
        <SwimmingSection />
        <FacilitiesSection />
        <HistorySection />
        <LegendsSection />
        <TransportSection />
        <RouteSection />
        <Gallery />
        <Reviews />
        <FAQSection />
        <MapEmbed />
        <SourcesSection />
      </main>
      <Footer />
    </>
  );
}
