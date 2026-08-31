'use client';

import { useTranslations, useMessages } from 'next-intl';
import type { CSSProperties, ReactNode } from 'react';

type FacilityItem = {
  id: string;
  name: string;
  desc: string;
  level: string;
};

type FacilityGroup = {
  id: string;
  title: string;
  items: FacilityItem[];
};

const ICONS: Record<string, ReactNode> = {
  restroom: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="4" r="2" />
      <path d="M5 9v5a2 2 0 0 0 2 2h1v4h-1M5 9h4M7 9v5" />
      <circle cx="17" cy="4" r="2" />
      <path d="M15 9v3h4V9M17 12v3l-1 5M17 12l2 5" />
    </svg>
  ),
  parking: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  ),
  trail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20c3-6 5-9 8-12M12 8l-2-2M12 8l3-1" />
      <path d="M4 20h16" />
      <path d="M14 20c2-4 3-6 6-8" />
    </svg>
  ),
  shade: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 3c4 0 7 3 7 7H5c0-4 3-7 7-7z" />
      <path d="M12 10v11M8 21h8" />
    </svg>
  ),
  waste: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  ),
  water: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c3 4 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 3-6 6-10z" />
    </svg>
  ),
  restaurant: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10" />
      <path d="M17 3c-1.5 2-2 4-2 6s.5 3 2 3 2-1 2-3-.5-4-2-6zM17 12v9" />
    </svg>
  ),
  fish: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c3-5 7-7 11-7 4 0 7 3 9 7-2 4-5 7-9 7-4 0-8-2-11-7z" />
      <path d="M7 10h.01M14 13h.01" />
    </svg>
  ),
  picnic: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18M5 20l2-9h10l2 9" />
      <path d="M12 11V4M12 4c1.5 0 2.5 1 2.5 2S13.5 8 12 8s-2.5-1-2.5-2S10.5 4 12 4z" />
    </svg>
  ),
  dietary: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4c0 8-5 12-11 12H7c0-8 5-12 11-12h2z" />
      <path d="M4 20c2-4 5-6 8-7" />
    </svg>
  ),
  accommodation: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18V6M3 12h12a4 4 0 0 1 4 4v2M3 18h18" />
      <circle cx="7" cy="9" r="2" />
    </svg>
  ),
  camping: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 12H4l8-12z" />
      <path d="M12 21v-6M12 15l-4 6M12 15l4 6" />
    </svg>
  ),
  grocery: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16l-1.5 12H5.5L4 8z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  ),
  souvenir: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7S9.5 3 7 4s3 3 5 3zM12 7s2.5-4 5-3-3 3-5 3z" />
    </svg>
  ),
  fuel: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M3 21h12M6 8h6" />
      <path d="M13 9h3a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0v-6l-2-3" />
    </svg>
  ),
  ev: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M15 11h2a3 3 0 0 1 0 6h-2" />
      <path d="M11 10l-2 3h3l-2 3" />
    </svg>
  ),
  rental: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M9 17h6M6 14V9l4-3M18 14v-4l-4-2M12 7h4" />
    </svg>
  ),
  payment: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  ),
  firstaid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  ),
  signal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13a10 10 0 0 1 14 0M8 16a6 6 0 0 1 8 0" />
      <path d="M12 20h.01" />
      <path d="M2 9a16 16 0 0 1 20 0" />
    </svg>
  ),
  accessibility: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.5" />
      <path d="M9 9l3 1 3-1M12 10v5l-3 6M12 15l3 6" />
    </svg>
  ),
  family: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="8" r="2.5" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 20v-3a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v3M14 20v-2.5a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3V20" />
    </svg>
  ),
  drone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="19" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M6.7 6.7l1.8 1.8M17.3 6.7l-1.8 1.8M6.7 17.3l1.8-1.8M17.3 17.3l-1.8-1.8" />
    </svg>
  ),
  default: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

const LEVEL_STYLE: Record<string, CSSProperties> = {
  onsite: { background: 'var(--accent)', color: '#fff' },
  nearby: { background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)' },
  planning: {
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
  },
};

export default function FacilitiesSection() {
  const t = useTranslations('facilities');
  const messages = useMessages() as any;
  const groups = (messages?.facilities?.groups || []) as FacilityGroup[];

  return (
    <section id="facilities" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
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
          className="rounded-xl p-5 flex items-start gap-3 mb-12"
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

        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.id}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded" style={{ background: 'var(--accent)' }} />
                <h3
                  className="font-display text-xl sm:text-2xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {group.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-5"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--accent)', color: '#fff' }}
                      >
                        {ICONS[item.id] || ICONS.default}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {item.name}
                          </h4>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={LEVEL_STYLE[item.level] || LEVEL_STYLE.planning}
                          >
                            {t(`levels.${item.level}` as any)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
