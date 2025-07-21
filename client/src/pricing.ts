export interface PricingConfig {
  products: Record<string, { basePrice: number }>;
  features: Record<string, { label: string; multiplier: number; products: string[] }>;
}

const defaultPricing: PricingConfig = {
  products: {
    glass: { basePrice: 100 },
    pvc: { basePrice: 150 },
    balcony: { basePrice: 200 }
  },
  features: {
    tempered: { label: 'tempered_feature', multiplier: 1.25, products: ['glass'] },
    colored: { label: 'colored_feature', multiplier: 1.1, products: ['glass', 'pvc'] },
    double: { label: 'double_glazing_feature', multiplier: 1.3, products: ['pvc', 'balcony'] }
  }
};

export function loadPricing(): PricingConfig {
  const stored = localStorage.getItem('pricing');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data && data.products && data.features) {
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
