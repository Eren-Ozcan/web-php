export default function Contact() {
  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">İletişim Formu</h1>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Adınız
            </label>
            <input
              id="name"
              type="text"
              placeholder="Adınızı girin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              placeholder="ornek@mail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
              Mesajınız
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Mesajınızı yazın..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg opacity-70 cursor-not-allowed"
          >
            Gönder (Pasif)
          </button>
        </form>
      </div>
    </section>
  );
}
