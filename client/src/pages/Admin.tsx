import React, { useState, useEffect } from 'react';
import ContentAdmin from './ContentAdmin';
import { useTranslation } from 'react-i18next';
import api from '../api';
import i18n from '../i18n';
import { safeSetItem, safeRemoveItem } from '../safeLocalStorage';

const Admin: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false); // Her zaman false — login formu her zaman göster
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sayfa açılınca eski oturumu temizle
  useEffect(() => {
    safeRemoveItem('token');
    safeRemoveItem('admin-auth');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  useEffect(() => {
    if (auth) {
      const load = async () => {
        try {
          const [cRes, tRes, pRes] = await Promise.all([
            api.get('/api/content'),
            api.get('/api/translations'),
            api.get('/api/pricing')
          ]);
          safeSetItem('content', JSON.stringify(cRes.data));
          safeSetItem('translations', JSON.stringify(tRes.data));
          safeSetItem('pricing', JSON.stringify(pRes.data));
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
      const res = await api.post('/api/login', { username, password });
      safeSetItem('token', res.data.token);
      safeSetItem('admin-auth', 'true');
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setAuth(true);
      setError(null);
    } catch (err: any) {
      if (err?.response?.status === 429) {
        setError(t('too_many_attempts'));
        return;
      }
      const msg = err?.response?.data?.error;
      const key =
        msg === 'User not found'
          ? 'user_not_found'
          : msg === 'Password incorrect'
            ? 'password_incorrect'
            : 'login_error';
      setError(t(key));
    }
  };

  const handleLogout = () => {
    safeRemoveItem('token');
    safeRemoveItem('admin-auth');
    delete api.defaults.headers.common['Authorization'];
    setAuth(false);
    setLoaded(false);
    setUsername('');
    setPassword('');
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow w-80 space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin Girişi</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Kullanıcı adı"
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Şifre"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            {t('login')}
          </button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return <div className="p-4">{t('loading')}</div>;
  }

  return <ContentAdmin onLogout={handleLogout} />;
};

export default Admin;
