import CalculatorForm from '../components/CalculatorForm';
import { useTranslation } from 'react-i18next';

export default function Calculate() {
  const { t } = useTranslation();
  return (
    <section className="pt-10">
      <h1 className="text-3xl font-bold text-center mb-6">{t('calculator')}</h1>
      <CalculatorForm />
    </section>
  );
}
