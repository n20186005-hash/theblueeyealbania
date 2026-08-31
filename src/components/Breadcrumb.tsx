import { useTranslations } from 'next-intl';

// Visible geographic breadcrumb: Attraction → City → County → Country.
// Mirrors the BreadcrumbList JSON-LD injected in page.tsx.
export default function Breadcrumb() {
  const t = useTranslations('breadcrumb');
  const items = t.raw('items') as string[];

  return (
    <nav aria-label="Breadcrumb" className="px-4 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">›</span>}
              <span
                className={i === 0 ? 'font-medium' : ''}
                style={i === 0 ? { color: 'var(--text-primary)' } : undefined}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
