// app/products/page.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';

// جميع المنتجات مع فئات محدثة
const allProducts = [
  // حواسيب
  { id: 1, name: 'لابتوبات', image: '/products/laptops.jpg', description: 'أجهزة كمبيوتر محمولة عالية الأداء', category: 'حواسيب' },
  { id: 7, name: 'كمبيوتر صغير', image: '/products/mini-pc.jpg', description: 'كمبيوتر بحجم صغير وأداء قوي', category: 'حواسيب' },
  
  // أجهزة لوحية
  { id: 2, name: 'ايباد', image: '/products/ipad.jpg', description: 'أجهزة لوحية للإبداع والإنتاجية', category: 'أجهزة لوحية' },
  
  // سماعات (فئة مستقلة)
  { id: 3, name: 'سماعات', image: '/products/headphones.jpg', description: 'سماعات عالية الجودة بصوت نقي', category: 'سماعات' },
  
  // شاشات
  { id: 4, name: 'شاشات', image: '/products/monitors.jpg', description: 'شاشات بدقة عالية وألوان زاهية', category: 'شاشات' },
  
  // طابعات
  { id: 5, name: 'طابعة', image: '/products/printer.jpg', description: 'طابعات متعددة الوظائف', category: 'طابعات' },
  { id: 9, name: 'ماكنات تصوير أوراق', image: '/products/copier.jpg', description: 'ماكنات تصوير متعددة الوظائف', category: 'طابعات' },
  
  // حبر (فئة مستقلة)
  { id: 6, name: 'حبر', image: '/products/ink.jpg', description: 'أحبار أصلية للطباعة بجودة عالية', category: 'حبر' },
  
  // ساعات
  { id: 8, name: 'ساعات يد حديثة', image: '/products/watch.jpg', description: 'ساعات ذكية متطورة بتقنيات حديثة', category: 'ساعات' },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // الفئات المتاحة (مرتبة ومنطقية)
  const categories = [
    'الكل',
    'حواسيب',
    'أجهزة لوحية',
    'سماعات',
    'شاشات',
    'طابعات',
    'حبر',
    'ساعات'
  ];

  // فلترة المنتجات
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.includes(searchTerm) || product.description.includes(searchTerm);
    const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* بار التنقل */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-8 text-sm border-b border-gray-200 pb-3">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
              الرئيسية
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-blue-600 font-semibold">المنتجات</span>
            <span className="text-gray-300">|</span>
            <Link href="/#contact" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
              تواصل معنا
            </Link>
          </div>
        </div>

        {/* الهيدر */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">جميع المنتجات</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            اكتشف مجموعتنا المتنوعة من أحدث المنتجات والتقنيات
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="🔍 ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* عرض عدد المنتجات */}
        <div className="mb-4 text-right">
          <p className="text-gray-500 text-sm">عدد المنتجات: {filteredProducts.length}</p>
        </div>

        {/* عرض المنتجات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-32 object-contain"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <Link 
                  href={`/${product.id}`}
                  className="block w-full text-center px-4 py-2 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* إذا لم يتم العثور على منتجات */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد منتجات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
}