import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';
import ImageHotspots from '@jacobsdigitalfactory/react-image-hotspots';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Hotspot tanımları
  const imageData = [
    {
      image: '/images/house1.jpg',
      hotspots: [
        {
          x: 30,
          y: 40,
          content: (
            <div
              onClick={() => navigate('/urunler/cam')}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:scale-110 transition transform"
            >
              Cam Ürünleri
            </div>
          )
        },
        {
          x: 70,
          y: 50,
          content: (
            <div
              onClick={() => navigate('/urunler/duvar')}
              className="bg-yellow-600 text-white text-xs px-2 py-1 rounded cursor-pointer hover:scale-110 transition transform"
            >
              Duvar Ürünleri
            </div>
          )
        }
      ]
    },
    {
      image: '/images/house2.jpg',
      hotspots: [
        {
          x: 25,
          y: 60,
          content: (
            <div
              onClick={() => navigate('/urunler/cati')}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:scale-110 transition transform"
            >
              Çatı Ürünleri
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Hoş Geldiniz</h1>
      <Swiper spaceBetween={30} slidesPerView={1} loop autoplay={{ delay: 4000 }}>
        {imageData.map((item, index) => (
          <SwiperSlide key={index}>
            <ImageHotspots src={item.image} hotspots={item.hotspots} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;
