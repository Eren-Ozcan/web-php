import React, { useState, useEffect } from 'react';
import i18n from '../i18n';

const AdminDashboard: React.FC = () => {
  const languages = Object.keys(i18n.options.resources || {});
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language);
  const [entries, setEntries] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    const resource = i18n.getResourceBundle(selectedLang, 'translation') || {};
    const arr = Object.entries(resource).map(([key, value]) => ({
      key,
      value: String(value)
    }));
    setEntries(arr);
  }, [selectedLang]);

  const handleChange = (
    index: number,
    field: 'key' | 'value',
    newVal: string
  ) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: newVal };
    setEntries(newEntries);
  };

  const addEntry = () => setEntries([...entries, { key: '', value: '' }]);

  const removeEntry = (index: number) =>
    setEntries(entries.filter((_, i) => i !== index));

  const save = () => {
    const updated = entries.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    i18n.addResourceBundle(selectedLang, 'translation', updated, true, true);
    localStorage.setItem('translations', JSON.stringify(i18n.store.data));
    alert('Saved');
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Language:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="border p-1"
        >
          {languages.map((lng) => (
            <option key={lng} value={lng}>
              {lng.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full mb-4 border">
        <thead>
          <tr className="text-left">
            <th className="border p-2">Key</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={idx}>
              <td className="border p-2">
                <input
                  value={entry.key}
                  onChange={(e) => handleChange(idx, 'key', e.target.value)}
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border p-2">
                <input
                  value={entry.value}
                  onChange={(e) => handleChange(idx, 'value', e.target.value)}
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => removeEntry(idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-x-2">
        <button
          onClick={addEntry}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add Row
        </button>
        <button
          onClick={save}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
