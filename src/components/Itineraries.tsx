'use client';

import { useTranslations, useMessages } from 'next-intl';
import type { ReactNode } from 'react';

type Audience = {
  id: string;
  name: string;
  desc: string;
  tips: string[];
};

type RoutePlan = {
  title: string;
  time: string;
  steps: string[];
};

const AUDIENCE_ICONS: Record<string, ReactNode> = {
  families: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="8" r="2.5" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 20v-3a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v3M14 20v-2.5a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3V20" />
    </svg>
  ),
  photographers: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  accessible: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.6" />
      <path d="M8.5 9l3.5 1 3.5-1M12 10v5l-3 6M12 15l3 6" />
    </svg>
  ),
};

export default function Itineraries() {
  const t = useTranslations('itineraries');
  const messages = useMessages() as any;
  const audiences = (messages?.itineraries?.audiences || []) as Audience[];
  const halfDay = (messages?.itineraries?.halfDay || {}) as RoutePlan;
  const fullDay = (messages?.itineraries?.fullDay || {}) as RoutePlan;

  return (
    <section id="itineraries" className="section-padding">
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

        {/* By type of visitor */}
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('audienceTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {audiences.map((audience) => (
            <div
              key={audience.id}
              className="rounded-2xl p-5"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {AUDIENCE_ICONS[audience.id] ?? AUDIENCE_ICONS.families}
              </div>
              <h4 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {audience.name}
              </h4>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {audience.desc}
              </p>
              <ul className="space-y-1.5">
                {audience.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent)' }} />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* By available time */}
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('routesTitle')}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RouteCard plan={halfDay} accent />
          <RouteCard plan={fullDay} />
        </div>
      </div>
    </section>
  );
}

function RouteCard({ plan, accent = false }: { plan: RoutePlan; accent?: boolean }) {
  if (!plan?.title) return null;
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: accent ? 'var(--accent)' : 'var(--bg-tertiary)',
        border: accent ? 'none' : '1px solid var(--border-color)',
      }}
    >
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h4
          className="font-display text-xl font-semibold"
          style={{ color: accent ? '#fff' : 'var(--text-primary)' }}
        >
          {plan.title}
        </h4>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{
            background: accent ? 'rgba(255,255,255,0.18)' : 'var(--bg-secondary)',
            color: accent ? '#fff' : 'var(--accent)',
            border: accent ? 'none' : '1px solid var(--border-color)',
          }}
        >
          {plan.time}
        </span>
      </div>
      <ol className="space-y-3">
        {plan.steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: accent ? 'rgba(255,255,255,0.22)' : 'var(--bg-secondary)',
                color: accent ? '#fff' : 'var(--accent)',
              }}
            >
              {idx + 1}
            </span>
            <span
              className="text-sm leading-relaxed pt-0.5"
              style={{ color: accent ? 'rgba(255,255,255,0.92)' : 'var(--text-secondary)' }}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
