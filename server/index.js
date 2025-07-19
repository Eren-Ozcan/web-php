import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

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
    tempered: { label: 'Tempered Glass', multiplier: 1.25, products: ['glass'] },
    colored: { label: 'Colored', multiplier: 1.15, products: ['glass', 'pvc'] },
    double: { label: 'Double Glazing', multiplier: 1.35, products: ['glass'] }
  }
};

app.get('/api/pricing', (req, res) => {
  res.json(pricing);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${PORT}`);
});
