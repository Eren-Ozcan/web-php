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
  const [error, setError] = useState<string | null>(null);

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

  const handleLogin = async () => {
    try {
      const res = await api.post('/api/login', { username: 'admin', password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('admin-auth', 'true');
      setAuth(true);
      alert(t('login_success'));
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.error;
      const key = msg === 'User not found'
        ? 'user_not_found'
        : msg === 'Password incorrect'
        ? 'password_incorrect'
        : 'login_error';
      setError(t(key));
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
        {error && <div className="text-red-500">{error}</div>}
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
