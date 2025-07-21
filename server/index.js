import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

function loadJson(file) {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf8'));
}

function saveJson(file, data) {
  writeFileSync(join(dataDir, file), JSON.stringify(data, null, 2));
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashed = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hashed === hash;
}

let contentData;
let translationsData;

async function ensureTables() {
  await pool.query(`CREATE TABLE IF NOT EXISTS content (
    id INT PRIMARY KEY,
    data JSON NOT NULL
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS translations (
    id INT PRIMARY KEY,
    data JSON NOT NULL
  )`);
}

async function loadData() {
  try {
    const [cRows] = await pool.query('SELECT data FROM content WHERE id = 1');
    if (!cRows.length) {
      contentData = loadJson('content.json');
      await pool.query('INSERT INTO content (id, data) VALUES (1, ?)', [JSON.stringify(contentData)]);
    } else {
      const raw = cRows[0].data;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (parsed && Object.keys(parsed).length) {
        contentData = parsed;
      } else {
        contentData = loadJson('content.json');
        await pool.query('UPDATE content SET data = ? WHERE id = 1', [JSON.stringify(contentData)]);
      }
    }

    const [tRows] = await pool.query('SELECT data FROM translations WHERE id = 1');
    if (!tRows.length) {
      translationsData = { en: loadJson('en.json'), tr: loadJson('tr.json') };
      await pool.query('INSERT INTO translations (id, data) VALUES (1, ?)', [JSON.stringify(translationsData)]);
    } else {
      const rawT = tRows[0].data;
      const parsedT = typeof rawT === 'string' ? JSON.parse(rawT) : rawT;
      if (parsedT && Object.keys(parsedT).length) {
        translationsData = parsedT;
      } else {
        translationsData = { en: loadJson('en.json'), tr: loadJson('tr.json') };
        await pool.query('UPDATE translations SET data = ? WHERE id = 1', [JSON.stringify(translationsData)]);
      }
    }
  } catch (err) {
    console.error('Failed to load from database, falling back to files', err);
    contentData = loadJson('content.json');
    translationsData = { en: loadJson('en.json'), tr: loadJson('tr.json') };
  }
}

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, username, passwordHash FROM users WHERE username = ?',
      [username]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Password incorrect' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor ✅');
});

// Example projects data
const projects = [
  {
    id: 1,
    title: 'Modern Villa',
    description: 'Large scale glass installation',
    image: '/images/project1.jpg',
    highlight: true
  },
  {
    id: 2,
    title: 'Office Center',
    description: 'PVC window replacement',
    image: '/images/project2.jpg',
    highlight: true
  },
  {
    id: 3,
    title: 'Shopping Mall',
    description: 'Curtain wall facade',
    image: '/images/project3.jpg',
    highlight: false
  }
];

app.get('/api/projects', (req, res) => {
  const { highlight } = req.query;
  if (highlight === 'true') {
    return res.json(projects.filter((p) => p.highlight));
  }
  res.json(projects);
});

// Example pricing configuration
const pricing = {
  products: {
    glass: { basePrice: 650 },
    pvc: { basePrice: 950 },
    balcony: { basePrice: 1200 }
  },
  features: {
    tempered: { label: 'tempered_feature', multiplier: 1.25, products: ['glass'] },
    colored: { label: 'colored_feature', multiplier: 1.15, products: ['glass', 'pvc'] },
    double: { label: 'double_glazing_feature', multiplier: 1.35, products: ['glass'] }
  }
};

app.get('/api/pricing', (req, res) => {
  res.json(pricing);
});

app.get('/api/content', (req, res) => {
  res.json(contentData);
});

app.post('/api/content', async (req, res) => {
  contentData = req.body;
  try {
    saveJson('content.json', contentData);
    await pool.query('UPDATE content SET data = ? WHERE id = 1', [JSON.stringify(contentData)]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save content', err);
    res.status(500).json({ ok: false });
  }
});

app.get('/api/translations', (req, res) => {
  res.json(translationsData);
});

app.post('/api/translations', async (req, res) => {
  translationsData = req.body;
  try {
    saveJson('en.json', translationsData.en);
    saveJson('tr.json', translationsData.tr);
    await pool.query('UPDATE translations SET data = ? WHERE id = 1', [JSON.stringify(translationsData)]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save translations', err);
    res.status(500).json({ ok: false });
  }
});

await ensureTables();
await loadData();

app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
