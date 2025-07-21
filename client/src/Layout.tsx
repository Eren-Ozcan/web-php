// client/src/Layout.tsx
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
