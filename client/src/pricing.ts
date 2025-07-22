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
        if (!data.productOrder) {
          data.productOrder = Object.keys(data.products);
        }
        return data as PricingConfig;
      }
    } catch {}
  }
  return defaultPricing;
}

export function savePricing(data: PricingConfig) {
  localStorage.setItem('pricing', JSON.stringify(data));
}

export default defaultPricing;
