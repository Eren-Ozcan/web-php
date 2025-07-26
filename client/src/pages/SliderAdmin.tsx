import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { useContent } from '../ContentContext';

const SliderAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { content, setContent } = useContent();
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(localStorage.getItem('admin-auth') === 'true');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (auth) {
      const load = async () => {
        try {
          const res = await api.get('/api/content');
          localStorage.setItem('content', JSON.stringify(res.data));
          setContent(res.data);
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
      const key =
        msg === 'User not found'
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

  const slides = content.sliders || [];
  const current = slides[index];
  const lang = i18n.language as 'tr' | 'en';
  const routeOptions = Object.entries(content.categories.products).map(([key, val]) => ({
    value: `/urunler/${key}`,
    label: val[lang] || key
  }));

  const updateSlides = (newSlides: typeof slides) => {
    setContent({ ...content, sliders: newSlides });
  };

  const addSlide = () => {
    const newSlides = [...slides, { image: '', hotspots: [] }];
    updateSlides(newSlides);
    setIndex(newSlides.length - 1);
  };

  const removeSlide = (i: number) => {
    const newSlides = slides.filter((_, idx) => idx !== i);
    updateSlides(newSlides);
    setIndex(Math.max(0, i - 1));
  };

  const updateHotspot = (hIdx: number, field: string, value: any) => {
    const newSlides = [...slides];
    const hs = { ...newSlides[index].hotspots[hIdx], [field]: value };
    newSlides[index].hotspots[hIdx] = hs;
    updateSlides(newSlides);
  };

  const addHotspot = () => {
    const newSlides = [...slides];
    newSlides[index].hotspots.push({ x: 50, y: 50, label: '', tooltip: '', color: '#3b82f6', route: routeOptions[0]?.value || '' });
    updateSlides(newSlides);
  };

  const deleteHotspot = (hIdx: number) => {
    const newSlides = [...slides];
    newSlides[index].hotspots.splice(hIdx, 1);
    updateSlides(newSlides);
  };

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlides = [...slides];
      newSlides[index].image = reader.result as string;
      updateSlides(newSlides);
    };
    reader.readAsDataURL(file);
  };

  const saveAll = async () => {
    try {
      const updated = { ...content, sliders: slides };
      await api.post('/api/content', updated);
      localStorage.setItem('content', JSON.stringify(updated));
      alert(t('admin_saved'));
    } catch (err) {
      console.error('Save failed', err);
      alert(t('admin_save_error'));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('slider_admin')}</h1>
      <div className="flex space-x-2 mb-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`px-2 py-1 rounded ${index === i ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={addSlide} className="bg-blue-500 text-white px-2 py-1 rounded">
          {t('add_slide')}
        </button>
        {slides.length > 0 && (
          <button onClick={() => removeSlide(index)} className="bg-red-500 text-white px-2 py-1 rounded">
            {t('admin_delete')}
          </button>
        )}
      </div>
      {current && (
        <div className="flex space-x-4">
          <div className="w-1/2 space-y-2">
            {current.image && <img src={current.image} alt="slide" className="w-full rounded" />}
            <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer inline-block">
              {t('change_image')}
              <input type="file" accept="image/*" className="hidden" onChange={changeImage} />
            </label>
          </div>
          <div className="w-1/2 space-y-2">
            {current.hotspots.map((h, hIdx) => (
              <div key={hIdx} className="border p-2 space-y-1">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    className="border p-1 w-20"
                    value={h.x}
                    onChange={(e) => updateHotspot(hIdx, 'x', parseFloat(e.target.value) || 0)}
                  />
                  <input
                    type="number"
                    className="border p-1 w-20"
                    value={h.y}
                    onChange={(e) => updateHotspot(hIdx, 'y', parseFloat(e.target.value) || 0)}
                  />
                  <input
                    className="border p-1 flex-1"
                    value={h.label}
                    onChange={(e) => updateHotspot(hIdx, 'label', e.target.value)}
                  />
                </div>
                <input
                  className="border p-1 w-full"
                  value={h.tooltip}
                  onChange={(e) => updateHotspot(hIdx, 'tooltip', e.target.value)}
                />
                <input
                  type="color"
                  className="border p-1 w-full"
                  value={h.color}
                  onChange={(e) => updateHotspot(hIdx, 'color', e.target.value)}
                />
                <select
                  className="border p-1 w-full"
                  value={h.route}
                  onChange={(e) => updateHotspot(hIdx, 'route', e.target.value)}
                >
                  {routeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => deleteHotspot(hIdx)} className="bg-red-500 text-white px-2 py-1 rounded">
                  {t('admin_delete_hotspot', { defaultValue: t('admin_delete') })}
                </button>
              </div>
            ))}
            <button onClick={addHotspot} className="bg-blue-500 text-white px-2 py-1 rounded">
              {t('admin_add_hotspot')}
            </button>
          </div>
        </div>
      )}
      <button onClick={saveAll} className="bg-green-600 text-white px-3 py-1 rounded">
        {t('admin_save_all')}
      </button>
    </div>
  );
};

export default SliderAdmin;
