import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Product } from '../content';
import { useContent } from '../ContentContext';
import type { Language } from '../i18n';

export default function Products() {
  const { t, i18n } = useTranslation();
  const { content } = useContent();
  const params = useParams<{ category?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const initialFilter = params.category ?? (location.state as any)?.filter ?? 'all';
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    if (params.category) {
      setFilter(params.category);
    }
  }, [params.category]);

  useEffect(() => {
    if ((location.state as any)?.filter !== filter) {
      navigate('.', { replace: true, state: { filter } });
    }
  }, [filter]);

  const toSlug = (s: string) => encodeURIComponent(s.toLowerCase().replace(/\s+/g, '-'));

  const products: Product[] = content.products;
  const lang = i18n.language as Language;
  const productCategories = content.categories.products[lang] || [];

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('products')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', ...productCategories].map((f) => (
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
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/article/${toSlug(t(p.titleKey))}`, { state: { filter } })}
            className="bg-white shadow rounded overflow-hidden cursor-pointer"
          >
            <img src={p.image} alt={t(p.titleKey)} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{t(p.titleKey)}</h3>
              <p className="text-sm text-gray-600">{t(p.descriptionKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
