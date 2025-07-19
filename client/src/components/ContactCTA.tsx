// client/src/components/ContactCTA.tsx
import { useTranslation } from 'react-i18next';

export default function ContactCTA() {
  const { t } = useTranslation();
  return (
    <section className="bg-blue-50 py-16 text-center mt-10">
      <h3 className="text-xl font-semibold">{t('contact_cta_title')}</h3>
      <p className="mt-2 text-gray-700">{t('contact_cta_subtext')}</p>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
        {t('contact_cta_button')}
      </button>
    </section>
  );
}
