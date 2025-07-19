import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

interface PricingConfig {
  products: Record<string, { basePrice: number }>;
  features: Record<
    string,
    { label: string; multiplier: number; products: string[] }
  >;
}

export default function CalculatorForm() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [product, setProduct] = useState('glass');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get<PricingConfig>('/api/pricing');
        if (res.data && res.data.products && res.data.features) {
          setConfig(res.data);
          const initialOpts: Record<string, boolean> = {};
          Object.keys(res.data.features).forEach(
            (key) => (initialOpts[key] = false)
          );
          setOptions(initialOpts);
          setError(null);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        console.error('Failed to fetch pricing', err);
        setConfig(null);
        setOptions({});
        setError('Unable to load pricing data. Please try again later.');
      }
    };

    fetchConfig();
  }, []);

  const visibleFeatures = useMemo(() => {
    if (!config) return [];
    return Object.entries(config.features).filter(([_, v]) =>
      v.products.includes(product)
    );
  }, [config, product]);

  const total = useMemo(() => {
    if (!config) return 0;
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!w || !h) return 0;
    const area = (w * h) / 10000; // cm to m2
    const base = config.products[product].basePrice;
    let multiplier = 1;
    visibleFeatures.forEach(([key, val]) => {
      if (options[key]) multiplier *= val.multiplier;
    });
    return area * base * multiplier * qty;
  }, [config, width, height, product, qty, options, visibleFeatures]);

  if (error) return <div>{error}</div>;
  if (!config) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <div className="mb-4">
        <label className="block mb-1 font-medium">{t('products')}</label>
        <select
          className="border rounded w-full p-2"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        >
          {Object.keys(config.products).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          className="border rounded p-2"
          type="number"
          placeholder={t('width_cm')}
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <input
          className="border rounded p-2"
          type="number"
          placeholder={t('height_cm')}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          className="border rounded p-2 w-full"
          type="number"
          placeholder={t('quantity')}
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value) || 1)}
        />
      </div>

      {visibleFeatures.length > 0 && (
        <div className="mb-4 space-y-2">
          {visibleFeatures.map(([key, val]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) =>
                  setOptions({ ...options, [key]: e.target.checked })
                }
              />
              <span>{val.label}</span>
            </label>
          ))}
        </div>
      )}

      <div className="text-center font-semibold mb-4">
        {t('estimated_price')}: {total.toFixed(2)} TL
      </div>
    </div>
  );
}
