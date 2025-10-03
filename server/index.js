import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/api.js';
import { ensureTables, loadData } from './services/data.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use('/api', apiRouter);

// ✅ EKLE: Health check (404'ün ÜSTÜNDE OLMALI)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend çalışıyor ✅' });
});

app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor ✅');
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

await ensureTables();
await loadData();

app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
