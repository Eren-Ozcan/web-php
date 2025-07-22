import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Project } from '../content';
import { useContent } from '../ContentContext';
import type { Language } from '../i18n';

export default function Projects() {
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

  const projects: Project[] = content.projects;
  const lang = i18n.language as Language;
  const projectCategories = content.categories.projects;

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('projects')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', ...Object.keys(projectCategories)].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {f === 'all' ? t('filter_all') : projectCategories[f][lang] || f}
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
