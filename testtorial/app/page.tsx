'use client';

import { useState } from 'react';
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import { COMPANY_NAME } from './constants/company';
import Link from 'next/link';

// جميع المنتجات
const allProducts = [
  { id: 1, name: 'لابتوبات', image: '/products/laptops.jpg', description: 'أجهزة كمبيوتر محمولة عالية الأداء', category: 'لابتوبات' },
  { id: 2, name: 'ايباد', image: '/products/ipad.jpg', description: 'أجهزة لوحية للإبداع والإنتاجية', category: 'أجهزة لوحية' },
  { id: 3, name: 'سماعات', image: '/products/headphones.jpg', description: 'سماعات عالية الجودة بصوت نقي', category: 'ملحقات' },
  { id: 4, name: 'شاشات', image: '/products/monitors.jpg', description: 'شاشات بدقة عالية وألوان زاهية', category: 'شاشات' },
  { id: 5, name: 'طابعة', image: '/products/printer.jpg', description: 'طابعات متعددة الوظائف', category: 'طابعات' },
  { id: 6, name: 'حبر', image: '/products/ink.jpg', description: 'أحبار أصلية للطباعة بجودة عالية', category: 'ملحقات' },
  { id: 7, name: 'كمبيوتر صغير', image: '/products/mini-pc.jpg', description: 'كمبيوتر بحجم صغير وأداء قوي', category: 'حواسيب' },
  { id: 8, name: 'ساعات يد حديثة', image: '/products/watch.jpg', description: 'ساعات ذكية متطورة بتقنيات حديثة', category: 'ساعات' },
  { id: 9, name: 'ماكنات تصوير أوراق', image: '/products/copier.jpg', description: 'ماكنات تصوير متعددة الوظائف', category: 'طابعات' },
];

// Services data
const services = [
  { id: 1, name: 'توريد الأجهزة', icon: '📦', description: 'توريد جميع أنواع الأجهزة الإلكترونية بأحدث المواصفات' },
  { id: 2, name: 'الدعم الفني', icon: '🔧', description: 'فريق دعم فني متخصص لحل جميع المشاكل التقنية' },
  { id: 3, name: 'الصيانة', icon: '⚙️', description: 'صيانة دورية وطارئة لجميع الأجهزة' },
  { id: 4, name: 'حلول الشبكات', icon: '🌐', description: 'تصميم وتنفيذ حلول شبكات متكاملة' },
  { id: 5, name: 'حلول الأعمال', icon: '💼', description: 'حلول تقنية متكاملة للشركات والمؤسسات' },
];

export default function Home() {
  // Carousel state - ننتقل منتج واحد في كل مرة
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalProducts = allProducts.length;

  // دوال التنقل - منتج واحد في كل مرة
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalProducts);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalProducts) % totalProducts);
  };

  // المنتج الحالي
  const currentProduct = allProducts[currentIndex];

  // حساب المنتجات المعروضة (المنتج الحالي + منتجين إضافيين للتأثير)
  const getVisibleProducts = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      let index = (currentIndex + i + totalProducts) % totalProducts;
      result.push({ ...allProducts[index], position: i });
    }
    return result;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F19] to-[#1a1f2e] overflow-hidden pt-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold backdrop-blur-sm">
              تأسست 2017
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight">
            مستقبل التقنية <br className="hidden md:block"/> بين يديك الآن
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            أقوى حلول {COMPANY_NAME} لأعمالك ومنزلك. أجهزة موثوقة، أداء عالي، وخيارات تناسب كل احتياج بتصميم يفوق التوقعات.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#featured-products" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              استكشف المنتجات
            </Link>
            <Link href="/#about" className="px-8 py-4 border-2 border-gray-500 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:border-blue-500">
              من نحن
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">من نحن</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              بانياس للإلكترونيات <span className="text-blue-600">BEC</span>
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                تأسست <span className="font-bold text-blue-600">بانياس للإلكترونيات (BEC)</span> عام <span className="font-bold text-blue-600">2017</span> في <span className="font-bold text-blue-600">رام الله</span>، ونحن نقدم حلولاً تكنولوجية متكاملة للأفراد والشركات والمؤسسات في فلسطين.
              </p>
              
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">عنوان الشركة</h4>
                  <p className="text-gray-600">📍 البيرة – شارع القدس – مقابل بكدار</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full mt-1 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">حلول متكاملة</h4>
                    <p className="text-gray-600">نوفر أحدث الأجهزة والتقنيات مع خدمات الدعم والصيانة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full mt-1 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">جودة وموثوقية</h4>
                    <p className="text-gray-600">نقدم منتجات أصلية بجودة عالية وضمان موثوق</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full mt-1 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">صيانة سريعة ومضمونة</h4>
                    <p className="text-gray-600">صيانة دورية وطارئة لجميع الأجهزة بضمان جودة عالية وقطع غيار أصلية</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold">2017</div>
                    <div className="text-blue-200 text-sm mt-2">تأسست</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">+50k</div>
                    <div className="text-blue-200 text-sm mt-2">عميل راضي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">100%</div>
                    <div className="text-blue-200 text-sm mt-2">رضا العملاء</div>
                  </div>
                </div>
                <p className="text-blue-100 leading-relaxed text-center pt-4 border-t border-blue-500/30">
                  نسعى لنكون الشريك التقني الأول في فلسطين، من خلال حلول مبتكرة وخدمات موثوقة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">خدماتنا</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">حلول تقنية متكاملة</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto">نقدم مجموعة شاملة من الخدمات لتلبية جميع احتياجاتك التقنية</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group bg-gray-50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section - Carousel منتج واحد مع تأثير سلس */}
      <section id="featured-products" className="py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">منتجاتنا</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">استكشف المنتجات</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto">اكتشف مجموعتنا المتنوعة من أحدث المنتجات والتقنيات</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Carousel مع أسهم - منتج واحد في كل مرة */}
          <div className="relative px-4 md:px-12">
            {/* السهم الأيسر */}
            <button
              onClick={goToPrev}
              className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            >
              <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* السهم الأيمن */}
            <button
              onClick={goToNext}
              className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            >
              <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* المنتجات - عرض 3 منتجات مع تأثير المنتج الأوسط مكبر */}
            <div className="overflow-hidden">
              <div className="flex justify-center items-center gap-4 md:gap-8">
                {visibleProducts.map((product, idx) => {
                  const isCenter = product.position === 0;
                  const isLeft = product.position === -1;
                  const isRight = product.position === 1;
                  
                  return (
                    <div
                      key={`${product.id}-${product.position}`}
                      className={`
                        transition-all duration-500 ease-in-out
                        ${isCenter ? 'w-full md:w-1/2 scale-100 opacity-100 z-10' : ''}
                        ${isLeft ? 'hidden md:block md:w-1/3 scale-75 opacity-40 -translate-x-8' : ''}
                        ${isRight ? 'hidden md:block md:w-1/3 scale-75 opacity-40 translate-x-8' : ''}
                      `}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-48 object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                          <Link 
                            href={`/${product.id}`}
                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-300"
                          >
                            عرض التفاصيل
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* نقاط التنقل (Dots) */}
          <div className="flex justify-center gap-2 mt-8">
            {allProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-8 h-2 bg-blue-600'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* عرض المنتج الحالي */}
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              {currentIndex + 1} / {totalProducts}
            </p>
          </div>

          {/* زر عرض جميع المنتجات */}
          <div className="text-center mt-8">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              عرض جميع المنتجات
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">تواصل معنا</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">نحن هنا لخدمتك</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto">فريقنا جاهز للإجابة على استفساراتك وتقديم المساعدة</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp */}
            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 group">
              <div className="w-24 h-24 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#25D366] transition-all duration-300">
                <svg className="w-12 h-12 text-[#25D366] group-hover:text-white transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.032 2.001c-5.523 0-10 4.477-10 10 0 1.752.457 3.47 1.322 4.99L2 22l5.204-1.332c1.466.804 3.107 1.23 4.828 1.23 5.523 0 10-4.477 10-10s-4.477-10-10-10z"/>
                  <path d="M16.634 14.345c-.261-.131-1.54-.76-1.78-.847-.239-.087-.413-.131-.586.131-.173.262-.674.847-.826 1.021-.152.174-.304.196-.565.065-.261-.131-1.102-.406-2.099-1.297-.776-.693-1.3-1.549-1.452-1.812-.152-.262-.016-.403.114-.533.117-.117.261-.304.391-.456.13-.152.174-.261.261-.435.087-.174.043-.327-.022-.457-.065-.131-.586-1.414-.803-1.936-.212-.509-.427-.44-.586-.448-.152-.007-.326-.008-.5-.008-.174 0-.456.065-.695.326-.239.262-.913.893-.913 2.179s.936 2.528 1.066 2.702c.13.174 1.837 2.81 4.456 3.937.623.268 1.109.428 1.488.548.625.196 1.194.168 1.644.102.502-.074 1.54-.63 1.757-1.238.217-.608.217-1.129.152-1.238-.065-.109-.239-.174-.5-.305z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">واتساب</h3>
              <p className="text-gray-500 mb-6">دردش معنا مباشرة</p>
              <a href="https://wa.me/972568800999?text=مرحباً،%20أحتاج%20لمساعدة" target="_blank" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full hover:bg-[#20b859] transition-all duration-300 font-semibold">
                ابدأ المحادثة
              </a>
            </div>

            {/* Gmail */}
            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 group">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500 transition-all duration-300">
                <svg className="w-12 h-12 text-red-500 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m16.5 0L12 12.75 4.5 6.75m16.5 0H4.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">جيميل</h3>
              <p className="text-gray-500 mb-6">راسلنا عبر Gmail</p>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=zaidbhees910@gmail.com&su=استفسار%20عن%20منتجات%20BEC" target="_blank" className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300 font-semibold">
                أرسل عبر جيميل
              </a>
            </div>

            {/* Facebook */}
            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 group">
              <div className="w-24 h-24 bg-[#1877F2]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1877F2] transition-all duration-300">
                <svg className="w-12 h-12 text-[#1877F2] group-hover:text-white transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.989C18.343 21.129 22 16.99 22 12z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">فيسبوك</h3>
              <p className="text-gray-500 mb-6">تابعنا للحصول على أحدث العروض</p>
              <a href="https://www.facebook.com/banyaselectronics" target="_blank" className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-full hover:bg-[#0f5db4] transition-all duration-300 font-semibold">
                تابعنا على فيسبوك
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <Logo variant="light" size="sm" />
              <p className="mt-4 text-sm leading-relaxed">
                نسعى دائماً لتقديم أحدث التقنيات وأفضل الحلول لتطوير منظومة الأعمال وتحسين أسلوب الحياة.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/#featured-products" className="hover:text-white transition">المنتجات</Link></li>
                <li><Link href="/#services" className="hover:text-white transition">خدماتنا</Link></li>
                <li><Link href="/#about" className="hover:text-white transition">من نحن</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition">تواصل معنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">خدماتنا</h4>
              <ul className="space-y-2">
                <li><Link href="/#services" className="hover:text-white transition">توريد الأجهزة</Link></li>
                <li><Link href="/#services" className="hover:text-white transition">الدعم الفني</Link></li>
                <li><Link href="/#services" className="hover:text-white transition">الصيانة</Link></li>
                <li><Link href="/#services" className="hover:text-white transition">حلول الشبكات</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">تابعنا</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/banyaselectronics" target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.989C18.343 21.129 22 16.99 22 12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-800">
            <p>© {new Date().getFullYear()} {COMPANY_NAME}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}