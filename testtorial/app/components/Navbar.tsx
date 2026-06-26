'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { useLanguage, LANGUAGES, Lang } from '../contexts/LanguageContext';
import { useAutoTranslateBatch } from '../hooks/useAutoTranslate';

/* ── Types ── */
interface NavProduct { id: number; name: string; type: string; colorType: string; }

/* ── Category config ── */
const NAV_TYPE_ORDER = ['Ink', 'Printer', 'Gaming', 'GamingLaptop', 'Device', 'Other'];

const NAV_LABELS: Record<string, string> = {
  Ink: 'حبر BEC', Printer: 'طابعات', Gaming: 'ملحقات الجيمينج', GamingLaptop: 'لابتوب جيمينج', Device: 'أجهزة', Other: 'منتجات أخرى',
};

const NAV_UNIT: Record<string, string> = {
  Ink: 'لون', Gaming: 'ملحق', GamingLaptop: 'لابتوب', Printer: 'طابعة', Device: 'جهاز', Other: 'منتج',
};

const NAV_ICON: Record<string, string> = {
  Ink:          'M12 2c-2.8 3.8-5.5 7.2-5.5 11a5.5 5.5 0 0011 0C17.5 9.2 14.8 5.8 12 2z',
  Printer:      'M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2 0H8m0 0v4h8v-4',
  Gaming:       'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
  GamingLaptop: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  Device:       'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  Other:        'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
};

const NAV_STYLE: Record<string, { iconBg: string; iconFg: string; badge: string; href: string }> = {
  Ink:          { iconBg: 'bg-blue-50',    iconFg: 'text-blue-600',    badge: 'bg-blue-100 text-blue-700',       href: '/#bec-ink'  },
  Printer:      { iconBg: 'bg-indigo-50',  iconFg: 'text-indigo-600',  badge: 'bg-indigo-100 text-indigo-700',   href: '/products'  },
  Gaming:       { iconBg: 'bg-rose-50',    iconFg: 'text-rose-600',    badge: 'bg-rose-100 text-rose-700',       href: '/products?type=Gaming'       },
  GamingLaptop: { iconBg: 'bg-orange-50',  iconFg: 'text-orange-600',  badge: 'bg-orange-100 text-orange-700',   href: '/products?type=GamingLaptop' },
  Device:       { iconBg: 'bg-emerald-50', iconFg: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', href: '/products'  },
  Other:        { iconBg: 'bg-gray-50',    iconFg: 'text-gray-500',    badge: 'bg-gray-100 text-gray-500',       href: '/products'  },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [langOpen, setLangOpen]           = useState(false);
  const [productsOpen, setProductsOpen]   = useState(false);
  const [navProducts, setNavProducts]     = useState<NavProduct[]>([]);
  const [navLoading, setNavLoading]       = useState(true);

  const langRef     = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const pathname    = usePathname();
  const router      = useRouter();
  const { lang, setLang, tr } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) setProductsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    fetch('/api?action=getProducts')
      .then(r => r.json())
      .then(data => { setNavProducts(Array.isArray(data) ? data : []); setNavLoading(false); })
      .catch(() => setNavLoading(false));
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setProductsOpen(false);
    if (href === '/') { router.push('/'); return; }
    if (href.includes('#')) {
      const [, section] = href.split('#');
      if (pathname === '/') {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  const navLinks = [
    { id: 'home',     href: '/' },
    { id: 'about',    href: '/#about' },
    { id: 'services', href: '/#services' },
    { id: 'contact',  href: '/#contact' },
  ];

  const isActive = (id: string) => {
    if (id === 'home' && pathname === '/') return true;
    if (id === 'products' && pathname === '/products') return true;
    return false;
  };

  useEffect(() => {
    if (pathname === '/') {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          document.getElementById(hash.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname]);

  const currentLang  = LANGUAGES.find(l => l.code === lang)!;
  const activeTypes  = NAV_TYPE_ORDER.filter(t => navProducts.some(p => p.type === t));

  const NAV_LABELS_TR: Record<string, string> = {
    Ink: tr('type_label_ink'), Printer: tr('type_label_printer'),
    Gaming: tr('type_label_gaming'), GamingLaptop: tr('type_label_gaming_laptop'),
    Device: tr('type_label_device'), Other: tr('type_label_other'),
  };
  const NAV_UNIT_TR: Record<string, string> = {
    Ink: tr('nav_unit_ink'), Gaming: tr('nav_unit_gaming'), GamingLaptop: tr('nav_unit_gaming_laptop'),
    Printer: tr('nav_unit_printer'), Device: tr('nav_unit_device'), Other: tr('nav_unit_other'),
  };

  // Batch-translate all product names in the dropdown
  const navNameTexts = navProducts.reduce<Record<string, string>>((acc, p) => {
    acc[`p_${p.id}`] = p.name;
    return acc;
  }, {});
  const navNamesTr = useAutoTranslateBatch(navNameTexts, lang);

  /* ── Products dropdown: all product names ── */
  const ProductsDropdown = () => (
    <div
      className="absolute top-full mt-2 end-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
      style={{ minWidth: '220px', maxHeight: '420px', overflowY: 'auto' }}
    >
      <button
        onClick={() => handleNavClick('/products')}
        className="sticky top-0 w-full text-right px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-200 bg-white z-10"
      >
        {tr('nav_all_products')}
      </button>

      {navLoading ? (
        <div className="px-4 py-3 space-y-2">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${70 + i * 5}%` }} />
          ))}
        </div>
      ) : (
        navProducts.map((product, idx) => (
          <button
            key={product.id}
            onClick={() => handleNavClick(`/products?type=${product.type}`)}
            className={`w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${idx < navProducts.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            {navNamesTr[`p_${product.id}`] ?? product.name}
          </button>
        ))
      )}
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          <div className="shrink-0"><Logo /></div>

          {/* ── Desktop ── */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-4 lg:px-5 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-300 cursor-pointer ${
                  isActive(link.id) ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {tr(link.id)}
              </button>
            ))}

            {/* products dropdown trigger */}
            <div ref={productsRef} className="relative">
              <button
                onClick={() => setProductsOpen(v => !v)}
                className={`flex items-center gap-1.5 px-4 lg:px-5 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-300 cursor-pointer ${
                  pathname === '/products' || productsOpen ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {tr('products')}
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {productsOpen && <ProductsDropdown />}
            </div>

            {/* language */}
            <div ref={langRef} className="relative ms-3">
              <button
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                </svg>
                <span>{currentLang.nativeLabel}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 end-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 min-w-[160px] z-50 overflow-hidden">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code as Lang); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${lang === l.code ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                      dir={l.dir}>
                      <span className="text-base leading-none">
                        {l.code === 'ar' ? '🇸🇦' : l.code === 'en' ? '🇬🇧' : l.code === 'fr' ? '🇫🇷' : '🇩🇪'}
                      </span>
                      <span>{l.nativeLabel}</span>
                      {lang === l.code && (
                        <svg className="w-3.5 h-3.5 ms-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile: lang + hamburger ── */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                </svg>
                <span>{currentLang.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 end-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 min-w-[150px] z-50">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code as Lang); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${lang === l.code ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                      dir={l.dir}>
                      <span>{l.code === 'ar' ? '🇸🇦' : l.code === 'en' ? '🇬🇧' : l.code === 'fr' ? '🇫🇷' : '🇩🇪'}</span>
                      <span>{l.nativeLabel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all text-right ${
                    isActive(link.id) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}>
                  {tr(link.id)}
                </button>
              ))}

              {/* products accordion */}
              <div className="mt-1 rounded-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setProductsOpen(v => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 font-semibold text-base transition-colors ${productsOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700'}`}>
                  {tr('products')}
                  <svg className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {productsOpen && (
                  <div className="border-t border-gray-100 bg-white">
                    {/* all products row */}
                    <button onClick={() => handleNavClick('/products')}
                      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-blue-50 group transition-colors text-right">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{tr('nav_all_products')}</div>
                        <div className="text-xs text-gray-400">{navProducts.length} {tr('nav_unit_other')}</div>
                      </div>
                    </button>
                    {/* categories */}
                    {activeTypes.map((type, idx) => {
                      const s     = NAV_STYLE[type] ?? NAV_STYLE.Other;
                      const icon  = NAV_ICON[type]  ?? NAV_ICON.Other;
                      const count = navProducts.filter(p => p.type === type).length;
                      const last  = idx === activeTypes.length - 1;
                      return (
                        <button key={type} onClick={() => handleNavClick(s.href)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 group transition-colors text-right ${!last ? 'border-b border-gray-50' : ''}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
                            <svg className={`w-4 h-4 ${s.iconFg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon}/>
                            </svg>
                          </div>
                          <span className="flex-1 font-medium text-gray-800 group-hover:text-blue-600 text-sm transition-colors">{NAV_LABELS_TR[type] ?? type}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{count} {NAV_UNIT_TR[type] ?? tr('nav_unit_other')}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
