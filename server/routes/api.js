import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import {
  contentData,
  translationsData,
  pricingData,
  loadJson,
  saveJson,
  verifyPassword,
  normalizeCategories,
  normalizePricing
} from '../services/data.js';
import { mailTransporter } from '../services/mail.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/login', async (req, res) => {
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

router.get('/content', (req, res) => {
  res.json(contentData);
});

router.post('/content', async (req, res) => {
  const data = req.body;
  try {
    Object.assign(
      contentData,
      { ...data, categories: normalizeCategories(data.categories) }
    );
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

router.get('/translations', (req, res) => {
  res.json(translationsData);
});

router.post('/translations', async (req, res) => {
  const data = req.body;
  try {
    Object.assign(translationsData, data);
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

router.get('/pricing', (req, res) => {
  res.json(pricingData);
});

router.post('/pricing', async (req, res) => {
  const data = req.body;
  try {
    Object.assign(pricingData, normalizePricing(data));
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

router.get('/projects', (req, res) => {
  const highlight = req.query.highlight === 'true';
  const data = highlight
    ? (contentData.projects || []).filter((p) => p.featured)
    : contentData.projects || [];
  res.json(data);
});

router.post('/sendMail', async (req, res) => {
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

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing fields' });
  }
  try {
    await mailTransporter.sendMail({
      from: 'info@mefaaluminyum.com',
      to: 'info@mefaaluminyum.com',
      subject: 'Yeni İletişim Mesajı',
      html: `<p><strong>Gönderen:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br/>')}</p>`
    });

    await mailTransporter.sendMail({
      from: 'info@mefaaluminyum.com',
      to: email,
      subject: 'Bizimle İletişime Geçtiğiniz İçin Teşekkürler',
      text: `Merhaba ${name},\n\nİletişime geçtiğiniz için teşekkürler. En kısa sürede size dönüş yapacağız.\n\nİyi günler dileriz.\n\n(Bu e-posta otomatik olarak gönderilmiştir.)`
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact mail error:', err);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

export default router;
