import { useTranslations, useMessages } from 'next-intl';

export default function FAQSection() {
  const t = useTranslations('faq');
  const messages = useMessages() as any;
  const items = (messages?.faq?.items || []) as Array<{ question: string; answer: string }>;

  return (
    <section id="faq" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-12 mx-auto" style={{ background: 'var(--accent)' }} />

        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={index}
              className="group rounded-xl border"
              style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--accent)' }}
              {...(index === 0 ? { open: true } : {})}
            >
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                <h3
                  className="font-display text-base sm:text-lg font-semibold leading-snug"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.question}
                </h3>
                <svg
                  className="flex-shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-180"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
