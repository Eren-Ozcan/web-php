import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { Language } from '../i18n';
import { loadContent, ContentData } from '../content';
import api from '../api';
import { useContent } from '../ContentContext';
import { PricingConfig, loadPricing } from '../pricing';

const ContentAdmin: React.FC = () => {
  const { t, i18n: i18next } = useTranslation();
  const languages = Object.keys(i18next.options.resources || {});
  const [lang, setLang] = useState<Language>(i18next.language as Language);
  const [content, setContent] = useState<ContentData>(loadContent());
  const [pricing, setPricing] = useState<PricingConfig>(loadPricing());
  const [productNameEdits, setProductNameEdits] = useState<Record<string, string>>({});
  const [basicTexts, setBasicTexts] = useState({
    mission: t('mission'),
    mission_text: t('mission_text'),
    vision: t('vision'),
    vision_text: t('vision_text'),
    values: t('values'),
    values_text: t('values_text')
  });
  const { setContent: setGlobalContent } = useContent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, tRes, pRes] = await Promise.all([
          api.get<ContentData>('/api/content'),
          api.get<Record<string, Record<string, string>>>('/api/translations'),
          api.get<PricingConfig>('/api/pricing')
        ]);
        setContent(cRes.data);
        setPricing(pRes.data);
        localStorage.setItem('content', JSON.stringify(cRes.data));
        localStorage.setItem('translations', JSON.stringify(tRes.data));
        localStorage.setItem('pricing', JSON.stringify(pRes.data));
        Object.entries(tRes.data).forEach(([lng, vals]) => {
          Object.entries(vals).forEach(([k, v]) => {
            i18next.addResource(lng, 'translation', k, v);
          });
        });
        setBasicTexts({
          mission: i18next.t('mission'),
          mission_text: i18next.t('mission_text'),
          vision: i18next.t('vision'),
          vision_text: i18next.t('vision_text'),
          values: i18next.t('values'),
          values_text: i18next.t('values_text')
        });
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    };
    fetchData();
  }, []);
  const [section, setSection] = useState<
    'blogs' | 'projects' | 'reviews' | 'products' | 'basic' | 'categories' | 'pricing'
  >('blogs');
  const [catSection, setCatSection] = useState<'blogs' | 'projects' | 'reviews' | 'products'>(
    'blogs'
  );

  useEffect(() => {
    i18next.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setBasicTexts({
      mission: i18next.t('mission'),
      mission_text: i18next.t('mission_text'),
      vision: i18next.t('vision'),
      vision_text: i18next.t('vision_text'),
      values: i18next.t('values'),
      values_text: i18next.t('values_text')
    });
  }, [lang, i18next]);

  useEffect(() => {
    const handler = (l: string) => setLang(l);
    i18next.on('languageChanged', handler);
    return () => {
      i18next.off('languageChanged', handler);
    };
  }, [i18next]);

  const updateTranslation = (key: string, value: string) => {
    i18next.addResource(lang, 'translation', key, value);
  };

  const entries =
    section === 'blogs'
      ? content.blogs
      : section === 'projects'
        ? content.projects
        : section === 'reviews'
          ? content.reviews
          : section === 'products'
            ? content.products
            : [];

  const setEntries = (items: any[]) => {
    const newContent = { ...content } as any;
    newContent[section] = items;
    setContent(newContent);
  };

  const categoryOptions = ((content.categories as any)[section]?.[lang] as string[]) || [];

  const addEntry = () => {
    const id = Date.now();
    const titleKey = `${section}_title_${id}`;
    const textKey = `${section}_text_${id}`;
    const newItem: any = {
      id,
      titleKey,
      image: '',
      category: '',
      ...(section === 'projects' ? { featured: false } : {})
    };
    if (section === 'products') {
      newItem.descriptionKey = textKey;
    } else {
      newItem.textKey = textKey;
    }
    updateTranslation(titleKey, '');
    updateTranslation(textKey, '');
    setEntries([...entries, newItem]);
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newEntries = [...entries];
    const item: any = { ...newEntries[index] };
    if (field === 'title') {
      updateTranslation(item.titleKey, value);
    } else if (field === 'text') {
      const key = item.textKey || item.descriptionKey;
      if (key) updateTranslation(key, value);
    } else {
      item[field] = value;
    }
    newEntries[index] = { ...item };
    setEntries(newEntries);
  };

  const saveAll = async () => {
    try {
      await Promise.all([
        api.post('/api/content', content),
        api.post('/api/translations', i18n.store.data),
        api.post('/api/pricing', pricing)
      ]);
      localStorage.setItem('content', JSON.stringify(content));
      localStorage.setItem('translations', JSON.stringify(i18n.store.data));
      localStorage.setItem('pricing', JSON.stringify(pricing));
      setGlobalContent(content);
      alert(t('admin_saved'));
    } catch (err) {
      console.error('Save failed', err);
      alert(t('admin_save_error'));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('admin_title')}</h1>

      {/* Dil seçimi */}
      <div className="space-x-2">
        <label className="font-semibold">{t('admin_language')}:</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="border p-1">
          {languages.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Sekme seçimi */}
      <div className="space-x-2">
        {['blogs', 'projects', 'reviews', 'products', 'basic', 'categories', 'pricing'].map((s) => (
          <button
            key={s}
            onClick={() => setSection(s as any)}
            className={`px-3 py-1 rounded ${section === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {t(s)}
          </button>
        ))}
      </div>

      {/* BASIC */}
      {section === 'basic' ? (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2 w-1/2">{t('admin_title_label')}</th>
              <th className="border p-2 w-1/2">{t('admin_text')}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { titleKey: 'mission', textKey: 'mission_text' },
              { titleKey: 'vision', textKey: 'vision_text' },
              { titleKey: 'values', textKey: 'values_text' }
            ].map(({ titleKey, textKey }) => (
              <tr key={titleKey}>
                <td className="border p-2">
                  <input
                    className="border p-1 w-full"
                    value={(basicTexts as any)[titleKey]}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateTranslation(titleKey, val);
                      setBasicTexts((prev) => ({ ...prev, [titleKey]: val }));
                    }}
                  />
                </td>
                <td className="border p-2">
                  <input
                    className="border p-1 w-full"
                    value={(basicTexts as any)[textKey]}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateTranslation(textKey, val);
                      setBasicTexts((prev) => ({ ...prev, [textKey]: val }));
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : section === 'categories' ? (
        <div className="space-y-2">
          <div className="space-x-2 mb-2">
            {(['blogs', 'projects', 'reviews', 'products'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setCatSection(s)}
                className={`px-2 py-1 rounded ${catSection === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {t(s)}
              </button>
            ))}
          </div>
          <table className="w-full border mb-2">
            <thead>
              <tr className="text-left">
                <th className="border p-2">{t('admin_category')}</th>
                <th className="border p-2">{t('admin_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {content.categories[catSection][lang].map((c: string, idx: number) => (
                <tr key={idx}>
                  <td className="border p-2">
                    <input
                      className="border p-1 w-full"
                      value={c}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^filter_/, '');
                        const list = [...content.categories[catSection][lang]];
                        list[idx] = val;
                        setContent({
                          ...content,
                          categories: {
                            ...content.categories,
                            [catSection]: { ...content.categories[catSection], [lang]: list }
                          }
                        });
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        const list = content.categories[catSection][lang].filter(
                          (_: string, i: number) => i !== idx
                        );
                        setContent({
                          ...content,
                          categories: {
                            ...content.categories,
                            [catSection]: { ...content.categories[catSection], [lang]: list }
                          }
                        });
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      {t('admin_delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => {
              const list = [...content.categories[catSection][lang], ''];
              setContent({
                ...content,
                categories: {
                  ...content.categories,
                  [catSection]: { ...content.categories[catSection], [lang]: list }
                }
              });
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {t('admin_add_category')}
          </button>
        </div>
      ) : section === 'pricing' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('admin_products')}</h2>
          <table className="w-full border mb-4">
            <thead>
              <tr className="text-left">
                <th className="border p-2">{t('admin_product')}</th>
                <th className="border p-2">{t('admin_base_price')}</th>
                <th className="border p-2">{t('admin_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pricing.productOrder.map((key) => {
                const val = pricing.products[key];
                return (
                  <tr key={key}>
                    <td className="border p-2 space-x-2">
                      <input
                        className="border p-1 w-full"
                        value={productNameEdits[key] ?? key}
                        onChange={(e) =>
                          setProductNameEdits({
                            ...productNameEdits,
                            [key]: e.target.value
                          })
                        }
                        onBlur={() => {
                          const newKey = (productNameEdits[key] ?? key).trim();
                          if (!newKey || newKey === key || pricing.products[newKey]) {
                            setProductNameEdits((prev) => {
                              const { [key]: _omit, ...rest } = prev;
                              return rest;
                            });
                            return;
                          }
                          const { [key]: oldVal, ...rest } = pricing.products as any;
                          const updatedProducts = { ...rest, [newKey]: oldVal };
                          const updatedFeatures = Object.fromEntries(
                            Object.entries(pricing.features).map(([fKey, fVal]) => [
                              fKey,
                              {
                                ...fVal,
                                products: fVal.products.map((p) => (p === key ? newKey : p))
                              }
                            ])
                          );
                          const orderIndex = pricing.productOrder.indexOf(key);
                          const newOrder = [...pricing.productOrder];
                          if (orderIndex >= 0) newOrder[orderIndex] = newKey;
                          setPricing({
                            ...pricing,
                            products: updatedProducts,
                            features: updatedFeatures,
                            productOrder: newOrder
                          });
                          setProductNameEdits((prev) => {
                            const { [key]: _removed, ...rest } = prev;
                            return rest;
                          });
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="border p-1 w-full"
                        value={val.basePrice}
                        onChange={(e) => {
                          const bp = parseFloat(e.target.value) || 0;
                          setPricing({
                            ...pricing,
                            products: { ...pricing.products, [key]: { basePrice: bp } }
                          });
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => {
                          const prods = { ...pricing.products } as any;
                          delete prods[key];
                          setPricing({
                            ...pricing,
                            products: prods,
                            productOrder: pricing.productOrder.filter((k) => k !== key)
                          });
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        {t('admin_delete')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            onClick={() => {
              const name = prompt('product key');
              if (!name || pricing.products[name]) return;
              setPricing({
                ...pricing,
                products: { ...pricing.products, [name]: { basePrice: 0 } },
                productOrder: [...pricing.productOrder, name]
              });
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {t('admin_add_product')}
          </button>

          <h2 className="text-xl font-semibold mt-6">{t('admin_features')}</h2>
          <table className="w-full border mb-4">
            <thead>
              <tr className="text-left">
                <th className="border p-2">{t('admin_label')}</th>
                <th className="border p-2">{t('admin_multiplier')}</th>
                <th className="border p-2">{t('admin_products')}</th>
                <th className="border p-2">{t('admin_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pricing.features).map(([k, f]) => (
                <tr key={k}>
                  <td className="border p-2">
                    <input
                      className="border p-1 w-full"
                      value={f.label}
                      onChange={(e) => {
                        setPricing({
                          ...pricing,
                          features: {
                            ...pricing.features,
                            [k]: { ...f, label: e.target.value }
                          }
                        });
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="border p-1 w-full"
                      value={f.multiplier}
                      onChange={(e) => {
                        const m = parseFloat(e.target.value) || 1;
                        setPricing({
                          ...pricing,
                          features: { ...pricing.features, [k]: { ...f, multiplier: m } }
                        });
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="border p-1 w-full"
                      value={f.products.join(',')}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim());
                        setPricing({
                          ...pricing,
                          features: { ...pricing.features, [k]: { ...f, products: arr } }
                        });
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        const feats = { ...pricing.features } as any;
                        delete feats[k];
                        setPricing({ ...pricing, features: feats });
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      {t('admin_delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => {
              const key = prompt('feature key');
              if (!key) return;
              setPricing({
                ...pricing,
                features: {
                  ...pricing.features,
                  [key]: { label: '', multiplier: 1, products: [] }
                }
              });
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {t('admin_add_feature')}
          </button>
        </div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="text-left">
              <th className="border p-2">{t('admin_title_label')}</th>
              <th className="border p-2">{t('admin_text')}</th>
              <th className="border p-2">{t('admin_image')}</th>
              <th className="border p-2">{t('admin_category')}</th>
              {section === 'projects' && <th className="border p-2">{t('admin_featured')}</th>}
              <th className="border p-2">{t('admin_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item: any, idx: number) => (
              <tr key={item.id}>
                <td className="border p-2">
                  <input
                    className="border p-1 w-full"
                    value={t(item.titleKey)}
                    onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    className="border p-1 w-full"
                    value={
                      item.textKey
                        ? t(item.textKey)
                        : item.descriptionKey
                          ? t(item.descriptionKey)
                          : ''
                    }
                    onChange={(e) => handleChange(idx, 'text', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer inline-block">
                    {t('choose_file')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleChange(idx, 'image', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {item.image && (
                    <img
                      src={item.image}
                      alt="preview"
                      className="mt-2 w-20 h-20 object-cover rounded shadow"
                    />
                  )}
                </td>

                <td className="border p-2">
                  <select
                    className="border p-1 w-full"
                    value={item.category || ''}
                    onChange={(e) => handleChange(idx, 'category', e.target.value)}
                  >
                    {categoryOptions.map((c: string) => {
                      const key = c.replace(/^filter_/, '');
                      const label = t(`filter_${key}` as any);
                      return (
                        <option key={c} value={c}>
                          {label.startsWith('filter_') ? key : label}
                        </option>
                      );
                    })}
                  </select>
                </td>
                {section === 'projects' && (
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!item.featured}
                      onChange={(e) => handleChange(idx, 'featured', e.target.checked)}
                    />
                  </td>
                )}
                <td className="border p-2">
                  <button
                    onClick={() => removeEntry(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    {t('admin_delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="space-x-2">
        {section !== 'basic' && section !== 'categories' && section !== 'pricing' && (
          <button onClick={addEntry} className="bg-blue-500 text-white px-3 py-1 rounded">
            {t('admin_add')}
          </button>
        )}
        <button onClick={saveAll} className="bg-green-600 text-white px-3 py-1 rounded">
          {t('admin_save_all')}
        </button>
      </div>
    </div>
  );
};

export default ContentAdmin;
