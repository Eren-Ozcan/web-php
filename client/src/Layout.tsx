// client/src/Layout.tsx
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
