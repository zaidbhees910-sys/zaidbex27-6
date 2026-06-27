'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import IntroScreen from './components/IntroScreen';
import { COMPANY_NAME } from './constants/company';
import { useLanguage } from './contexts/LanguageContext';
import { useAutoTranslateBatch } from './hooks/useAutoTranslate';

/* ─── Types ──────────────────────────────────────────────── */
interface Variant { id: number; name: string; brand: string; price: number; specifications: string; image: string; stock?: number; featured?: boolean; }
interface Product { id: number; name: string; category: string; description: string; image: string; type: string; brand: string; modelNumber: string; colorType: string; featured: boolean; variants?: Variant[]; }
interface HpVariant { id: number; name: string; image: string; }
interface HpCategory { id: number; title: string; description: string; image: string; link: string; icon: string; sortOrder: number; variantIds: number[]; variants?: HpVariant[]; displayMode?: 'products' | 'logo'; }
interface HpBanner { id: number; title: string; subtitle: string; ctaText: string; ctaLink: string; bgColor: string; image: string; }
interface HomepageData { settings: Record<string, string>; banners: HpBanner[]; categories: HpCategory[]; }

/* ─── Constants ───────────────────────────────────────────── */
const SERVICE_ICONS = ['📦', '🔧', '⚙️', '🌐', '💼'];
const SERVICE_KEYS  = [['svc1_name','svc1_desc'],['svc2_name','svc2_desc'],['svc3_name','svc3_desc'],['svc4_name','svc4_desc'],['svc5_name','svc5_desc']];

const CAT_GRADIENTS = [
  'linear-gradient(145deg,#0c1445 0%,#1e3a8a 55%,#2563eb 100%)',
  'linear-gradient(145deg,#1a0533 0%,#5b21b6 55%,#8b5cf6 100%)',
  'linear-gradient(145deg,#042f2e 0%,#0f766e 55%,#0891b2 100%)',
  'linear-gradient(145deg,#3b0764 0%,#7e22ce 55%,#a855f7 100%)',
];

const DEFAULT_CATEGORIES: HpCategory[] = [
  { id: 0, title:'الطباعة والأحبار', description:'أحبار BEC الأصلية وطابعات HP وCanon وBrother', image:'', link:'/products?type=Ink',    icon:'🖨️', sortOrder:1, variantIds:[] },
  { id: 1, title:'Gaming',           description:'لابتوبات جيمينج وإكسسوارات احترافية',           image:'', link:'/products?type=GamingLaptop', icon:'🎮', sortOrder:2, variantIds:[] },
  { id: 2, title:'أجهزة الكمبيوتر', description:'لابتوبات وأجهزة بأحدث المواصفات',               image:'', link:'/products?type=Device',  icon:'💻', sortOrder:3, variantIds:[] },
  { id: 3, title:'الإكسسوارات',     description:'سماعات وملحقات تقنية متنوعة',                   image:'', link:'/products?type=Other',   icon:'🎧', sortOrder:4, variantIds:[] },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function interleaveByKey<T>(items: T[], key: keyof T): T[] {
  const groupMap = new Map<unknown, T[]>();
  for (const item of items) {
    const k = item[key];
    if (!groupMap.has(k)) groupMap.set(k, []);
    groupMap.get(k)!.push(item);
  }
  const groups = shuffleArray([...groupMap.values()]).map(g => shuffleArray(g));
  const result: T[] = [];
  const maxLen = Math.max(0, ...groups.map(g => g.length));
  for (let i = 0; i < maxLen; i++) for (const g of groups) if (i < g.length) result.push(g[i]);
  return result;
}

/* ─── Sub-components ─────────────────────────────────────── */
function CategoryCard({ cat, index }: { cat: HpCategory; index: number }) {
  const isLogoMode = cat.displayMode === 'logo';
  const hasImage   = !!cat.image;
  const href = (cat.variantIds?.length && cat.id) ? `/products?categoryId=${cat.id}` : cat.link;
  const grad = CAT_GRADIENTS[index % CAT_GRADIENTS.length];

  return (
    <Link
      href={href}
      className="group snap-start flex-none w-[78vw] sm:w-[44vw] lg:w-full relative rounded-3xl overflow-hidden flex flex-col cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
      style={{ minHeight: 360 }}
    >
      <div className="absolute inset-0">
        {hasImage && !isLogoMode ? (
          <img src={cat.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full transition-transform duration-700 group-hover:scale-110" style={{ background: grad }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-8 pb-4">
        {isLogoMode && hasImage ? (
          <img src={cat.image} alt={cat.title} className="max-h-32 max-w-[72%] w-auto object-contain drop-shadow-2xl"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : !hasImage ? (
          <span className="select-none" style={{ fontSize: '5rem', lineHeight: 1, opacity: 0.55 }}>{cat.icon}</span>
        ) : null}
      </div>

      <div className="relative z-10 px-5 pb-5">
        <div className="inline-flex items-center gap-1.5 mb-3 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
          <span className="text-sm leading-none">{cat.icon}</span>
          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{cat.title}</span>
        </div>
        {cat.description && (
          <p className="text-white/65 text-xs leading-relaxed mb-4 line-clamp-2">{cat.description}</p>
        )}
        <span className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-xs px-5 py-2.5 rounded-xl shadow group-hover:bg-blue-50 transition-colors duration-200">
          تصفح المنتجات
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}

function PromoBanner({ banner }: { banner: HpBanner }) {
  const style = banner.image ? {
    backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${banner.image})`,
    backgroundSize: 'cover', backgroundPosition: 'center',
  } : { background: banner.bgColor || '#2563eb' };

  return (
    <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={style}>
      <div>
        <h3 className="text-white font-bold text-xl leading-snug">{banner.title}</h3>
        {banner.subtitle && <p className="text-white/70 text-sm mt-1">{banner.subtitle}</p>}
      </div>
      {banner.ctaText && (
        <Link href={banner.ctaLink || '/products'}
          className="flex-shrink-0 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition whitespace-nowrap shadow-lg">
          {banner.ctaText}
        </Link>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Home() {
  const [products,     setProducts]     = useState<Product[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData>({ settings: {}, banners: [], categories: [] });
  const [loading,      setLoading]      = useState(true);
  const [showIntro,    setShowIntro]    = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(4);
  const { tr, dir, lang } = useLanguage();
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('bec-intro');
    if (seen) setShowIntro(false);
  }, []);

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem('bec-intro', '1');
    setShowIntro(false);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api?action=getProducts').then(r => r.json()),
      fetch('/api?action=getHomepageData').then(r => r.json()),
    ]).then(([all, hp]) => {
      setProducts(Array.isArray(all) ? all : []);
      if (hp && hp.settings) setHomepageData(hp);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCardsVisible(w < 640 ? 1 : w < 1024 ? 2 : 4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  const carouselItems = useMemo(() => {
    const raw = products.filter(p => p.featured).flatMap(p => {
      const all = p.variants || [];
      const chosen = all.filter(v => v.featured);
      return (chosen.length > 0 ? chosen : all).map(v => ({
        ...v, productId: p.id, category: p.category, productName: p.name,
        isInk: p.type === 'Ink', productType: p.type,
      }));
    });
    return interleaveByKey(raw, 'productType');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  /* ── Hero image collage: one image per product type ── */
  const heroImages = useMemo(() => {
    const LABELS: Record<string, string> = { Ink: 'حلول الطباعة', GamingLaptop: 'Gaming', Device: 'الأجهزة', Other: 'إكسسوارات' };
    return (['Ink', 'GamingLaptop', 'Device', 'Other'] as const)
      .map(type => {
        const img = products.find(p => p.type === type)?.variants?.[0]?.image;
        return img ? { img, label: LABELS[type] } : null;
      })
      .filter((x): x is { img: string; label: string } => x !== null);
  }, [products]);

  /* ── Product images for solution cards ── */
  const solutionImages = useMemo(() => ({
    ink:    products.find(p => p.type === 'Ink')?.variants?.[0]?.image    || '',
    gaming: products.find(p => p.type === 'GamingLaptop')?.variants?.[0]?.image || '',
    device: products.find(p => p.type === 'Device')?.variants?.[0]?.image || '',
  }), [products]);

  const carouselTexts = carouselItems.reduce<Record<string, string>>((acc, item) => {
    acc[`name_${item.id}`] = item.name;
    acc[`cat_${item.id}`]  = item.category;
    return acc;
  }, {});
  const carouselTr = useAutoTranslateBatch(carouselTexts, lang);

  const maxIdx      = Math.max(0, carouselItems.length - cardsVisible);
  const cardWidthPct = 100 / cardsVisible;
  const translatePct = dir === 'rtl' ? currentIndex * cardWidthPct : -(currentIndex * cardWidthPct);

  useEffect(() => { setCurrentIndex(prev => Math.min(prev, maxIdx)); }, [maxIdx]);

  const goNext = useCallback(() => setCurrentIndex(p => Math.min(p + 1, maxIdx)), [maxIdx]);
  const goPrev = useCallback(() => setCurrentIndex(p => Math.max(p - 1, 0)), []);

  const handleDragStart = useCallback((x: number) => { dragStartX.current = x; isDragging.current = false; }, []);
  const handleDragEnd   = useCallback((x: number) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - x;
    if (Math.abs(diff) > 50) {
      if (dir === 'rtl') { diff > 0 ? goPrev() : goNext(); }
      else               { diff > 0 ? goNext() : goPrev(); }
    }
    dragStartX.current = null;
  }, [dir, goNext, goPrev]);

  const displayCategories = homepageData.categories.length > 0 ? homepageData.categories : DEFAULT_CATEGORIES;
  const s = homepageData.settings;

  if (loading) {
    return (
      <>
        {showIntro && <IntroScreen onDone={handleIntroDone} />}
        <div className="min-h-screen bg-[#080C18]" />
      </>
    );
  }

  return (
    <>
      {showIntro && <IntroScreen onDone={handleIntroDone} />}
      <div className="min-h-screen bg-white font-sans" dir={dir}>
        <Navbar />

        {/* ══ 1. HERO ══════════════════════════════════════════ */}
        <HeroSection
          onContactClick={scrollToContact}
          titleOverride={s.hero_title || 'حلول تقنية متكاملة'}
          subtitleOverride={s.hero_subtitle || 'للشركات والأفراد'}
          titleHighlight="متكاملة"
          badgeOverride={s.hero_badge || 'شركة BEC للحلول التقنية · منذ 2017'}
          descOverride={s.hero_desc || 'طباعة احترافية، أجهزة أصلية، وتجميعات Gaming مخصصة حسب طلبك'}
          heroImageSrc="/assets/bec-hero.png"
        />

        {/* ══ 2. حلولنا الرئيسية — horizontal solution cards ══ */}
        <section className="py-24 px-4 md:px-8" style={{ background: '#f8faff' }}>
          <div className="max-w-[1260px] mx-auto">

            {/* Header */}
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] bg-blue-50 border border-blue-100 px-5 py-2 rounded-full mb-5">
                خدماتنا
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">حلولنا الرئيسية</h2>
              <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
                حلول تقنية متكاملة للشركات والأفراد
              </p>
            </div>

            {/* ── 3 vertical cards side by side ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 — Printing */}
              <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* Image area */}
                <div className="h-52 overflow-hidden relative">
                  <img src="/assets/card-printing.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                {/* Text */}
                <div className="flex flex-col flex-1 p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">حلول الطباعة للشركات</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                    عقود توريد وصيانة للطابعات وماكينات التصوير مع دعم فني وحلول للشركات
                  </p>
                  <a href="#printer-card"
                    className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all duration-300">
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    اعرف المزيد
                  </a>
                </div>
              </div>

              {/* Card 2 — Gaming */}
              <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <img src="/assets/card-gaming.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col flex-1 p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#faf5ff,#ede9fe)' }}>
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">تجميعات Gaming</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                    اطلب جهازك بالمواصفات التي تريدها ونحن نقوم بالتجميع خلال فترة قصيرة بأفضل القطع المناسبة
                  </p>
                  <Link href="/gaming-build"
                    className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm hover:gap-3 transition-all duration-300">
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    اطلب جهازك
                  </Link>
                </div>
              </div>

              {/* Card 3 — Electronics */}
              <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="h-52 overflow-hidden relative">
                  <img src="/assets/card-electronics.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col flex-1 p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#ecfeff,#cffafe)' }}>
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">الأجهزة الإلكترونية</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                    لابتوبات، إكسسوارات وأجهزة أصلية من أفضل العلامات
                  </p>
                  <Link href="/products?category=gaming&sort=price-desc"
                    className="inline-flex items-center gap-2 text-cyan-600 font-bold text-sm hover:gap-3 transition-all duration-300">
                    <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    تصفح المنتجات
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ 5. BEC INK SECTION ═══════════════════════════════ */}
        <section id="bec-ink" className="relative py-24 px-4 md:px-8 overflow-hidden bg-white border-y border-gray-100">
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(#2563eb 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-[480px] h-[320px] rounded-full blur-[120px] pointer-events-none opacity-[0.12]"
            style={{ background: 'radial-gradient(circle,rgba(37,99,235,1) 0%,transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[280px] rounded-full blur-[100px] pointer-events-none opacity-[0.08]"
            style={{ background: 'radial-gradient(circle,rgba(124,58,237,1) 0%,transparent 70%)' }} />

          <div className="relative max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
              <div className="flex-1 text-right order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                  <span className="relative flex w-2 h-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                  </span>
                  <span className="text-blue-700 text-xs font-bold tracking-[0.16em] uppercase">{tr('ink_exclusive')}</span>
                </div>
                <div>
                  <h2 className="font-black leading-[1.1] tracking-tight">
                    <span className="block text-gray-900 text-4xl md:text-5xl lg:text-[3.2rem]">{tr('ink_h1')}</span>
                    <span className="block text-4xl md:text-5xl lg:text-[3.2rem] mt-1">
                      <span className="text-gray-900">{tr('ink_h2a')}</span>
                      <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#2563eb 0%,#0ea5e9 55%,#7c3aed 100%)' }}>
                        {tr('ink_h2b')}
                      </span>
                    </span>
                  </h2>
                  <div className="mt-4 flex justify-end">
                    <div className="h-[3px] w-20 rounded-full bg-gradient-to-l from-blue-600 to-blue-400" />
                  </div>
                </div>
                <p className="text-gray-500 text-base leading-relaxed max-w-[420px]">{tr('ink_desc')}</p>
                <div className="space-y-3">
                  {[tr('ink_feat1'), tr('ink_feat2'), tr('ink_feat3')].map(f => (
                    <div key={f} className="flex items-center gap-3 text-gray-700 text-sm">
                      <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center bg-blue-50 border border-blue-200">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {[{ val:'+95', lbl:tr('ink_stat1'), icon:'🖨️' },{ val:'+10', lbl:tr('ink_stat2'), icon:'🔗' },{ val:'100%', lbl:tr('ink_stat3'), icon:'✅' }].map(st => (
                    <div key={st.lbl} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                      <span className="text-xl leading-none">{st.icon}</span>
                      <div>
                        <div className="text-xl font-black text-gray-900 leading-none">{st.val}</div>
                        <div className="text-gray-500 text-[11px] mt-0.5 font-medium">{st.lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/products?type=Ink"
                    className="inline-flex items-center gap-2.5 bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-600/25">
                    {tr('ink_cta1')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                  </Link>
                  <button onClick={scrollToContact}
                    className="inline-flex items-center gap-2.5 border border-blue-300 bg-blue-50 text-blue-700 px-7 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 hover:-translate-y-0.5">
                    {tr('ink_cta2')}
                  </button>
                </div>
              </div>

              <div className="order-1 lg:order-2 flex-shrink-0 flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute -inset-3 rounded-[2rem] blur-2xl opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-500"
                    style={{ background: 'conic-gradient(from 200deg at 50% 58%,#ef4444 0%,#f97316 14%,#eab308 27%,#22c55e 42%,#3b82f6 57%,#a855f7 72%,#ec4899 86%,#ef4444 100%)' }} />
                  <div className="relative rounded-3xl overflow-hidden flex flex-col items-center bg-white border border-gray-200 transition-transform duration-500 group-hover:-translate-y-2"
                    style={{ padding:'1.6rem 2.2rem 1.2rem', boxShadow:'0 4px 6px rgba(0,0,0,0.04),0 20px 48px rgba(37,99,235,0.08),0 8px 24px rgba(0,0,0,0.06)' }}>
                    <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-3xl"
                      style={{ background:'linear-gradient(90deg,#3b82f6,#a855f7,#ef4444,#f59e0b,#22c55e,#3b82f6)' }} />
                    <div className="relative z-10 mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold tracking-[0.14em] uppercase text-blue-700">
                      <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-50" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600" />
                      </span>
                      حبر BEC الأصلي
                    </div>
                    <img src="/assets/toner-brand.png" alt="BEC TONER"
                      className="ink-float relative z-10 object-contain select-none"
                      style={{ width:'230px', height:'230px', filter:'drop-shadow(0 6px 20px rgba(0,0,0,0.10)) drop-shadow(0 2px 8px rgba(37,99,235,0.07))' }}
                      draggable={false} />
                    <div className="relative z-10 w-full mt-3 pt-3 border-t border-gray-100 text-center">
                      <p className="font-black text-[1.1rem] tracking-[0.22em] text-gray-900">BEC<span className="text-transparent bg-clip-text" style={{ backgroundImage:'linear-gradient(90deg,#2563eb,#7c3aed)' }}> TONER</span></p>
                      <div className="flex justify-center gap-5 mt-1.5">
                        {['HP','Canon','Brother','Epson'].map(b => (
                          <span key={b} className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { color:'#38bdf8', path:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title:tr('ink_card1_title'), desc:tr('ink_card1_desc') },
                { color:'#f59e0b', path:'M13 10V3L4 14h7v7l9-11h-7z', title:tr('ink_card2_title'), desc:tr('ink_card2_desc') },
                { color:'#34d399', path:'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', title:tr('ink_card3_title'), desc:tr('ink_card3_desc') },
                { color:'#a78bfa', path:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title:tr('ink_card4_title'), desc:tr('ink_card4_desc') },
              ].map((item, i) => (
                <div key={i} className="group relative rounded-2xl p-5 text-center border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" style={{ background:item.color }} />
                  <div className="w-11 h-11 rounded-xl mx-auto mb-4 flex items-center justify-center border border-gray-100" style={{ background:`${item.color}18` }}>
                    <svg className="w-5 h-5" fill="none" stroke={item.color} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.path}/>
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1.5 text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-6 py-10">


{/* Gaming Card */}

<div className="relative min-h-[500px] rounded-3xl overflow-hidden bg-[#07030f] border border-purple-500/20">


<img
  src="https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&w=1200&q=85"
  alt=""
  className="absolute left-0 top-0 w-[75%] h-full object-cover object-center"
  style={{
    WebkitMaskImage:'linear-gradient(to right, black 0%, black 48%, rgba(0,0,0,0.3) 72%, transparent 92%)',
    maskImage:'linear-gradient(to right, black 0%, black 48%, rgba(0,0,0,0.3) 72%, transparent 92%)',
    filter:'brightness(0.72) saturate(1.3)',
  }}
/>
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#07030f]/20 to-[#07030f]/90"/>



<div className="relative z-10 h-full flex flex-col justify-center px-10 lg:px-14 text-right">


<span className="w-fit mb-6 px-4 py-2 rounded-full border border-purple-400/40 bg-purple-500/10 text-purple-300 text-sm">
● تجميع مخصص
</span>



<h2 className="text-white text-5xl font-black leading-tight">

ابني جهازك

<br/>

<span className="text-purple-400">
كما تريد
</span>

</h2>



<p className="text-white/60 mt-5 max-w-sm">
أخبرنا بالمواصفات المطلوبة ونجهز لك التجميع خلال فترة قصيرة
</p>



<div className="flex gap-3 mt-8 flex-wrap">


<span className="px-5 py-3 rounded-xl border border-purple-500/50 bg-purple-500/20 text-white">
🎮 Gaming
</span>


<span className="px-5 py-3 rounded-xl border border-pink-500/40 bg-pink-500/10 text-white">
🎬 مونتاج
</span>


<span className="px-5 py-3 rounded-xl border border-blue-500/40 bg-blue-500/10 text-white">
💼 عمل ودراسة
</span>


</div>



<Link href="/gaming-build" className="
mt-8
w-fit
px-10
py-4
rounded-xl
bg-purple-600
text-white
font-bold
shadow-lg
inline-block
hover:bg-purple-500
transition-colors
duration-200
">

✨ اعرف المزيد

</Link>


</div>


</div>





{/* Printer Card */}


<div id="printer-card" className="relative min-h-[500px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">

  {/* صورة الطابعة — يسار، تتلاشى عند 65% */}
  <img
    src="https://images.unsplash.com/photo-1650094980833-7373de26feb6?auto=format&fit=crop&w=1000&q=90"
    alt=""
    className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none"
    style={{
      WebkitMaskImage:'linear-gradient(to right, black 0%, black 50%, transparent 72%)',
      maskImage:'linear-gradient(to right, black 0%, black 50%, transparent 72%)',
    }}
  />

  {/* النص — محصور في النصف الأيمن فقط */}
  <div className="absolute inset-y-0 right-0 w-[46%] z-10 flex flex-col justify-center px-8 py-12 text-right">
    <span className="mb-4 inline-flex items-center justify-end gap-2 text-xs font-bold text-blue-600">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"/>
      حلول B2B للشركات
    </span>
    <h2 className="text-[#071038] font-black leading-[1.1] mb-3" style={{ fontSize:'clamp(1.4rem,2.2vw,2.2rem)' }}>
      طابعات وماكينات تصوير<br/>
      <span className="text-blue-600">للشركات والمكاتب</span>
    </h2>
    <p className="text-gray-500 text-sm leading-relaxed mb-5">
      نوفر طابعات وماكينات تصوير<br/>مع أحبار وصيانة وخيارات إيجار مرنة
    </p>
    <ul className="space-y-2.5 mb-7">
      {['بيع وتأجير طابعات وماكينات تصوير','توفير أحبار ومواد تشغيل أصلية','صيانة ودعم فني','حلول مناسبة للمكاتب والشركات'].map(item => (
        <li key={item} className="flex items-center justify-end gap-2.5 text-gray-700 text-sm">
          {item}
          <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7"/>
            </svg>
          </span>
        </li>
      ))}
    </ul>
    <div className="flex gap-3 flex-wrap">
      <Link
        href="/products?category=printers"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:-translate-y-0.5 transition-all duration-200"
        style={{ boxShadow:'0 5px 18px rgba(37,99,235,0.35)' }}
      >
        عرض الطابعات 🖨️
      </Link>
      <a
        href="#contact"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-300 text-blue-600 font-bold text-sm hover:-translate-y-0.5 hover:bg-blue-50 transition-all duration-200"
      >
        تواصل للإيجار 📞
      </a>
    </div>
  </div>

</div>



</section>


        {/* ══ 6. CATEGORY CARDS ════════════════════════════════ */}
        <section id="categories" className="py-20 px-4 md:px-8 bg-[#f8f9fc]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-4">
                استكشف
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
                تصفح حسب القسم
              </h2>
            </div>

            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
              {displayCategories.map((cat, i) => <CategoryCard key={cat.id ?? i} cat={cat} index={i} />)}
            </div>

            <div className="hidden lg:flex justify-center mt-10">
              <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-6 py-3 rounded-2xl transition-all duration-200 hover:bg-blue-50">
                عرض جميع المنتجات
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 7. FEATURED PRODUCTS CAROUSEL ════════════════════ */}
        <section id="featured-products" className="py-20 px-4 md:px-8 bg-[#f0f5ff]">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">{tr('sec_products_tag')}</span>
                <h2 className="text-4xl font-bold text-gray-900">{tr('sec_products_h2')}</h2>
              </div>
              <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all duration-300">
                {tr('viewall')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </Link>
            </div>

            {carouselItems.length > 0 ? (
              <div className="relative">
                <button onClick={dir === 'rtl' ? goPrev : goNext}
                  disabled={dir === 'rtl' ? currentIndex === 0 : currentIndex >= maxIdx}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-5 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 group transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                <button onClick={dir === 'rtl' ? goNext : goPrev}
                  disabled={dir === 'rtl' ? currentIndex >= maxIdx : currentIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-5 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 group transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>

                <div className="overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={e => handleDragStart(e.clientX)}
                  onMouseMove={() => { if (dragStartX.current !== null) isDragging.current = true; }}
                  onMouseUp={e => handleDragEnd(e.clientX)}
                  onMouseLeave={() => { dragStartX.current = null; isDragging.current = false; }}
                  onTouchStart={e => handleDragStart(e.touches[0].clientX)}
                  onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}>
                  <div className="flex transition-transform duration-500 ease-in-out select-none" style={{ transform: `translateX(${translatePct}%)` }}>
                    {carouselItems.map(item => (
                      <div key={item.id} className="flex-shrink-0 px-3" style={{ width: `${cardWidthPct}%` }}>
                        <div className="bg-white rounded-2xl border border-blue-100/60 hover:border-blue-300/60 hover:shadow-xl transition-all duration-300 group flex flex-col h-full overflow-hidden shadow-sm">
                          <div className="relative h-48 bg-[#f8faff] flex items-center justify-center p-4 overflow-hidden">
                            <img src={item.image} alt={item.name}
                              className="h-36 w-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                              onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=BEC'; }}
                              draggable={false} />
                            {(item as any).isInk ? (
                              <span className="absolute top-3 right-3 bg-violet-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">{tr('ink_badge')}</span>
                            ) : item.brand ? (
                              <span className="absolute top-3 right-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">{item.brand}</span>
                            ) : null}
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{carouselTr[`cat_${item.id}`] ?? item.category}</span>
                            <h3 className="text-sm font-bold text-gray-900 mt-1 mb-3 line-clamp-2 leading-snug flex-1">{carouselTr[`name_${item.id}`] ?? item.name}</h3>
                            {item.price > 0 && (
                              <div className="mb-3">
                                <span className="text-blue-600 font-bold text-base">{item.price.toLocaleString()}</span>
                                <span className="text-gray-400 text-sm"> ₪</span>
                              </div>
                            )}
                            <Link href={`/${(item as any).productId}`}
                              onClick={e => { if (isDragging.current) e.preventDefault(); }}
                              className="block text-center text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent py-2 rounded-xl transition-all duration-200 mt-auto">
                              {tr('viewdetails')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {maxIdx > 0 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: maxIdx + 1 }, (_, i) => (
                      <button key={i} onClick={() => setCurrentIndex(i)}
                        className={`transition-all duration-300 rounded-full h-2 ${currentIndex === i ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                </svg>
                <p className="text-sm">{tr('no_featured_yet')}</p>
                <Link href="/products" className="mt-3 inline-block text-blue-600 font-semibold text-sm hover:underline">{tr('browse_catalog')}</Link>
              </div>
            )}

            <div className="text-center mt-8 md:hidden">
              <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300">
                {tr('viewall_mobile')}
              </Link>
            </div>
          </div>
        </section>

        {/* ══ 8. PROMO BANNERS ══════════════════════════════════ */}
        {homepageData.banners.length > 0 && (
          <section id="banners" className="py-12 px-4 md:px-8 bg-[#f0f5ff]">
            <div className="max-w-[1400px] mx-auto space-y-4">
              {homepageData.banners.map(banner => <PromoBanner key={banner.id} banner={banner} />)}
            </div>
          </section>
        )}

        {/* ══ 9. ABOUT ═════════════════════════════════════════ */}
        <section id="about" className="py-20 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">{tr('about_tag')}</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {tr('about_h2_1')} <span className="text-blue-600">{tr('about_h2_2')}</span>
              </h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-gray-600 text-lg leading-relaxed">{tr('about_desc')}</p>
                <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{tr('about_address_title')}</h4>
                    <p className="text-gray-600">{tr('about_address')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {(['1','2','3'] as const).map((n, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full mt-1 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{tr(`about_feat${n}_title`)}</h4>
                        <p className="text-gray-600">{tr(`about_feat${n}_desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {[
                      ['7+',   'سنوات خبرة'],
                      ['50+',  'عميل شركة'],
                      ['∞',    'عقود طباعة مستمرة'],
                      ['500+', 'منتج'],
                    ].map(([val, lbl]) => (
                      <div key={lbl} className="text-center">
                        <div className="text-4xl font-bold">{val}</div>
                        <div className="text-blue-200 text-sm mt-2">{lbl}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-blue-100 leading-relaxed text-center pt-4 border-t border-blue-500/30">{tr('stat_mission')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 10. SERVICES ══════════════════════════════════════ */}
        <section id="services" className="py-20 px-4 md:px-8 bg-white border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">{tr('services_tag')}</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{tr('services_h2')}</h2>
              <p className="text-gray-500 text-lg max-w-3xl mx-auto">{tr('services_desc')}</p>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICE_KEYS.map(([nameKey, descKey], i) => (
                <div key={i} className="group bg-[#f0f5ff] rounded-2xl p-8 text-center hover:shadow-xl hover:bg-white transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                  <div className="w-20 h-20 bg-white text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <span className="text-3xl">{SERVICE_ICONS[i]}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tr(nameKey)}</h3>
                  <p className="text-gray-600 leading-relaxed">{tr(descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 11. CONTACT ══════════════════════════════════════ */}
        <section id="contact" className="py-24 px-4 md:px-8 bg-[#f0f5ff]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">{tr('contact_tag')}</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{tr('contact_h2')}</h2>
              <p className="text-gray-500 text-lg max-w-3xl mx-auto">{tr('contact_desc')}</p>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 group">
                <div className="w-24 h-24 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#25D366] transition-all duration-300">
                  <svg className="w-12 h-12 text-[#25D366] group-hover:text-white transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.032 2.001c-5.523 0-10 4.477-10 10 0 1.752.457 3.47 1.322 4.99L2 22l5.204-1.332c1.466.804 3.107 1.23 4.828 1.23 5.523 0 10-4.477 10-10s-4.477-10-10-10z"/>
                    <path d="M16.634 14.345c-.261-.131-1.54-.76-1.78-.847-.239-.087-.413-.131-.586.131-.173.262-.674.847-.826 1.021-.152.174-.304.196-.565.065-.261-.131-1.102-.406-2.099-1.297-.776-.693-1.3-1.549-1.452-1.812-.152-.262-.016-.403.114-.533.117-.117.261-.304.391-.456.13-.152.174-.261.261-.435.087-.174.043-.327-.022-.457-.065-.131-.586-1.414-.803-1.936-.212-.509-.427-.44-.586-.448-.152-.007-.326-.008-.5-.008-.174 0-.456.065-.695.326-.239.262-.913.893-.913 2.179s.936 2.528 1.066 2.702c.13.174 1.837 2.81 4.456 3.937.623.268 1.109.428 1.488.548.625.196 1.194.168 1.644.102.502-.074 1.54-.63 1.757-1.238.217-.608.217-1.129.152-1.238-.065-.109-.239-.174-.5-.305z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{tr('wa_title')}</h3>
                <p className="text-gray-500 mb-6">{tr('wa_desc')}</p>
                <a href="https://wa.me/972568800999?text=مرحباً،%20أحتاج%20لمساعدة" target="_blank" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full hover:bg-[#20b859] transition-all duration-300 font-semibold">
                  {tr('wa_btn')}
                </a>
              </div>
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 group">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500 transition-all duration-300">
                  <svg className="w-12 h-12 text-red-500 group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m16.5 0L12 12.75 4.5 6.75m16.5 0H4.5"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{tr('email_title')}</h3>
                <p className="text-gray-500 mb-6">{tr('email_desc')}</p>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=zaidbhees910@gmail.com&su=استفسار%20عن%20منتجات%20BEC" target="_blank" className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300 font-semibold">
                  {tr('email_btn')}
                </a>
              </div>
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 group">
                <div className="w-24 h-24 bg-[#1877F2]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1877F2] transition-all duration-300">
                  <svg className="w-12 h-12 text-[#1877F2] group-hover:text-white transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.989C18.343 21.129 22 16.99 22 12z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{tr('fb_title')}</h3>
                <p className="text-gray-500 mb-6">{tr('fb_desc')}</p>
                <a href="https://www.facebook.com/banyaselectronics" target="_blank" className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-full hover:bg-[#0f5db4] transition-all duration-300 font-semibold">
                  {tr('fb_btn')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ═══════════════════════════════════════════ */}
        <footer className="bg-[#111111] text-gray-400 py-16 border-t border-gray-800">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <Logo variant="light" size="sm" />
                <p className="mt-4 text-sm leading-relaxed">{tr('footer_desc')}</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">{tr('footer_quicklinks')}</h4>
                <ul className="space-y-2">
                  <li><Link href="/#bec-ink"           className="hover:text-white transition">{tr('footer_ink')}</Link></li>
                  <li><Link href="/#featured-products" className="hover:text-white transition">{tr('products')}</Link></li>
                  <li><Link href="/#services"          className="hover:text-white transition">{tr('services')}</Link></li>
                  <li><Link href="/#about"             className="hover:text-white transition">{tr('about')}</Link></li>
                  <li><Link href="/#contact"           className="hover:text-white transition">{tr('contact')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">{tr('footer_our_services')}</h4>
                <ul className="space-y-2">
                  {['svc1_name','svc2_name','svc3_name','svc4_name'].map(k => (
                    <li key={k} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      {tr(k)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">{tr('footer_follow')}</h4>
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
              <p>© {new Date().getFullYear()} {COMPANY_NAME}. {tr('footer_copyright')}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
