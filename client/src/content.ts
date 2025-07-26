export interface BlogPost {
  id: number;
  titleKey: string;
  category: string;
  textKey: string;
  image: string;
}

export interface Project {
  id: number;
  titleKey: string;
  descriptionKey: string;
  image: string;
  category: string;
  featured?: boolean;
}

export interface Review {
  id: number;
  titleKey: string;
  textKey: string;
  image: string;
  category: string;
}

export interface Product {
  id: number;
  titleKey: string;
  descriptionKey: string;
  image: string;
  category: string;
}

export interface Hotspot {
  x: number;
  y: number;
  label: string;
  tooltip: string;
  color: string;
  route: string;
}

export interface Slide {
  image: string;
  hotspots: Hotspot[];
}

export interface CategoryEntry {
  tr: string;
  en: string;
}

export type CategoryMap = Record<string, CategoryEntry>;

export interface Categories {
  blogs: CategoryMap;
  projects: CategoryMap;
  reviews: CategoryMap;
  products: CategoryMap;
}

export interface ContentData {
  blogs: BlogPost[];
  projects: Project[];
  reviews: Review[];
  products: Product[];
  sliders: Slide[];
  categories: Categories;
}

const defaultData: ContentData = {
  blogs: [
    {
      id: 1,
      titleKey: 'blog1',
      category: 'news',
      textKey: 'article_lorem1',
      image: '/images/project1.jpg'
    },
    {
      id: 2,
      titleKey: 'blog2',
      category: 'tips',
      textKey: 'article_lorem2',
      image: '/images/project2.jpg'
    },
    {
      id: 3,
      titleKey: 'blog3',
      category: 'news',
      textKey: 'article_lorem3',
      image: '/images/project3.jpg'
    }
  ],
  projects: [
    {
      id: 4,
      titleKey: 'project_modern_villa',
      descriptionKey: 'project_modern_villa_desc',
      image: '/images/project1.jpg',
      category: 'glass',
      featured: false
    },
    {
      id: 5,
      titleKey: 'project_office_center',
      descriptionKey: 'project_office_center_desc',
      image: '/images/project2.jpg',
      category: 'pvc',
      featured: false
    },
    {
      id: 6,
      titleKey: 'project_shopping_mall',
      descriptionKey: 'project_shopping_mall_desc',
      image: '/images/project3.jpg',
      category: 'balcony',
      featured: false
    }
  ],
  reviews: [
    {
      id: 7,
      titleKey: 'product_cam',
      textKey: 'product_cam_desc',
      image: '/images/cam.jpg',
      category: 'glass'
    },
    {
      id: 8,
      titleKey: 'product_pimapen',
      textKey: 'product_pimapen_desc',
      image: '/images/pimapen.jpg',
      category: 'pvc'
    }
  ],
  products: [
    {
      id: 9,
      titleKey: 'product_glass',
      descriptionKey: 'product_glass_desc',
      image: '/images/cam.jpg',
      category: 'glass'
    },
    {
      id: 10,
      titleKey: 'product_doors',
      descriptionKey: 'product_doors_desc',
      image: '/images/project1.jpg',
      category: 'door'
    },
    {
      id: 11,
      titleKey: 'product_balcony',
      descriptionKey: 'product_balcony_desc',
      image: '/images/project3.jpg',
      category: 'balcony'
    },
    {
      id: 12,
      titleKey: 'product_garden',
      descriptionKey: 'product_garden_desc',
      image: '/images/house3.jpg',
      category: 'garden'
    },
    {
      id: 13,
      titleKey: 'product_office',
      descriptionKey: 'product_office_desc',
      image: '/images/project2.jpg',
      category: 'office'
    },
    {
      id: 14,
      titleKey: 'product_facade',
      descriptionKey: 'product_facade_desc',
      image: '/images/house2.jpg',
      category: 'facade'
    }
  ],
  sliders: [
    {
      image: '/images/house1.jpg',
      hotspots: [
        {
          x: 15,
          y: 20,
          label: '1',
          tooltip: 'Glass',
          color: '#3b82f6',
          route: '/article/9'
        },
        {
          x: 30,
          y: 40,
          label: '2',
          tooltip: 'Door',
          color: '#3b82f6',
          route: '/article/10'
        },
        {
          x: 60,
          y: 45,
          label: '3',
          tooltip: 'Balcony',
          color: '#3b82f6',
          route: '/article/11'
        }
      ]
    },
    {
      image: '/images/house2.jpg',
      hotspots: [
        {
          x: 20,
          y: 30,
          label: '4',
          tooltip: 'Garden',
          color: '#3b82f6',
          route: '/article/12'
        },
        {
          x: 45,
          y: 55,
          label: '5',
          tooltip: 'Office',
          color: '#3b82f6',
          route: '/article/13'
        },
        {
          x: 70,
          y: 65,
          label: '6',
          tooltip: 'Facade',
          color: '#3b82f6',
          route: '/article/14'
        }
      ]
    }
  ],
  categories: {
    blogs: {
      news: { tr: 'Haber', en: 'News' },
      tips: { tr: 'İpucu', en: 'Tips' }
    },
    projects: {
      glass: { tr: 'Cam', en: 'Glass' },
      pvc: { tr: 'Pimapen', en: 'PVC' },
      balcony: { tr: 'Balkon', en: 'Balcony' }
    },
    reviews: {
      glass: { tr: 'Cam', en: 'Glass' },
      pvc: { tr: 'Pimapen', en: 'PVC' }
    },
    products: {
      glass: { tr: 'Cam', en: 'Glass' },
      door: { tr: 'Kapı', en: 'Door' },
      balcony: { tr: 'Balkon', en: 'Balcony' },
      garden: { tr: 'Bahçe', en: 'Garden' },
      office: { tr: 'Ofis', en: 'Office' },
      facade: { tr: 'Dış cephe', en: 'Facade' }
    }
  }
};

export function normalizeCategories(cat: any): Categories {
  const isNumericObj = (o: any) =>
    o &&
    typeof o === 'object' &&
    !Array.isArray(o) &&
    Object.keys(o)
      .filter((k) => k !== 'en' && k !== 'tr')
      .every((k) => /^\d+$/.test(k));
  const sanitize = (s: string) => s.replace(/^filter_/, '');
  const convertList = (enArr: any, trArr: any): CategoryMap => {
    if (isNumericObj(enArr))
      enArr = Object.keys(enArr)
        .filter((k) => k !== 'en' && k !== 'tr')
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => enArr[k]);
    if (isNumericObj(trArr))
      trArr = Object.keys(trArr)
        .filter((k) => k !== 'en' && k !== 'tr')
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => trArr[k]);
    if (!Array.isArray(enArr) && !Array.isArray(trArr)) return enArr as any;
    const map: CategoryMap = {};
    const max = Math.max(enArr?.length || 0, trArr?.length || 0);
    for (let i = 0; i < max; i++) {
      const id = sanitize(enArr?.[i] ?? trArr?.[i] ?? 'cat' + i);
      map[id] = { en: enArr?.[i] ?? id, tr: trArr?.[i] ?? id };
    }
    return map;
  };
  return {
    blogs: convertList(cat?.blogs?.en ?? cat?.blogs, cat?.blogs?.tr ?? cat?.blogs),
    projects: convertList(cat?.projects?.en ?? cat?.projects, cat?.projects?.tr ?? cat?.projects),
    reviews: convertList(cat?.reviews?.en ?? cat?.reviews, cat?.reviews?.tr ?? cat?.reviews),
    products: convertList(cat?.products?.en ?? cat?.products, cat?.products?.tr ?? cat?.products)
  };
}

export function loadContent(): ContentData {
  const stored = localStorage.getItem('content');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data && typeof data === 'object' && 'blogs' in data) {
        const cat = (data as any).categories;
        if (cat) {
          (data as any).categories = normalizeCategories(cat);
        }
        if (!(data as any).sliders) {
          (data as any).sliders = [];
        }
        return data as ContentData;
      }
    } catch {
      // ignore parse errors and fall back to defaults
    }
  }
  return defaultData;
}

export function saveContent(data: ContentData) {
  const normalized = { ...data, categories: normalizeCategories(data.categories) };
  localStorage.setItem('content', JSON.stringify(normalized));
}

export default defaultData;
