// client/src/components/Navbar/Navbar.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', name: t('home') },
    { path: '/urunler', name: t('products') },
    { path: '/calculator', name: t('calculator') },
    { path: '/bloglar', name: t('blogs') },
    { path: '/iletisim', name: t('contact') },
    { path: '/about', name: t('about') }
  ];

  const changeLanguage = (lng: 'tr' | 'en') => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-blue-600 text-white">
      {/* Desktop Navbar */}
      <div className="hidden md:flex container mx-auto p-4 items-center justify-between">
        <div className="flex space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === item.path
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-500 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="flex space-x-2">
          <button
            onClick={() => changeLanguage('tr')}
            className={`px-3 py-1 rounded ${i18n.language === 'tr' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
          >
            TR
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-500 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  changeLanguage('tr');
                  setIsMenuOpen(false);
                }}
                className={`px-3 py-1 rounded ${i18n.language === 'tr' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
              >
                TR
              </button>
              <button
                onClick={() => {
                  changeLanguage('en');
                  setIsMenuOpen(false);
                }}
                className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
              >
                EN
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
