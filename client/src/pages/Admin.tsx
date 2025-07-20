import React, { useState, useEffect } from 'react';
import ContentAdmin from './ContentAdmin';
import { useTranslation } from 'react-i18next';
import api from '../api';
import i18n from '../i18n';

const Admin: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(localStorage.getItem('admin-auth') === 'true');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (auth) {
      const load = async () => {
        try {
          const [cRes, tRes] = await Promise.all([
            api.get('/api/content'),
            api.get('/api/translations')
          ]);
          localStorage.setItem('content', JSON.stringify(cRes.data));
          localStorage.setItem('translations', JSON.stringify(tRes.data));
          Object.entries(tRes.data).forEach(([lng, vals]) => {
            Object.entries(vals as Record<string, string>).forEach(([k, v]) => {
              i18n.addResource(lng, 'translation', k, v);
            });
          });
        } catch (err) {
          console.error(err);
        }
        setLoaded(true);
      };
      load();
    }
  }, [auth]);

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem('admin-auth', 'true');
      setAuth(true);
    }
  };

  if (!auth) {
    return (
      <div className="p-4 space-y-2">
        <h1 className="text-2xl font-bold">Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-3 py-1 rounded">
          {t('login')}
        </button>
      </div>
    );
  }

  if (!loaded) {
    return <div className="p-4">{t('loading')}</div>;
  }

  return <ContentAdmin />;
};

export default Admin;
