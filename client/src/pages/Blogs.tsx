import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: number;
  titleKey: string;
  category: string;
  textKey: string;
}

const posts: BlogPost[] = [
  { id: 1, titleKey: 'blog1', category: 'news', textKey: 'article_lorem1' },
  { id: 2, titleKey: 'blog2', category: 'tips', textKey: 'article_lorem2' },
  { id: 3, titleKey: 'blog3', category: 'news', textKey: 'article_lorem3' }
];

export default function Blogs() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const toSlug = (s: string) => encodeURIComponent(s.toLowerCase().replace(/\s+/g, '-'));

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter);

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('blogs')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', 'news', 'tips'].map((f) => (
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
        {filtered.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/article/${toSlug(t(post.titleKey))}`)}
            className="bg-white shadow rounded p-4 cursor-pointer"
          >
            <h3 className="font-semibold text-lg mb-2">{t(post.titleKey)}</h3>
            <p className="text-sm text-gray-600 mb-2">{t(post.textKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
