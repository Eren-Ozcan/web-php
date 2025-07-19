// client/src/components/ProductList.tsx
import { useTranslation } from 'react-i18next';

export default function ProductList() {
  const { t } = useTranslation();
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-2xl font-semibold mb-8 text-center">{t('popular_products')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition">{t('product_balcony_glass')}</div>
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition">{t('product_shower_cabin')}</div>
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition">{t('product_mirror_decor')}</div>
      </div>
    </section>
  );
}
