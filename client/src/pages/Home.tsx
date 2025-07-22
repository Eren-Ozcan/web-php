import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import type { Swiper as SwiperClass } from 'swiper/types';
import { useTranslation } from 'react-i18next';
import { useContent } from '../ContentContext';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { content } = useContent();
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperClass | null>(null);

  const handlePause = () => swiperRef.current?.autoplay?.stop();
  const handleResume = () => swiperRef.current?.autoplay?.start();

  const imageData = [
    {
      image: '/images/house1.jpg',
      hotspots: [
        { x: 15, y: 20, label: '1', route: '/urunler/glass', tooltip: t('glass') },
        { x: 30, y: 40, label: '2', route: '/urunler/door', tooltip: t('door') },
        { x: 60, y: 45, label: '3', route: '/urunler/balcony', tooltip: t('balcony') }
      ]
    },
    {
      image: '/images/house2.jpg',
      hotspots: [
        { x: 20, y: 30, label: '4', route: '/urunler/garden', tooltip: t('garden') },
        { x: 45, y: 55, label: '5', route: '/urunler/office', tooltip: t('office') },
        { x: 70, y: 65, label: '6', route: '/urunler/facade', tooltip: t('exterior') }
      ]
    }
  ];


  return (
    <>
      {/* Başlık */}
      <div className="w-full pt-[100px] px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">{t('welcome')}</h1>
      </div>

      {/* İçerik: Yazı + Slider */}
      <div className="w-full mt-6 flex justify-center gap-6 px-4">
        <div className="w-[30vw] max-w-sm p-4 text-left rounded bg-white shadow">
          <h2 className="text-2xl font-semibold mb-2">{t('left_section_title')}</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{t('left_section_text')}</p>
        </div>

        <div className="relative w-[60vw] max-w-[1280px] aspect-video">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="w-full h-full"
          >
            {imageData.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  {slide.hotspots.map((hotspot, hIdx) => (
                    <div
                      key={hIdx}
                      onClick={() => navigate(hotspot.route)}
                      className="absolute flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-700 transition group"
                      style={{
                        top: `${hotspot.y}%`,
                        left: `${hotspot.x}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {hotspot.label}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-md z-10">
                        {hotspot.tooltip}
                      </div>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Bloglar */}
      <div className="mt-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">{t('blogs')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.blogs.slice(0, 3).map((b) => (
            <div
              key={b.id}
              onClick={() => navigate(`/article/${b.id}`)}
              className="bg-white rounded shadow-md p-4 hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{t(b.titleKey)}</h3>
              <p className="text-gray-600 text-sm">{t(b.textKey)}</p>
              <span className="mt-2 text-sm text-blue-500 hover:underline inline-block">
                {t('readMore')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Projeler */}
      <div className="mt-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">{t('projects')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.projects
            .filter((p) => p.featured)
            .slice(0, 3)
            .map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/article/${p.id}`)}
                className="overflow-hidden rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <img src={p.image} alt={t(p.titleKey)} className="w-full h-48 object-cover" />
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-lg text-gray-800">{t(p.titleKey)}</h3>
                  <p className="text-gray-600 text-sm">{t(p.descriptionKey)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Ürün İncelemeleri */}
      <div className="mt-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">{t('reviews')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {content.reviews.slice(0, 2).map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/article/${r.id}`)}
              className="bg-white shadow rounded-lg overflow-hidden flex flex-col md:flex-row cursor-pointer"
            >
              <img src={r.image} alt={t(r.titleKey)} className="w-full md:w-1/3 h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t(r.titleKey)}</h3>
                <p className="text-gray-600">{t(r.textKey)}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
    </>
  );
};

export default Home;
