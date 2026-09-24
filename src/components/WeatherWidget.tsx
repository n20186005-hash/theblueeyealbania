// Weather section — Server Component.
//
// Data is fetched on the server (see src/lib/weather.ts) and cached there, so
// the visitor only ever sees the result (current conditions + 7-day outlook).
// We deliberately keep any mention of the data provider or its licensing out of
// the rendered UI: a visitor cares about whether they need a coat or an umbrella,
// not where the numbers come from.

import { getTranslations, getLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { getWeather, buildAdvice, adviceLabels } from '@/lib/weather';

const INTL_LOCALE: Record<string, string> = {
  sq: 'sq-AL',
  zh: 'zh-CN',
  en: 'en-GB',
};

function codeKey(code: number): string {
  if (code === 0) return 'clear';
  if (code === 1) return 'mainlyClear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) return 'drizzle';
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67) return 'rain';
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86)
    return 'snow';
  if (code === 80 || code === 81 || code === 82) return 'showers';
  if (code === 95) return 'thunderstorm';
  if (code === 96 || code === 99) return 'thunderstormHail';
  return 'clear';
}

function WeatherIcon({ code, size = 28 }: { code: number; size?: number }) {
  const key = codeKey(code);
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor' as const,
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const icons: Record<string, ReactNode> = {
    clear: (
      <svg {...common}>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
      </svg>
    ),
    mainlyClear: (
      <svg {...common}>
        <circle cx="9" cy="9" r="3.4" />
        <path d="M9 2.6v1.6M2.6 9h1.6M4.5 4.5l1.2 1.2M13.5 4.5l-1.2 1.2" />
        <path d="M17 20h-5.5a3.5 3.5 0 0 1 .5-7 4.6 4.6 0 0 1 8.6 1.2A3.4 3.4 0 0 1 17 20z" />
      </svg>
    ),
    partlyCloudy: (
      <svg {...common}>
        <circle cx="8.5" cy="8" r="2.8" />
        <path d="M8.5 2.8v1.4M3.3 8h1.4" />
        <path d="M17 20h-5a3.4 3.4 0 0 1 .4-6.8A4.5 4.5 0 0 1 21 14.4 3.3 3.3 0 0 1 17 20z" />
      </svg>
    ),
    overcast: (
      <svg {...common}>
        <path d="M7.5 12.5a4 4 0 0 1 7.6-1.4" />
        <path d="M17 19H7.2a4.2 4.2 0 0 1 .4-8.4 5.5 5.5 0 0 1 10.3 1.4A3.9 3.9 0 0 1 17 19z" />
      </svg>
    ),
    fog: (
      <svg {...common}>
        <path d="M17 13.5H7a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 9.9 1.4A3.8 3.8 0 0 1 17 13.5z" />
        <path d="M4 17h16M6 20.5h12" />
      </svg>
    ),
    drizzle: (
      <svg {...common}>
        <path d="M17 14H7a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 9.9 1.4A3.8 3.8 0 0 1 17 14z" />
        <path d="M9 18v1.5M13 18v1.5" />
      </svg>
    ),
    rain: (
      <svg {...common}>
        <path d="M17 14H7a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 9.9 1.4A3.8 3.8 0 0 1 17 14z" />
        <path d="M8.5 17.5l-1 2.5M12 17.5l-1 2.5M15.5 17.5l-1 2.5" />
      </svg>
    ),
    snow: (
      <svg {...common}>
        <path d="M17 14H7a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 9.9 1.4A3.8 3.8 0 0 1 17 14z" />
        <path d="M9 18h.01M12 20h.01M15 18h.01" />
      </svg>
    ),
    showers: (
      <svg {...common}>
        <path d="M17 13H7a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 9.9 1.4A3.8 3.8 0 0 1 17 13z" />
        <path d="M8 16.5l-1.2 3M12 16.5l-1.2 3M16 16.5l-1.2 3" />
      </svg>
    ),
    thunderstorm: (
      <svg {...common}>
        <path d="M17 13H7a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 9.9 1.4A3.8 3.8 0 0 1 17 13z" />
        <path d="M13 16l-3 3.5h2.5L11 22" />
      </svg>
    ),
    thunderstormHail: (
      <svg {...common}>
        <path d="M17 13H7a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 9.9 1.4A3.8 3.8 0 0 1 17 13z" />
        <path d="M12 16.5l-2 2.5h1.8l-1 2" />
        <circle cx="17.5" cy="20" r="1.2" />
      </svg>
    ),
  };

  return icons[key] ?? icons.clear;
}

export default async function WeatherWidget() {
  const t = await getTranslations('weather');
  const locale = await getLocale();
  const intlLocale = INTL_LOCALE[locale] || 'en-GB';
  const data = await getWeather();
  const advice = data ? buildAdvice(data, locale) : null;

  const formatWeekday = (iso: string, index: number) =>
    index === 0
      ? t('today')
      : new Intl.DateTimeFormat(intlLocale, { weekday: 'short' }).format(new Date(iso));

  const formatDay = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short' }).format(new Date(iso));

  const formatClock = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

  const formatUpdated = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));

  return (
    <section id="weather" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
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

        {!data ? (
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
                {t('error')}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {t('errorHint')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current conditions */}
            <div
              className="rounded-2xl p-6 sm:p-7"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <div className="flex items-center gap-4">
                  <div style={{ color: 'var(--accent)' }}>
                    <WeatherIcon code={data.current.weather_code} size={44} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      {t('current')}
                    </p>
                    <p
                      className="font-display text-4xl font-semibold leading-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {Math.round(data.current.temperature_2m)}°C
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {t(`codes.${codeKey(data.current.weather_code)}` as any)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <Metric label={t('feelsLike')} value={`${Math.round(data.current.apparent_temperature)}°C`} />
                  <Metric label={t('humidity')} value={`${Math.round(data.current.relative_humidity_2m)}%`} />
                  <Metric label={t('wind')} value={`${Math.round(data.current.wind_speed_10m)} km/h`} />
                  <Metric label={t('precipitation')} value={`${data.current.precipitation.toFixed(1)} mm`} />
                </div>
              </div>
            </div>

            {/* Sunrise / sunset */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.7">
                  <path d="M12 19V5M8 9l4-4 4 4M4 19h16" />
                </svg>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {t('sunrise')}
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatClock(data.daily.sunrise[0])}
                  </p>
                </div>
              </div>
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.7">
                  <path d="M12 5v14M8 15l4 4 4-4M4 19h16" />
                </svg>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {t('sunset')}
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatClock(data.daily.sunset[0])}
                  </p>
                </div>
              </div>
            </div>

            {/* Actionable advice — only lines relevant to today's conditions are shown */}
            {advice && (
              <div
                className="rounded-2xl p-6 sm:p-7 space-y-4"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                {advice.risk.length > 0 && (
                  <div
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.45)' }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#b91c1c"
                      strokeWidth="2"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold mb-1" style={{ color: '#b91c1c' }}>
                        {adviceLabels(locale).risk}
                      </p>
                      <ul className="list-disc pl-5 space-y-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {advice.risk.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <AdviceGroup title={adviceLabels(locale).outfit} items={advice.outfit} />
                <AdviceGroup title={adviceLabels(locale).plan} items={advice.plan} />
                <AdviceGroup title={adviceLabels(locale).items} items={advice.items} />
              </div>
            )}

            {/* 7-day forecast */}
            <div>
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('forecast')}
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {data.daily.time.map((day, index) => (
                  <div
                    key={day}
                    className="flex-1 min-w-[84px] rounded-xl p-3 text-center"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                  >
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatWeekday(day, index)}
                    </p>
                    <p className="text-[11px] mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {formatDay(day)}
                    </p>
                    <div className="flex justify-center my-1" style={{ color: 'var(--accent)' }}>
                      <WeatherIcon code={data.daily.weather_code[index]} size={24} />
                    </div>
                    <p className="text-[11px] leading-tight px-1" style={{ color: 'var(--text-secondary)' }}>
                      {t(`codes.${codeKey(data.daily.weather_code[index])}` as any)}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {Math.round(data.daily.temperature_2m_max[index])}°
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {Math.round(data.daily.temperature_2m_min[index])}°
                    </p>
                    {typeof data.daily.precipitation_probability_max[index] === 'number' && (
                      <p className="text-[11px] mt-1" style={{ color: 'var(--accent)' }}>
                        {data.daily.precipitation_probability_max[index]}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('updated')}: {formatUpdated(data.current.time)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}

function AdviceGroup({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--accent)' }}
      >
        {title}
      </p>
      <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <span style={{ color: 'var(--accent)' }}>✓</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
