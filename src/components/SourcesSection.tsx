import { useTranslations } from 'next-intl';
import { useMessages } from 'next-intl';

// E-E-A-T: links to official Albanian government institutions for verification.
export default function SourcesSection() {
  const t = useTranslations('sources');
  const messages = useMessages() as any;
  const items = (messages?.sources?.items || []) as Array<{
    name: string;
    url: string;
  }>;

  return (
    <section id="sources" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>{t('note')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {item.name}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
