import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { pool } from '../db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');

export function loadJson(file) {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf8'));
}

export function saveJson(file, data) {
  writeFileSync(join(dataDir, file), JSON.stringify(data, null, 2));
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashed = crypto
    .pbkdf2Sync(password, Buffer.from(salt, 'hex'), 10000, 64, 'sha512')
    .toString('hex');
  return hashed === hash;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, Buffer.from(salt, 'hex'), 10000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

export let contentData;
export let translationsData;
export let pricingData;

export function setContentData(data) {
  contentData = data;
}

export function setTranslationsData(data) {
  translationsData = data;
}

export function setPricingData(data) {
  pricingData = data;
}

export function normalizeCategories(cat) {
  const isNumericObj = (o) =>
    o &&
    typeof o === 'object' &&
    !Array.isArray(o) &&
    Object.keys(o)
      .filter((k) => k !== 'en' && k !== 'tr')
      .every((k) => /^\d+$/.test(k));
  const sanitize = (s) => s.replace(/^filter_/, '');
  const convertList = (enArr, trArr) => {
    if (isNumericObj(enArr))
      enArr = Object.keys(enArr)
        .filter((k) => k !== 'en' && k !== 'tr')
        .sort((a, b) => a - b)
        .map((k) => enArr[k]);
    if (isNumericObj(trArr))
      trArr = Object.keys(trArr)
        .filter((k) => k !== 'en' && k !== 'tr')
        .sort((a, b) => a - b)
        .map((k) => trArr[k]);
    if (!Array.isArray(enArr) && !Array.isArray(trArr)) return enArr || {};
    const map = {};
    const max = Math.max(enArr?.length || 0, trArr?.length || 0);
    for (let i = 0; i < max; i++) {
      const id = sanitize(enArr?.[i] ?? trArr?.[i] ?? `cat${i}`);
      map[id] = { en: enArr?.[i] ?? id, tr: trArr?.[i] ?? id };
    }
    return map;
  };
  if (!cat) return { blogs: {}, projects: {}, reviews: {}, products: {} };
  return {
    blogs: convertList(cat.blogs?.en ?? cat.blogs, cat.blogs?.tr ?? cat.blogs),
    projects: convertList(cat.projects?.en ?? cat.projects, cat.projects?.tr ?? cat.projects),
    reviews: convertList(cat.reviews?.en ?? cat.reviews, cat.reviews?.tr ?? cat.reviews),
    products: convertList(cat.products?.en ?? cat.products, cat.products?.tr ?? cat.products)
  };
}

export function normalizePricing(p) {
  if (!p) return { features: {}, products: {}, productOrder: [] };
  if (!p.productOrder) {
    p.productOrder = Object.keys(p.products || {});
  }
  Object.entries(p.features || {}).forEach(([k, f]) => {
    if (typeof f.label === 'string') {
      const tr = translationsData?.tr?.[f.label] || f.label;
      const en = translationsData?.en?.[f.label] || f.label;
      p.features[k].label = { tr, en };
    } else {
      f.label = { tr: f.label.tr || '', en: f.label.en || '' };
    }

    if (Array.isArray(f.products)) {
      p.features[k].products = { tr: f.products, en: f.products };
    } else {
      p.features[k].products = {
        tr: f.products?.tr || [],
        en: f.products?.en || []
      };
    }

    if ('description' in f) delete p.features[k].description;
  });
  return p;
}

export async function ensureTables() {
  await pool.query(`CREATE TABLE IF NOT EXISTS content (
    id INT PRIMARY KEY,
    data JSON NOT NULL
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS translations (
    id INT PRIMARY KEY,
    data JSON NOT NULL
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pricing (
    id INT PRIMARY KEY,
    data JSON NOT NULL
  )`);
}

export async function loadData() {
  try {
    const [cRows] = await pool.query('SELECT data FROM content WHERE id = 1');
    if (!cRows.length) {
      contentData = loadJson('content.json');
      if (!contentData.sliders) contentData.sliders = [];
      contentData.categories = normalizeCategories(contentData.categories);
      await pool.query('INSERT INTO content (id, data) VALUES (1, ?)', [
        JSON.stringify(contentData)
      ]);
    } else {
      const raw = cRows[0].data;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (parsed && Object.keys(parsed).length) {
        contentData = parsed;
        if (!contentData.sliders) contentData.sliders = [];
        contentData.categories = normalizeCategories(contentData.categories);
      } else {
        contentData = loadJson('content.json');
        if (!contentData.sliders) contentData.sliders = [];
        contentData.categories = normalizeCategories(contentData.categories);
        await pool.query('UPDATE content SET data = ? WHERE id = 1', [JSON.stringify(contentData)]);
      }

      if (Array.isArray(contentData.products)) {
        contentData.products = contentData.products.map((p) =>
          p.descriptionKey ? p : { ...p, descriptionKey: `${p.titleKey}_desc` }
        );
      }
    }

    const [tRows] = await pool.query('SELECT data FROM translations WHERE id = 1');
    if (!tRows.length) {
      translationsData = { en: loadJson('en.json'), tr: loadJson('tr.json') };
      await pool.query('INSERT INTO translations (id, data) VALUES (1, ?)', [
        JSON.stringify(translationsData)
      ]);
    } else {
      const rawT = tRows[0].data;
      const parsedT = typeof rawT === 'string' ? JSON.parse(rawT) : rawT;
      if (parsedT && Object.keys(parsedT).length) {
        translationsData = parsedT;
      } else {
        translationsData = { en: loadJson('en.json'), tr: loadJson('tr.json') };
        await pool.query('UPDATE translations SET data = ? WHERE id = 1', [
          JSON.stringify(translationsData)
        ]);
      }
    }

    const [pRows] = await pool.query('SELECT data FROM pricing WHERE id = 1');
    if (!pRows.length) {
      pricingData = normalizePricing(loadJson('pricing.json'));
      await pool.query('INSERT INTO pricing (id, data) VALUES (1, ?)', [
        JSON.stringify(pricingData)
      ]);
    } else {
      const rawP = pRows[0].data;
      const parsedP = typeof rawP === 'string' ? JSON.parse(rawP) : rawP;
      if (parsedP && Object.keys(parsedP).length) {
        if (!parsedP.productOrder) {
          parsedP.productOrder = Object.keys(parsedP.products || {});
        }
        pricingData = normalizePricing(parsedP);
      } else {
        pricingData = normalizePricing(loadJson('pricing.json'));
        await pool.query('UPDATE pricing SET data = ? WHERE id = 1', [JSON.stringify(pricingData)]);
      }
    }
  } catch (err) {
    console.error('Failed to load from database, falling back to files', err);
    contentData = loadJson('content.json');
    if (!contentData.sliders) contentData.sliders = [];
    contentData.categories = normalizeCategories(contentData.categories);
    translationsData = { en: loadJson('en.json'), tr: loadJson('tr.json') };
    pricingData = normalizePricing(loadJson('pricing.json'));
  }
}
