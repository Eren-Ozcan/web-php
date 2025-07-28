import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContent } from '../ContentContext';

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { content } = useContent();

  const numericId = Number(id);
  const item =
    content.blogs.find((b) => b.id === numericId) ||
    content.projects.find((p) => p.id === numericId) ||
    content.reviews.find((r) => r.id === numericId) ||
    content.products.find((p) => p.id === numericId);

  if (!item) {
    return (
      <section className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
      </section>
    );
  }

  const title = t((item as any).titleKey);
  const key = (item as any).textKey || (item as any).descriptionKey;
  const text = key ? t(key) : '';

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 capitalize">{title}</h1>
      {item.image && (
        <img src={(item as any).image} alt={title} className="w-full h-64 object-cover mb-4" />
      )}
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </section>
  );
}
