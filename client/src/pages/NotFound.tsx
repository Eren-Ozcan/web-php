import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">{t('page_not_found')}</h1>
      <Link to="/" className="text-blue-500 underline">
        {t('back_home')}
      </Link>
    </div>
  );
}
