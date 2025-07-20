import React, { useState } from 'react';
import i18n from '../i18n';
import { loadContent, saveContent, ContentData } from '../content';

const ContentAdmin: React.FC = () => {
  const languages = Object.keys(i18n.options.resources || {});
  const [lang, setLang] = useState<string>(i18n.language);
  const [content, setContent] = useState<ContentData>(loadContent());
  const [section, setSection] = useState<
    'blogs' | 'projects' | 'reviews' | 'products' | 'basic' | 'categories'
  >('blogs');
  const [catSection, setCatSection] = useState<'blogs' | 'projects' | 'reviews' | 'products'>(
    'blogs'
  );

  const updateTranslation = (key: string, value: string) => {
    i18n.addResource(lang, 'translation', key, value);
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
    const newItem: any = { id, titleKey };
    if (section === 'projects') newItem.descriptionKey = textKey;
    if (section === 'blogs') newItem.textKey = textKey;
    if (section === 'reviews') newItem.textKey = textKey;
    if (section === 'products') {
      newItem.image = '';
    } else {
      newItem.image = '';
    }
    newItem.category = categoryOptions[0] || 'all';
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
    alert('Saved');
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Content Admin</h1>
      <div className="space-x-2">
        <label className="font-semibold">Language:</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="border p-1">
          {languages.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="space-x-2">
        {['blogs', 'projects', 'reviews', 'products', 'basic', 'categories'].map((s) => (
          <button
            key={s}
            onClick={() => setSection(s as any)}
            className={`px-3 py-1 rounded ${section === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {section === 'basic' ? (
        <div className="space-y-2">
          {['mission_text', 'vision_text', 'values_text'].map((k) => (
            <div key={k} className="flex items-center space-x-2">
              <label className="w-32 font-semibold">{k}</label>
              <input
                className="border p-1 flex-1"
                value={i18n.t(k, { lng: lang })}
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
                {s}
              </button>
            ))}
          </div>
          <table className="w-full border mb-2">
            <thead>
              <tr className="text-left">
                <th className="border p-2">Category</th>
                <th className="border p-2">Actions</th>
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
                      Delete
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
            Add Category
          </button>
        </div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="text-left">
              <th className="border p-2">Title</th>
              {section !== 'products' && <th className="border p-2">Text</th>}
              <th className="border p-2">Image</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item: any, idx: number) => (
              <tr key={item.id}>
                <td className="border p-2">
                  <input
                    className="border p-1 w-full"
                    value={i18n.t(item.titleKey, { lng: lang })}
                    onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  />
                </td>
                {section !== 'products' && (
                  <td className="border p-2">
                    <input
                      className="border p-1 w-full"
                      value={item.textKey ? i18n.t(item.textKey, { lng: lang }) : ''}
                      onChange={(e) => handleChange(idx, 'text', e.target.value)}
                    />
                  </td>
                )}
                <td className="border p-2">
                  <input
                    className="border p-1 w-full"
                    value={item.image || ''}
                    onChange={(e) => handleChange(idx, 'image', e.target.value)}
                  />
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
                    Delete
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
            Add
          </button>
        )}
        <button onClick={saveAll} className="bg-green-600 text-white px-3 py-1 rounded">
          Save All
        </button>
      </div>
    </div>
  );
};

export default ContentAdmin;
