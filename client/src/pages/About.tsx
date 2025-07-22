import { useEffect, useState } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Project, Review } from '../content';
import { useContent } from '../ContentContext';
import type { Language } from '../i18n';

export default function About() {
  const { t, i18n } = useTranslation();
  const { content } = useContent();
  const [highlightProjects, setHighlightProjects] = useState<Project[]>([]);
  const [projectFilter, setProjectFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');
  const navigate = useNavigate();


  useEffect(() => {
    api
      .get<Project[]>('/api/projects?highlight=true')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setHighlightProjects(data);
      })
      .catch(() => setHighlightProjects([]));
  }, []);

  const projectData: Project[] = content.projects;
  const reviewData: Review[] = content.reviews;
  const projectCategories = content.categories.projects;
  const reviewCategories = content.categories.reviews;

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">{t('aboutTitle')}</h1>
      <p className="text-center mb-8 text-gray-700">{t('about_intro')}</p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="font-semibold text-xl mb-2">{t('mission')}</h2>
          <p>{t('mission_text')}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="font-semibold text-xl mb-2">{t('vision')}</h2>
          <p>{t('vision_text')}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="font-semibold text-xl mb-2">{t('values')}</h2>
          <p>{t('values_text')}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">{t('highlight_projects')}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {highlightProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/article/${p.id}`)}
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

      <h2 id="projects" className="text-2xl font-bold mt-12 mb-4 text-center">
        {t('projects')}
      </h2>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', ...Object.keys(projectCategories)].map((f) => (
          <button
            key={f}
            onClick={() => setProjectFilter(f)}
            className={`px-3 py-1 rounded text-sm ${projectFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {f === 'all' ? t('filter_all') : projectCategories[f][i18n.language as Language] || f}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {(projectFilter === 'all'
          ? projectData
          : projectData.filter((p) => p.category === projectFilter)
        ).map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/article/${p.id}`)}
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

      <h2 id="reviews" className="text-2xl font-bold mt-12 mb-4 text-center">
        {t('reviews')}
      </h2>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', ...Object.keys(reviewCategories)].map((f) => (
          <button
            key={f}
            onClick={() => setReviewFilter(f)}
            className={`px-3 py-1 rounded text-sm ${reviewFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {f === 'all' ? t('filter_all') : reviewCategories[f][i18n.language as Language] || f}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {(reviewFilter === 'all'
          ? reviewData
          : reviewData.filter((r) => r.category === reviewFilter)
        ).map((r) => (
          <div
            key={r.id}
            onClick={() => navigate(`/article/${r.id}`)}
            className="bg-white shadow rounded overflow-hidden flex flex-col md:flex-row cursor-pointer"
          >
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
