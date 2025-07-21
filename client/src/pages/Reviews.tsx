import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Review } from '../content';
import { useContent } from '../ContentContext';

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const { content } = useContent();
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState((location.state as any)?.filter ?? 'all');

  useEffect(() => {
    if ((location.state as any)?.filter !== filter) {
      navigate('.', { replace: true, state: { filter } });
    }
  }, [filter]);

  const reviews: Review[] = content.reviews;
  const reviewCategories = content.categories.reviews[i18n.language] || [];

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.category === filter);

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('reviews')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', ...reviewCategories].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {(() => {
              const key = f.replace(/^filter_/, '');
              const label = t(`filter_${key}` as any);
              return label.startsWith('filter_') ? key : label;
            })()}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white shadow rounded overflow-hidden flex flex-col md:flex-row">
            <img src={r.image} alt={t(r.titleKey)} className="w-full md:w-1/3 h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{t(r.titleKey)}</h3>
              <p className="text-gray-600 text-sm">{t(r.textKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
