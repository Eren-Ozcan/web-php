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

export interface CategoryList {
  en: string[];
  tr: string[];
}

export interface Categories {
  blogs: CategoryList;
  projects: CategoryList;
  reviews: CategoryList;
  products: CategoryList;
}

export interface ContentData {
  blogs: BlogPost[];
  projects: Project[];
  reviews: Review[];
  products: Product[];
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
      id: 1,
      titleKey: 'project_modern_villa',
      descriptionKey: 'project_modern_villa_desc',
      image: '/images/project1.jpg',
      category: 'glass',
      featured: false
    },
    {
      id: 2,
      titleKey: 'project_office_center',
      descriptionKey: 'project_office_center_desc',
      image: '/images/project2.jpg',
      category: 'pvc',
      featured: false
    },
    {
      id: 3,
      titleKey: 'project_shopping_mall',
      descriptionKey: 'project_shopping_mall_desc',
      image: '/images/project3.jpg',
      category: 'balcony',
      featured: false
    }
  ],
  reviews: [
    {
      id: 1,
      titleKey: 'product_cam',
      textKey: 'product_cam_desc',
      image: '/images/cam.jpg',
      category: 'glass'
    },
    {
      id: 2,
      titleKey: 'product_pimapen',
      textKey: 'product_pimapen_desc',
      image: '/images/pimapen.jpg',
      category: 'pvc'
    }
  ],
  products: [
    {
      id: 1,
      titleKey: 'product_glass',
      descriptionKey: 'product_glass_desc',
      image: '/images/cam.jpg',
      category: 'glass'
    },
    {
      id: 2,
      titleKey: 'product_doors',
      descriptionKey: 'product_doors_desc',
      image: '/images/project1.jpg',
      category: 'door'
    },
    {
      id: 3,
      titleKey: 'product_balcony',
      descriptionKey: 'product_balcony_desc',
      image: '/images/project3.jpg',
      category: 'balcony'
    },
    {
      id: 4,
      titleKey: 'product_garden',
      descriptionKey: 'product_garden_desc',
      image: '/images/house3.jpg',
      category: 'garden'
    },
    {
      id: 5,
      titleKey: 'product_office',
      descriptionKey: 'product_office_desc',
      image: '/images/project2.jpg',
      category: 'office'
    },
    {
      id: 6,
      titleKey: 'product_facade',
      descriptionKey: 'product_facade_desc',
      image: '/images/house2.jpg',
      category: 'facade'
    }
  ],
  categories: {
    blogs: { en: ['news', 'tips'], tr: ['news', 'tips'] },
    projects: { en: ['glass', 'pvc', 'balcony'], tr: ['glass', 'pvc', 'balcony'] },
    reviews: { en: ['glass', 'pvc'], tr: ['glass', 'pvc'] },
    products: {
      en: ['glass', 'door', 'balcony', 'garden', 'office', 'facade'],
      tr: ['glass', 'door', 'balcony', 'garden', 'office', 'facade']
    }
  }
};

export function loadContent(): ContentData {
  const stored = localStorage.getItem('content');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data && typeof data === 'object' && 'blogs' in data) {
        const cat = (data as any).categories;
        if (cat && Array.isArray(cat.blogs)) {
          (data as any).categories = {
            blogs: { en: cat.blogs, tr: cat.blogs },
            projects: { en: cat.projects, tr: cat.projects },
            reviews: { en: cat.reviews, tr: cat.reviews },
            products: { en: cat.products, tr: cat.products }
          };
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
  localStorage.setItem('content', JSON.stringify(data));
}

export default defaultData;
