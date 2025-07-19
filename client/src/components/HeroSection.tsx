// client/src/components/HeroSection.tsx
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-gradient-to-br from-blue-100 to-white py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-800">{t('hero_title')}</h1>
      <p className="mt-4 text-lg text-gray-600">{t('hero_subtitle')}</p>
    </section>
  );
}
