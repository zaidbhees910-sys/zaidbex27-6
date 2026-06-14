// app/[id]/page.tsx

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>
}

// بيانات المنتجات مع الأصناف والأسعار المختلفة
const allProducts = [
  { 
    id: 1, 
    name: 'لابتوبات', 
    image: '/products/laptops.jpg', 
    description: 'أجهزة كمبيوتر محمولة عالية الأداء',
    variants: [
      { name: '8GB RAM - 256GB SSD', price: '$599' },
      { name: '16GB RAM - 512GB SSD', price: '$799' },
      { name: '32GB RAM - 1TB SSD', price: '$1099' },
    ]
  },
  { 
    id: 2, 
    name: 'ايباد', 
    image: '/products/ipad.jpg', 
    description: 'أجهزة لوحية للإبداع والإنتاجية',
    variants: [
      { name: 'iPad 64GB', price: '$499' },
      { name: 'iPad 256GB', price: '$649' },
      { name: 'iPad Pro 512GB', price: '$1099' },
    ]
  },
  { 
    id: 3, 
    name: 'سماعات', 
    image: '/products/headphones.jpg', 
    description: 'سماعات عالية الجودة بصوت نقي',
    variants: [
      { name: 'سماعات لاسلكية أساسية', price: '$89' },
      { name: 'سماعات لاسلكية احترافية', price: '$149' },
      { name: 'سماعات عازلة للضوضاء', price: '$249' },
    ]
  },
  { 
    id: 4, 
    name: 'شاشات', 
    image: '/products/monitors.jpg', 
    description: 'شاشات بدقة عالية وألوان زاهية',
    variants: [
      { name: '24 بوصة Full HD', price: '$199' },
      { name: '27 بوصة 4K', price: '$399' },
      { name: '32 بوصة 4K منحنية', price: '$599' },
    ]
  },
  { 
    id: 5, 
    name: 'طابعة', 
    image: '/products/printer.jpg', 
    description: 'طابعات متعددة الوظائف',
    variants: [
      { name: 'طابعة منزلية', price: '$149' },
      { name: 'طابعة لاسلكية', price: '$249' },
      { name: 'طابعة متعددة الوظائف (طباعة - نسخ - مسح)', price: '$399' },
    ]
  },
  { 
    id: 6, 
    name: 'حبر', 
    image: '/products/ink.jpg', 
    description: 'أحبار أصلية للطباعة بجودة عالية',
    variants: [
      { name: 'خرطوشة حبر أسود', price: '$29' },
      { name: 'خرطوشة حبر ملون (3 ألوان)', price: '$49' },
      { name: 'طقم حبر كامل (أسود + ملون)', price: '$89' },
    ]
  },
  { 
    id: 7, 
    name: 'كمبيوتر صغير', 
    image: '/products/mini-pc.jpg', 
    description: 'كمبيوتر بحجم صغير وأداء قوي',
    variants: [
      { name: '8GB RAM - 128GB SSD', price: '$299' },
      { name: '16GB RAM - 256GB SSD', price: '$399' },
      { name: '32GB RAM - 512GB SSD', price: '$599' },
    ]
  },
  { 
    id: 8, 
    name: 'ساعات يد حديثة', 
    image: '/products/watch.jpg', 
    description: 'ساعات ذكية متطورة بتقنيات حديثة، قياس نبضات القلب، عداد خطوات، وشاشة تعمل باللمس',
    variants: [
      { name: 'ساعة رياضية', price: '$199' },
      { name: 'ساعة كلاسيكية', price: '$299' },
      { name: 'ساعة ذكية متكاملة', price: '$399' },
    ]
  },
  { 
    id: 9, 
    name: 'ماكنات تصوير أوراق', 
    image: '/products/copier.jpg', 
    description: 'ماكنات تصوير متعددة الوظائف (طباعة - نسخ - مسح ضوئي) بجودة عالية وسرعة فائقة',
    variants: [
      { name: 'ماكنة تصوير منزلية', price: '$399' },
      { name: 'ماكنة تصوير مكتبية', price: '$799' },
      { name: 'ماكنة تصوير احترافية A3', price: '$1299' },
    ]
  },
];

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = parseInt(id);
  const product = allProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
          <p className="text-gray-600 mb-8">عذراً، لا يوجد منتج بهذا الرقم</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProductPageClient product={product} />
  );
}

// Client Component
function ProductPageClient({ product }: { product: any }) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // دوال السحب بالماوس
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainer.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainer.current.offsetLeft;
    scrollLeftStart.current = scrollContainer.current.scrollLeft;
    scrollContainer.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainer.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainer.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    if (!scrollContainer.current) return;
    isDragging.current = false;
    scrollContainer.current.style.cursor = 'grab';
  };

  // فلترة المنتجات المقترحة (كل المنتجات ما عدا الحالي)
  const suggestedProducts = allProducts.filter(p => p.id !== product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* بار التنقل - الرئيسية | المنتجات | تواصل معنا */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-8 text-sm border-b border-gray-200 pb-3">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
              الرئيسية
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/products" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
              المنتجات
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/#contact" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
              تواصل معنا
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-blue-600 font-semibold">{product.name}</span>
          </div>
        </div>

        {/* بطاقة المنتج */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* قسم الصورة */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 p-12 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="max-w-full h-auto max-h-[400px] object-contain"
              />
            </div>

            {/* قسم التفاصيل */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* عرض جميع الأصناف مع السعر */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-4 text-lg">
                  اختر الإصدار:
                </label>
                <div className="space-y-3">
                  {product.variants.map((variant: any, index: number) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-100"
                    >
                      <span className="text-gray-800 font-medium">{variant.name}</span>
                      <span className="text-blue-600 font-bold text-xl">{variant.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* منتجات قد تعجبك - مع شريط سحب */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">منتجات قد تعجبك</h2>
          
          <div 
            ref={scrollContainer}
            className="overflow-x-auto cursor-grab select-none"
            style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
              {suggestedProducts.map((p) => (
                <Link 
                  key={p.id} 
                  href={`/${p.id}`}
                  className="bg-white rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 w-40 flex-shrink-0 hover:-translate-y-1 block"
                >
                  <img src={p.image} alt={p.name} className="h-24 mx-auto mb-3 object-contain" />
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.variants[0].price}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}