'use client';

import { useTranslations, useMessages } from 'next-intl';

type SeasonalRow = {
  season: string;
  weather: string;
  spring: string;
  wildlife: string;
  bestFor: string;
};

export default function SeasonalStrategy() {
  const t = useTranslations('seasonal');
  const messages = useMessages() as any;
  const rows = (messages?.seasonal?.rows || []) as SeasonalRow[];
  const cols = (messages?.seasonal?.cols || {}) as Record<string, string>;

  if (rows.length === 0) return null;

  return (
    <section id="seasonal" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />

        <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>

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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('note')}
          </p>
        </div>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full border-collapse text-sm min-w-[720px]">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--accent)' }}>
                <Th>{cols.season}</Th>
                <Th>{cols.weather}</Th>
                <Th>{cols.spring}</Th>
                <Th>{cols.wildlife}</Th>
                <Th>{cols.bestFor}</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.season}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: i % 2 === 1 ? 'var(--bg-tertiary)' : 'transparent',
                  }}
                >
                  <Td className="font-semibold" style={{ color: 'var(--accent)' }}>
                    {row.season}
                  </Td>
                  <Td>{row.weather}</Td>
                  <Td>{row.spring}</Td>
                  <Td>{row.wildlife}</Td>
                  <Td>{row.bestFor}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="text-left font-semibold p-3 align-top"
      style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <td
      className={`p-3 align-top leading-relaxed ${className}`}
      style={{ color: 'var(--text-secondary)', ...style }}
    >
      {children}
    </td>
  );
}
