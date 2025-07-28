import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import { ensureTables, loadData } from './services/data.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Increase body size limit to handle slider images encoded as data URLs
// A single image can exceed 10mb once base64 encoded, causing POST /api/content
// to fail when saving new sliders. Allow a larger limit to avoid "Save Failed".
// Allow a larger payload when saving slider data with base64 images.
// Users reported "Save Failed" errors due to payload size, so bump the
// limit to 100mb to accommodate bigger images.
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor ✅');
});

await ensureTables();
await loadData();

app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
