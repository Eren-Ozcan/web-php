import { useEffect, useState } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function About() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api
      .get<Project[]>('/api/projects?highlight=true')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProjects(data);
      })
      .catch(() => setProjects([]));
  }, []);

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
        {projects.map((p) => (
          <div key={p.id} className="bg-white shadow rounded overflow-hidden">
            <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
