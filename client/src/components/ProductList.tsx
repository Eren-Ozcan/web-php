// client/src/components/ProductList.tsx
export default function ProductList() {
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-2xl font-semibold mb-8 text-center">Popüler Ürünler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition">Cam Balkon</div>
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition">Duşakabin</div>
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition">Ayna Dekor</div>
      </div>
    </section>
  );
}
