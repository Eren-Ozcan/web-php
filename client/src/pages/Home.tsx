import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import ImageHotspots from '@jacobsdigitalfactory/react-image-hotspots';
import type { Swiper as SwiperClass } from 'swiper/types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperClass | null>(null);

  const handlePause = () => swiperRef.current?.autoplay?.stop();
  const handleResume = () => swiperRef.current?.autoplay?.start();

  const makeHotspot = (num: number, route: string, tooltip: string): JSX.Element => (
    <div
      onClick={() => navigate(route)}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      className="group relative w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-110 transition"
    >
      {num}
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10">
        {tooltip}
      </div>
    </div>
  );

  const imageData = [
    {
      image: '/images/house1.jpg',
      hotspots: [
        { x: 15, y: 20, content: makeHotspot(1, '/urunler/cam', 'Cam Ürünleri') },
        { x: 30, y: 40, content: makeHotspot(2, '/urunler/kapilar', 'Kapı Ürünleri') },
        { x: 60, y: 45, content: makeHotspot(3, '/urunler/balkon', 'Balkon Ürünleri') }
      ]
    },
    {
      image: '/images/house2.jpg',
      hotspots: [
        { x: 20, y: 30, content: makeHotspot(4, '/urunler/bahce', 'Bahçe Mobilyası') },
        { x: 45, y: 55, content: makeHotspot(5, '/urunler/ofis', 'Ofis Ürünleri') },
        { x: 70, y: 65, content: makeHotspot(6, '/urunler/cephe', 'Dış Cephe') }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Hoş Geldiniz</h1>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        pagination={{ clickable: true }}
        navigation={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {imageData.map((item, index) => (
          <SwiperSlide key={index}>
            <ImageHotspots
              src={item.image}
              hotspots={item.hotspots}
              hideFullscreenControl={true} // ✅ FS butonu devre dışı
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color: white;
            --swiper-navigation-size: 28px;
          }
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
