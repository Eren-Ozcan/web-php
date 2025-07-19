import { useTranslation } from 'react-i18next';

export default function ContactShort() {
  const { t } = useTranslation();
  return (
    <section className="bg-blue-100 py-12 text-center mt-12">
      <h3 className="text-xl font-semibold">{t('contact_short_title')}</h3>
      <p className="mt-2 text-gray-700">{t('contact_short_text')}</p>
    </section>
  );
}
