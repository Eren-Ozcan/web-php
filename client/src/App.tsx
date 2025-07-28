// client/src/App.tsx
import { useEffect } from 'react';
import AppRoutes from './routes';
import api from './api';
import i18n from './i18n';
import { useContent } from './ContentContext';
import { normalizeCategories } from './content';
import { safeSetItem } from './safeLocalStorage';

export default function App() {
  const { setContent } = useContent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          api.get('/api/content'),
          api.get('/api/translations')
        ]);
        const normalized = {
          ...cRes.data,
          categories: normalizeCategories(cRes.data.categories)
        };
        safeSetItem('content', JSON.stringify(normalized));
        safeSetItem('translations', JSON.stringify(tRes.data));
        setContent(normalized);
        Object.entries(tRes.data).forEach(([lng, vals]) => {
          Object.entries(vals as Record<string, string>).forEach(([k, v]) => {
            i18n.addResource(lng, 'translation', k, v);
          });
        });
      } catch (err) {
        console.error('Failed to load site data', err);
      }
    };
    fetchData();
  }, [setContent]);

  return <AppRoutes />;
}
