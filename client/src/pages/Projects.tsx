import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Project {
  id: number;
  titleKey: string;
  descriptionKey: string;
  image: string;
  category: string;
}

const projects: Project[] = [
  { id: 1, titleKey: 'project_modern_villa', descriptionKey: 'project_modern_villa_desc', image: '/images/project1.jpg', category: 'glass' },
  { id: 2, titleKey: 'project_office_center', descriptionKey: 'project_office_center_desc', image: '/images/project2.jpg', category: 'pvc' },
  { id: 3, titleKey: 'project_shopping_mall', descriptionKey: 'project_shopping_mall_desc', image: '/images/project3.jpg', category: 'balcony' }
];

export default function Projects() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('projects')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', 'glass', 'pvc', 'balcony'].map((f) => (
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
          <div key={p.id} className="bg-white shadow rounded overflow-hidden">
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
