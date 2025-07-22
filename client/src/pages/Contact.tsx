import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          {t('contact_form_heading')}
        </h1>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              {t('contact_name_label')}
            </label>
            <input
              id="name"
              type="text"
              placeholder={t('contact_name_placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              {t('contact_email_label')}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t('contact_email_placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
              {t('contact_message_label')}
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder={t('contact_message_placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg opacity-70 cursor-not-allowed"
          >
            {t('contact_submit')}
          </button>
        </form>
      </div>
    </section>
  );
}
