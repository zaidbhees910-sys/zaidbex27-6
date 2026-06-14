'use client';

import { useState } from 'react';
import Link from 'next/link';  // ✅ أضف هذا

interface Product {
  id: number;
  name: string;
  image: string;
}

interface ProductGalleryProps {
  products: Product[];
}

export default function ProductGallery({ products }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const currentProduct = products[currentIndex];
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-gray-50 rounded-3xl border border-gray-100 p-2 md:p-4 flex flex-col md:flex-row items-stretch shadow-sm">
      
      {/* القسم الداكن */}
      <div className="w-full md:w-1/3 bg-[#0B0F19] text-white rounded-2xl p-8 flex flex-col justify-between relative z-10 md:-ml-8 shadow-2xl order-2 md:order-1 mt-4 md:mt-0">
        <div>
          <span className="text-blue-400 text-xs font-bold mb-3 block uppercase tracking-wider">
            منتجات BEC
          </span>
          <h3 key={`title-${currentIndex}`} className="text-3xl font-bold mb-4 animate-fade-in">
            {currentProduct.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            اختر المنتج من القائمة أو استخدم أزرار التنقل لمشاهدة الصور واحدة تلو الأخرى.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-start">
          <button onClick={nextProduct} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={prevProduct} className="w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-all duration-300 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ قسم الصورة مع زر التفاصيل */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl flex items-center justify-center p-8 relative min-h-[350px] md:min-h-[450px] order-1 md:order-2">
        <div className="absolute top-6 left-6 bg-white border border-gray-100 px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-sm z-10">
          {formatNumber(currentIndex + 1)} / {formatNumber(products.length)}
        </div>

        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <img
            key={`img-${currentProduct.id}`}
            src={currentProduct.image}
            alt={currentProduct.name}
            className="max-w-full max-h-[250px] md:max-h-[280px] object-contain transition-opacity duration-500 animate-fade-in"
          />
          
          {/* ✅ زر التفاصيل - هذا هو التغيير الأساسي */}
          <Link href={`/${currentProduct.id}`}>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md text-sm font-semibold">
              عرض التفاصيل ←
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}