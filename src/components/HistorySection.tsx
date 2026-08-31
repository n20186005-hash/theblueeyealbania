'use client';

import { useTranslations, useMessages } from 'next-intl';

type HistoryEvent = { year: string; title: string; content: string };
type HistoryFact = { label: string; value: string };

export default function HistorySection() {
  const t = useTranslations('history');
  const messages = useMessages() as any;
  const events = (messages?.history?.events || []) as HistoryEvent[];
  const facts = (messages?.history?.facts || []) as HistoryFact[];

  return (
    <section id="history" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>

        {facts.length > 0 && (
          <div className="mb-14">
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('keyFactsTitle')}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl p-4"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {fact.label}
                  </p>
                  <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--accent)' }}>
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <div
            className="absolute left-3 sm:left-28 top-0 bottom-0 w-0.5"
            style={{ background: 'var(--border-color)' }}
          />
          <div className="space-y-8">
            {events.map((event) => (
              <div key={event.year} className="relative flex flex-col sm:flex-row gap-2 sm:gap-6 pl-10 sm:pl-0">
                <div
                  className="absolute left-3 sm:left-28 -translate-x-1/2 w-3 h-3 rounded-full"
                  style={{ background: 'var(--accent)', top: '0.4rem' }}
                />
                <div className="sm:w-24 sm:text-right sm:flex-shrink-0 sm:pr-4">
                  <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
                    {event.year}
                  </span>
                </div>
                <div
                  className="flex-1 rounded-xl p-5"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <h3
                    className="font-display text-lg font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {event.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
