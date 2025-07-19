import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: number;
  title: string;
  category: string;
  text: string;
}

const posts: BlogPost[] = [
  { id: 1, title: 'First Blog', category: 'news', text: 'Lorem ipsum dolor sit amet.' },
  { id: 2, title: 'Second Blog', category: 'tips', text: 'Ut enim ad minim veniam.' },
  { id: 3, title: 'Third Blog', category: 'news', text: 'Duis aute irure dolor.' }
];

export default function Blogs() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

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
          <div key={post.id} className="bg-white shadow rounded p-4">
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{post.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

