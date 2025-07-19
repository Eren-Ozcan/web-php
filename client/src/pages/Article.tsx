import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Article() {
  const { topic } = useParams<{ topic: string }>();
  const { t } = useTranslation();

  const texts = [t('article_lorem1'), t('article_lorem2'), t('article_lorem3')];
  const text = texts[Math.floor(Math.random() * texts.length)];

  const title = topic ? topic.replace(/-/g, ' ') : '';

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 capitalize">{title}</h1>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </section>
  );
}
