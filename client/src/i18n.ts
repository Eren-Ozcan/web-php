import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import tr from './locales/tr.json';
import { safeGetItem } from './safeLocalStorage';

// Allow overriding translations via localStorage so the admin page can persist
// updates across reloads. If no overrides exist, fall back to the bundled JSON
// files.
const stored = safeGetItem('translations');
let overrides: Record<string, { translation: Record<string, string> }> | null = null;
if (stored) {
  try {
    overrides = JSON.parse(stored);
  } catch {
    overrides = null;
  }
}
const resources = {
  en: { translation: { ...en, ...(overrides?.en?.translation || {}) } },
  tr: { translation: { ...tr, ...(overrides?.tr?.translation || {}) } }
};

export type Language = keyof typeof resources;

const storedLang = safeGetItem('language');

i18n.use(initReactI18next).init({
  resources,
  lng: storedLang || 'tr', // Default to Turkish if none stored
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
