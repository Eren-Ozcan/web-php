import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import apiRouter from './routes/api.js';
import { ensureTables, loadData } from './services/data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  'https://sundizayn.com.tr',
  'https://www.sundizayn.com.tr',
  'http://localhost:5173',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  }
}));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend çalışıyor ✅' });
});

// Production'da React build'ini sun
const distPath = join(__dirname, '..', 'client', 'dist');
if (isProduction && existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Sunucu çalışıyor ✅');
  });
  app.all('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
}

await ensureTables();
await loadData();

app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
