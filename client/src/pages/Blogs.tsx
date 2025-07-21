import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { BlogPost } from '../content';
import { useContent } from '../ContentContext';

export default function Blogs() {
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

  const toSlug = (s: string) => encodeURIComponent(s.toLowerCase().replace(/\s+/g, '-'));
  const posts: BlogPost[] = content.blogs;
  const blogCategories = content.categories.blogs[i18n.language] || [];

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter);

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('blogs')}</h1>
      <div className="flex justify-center space-x-2 mb-6">
        {['all', ...blogCategories].map((f) => (
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
        {filtered.map((post) => (
          <div
            key={post.id}
            onClick={() =>
              navigate(`/article/${toSlug(t(post.titleKey))}`, { state: { filter } })
            }
            className="bg-white shadow rounded overflow-hidden cursor-pointer"
          >
            {post.image && (
              <img
                src={post.image}
                alt={t(post.titleKey)}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{t(post.titleKey)}</h3>
              <p className="text-sm text-gray-600 mb-2">{t(post.textKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
