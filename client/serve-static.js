// client/serve-static.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const FRONT_PORT = 5173;
const BACKEND_URL = 'http://localhost:5000';

// ---- Basit istek logu (teşhis için)
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// ---- /api için PROXY (kök + alt yollar) + DEBUG
app.use(
  ['/api', '/api/*'],
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    logLevel: 'debug' // konsola "proxying request to ..." yazar
    // pathRewrite: { }   // GEREK YOK: backend /api altında; rewrite ETME!
  })
);

// ---- Statik içerik
app.use(express.static(path.join(__dirname, 'dist')));

// ---- SPA fallback (SON MIDDLEWARE)
// /api ile başlayanları asla yakalama
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(FRONT_PORT, () => {
  console.log(`[Static] http://localhost:${FRONT_PORT}`);
});
