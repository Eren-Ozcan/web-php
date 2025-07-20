import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

interface Product {
  id: number;
  titleKey: string;
  image: string;
  category: string;
}

const products: Product[] = [
  { id: 1, titleKey: 'product_glass', image: '/images/cam.jpg', category: 'glass' },
  { id: 2, titleKey: 'product_doors', image: '/images/project1.jpg', category: 'door' },
  { id: 3, titleKey: 'product_balcony', image: '/images/project3.jpg', category: 'balcony' },
  { id: 4, titleKey: 'product_garden', image: '/images/house3.jpg', category: 'garden' },
  { id: 5, titleKey: 'product_office', image: '/images/project2.jpg', category: 'office' },
  { id: 6, titleKey: 'product_facade', image: '/images/house2.jpg', category: 'facade' }
];

export default function Products() {
  const { t } = useTranslation();
  const params = useParams<{ category?: string }>();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (params.category) {
      setFilter(params.category);
    }
  }, [params.category]);

  const toSlug = (s: string) => encodeURIComponent(s.toLowerCase().replace(/\s+/g, '-'));

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('products')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', 'glass', 'door', 'balcony', 'garden', 'office', 'facade'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {t(`filter_${f}` as any)}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/article/${toSlug(t(p.titleKey))}`)}
            className="bg-white shadow rounded overflow-hidden cursor-pointer"
          >
            <img src={p.image} alt={t(p.titleKey)} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{t(p.titleKey)}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
