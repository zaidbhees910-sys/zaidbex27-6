// app/[id]/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  specifications?: string;
}

type Props = {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState<number | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    params.then(p => {
      setProductId(parseInt(p.id));
    });
  }, [params]);

  useEffect(() => {
    fetch('/api?action=getProducts')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
      });
  }, []);

  useEffect(() => {
    if (productId) {
      fetch(`/api?action=getProduct&id=${productId}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">جاري تحميل المنتج...</div>
      </div>
    );
  }

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
    <ProductPageClient product={product} allProducts={allProducts} />
  );
}

// Client Component
function ProductPageClient({ product, allProducts }: { product: any; allProducts: any[] }) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // أصناف افتراضية للمنتج
  const variants = [
    { name: 'الإصدار الأساسي', price: 'يحدد لاحقاً' },
    { name: 'الإصدار المتوسط', price: 'يحدد لاحقاً' },
    { name: 'الإصدار الاحترافي', price: 'يحدد لاحقاً' },
  ];

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

  // فلترة المنتجات المقترحة
  const suggestedProducts = allProducts.filter(p => p.id !== product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* بار التنقل */}
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=صورة+غير+موجودة';
                }}
              />
            </div>

            {/* قسم التفاصيل */}
            <div className="md:w-1/2 p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* السعر */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">السعر:</span>
                  <span className="text-2xl font-bold text-blue-600">{product.price} ₪</span>
                </div>
              </div>

              {/* المواصفات */}
              {product.specifications && (
                <div className="mb-6">
                  <h3 className="text-gray-700 font-semibold mb-2">المواصفات:</h3>
                  <p className="text-gray-600">{product.specifications}</p>
                </div>
              )}

              {/* عرض الأصناف */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-4 text-lg">
                  اختر الإصدار:
                </label>
                <div className="space-y-3">
                  {variants.map((variant, index) => (
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

              {/* زر طلب عرض سعر */}
              <button 
                onClick={() => window.location.href = '/#contact'}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition shadow-md"
              >
                طلب عرض سعر 📞
              </button>

              <p className="text-center text-gray-400 text-sm mt-4">
                للاستفسار عن السعر والمواصفات، يرجى التواصل معنا
              </p>
            </div>
          </div>
        </div>

        {/* منتجات قد تعجبك */}
        {suggestedProducts.length > 0 && (
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
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="h-24 mx-auto mb-3 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                      }}
                    />
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <p className="text-sm font-bold text-blue-600 mt-1">{p.price} ₪</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}