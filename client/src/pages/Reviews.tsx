import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Review {
  id: number;
  title: string;
  text: string;
  image: string;
  category: string;
}

const reviews: Review[] = [
  { id: 1, title: 'Glass Product Review', text: 'High quality insulated glass.', image: '/images/cam.jpg', category: 'glass' },
  { id: 2, title: 'PVC Window Review', text: 'Durable PVC systems for insulation.', image: '/images/pimapen.jpg', category: 'pvc' }
];

export default function Reviews() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.category === filter);

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('reviews')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', 'glass', 'pvc'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {t(`filter_${f}` as any)}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white shadow rounded overflow-hidden flex flex-col md:flex-row">
            <img src={r.image} alt={r.title} className="w-full md:w-1/3 h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{r.title}</h3>
              <p className="text-gray-600 text-sm">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
