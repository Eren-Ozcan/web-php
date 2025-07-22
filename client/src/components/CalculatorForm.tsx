import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { PricingConfig } from '../pricing';

export default function CalculatorForm() {
  const { t, i18n } = useTranslation();
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [product, setProduct] = useState('cam');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get<PricingConfig>('/api/pricing');
        if (res.data && res.data.products && res.data.features) {
          setConfig(res.data);
          setSelected('');
          setError(null);
        } else {
          throw new Error('Invalid response');
        }
      } catch (err) {
        console.error('Failed to fetch pricing', err);
        setConfig(null);
        setSelected('');
        setError(t('pricing_error'));
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    setSelected('');
  }, [product, config]);

  const visibleFeatures = useMemo(() => {
    if (!config) return [];
    return Object.entries(config.features).filter(([_, v]) => {
      const list = Array.isArray((v as any).products)
        ? (v as any).products
        : v.products?.tr;
      return Array.isArray(list) && list.includes(product);
    });
  }, [config, product]);

  const calculateTotal = () => {
    if (!config) {
      setTotal(0);
      return;
    }
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!w || !h) {
      setTotal(0);
      return;
    }
    const area = (w * h) / 10000; // cm to m2
    const base = config.products[product].basePrice;
    let multiplier = 1;
    if (selected && config.features[selected]) {
      multiplier *= config.features[selected].multiplier;
    }
    setTotal(area * base * multiplier * qty);
  };

  if (error) return <div>{error}</div>;
  if (!config) return <div>{t('loading')}</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <div className="mb-4">
        <label className="block mb-1 font-medium">{t('products')}</label>
        <select
          className="border rounded w-full p-2"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        >
          {config.productOrder.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex border rounded overflow-hidden">
          <span className="px-2 flex items-center bg-gray-100 text-sm whitespace-nowrap">
            {t('width_cm')}
          </span>
          <input
            className="p-2 flex-1 outline-none"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>
        <div className="flex border rounded overflow-hidden">
          <span className="px-2 flex items-center bg-gray-100 text-sm whitespace-nowrap">
            {t('height_cm')}
          </span>
          <input
            className="p-2 flex-1 outline-none"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex border rounded overflow-hidden">
          <span className="px-2 flex items-center bg-gray-100 text-sm whitespace-nowrap">
            {t('quantity')}
          </span>
          <input
            className="p-2 flex-1 outline-none"
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      {visibleFeatures.length > 0 && (
        <div className="mb-4 space-y-2">
          {visibleFeatures.map(([key, val]) => (
            <label key={key} className="flex items-start space-x-2">
              <input
                type="radio"
                name="feature"
                checked={selected === key}
                onChange={() => setSelected(key)}
              />
              <span className="flex-1 font-medium">
                {typeof (val as any).label === 'string'
                  ? (val as any).label
                  : (val as any).label[i18n.language as 'tr' | 'en']}
              </span>
            </label>
          ))}
        </div>
      )}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full"
        onClick={calculateTotal}
      >
        {t('calculate')}
      </button>

      <div className="text-center font-semibold mb-4">
        {t('estimated_price')}: {total.toFixed(2)} TL
      </div>
    </div>
  );
}
