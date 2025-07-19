// client/src/routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Calculate from './pages/Calculate';
import Blogs from './pages/Blogs';
import Products from './pages/Products';
import About from './pages/About';
import Article from './pages/Article';
import Layout from './Layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/calculator" element={<Calculate />} />
        <Route path="/hesaplama" element={<Navigate to="/calculator" replace />} />
        <Route path="/bloglar" element={<Blogs />} />
        <Route path="/urunler" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/article/:topic" element={<Article />} />
      </Route>
    </Routes>
  );
}
