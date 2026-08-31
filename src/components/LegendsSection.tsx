'use client';

import { useTranslations, useMessages } from 'next-intl';

type Legend = { id: string; kind: string; title: string; content: string };

export default function LegendsSection() {
  const t = useTranslations('legends');
  const messages = useMessages() as any;
  const items = (messages?.legends?.items || []) as Legend[];

  return (
    <section id="legends" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />

        <div
          className="rounded-xl p-5 flex items-start gap-3 mb-10"
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
            <path d="M12 3l9 16H3l9-16z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('disclaimer')}
          </p>
        </div>

        <div className="space-y-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-6 sm:p-7"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <h3
                  className="font-display text-xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {item.kind}
                </span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
