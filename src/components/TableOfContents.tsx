'use client';

import { useTranslations, useMessages } from 'next-intl';

type TocItem = { id: string; label: string };

export default function TableOfContents() {
  const t = useTranslations('toc');
  const messages = useMessages() as any;
  const items = (messages?.toc?.items || []) as TocItem[];

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={t('title')}
      className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 mb-12"
    >
      <div
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('title')}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--accent)' }}
                />
                <span className="truncate">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
