import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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

let contentData = loadJson('content.json');
let translationsData = {
  en: loadJson('en.json'),
  tr: loadJson('tr.json')
};

app.use(cors());
app.use(express.json());

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

app.post('/api/content', (req, res) => {
  contentData = req.body;
  try {
    saveJson('content.json', contentData);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save content', err);
    res.status(500).json({ ok: false });
  }
});

app.get('/api/translations', (req, res) => {
  res.json(translationsData);
});

app.post('/api/translations', (req, res) => {
  translationsData = req.body;
  try {
    saveJson('en.json', translationsData.en);
    saveJson('tr.json', translationsData.tr);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save translations', err);
    res.status(500).json({ ok: false });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
