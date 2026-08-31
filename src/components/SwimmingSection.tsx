'use client';

import { useTranslations, useMessages } from 'next-intl';

export default function SwimmingSection() {
  const t = useTranslations('swimming');
  const messages = useMessages() as any;
  const reasons = (messages?.swimming?.reasons || []) as string[];

  return (
    <section id="swimming" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>

        <div
          className="rounded-2xl p-6 sm:p-7 mb-5"
          style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--accent)' }}
        >
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {t('status')}
          </span>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('official')}
          </p>
        </div>

        <div
          className="rounded-xl p-5 sm:p-6 mb-10"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        >
          <h3
            className="font-display text-lg font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('realityTitle')}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('reality')}
          </p>
        </div>

        <h3
          className="font-display text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('reasonsTitle')}
        </h3>
        <ul className="space-y-3 mb-10">
          {reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
              <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {reason}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="rounded-xl p-5 flex items-start gap-3"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            className="flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('alternativeTitle')}
            </p>
            <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('alternative')}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#tickets"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-75"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
          >
            {t('linkTickets')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="#transport"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-75"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
          >
            {t('linkTransport')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <p className="text-xs leading-relaxed mt-5" style={{ color: 'var(--text-secondary)' }}>
          {t('note')}
        </p>
      </div>
    </section>
  );
}
