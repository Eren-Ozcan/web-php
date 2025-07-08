// client/src/pages/Home.tsx
import HeroSection from '../components/HeroSection';
import ProductList from '../components/ProductList';
import ContactCTA from '../components/ContactCTA';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProductList />
      <ContactCTA />
    </main>
  );
}
