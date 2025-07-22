export interface PricingConfig {
  products: Record<string, { basePrice: number }>;
  features: Record<
    string,
    {
      label: { tr: string; en: string };
      multiplier: number;
      products: { tr: string[]; en: string[] };
    }
  >;
  productOrder: string[];
}

export function normalizePricing(p: any): PricingConfig {
  if (!p.productOrder) {
    p.productOrder = Object.keys(p.products || {});
  }
  Object.entries(p.features || {}).forEach(([k, f]: any) => {
    if (typeof f.label === 'string') {
      p.features[k].label = { tr: f.label, en: f.label };
    } else {
      f.label = { tr: f.label.tr || '', en: f.label.en || '' };
    }

    if (Array.isArray(f.products)) {
      p.features[k].products = { tr: f.products, en: f.products };
    } else {
      p.features[k].products = {
        tr: f.products?.tr || [],
        en: f.products?.en || []
      };
    }
    if ('description' in f) delete p.features[k].description;
  });
  return p as PricingConfig;
}

const defaultPricing: PricingConfig = {
  productOrder: ['cam', 'pvc', 'balkon'],
  products: {
    cam: { basePrice: 100 },
    pvc: { basePrice: 150 },
    balkon: { basePrice: 200 }
  },
  features: {
    tempered: {
      label: { tr: 'Temperli Cam', en: 'Tempered Glass' },
      multiplier: 1.25,
      products: { tr: ['cam'], en: ['glass'] }
    },
    colored: {
      label: { tr: 'Renkli', en: 'Colored' },
      multiplier: 1.1,
      products: { tr: ['cam', 'pvc'], en: ['glass', 'pvc'] }
    },
    double: {
      label: { tr: 'Çift Cam', en: 'Double Glazing' },
      multiplier: 1.3,
      products: { tr: ['pvc', 'balkon'], en: ['pvc', 'balcony'] }
    }
  }
};

export function loadPricing(): PricingConfig {
  const stored = localStorage.getItem('pricing');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data && data.products && data.features) {
        return normalizePricing(data);
      }
    } catch {}
  }
  return normalizePricing({ ...defaultPricing });
}

export function savePricing(data: PricingConfig) {
  localStorage.setItem('pricing', JSON.stringify(data));
}

export default defaultPricing;
