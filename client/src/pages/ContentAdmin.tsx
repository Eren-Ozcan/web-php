import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { loadContent, saveContent, ContentData } from '../content';

const ContentAdmin: React.FC = () => {
  const { t, i18n: i18next } = useTranslation();
  const languages = Object.keys(i18next.options.resources || {});
  const [lang, setLang] = useState<string>(i18next.language);
  const [content, setContent] = useState<ContentData>(loadContent());
  const [section, setSection] = useState<
    'blogs' | 'projects' | 'reviews' | 'products' | 'basic' | 'categories'
  >('blogs');
  const [catSection, setCatSection] = useState<'blogs' | 'projects' | 'reviews' | 'products'>(
    'blogs'
  );

  useEffect(() => {
    i18next.changeLanguage(lang);
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

  const categoryOptions = (content.categories as any)[section] || [];

  const addEntry = () => {
    const id = Date.now();
    const titleKey = `${section}_title_${id}`;
    const textKey = `${section}_text_${id}`;
    const newItem = {
      id,
      titleKey,
      textKey: section !== 'products' ? textKey : undefined,
      image: '',
      category: ''
    };
    updateTranslation(titleKey, '');
    if (newItem.textKey) updateTranslation(newItem.textKey, '');
    setEntries([...entries, newItem]);
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newEntries = [...entries];
    const item: any = { ...newEntries[index] };
    if (field === 'title') {
      updateTranslation(item.titleKey, value);
    } else if (field === 'text' && item.textKey) {
      updateTranslation(item.textKey, value);
    } else {
      item[field] = value;
    }
    newEntries[index] = { ...item };
    setEntries(newEntries);
  };

  const saveAll = () => {
    saveContent(content);
    localStorage.setItem('translations', JSON.stringify(i18n.store.data));
    alert(t('admin_saved'));
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
        {['blogs', 'projects', 'reviews', 'products', 'basic', 'categories'].map((s) => (
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
        <div className="space-y-2">
          {['mission_text', 'vision_text', 'values_text'].map((k) => (
            <div key={k} className="flex items-center space-x-2">
              <label className="w-32 font-semibold">{t(k)}</label>
              <input
                className="border p-1 flex-1"
                value={t(k)}
                onChange={(e) => updateTranslation(k, e.target.value)}
              />
            </div>
          ))}
        </div>
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
              {content.categories[catSection].map((c, idx) => (
                <tr key={idx}>
                  <td className="border p-2">
                    <input
                      className="border p-1 w-full"
                      value={c}
                      onChange={(e) => {
                        const list = [...content.categories[catSection]];
                        list[idx] = e.target.value;
                        setContent({
                          ...content,
                          categories: {
                            ...content.categories,
                            [catSection]: list
                          }
                        });
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        const list = content.categories[catSection].filter((_, i) => i !== idx);
                        setContent({
                          ...content,
                          categories: { ...content.categories, [catSection]: list }
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
              const list = [...content.categories[catSection], ''];
              setContent({
                ...content,
                categories: { ...content.categories, [catSection]: list }
              });
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {t('admin_add_category')}
          </button>
        </div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="text-left">
              <th className="border p-2">{t('admin_title_label')}</th>
              {section !== 'products' && <th className="border p-2">{t('admin_text')}</th>}
              <th className="border p-2">{t('admin_image')}</th>
              <th className="border p-2">{t('admin_category')}</th>
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
                {section !== 'products' && (
                  <td className="border p-2">
                    <input
                      className="border p-1 w-full"
                      value={item.textKey ? t(item.textKey) : ''}
                      onChange={(e) => handleChange(idx, 'text', e.target.value)}
                    />
                  </td>
                )}
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
                    {categoryOptions.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
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
        {section !== 'basic' && section !== 'categories' && (
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
