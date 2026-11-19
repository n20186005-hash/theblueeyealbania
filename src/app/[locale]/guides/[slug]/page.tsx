import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { guides, guideSlugs, sectionLabels, type GuideSlug } from '@/lib/guides';
import { siteConfig, hreflangLocale } from '@/config/site';

type Locale = 'sq' | 'en' | 'zh';
type Params = Promise<{ locale: string; slug: string }>;
export function generateStaticParams() { return (['sq', 'en', 'zh'] as const).flatMap(locale => guideSlugs.map(slug => ({ locale, slug }))); }
function getGuide(locale: string, slug: string) {
  if (!['sq', 'en', 'zh'].includes(locale) || !guideSlugs.includes(slug as GuideSlug)) notFound();
  return guides[locale as Locale][slug as GuideSlug];
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(locale, slug);
  const canonical = `${siteConfig.baseUrl}/${locale}/guides/${slug}`;
  return { title: `${guide.title} | The Blue Eye`, description: guide.intro, alternates: { canonical, languages: Object.fromEntries([...(['sq','en','zh'] as const).map(l => [hreflangLocale[l], `${siteConfig.baseUrl}/${l}/guides/${slug}`]), ['x-default', `${siteConfig.baseUrl}/sq/guides/${slug}`]]) }, openGraph: { title: guide.title, description: guide.intro, url: canonical, type: 'article' } };
}
export default async function GuidePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const g = getGuide(locale, slug);
  const labels = sectionLabels[locale as Locale];
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Syri i Kaltër Blue Eye Muzinë Albania')}`;
  const related = guideSlugs.filter(s => s !== slug);
  const photo = `/gallery/the-blue-eye-${slug === 'tickets' ? '02' : slug === 'saranda-transport' ? '06' : slug === 'opening-hours' ? '11' : '14'}.jpg`;
  const url = `${siteConfig.baseUrl}/${locale}/guides/${slug}`;
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: g.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) };
  return <>
    <Header />
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <section className="pt-28 pb-12 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <a href={`/${locale}`} className="text-sm underline" style={{ color: 'var(--accent)' }}>The Blue Eye / Syri i Kaltër</a>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 mb-4">{g.title}</h1>
          <p className="text-xl mb-5" style={{ color: 'var(--text-secondary)' }}>{g.subtitle}</p>
          <p className="leading-8 max-w-3xl">{g.intro}</p>
          <div className="flex flex-wrap gap-3 mt-6"><a href={maps} target="_blank" rel="noopener noreferrer" className="rounded-full px-5 py-3 text-white" style={{ background: 'var(--accent)' }}>Google Maps ↗</a><a href={`/${locale}#explore-guides`} className="rounded-full px-5 py-3 border" style={{ borderColor: 'var(--border-color)' }}>{locale === 'zh' ? '更多指南' : locale === 'sq' ? 'Udhëzues të tjerë' : 'More guides'}</a></div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <section className="rounded-2xl p-6 md:p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}><h2 className="font-display text-2xl font-semibold mb-4">{labels[0]}</h2><p className="leading-8">{g.management}</p><a className="block mt-4 underline" href="https://akt.gov.al/en/monumente-natyrore/syri-i-kalter/" target="_blank" rel="noopener noreferrer">Albanian National Tourism Agency ↗</a></section>
        <section><h2 className="font-display text-2xl font-semibold mb-5">{labels[1]}</h2><ul className="grid md:grid-cols-3 gap-4">{g.overview.map((item,i) => <li key={i} className="p-5 rounded-xl leading-7" style={{ background: 'var(--bg-secondary)' }}>{item}</li>)}</ul></section>
        <section><h2 className="font-display text-2xl font-semibold mb-4">{labels[2]}</h2><div className="grid md:grid-cols-2 gap-8 items-center"><div className="space-y-4 leading-8">{g.details.map((x,i)=><p key={i}>{x}</p>)}</div><img src={photo} alt={`${g.title} — Syri i Kaltër`} className="rounded-2xl w-full object-cover max-h-80" loading="lazy" /></div></section>
        <section><h2 className="font-display text-2xl font-semibold mb-5">{labels[3]}</h2><ol className="space-y-3">{g.route.map((x,i)=><li className="flex gap-4 items-start leading-7" key={i}><span className="rounded-full shrink-0 w-8 h-8 flex items-center justify-center text-white" style={{ background: 'var(--accent)' }}>{i+1}</span>{x}</li>)}</ol></section>
        <section className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)' }}><h2 className="font-display text-2xl font-semibold mb-3">{labels[4]}</h2><p className="leading-8">{g.photo}</p></section>
        <section><h2 className="font-display text-2xl font-semibold mb-5">{labels[5]}</h2><div className="space-y-4">{g.faqs.map(([q,a])=><div key={q} className="border-b pb-4" style={{ borderColor: 'var(--border-color)' }}><h3 className="font-semibold mb-2">{q}</h3><p className="leading-7">{a}</p></div>)}</div></section>
        <section><h2 className="font-display text-2xl font-semibold mb-3">{labels[6]}</h2><p className="mb-4">Syri i Kaltër · Muzinë · Albania</p><a href={maps} className="underline" target="_blank" rel="noopener noreferrer">Google Maps — Syri i Kaltër ↗</a></section>
        <section><h2 className="font-display text-2xl font-semibold mb-5">{locale === 'zh' ? '继续探索蓝眼泉' : locale === 'sq' ? 'Eksploroni më tej' : 'Explore more guides'}</h2><div className="grid md:grid-cols-3 gap-4">{related.map(s=><a key={s} href={`/${locale}/guides/${s}`} className="rounded-xl p-5 hover:underline" style={{ background: 'var(--bg-secondary)' }}>{guides[locale as Locale][s].title} →</a>)}</div></section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify([{ '@context':'https://schema.org', '@type':'Article', headline:g.title, description:g.intro, inLanguage:hreflangLocale[locale], mainEntityOfPage:url, dateModified:'2026-11-19' }, faqSchema])}} />
    </main>
    <Footer />
  </>;
}
