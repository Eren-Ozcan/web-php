import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-20 bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-lg font-bold mb-2">{t('about')}</h4>
          <p className="text-sm text-gray-300">{t('footer_about')}</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2">{t('footer_menu')}</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>
              <a href="/" className="hover:underline">
                {t('home')}
              </a>
            </li>
            <li>
              <a href="/urunler" className="hover:underline">
                {t('products')}
              </a>
            </li>
            <li>
              <a href="/calculator" className="hover:underline">
                {t('calculator')}
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                {t('about')}
              </a>
            </li>
            <li>
              <a href="/iletisim" className="hover:underline">
                {t('contact')}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2">{t('footer_contact')}</h4>
          <p className="text-sm text-gray-300">Email: info@sirket.com</p>
          <p className="text-sm text-gray-300">Tel: +90 555 123 45 67</p>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} {t('copyright')}
      </div>
    </footer>
  );
}
