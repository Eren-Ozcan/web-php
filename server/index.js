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
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;

const mailTransporter = nodemailer.createTransport({
  host: 'srvc192.trwww.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@mefaaluminyum.com',
    pass: process.env.MAIL_PASS
  }
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

// JSON load/save helpers
function loadJson(file) {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf8'));
}
function saveJson(file, data) {
  writeFileSync(join(dataDir, file), JSON.stringify(data, null, 2));
}

// DOĞRU ŞEKİLDE hash doğrulama!
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashed = crypto
    .pbkdf2Sync(password, Buffer.from(salt, 'hex'), 10000, 64, 'sha512')
    .toString('hex');
  return hashed === hash;
}

// (Opsiyonel: yeni hash üretmek için kullanabilirsin)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, Buffer.from(salt, 'hex'), 10000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

let contentData;
let translationsData;
let pricingData;

async function ensureTables() {
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

async function loadData() {
  try {
    const [cRows] = await pool.query('SELECT data FROM content WHERE id = 1');
    if (!cRows.length) {
      contentData = loadJson('content.json');
      await pool.query('INSERT INTO content (id, data) VALUES (1, ?)', [
        JSON.stringify(contentData)
      ]);
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
      pricingData = loadJson('pricing.json');
      await pool.query('INSERT INTO pricing (id, data) VALUES (1, ?)', [
        JSON.stringify(pricingData)
      ]);
    } else {
      const rawP = pRows[0].data;
      const parsedP = typeof rawP === 'string' ? JSON.parse(rawP) : rawP;
      if (parsedP && Object.keys(parsedP).length) {
        pricingData = parsedP;
      } else {
        pricingData = loadJson('pricing.json');
        await pool.query('UPDATE pricing SET data = ? WHERE id = 1', [
          JSON.stringify(pricingData)
        ]);
      }
    }
  } catch (err) {
    console.error('Failed to load from database, falling back to files', err);
    contentData = loadJson('content.json');
    translationsData = { en: loadJson('en.json'), tr: loadJson('tr.json') };
    pricingData = loadJson('pricing.json');
  }
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// GÜVENLİ LOGIN ENDPOINT
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
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Content API
app.get('/api/content', (req, res) => {
  res.json(contentData);
});

app.post('/api/content', async (req, res) => {
  const data = req.body;
  try {
    contentData = data;
    await pool.query('UPDATE content SET data = ? WHERE id = 1', [
      JSON.stringify(contentData)
    ]);
    saveJson('content.json', contentData);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save content', err);
    res.status(500).json({ error: 'Could not save content' });
  }
});

// Translations API
app.get('/api/translations', (req, res) => {
  res.json(translationsData);
});

app.post('/api/translations', async (req, res) => {
  const data = req.body;
  try {
    translationsData = data;
    await pool.query('UPDATE translations SET data = ? WHERE id = 1', [
      JSON.stringify(translationsData)
    ]);
    saveJson('en.json', translationsData.en);
    saveJson('tr.json', translationsData.tr);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save translations', err);
    res.status(500).json({ error: 'Could not save translations' });
  }
});

// Pricing API
app.get('/api/pricing', (req, res) => {
  res.json(pricingData);
});

app.post('/api/pricing', async (req, res) => {
  const data = req.body;
  try {
    pricingData = data;
    await pool.query('UPDATE pricing SET data = ? WHERE id = 1', [
      JSON.stringify(pricingData)
    ]);
    saveJson('pricing.json', pricingData);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save pricing', err);
    res.status(500).json({ error: 'Could not save pricing' });
  }
});

app.post('/api/sendMail', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing fields' });
  }
  try {
    await mailTransporter.sendMail({
      from: 'info@mefaaluminyum.com',
      to: 'info@mefaaluminyum.com',
      subject: 'Yeni İletişim Mesajı',
      text: `Gönderen: ${name} <${email}>\n\n${message}`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Send mail error:', err);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor ✅');
});

// ... (diğer endpoint'ler aynı şekilde devam)

await ensureTables();
await loadData();

app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
