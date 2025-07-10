// client/src/routes.tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Calculate from './pages/Calculate';
import Blogs from './pages/Blogs';
import Products from './pages/Products';
import Layout from './Layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/hesaplama" element={<Calculate />} />
        <Route path="/bloglar" element={<Blogs />} />
        <Route path="/urunler" element={<Products />} />
      </Route>
    </Routes>
  );
}
