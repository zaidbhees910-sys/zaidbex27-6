'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { useAutoTranslateBatch } from '../hooks/useAutoTranslate';
import { fetchAllProducts } from '../../lib/products-cache';

/* ═══ Pure utility — outside component so no closure issues ═══ */
function calcPct(v: number, mn: number, mx: number) {
  return mx > mn ? Math.max(0, Math.min(100, ((v - mn) / (mx - mn)) * 100)) : 0;
}

/* ═══ Dual Range Slider ═══
   Design: unchanged. Performance: DOM mutation during drag (zero React
   re-renders), debounced React state update (60 ms) to avoid re-filtering
   the product grid on every pixel. Native window listeners set up once so
   pointer events are caught even when the cursor moves outside the track.   */
function PriceRangeSlider({
  min, max, low, high, onLow, onHigh,
}: { min: number; max: number; low: number; high: number; onLow: (v: number) => void; onHigh: (v: number) => void; }) {

  /* DOM refs — mutated directly during drag, zero React re-renders */
  const trackRef   = useRef<HTMLDivElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);
  const loThumbRef = useRef<HTMLDivElement>(null);
  const hiThumbRef = useRef<HTMLDivElement>(null);
  const loLabelRef = useRef<HTMLSpanElement>(null);
  const hiLabelRef = useRef<HTMLSpanElement>(null);

  /* Stable refs for values used inside the native event handler */
  const minR    = useRef(min);
  const maxR    = useRef(max);
  const liveR   = useRef({ low, high });
  const onLoR   = useRef(onLow);
  const onHiR   = useRef(onHigh);
  const dragging = useRef<'low' | 'high' | null>(null);
  const debTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Keep refs current every render */
  onLoR.current = onLow;
  onHiR.current = onHigh;

  /* Sync props → DOM when parent resets (e.g. category change) */
  useEffect(() => {
    minR.current  = min;
    maxR.current  = max;
    liveR.current = { low, high };
    paintDOM(low, high, min, max);
  }, [min, max, low, high]); // eslint-disable-line react-hooks/exhaustive-deps

  function paintDOM(lo: number, hi: number, mn = minR.current, mx = maxR.current) {
    const lp = calcPct(lo, mn, mx);
    const hp = calcPct(hi, mn, mx);
    if (fillRef.current) {
      fillRef.current.style.left  = `${lp}%`;
      fillRef.current.style.right = `${100 - hp}%`;
    }
    if (loThumbRef.current) loThumbRef.current.style.left = `${lp}%`;
    if (hiThumbRef.current) hiThumbRef.current.style.left = `${hp}%`;
    if (loLabelRef.current) loLabelRef.current.textContent = `₪ ${lo.toLocaleString()}`;
    if (hiLabelRef.current) hiLabelRef.current.textContent = `₪ ${hi.toLocaleString()}`;
  }

  /* Native window listeners — registered once, never stale via refs */
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return;
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      const mn = minR.current, mx = maxR.current;
      const rawPct = ((e.clientX - rect.left) / rect.width) * 100;
      const val = Math.round(mn + (Math.max(0, Math.min(100, rawPct)) / 100) * (mx - mn));

      const { low: lo, high: hi } = liveR.current;
      const nLo = dragging.current === 'low'  ? Math.max(mn, Math.min(val, hi - 1)) : lo;
      const nHi = dragging.current === 'high' ? Math.min(mx, Math.max(val, lo + 1)) : hi;

      liveR.current = { low: nLo, high: nHi };
      paintDOM(nLo, nHi, mn, mx);

      /* Debounce React state → avoids re-filtering grid on every pixel */
      if (debTimer.current) clearTimeout(debTimer.current);
      debTimer.current = setTimeout(() => {
        onLoR.current(nLo);
        onHiR.current(nHi);
      }, 60);
    }

    function onUp() {
      if (!dragging.current) return;
      dragging.current = null;
      if (debTimer.current) clearTimeout(debTimer.current);
      /* Commit final value immediately on release */
      onLoR.current(liveR.current.low);
      onHiR.current(liveR.current.high);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup',   onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
      if (debTimer.current) clearTimeout(debTimer.current);
    };
  }, []); // once

  /* Initial render positions */
  const lp = calcPct(low, min, max);
  const hp = calcPct(high, min, max);

  return (
    <div dir="ltr">
      {/* Live value labels — updated via ref, no re-render */}
      <div className="flex items-center justify-between mb-4">
        <span ref={loLabelRef} className="text-sm font-bold text-blue-600">₪ {low.toLocaleString()}</span>
        <span className="text-xs text-gray-300">—</span>
        <span ref={hiLabelRef} className="text-sm font-bold text-blue-600">₪ {high.toLocaleString()}</span>
      </div>

      <div className="px-1">
        <div ref={trackRef} className="relative select-none" style={{ height: 32 }}>
          {/* Gray bg */}
          <div className="absolute rounded-full bg-gray-200 pointer-events-none"
            style={{ height: 4, top: '50%', transform: 'translateY(-50%)', left: 0, right: 0 }} />
          {/* Blue fill */}
          <div ref={fillRef} className="absolute rounded-full bg-blue-500 pointer-events-none"
            style={{ height: 4, top: '50%', transform: 'translateY(-50%)', left: `${lp}%`, right: `${100 - hp}%` }} />
          {/* Low thumb */}
          <div ref={loThumbRef}
            className="absolute w-5 h-5 rounded-full bg-white border-[2.5px] border-blue-600 shadow-md cursor-grab active:cursor-grabbing touch-none"
            style={{ top: '50%', left: `${lp}%`, transform: 'translate(-50%, -50%)', zIndex: 3, willChange: 'left' }}
            onPointerDown={e => { e.preventDefault(); dragging.current = 'low'; }}
          />
          {/* High thumb */}
          <div ref={hiThumbRef}
            className="absolute w-5 h-5 rounded-full bg-white border-[2.5px] border-blue-600 shadow-md cursor-grab active:cursor-grabbing touch-none"
            style={{ top: '50%', left: `${hp}%`, transform: 'translate(-50%, -50%)', zIndex: 4, willChange: 'left' }}
            onPointerDown={e => { e.preventDefault(); dragging.current = 'high'; }}
          />
        </div>
      </div>

      {/* Bounds labels */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-gray-400">₪ {min.toLocaleString()}</span>
        <span className="text-[11px] text-gray-400">₪ {max.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ═══ Types ═══ */
interface Variant {
  id: number;
  name: string;
  brand: string;
  price: number;
  specifications: string;
  image: string;
  stock?: number;
  colorType?: string;
}
interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  type: string;
  colorType: string;
  variants: Variant[];
}
interface DisplayVariant extends Variant {
  productId: number;
  category: string;
  colorType: string;
  type: string;
}

/* ═══ Category price range config — edit here, no need to touch anything else ═══
   Keys must match the `type` values used in your database (Printer, Ink, etc.)
   Leave a type out to auto-compute its range from real product prices.
   Override min/max to cap the slider beyond the real data range.            */
const CATEGORY_PRICE_CONFIG: Record<string, { min?: number; max?: number }> = {
  // Printer:      { min: 200,   max: 8000  },
  // Ink:          { min: 10,    max: 600   },
  // Device:       { min: 100,   max: 5000  },
  // Gaming:       { min: 500,   max: 15000 },
  // GamingLaptop: { min: 2000,  max: 20000 },
};

/* ═══ Type config ═══ */
const TYPE_META: Record<string, { dot: string; badge: string; label: string }> = {
  Printer:               { dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-100',       label: 'type_label_printer' },
  Ink:                   { dot: 'bg-violet-500',  badge: 'bg-violet-50 text-violet-700 border-violet-100',  label: 'type_label_ink' },
  Device:                { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'type_label_device' },
  Gaming:                { dot: 'bg-rose-500',    badge: 'bg-rose-50 text-rose-700 border-rose-100',        label: 'type_label_gaming' },
  GamingLaptop:          { dot: 'bg-orange-500',  badge: 'bg-orange-50 text-orange-700 border-orange-100',  label: 'type_label_gaming_laptop' },
  'ساعات ذكية':          { dot: 'bg-sky-500',     badge: 'bg-sky-50 text-sky-700 border-sky-100',           label: 'type_label_smartwatch' },
  'Headphones &Earbuds': { dot: 'bg-indigo-500',  badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',  label: 'type_label_headphones' },
  Other:                 { dot: 'bg-gray-400',    badge: 'bg-gray-50 text-gray-500 border-gray-100',        label: 'type_label_other' },
};
const TYPE_ORDER = ['Printer', 'Ink', 'Device', 'Gaming', 'GamingLaptop', 'ساعات ذكية', 'Headphones &Earbuds', 'Other'];

/* ═══ Product Card ═══ */
function ProductCard({ v }: { v: DisplayVariant }) {
  const { tr, lang } = useLanguage();
  const meta = TYPE_META[v.type] ?? TYPE_META.Other;
  const t = useAutoTranslateBatch({ name: v.name }, lang);

  return (
    <Link
      href={`/${v.productId}?variant=${v.id}`}
      className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-5 overflow-hidden">
        <img
          src={v.image || 'https://placehold.co/400x300?text=BEC'}
          alt={t.name}
          className="h-32 w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=BEC'; }}
        />
        <span className={`absolute top-2.5 start-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badge}`}>
          {tr(meta.label)}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {v.brand && <span className="text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wider">{v.brand}</span>}
        <h3 className="font-bold text-sm text-gray-900 mb-3 line-clamp-2 leading-snug flex-1">{t.name}</h3>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="font-black text-blue-600 text-[15px]">
            {v.price.toLocaleString()}
            <span className="text-xs font-normal text-gray-400 mr-1">₪</span>
          </span>
          <span className="text-xs font-semibold text-gray-400 group-hover:text-blue-600 transition-colors flex items-center gap-0.5">
            {tr('details')}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══ Close icon ═══ */
const X = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

/* ═══ Page size ═══ */
const PAGE = 24;

/* ═══ Main ═══ */
function ProductsPageInner() {
  const searchParams = useSearchParams();
  const { tr, dir } = useLanguage();

  const [products, setProducts]               = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedTypes, setSelectedTypes]     = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands]   = useState<string[]>([]);
  const [selectedColor, setSelectedColor]     = useState<'__all__' | 'colored' | 'uncolored'>('__all__');
  const [sortBy, setSortBy]                   = useState('newest');
  const [searchTerm, setSearchTerm]           = useState('');
  const [visibleCount, setVisibleCount]       = useState(PAGE);
  const [drawerOpen, setDrawerOpen]           = useState(false);
  const [categoryVariantIds, setCategoryVariantIds] = useState<number[] | null>(null);
  const [categoryTitle, setCategoryTitle]     = useState<string>('');

  /* price bounds */
  const [globalMin, setGlobalMin] = useState(0);
  const [globalMax, setGlobalMax] = useState(999999);
  const [pMin, setPMin] = useState(0);
  const [pMax, setPMax] = useState(999999);
  const [fMin, setFMin] = useState(0);
  const [fMax, setFMax] = useState(999999);
  const [boundsReady, setBoundsReady] = useState(false);

  /* fetch */
  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        const list = data as Product[];
        setProducts(list);
        const prices = list.flatMap(p => p.variants.map(v => v.price)).filter(x => x > 0);
        if (prices.length) {
          const lo = Math.floor(Math.min(...prices));
          const hi = Math.ceil(Math.max(...prices));
          setGlobalMin(lo); setGlobalMax(hi);
          setPMin(lo); setPMax(hi); setFMin(lo); setFMax(hi);
        }
        setBoundsReady(true);
        setLoading(false);
      })
      .catch(() => { setBoundsReady(true); setLoading(false); });
  }, []);

  /* URL params → pre-select type OR categoryId */
  useEffect(() => {
    const t        = searchParams.get('type');
    const cid      = searchParams.get('categoryId');
    const category = searchParams.get('category');
    const sort     = searchParams.get('sort');

    if (category === 'gaming') {
      setSelectedTypes(['GamingLaptop', 'Gaming', 'Other']);
    } else {
      setSelectedTypes(t ? [t] : []);
    }

    setSortBy(sort ?? 'newest');
    setSelectedBrands([]);
    setSelectedColor('__all__');
    setVisibleCount(PAGE);

    if (cid) {
      fetch(`/api?action=getCategoryById&id=${cid}`)
        .then(r => r.json())
        .then(d => {
          setCategoryVariantIds(Array.isArray(d.variantIds) ? d.variantIds : []);
          setCategoryTitle(d.title || '');
        })
        .catch(() => { setCategoryVariantIds(null); setCategoryTitle(''); });
    } else {
      setCategoryVariantIds(null);
      setCategoryTitle('');
    }
  }, [searchParams]);

  /* derived */
  const allVariants = useMemo<DisplayVariant[]>(() =>
    products.flatMap(p =>
      p.variants.map(v => ({
        ...v,
        productId: p.id,
        category: p.category,
        colorType: v.colorType || p.colorType,
        type: p.type,
      }))
    ), [products]);

  /* per-type price ranges computed from real data + optional config overrides */
  const typePriceRanges = useMemo(() => {
    const map: Record<string, { min: number; max: number }> = {};
    for (const v of allVariants) {
      if (!v.type || v.price <= 0) continue;
      if (!map[v.type]) map[v.type] = { min: v.price, max: v.price };
      else {
        map[v.type].min = Math.min(map[v.type].min, v.price);
        map[v.type].max = Math.max(map[v.type].max, v.price);
      }
    }
    // Apply static config overrides
    for (const [type, cfg] of Object.entries(CATEGORY_PRICE_CONFIG)) {
      if (!map[type]) continue;
      if (cfg.min !== undefined) map[type].min = cfg.min;
      if (cfg.max !== undefined) map[type].max = cfg.max;
    }
    return map;
  }, [allVariants]);

  /* Update slider bounds whenever the selected types change */
  useEffect(() => {
    if (!boundsReady) return;
    let newMin: number;
    let newMax: number;
    if (selectedTypes.length === 0) {
      newMin = globalMin;
      newMax = globalMax;
    } else {
      let lo = Infinity;
      let hi = -Infinity;
      for (const type of selectedTypes) {
        const r = typePriceRanges[type];
        if (r) { lo = Math.min(lo, r.min); hi = Math.max(hi, r.max); }
      }
      newMin = lo === Infinity  ? globalMin : Math.floor(lo);
      newMax = hi === -Infinity ? globalMax : Math.ceil(hi);
    }
    setPMin(newMin); setPMax(newMax);
    setFMin(newMin); setFMax(newMax);
  }, [selectedTypes, typePriceRanges, boundsReady, globalMin, globalMax]);

  const allTypes = useMemo(() =>
    [...new Set(
      products
        .map(p => p.type)
        .filter(t => t && t !== 'Other' && TYPE_META[t])   // only known, real types
    )].sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a), bi = TYPE_ORDER.indexOf(b);
      if (ai < 0 && bi < 0) return 0;
      if (ai < 0) return 1; if (bi < 0) return -1;
      return ai - bi;
    }), [products]);

  const availableBrands = useMemo(() => {
    const src = selectedTypes.length > 0
      ? allVariants.filter(v => selectedTypes.includes(v.type))
      : allVariants;
    return [...new Set(src.map(v => v.brand).filter(Boolean))].sort();
  }, [allVariants, selectedTypes]);

  const isColored = (ct?: string) => !['Black', 'Non-color', '', undefined].includes(ct as string);

  // Show color filter ONLY when user explicitly selects Printer or Ink
  const showColorFilter =
    selectedTypes.length > 0 && selectedTypes.some(t => t === 'Printer' || t === 'Ink');

  const filteredVariants = useMemo(() => {
    return allVariants.filter(v => {
      if (categoryVariantIds !== null && !categoryVariantIds.includes(v.id)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(v.type)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(v.brand)) return false;
      if (v.price > 0 && (v.price < fMin || v.price > fMax)) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!v.name.toLowerCase().includes(q) && !(v.brand || '').toLowerCase().includes(q)) return false;
      }
      if (selectedColor !== '__all__' && showColorFilter) {
        const colored = isColored(v.colorType);
        if (selectedColor === 'colored' && !colored) return false;
        if (selectedColor === 'uncolored' && colored) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.id - a.id; // newest
    });
  }, [allVariants, categoryVariantIds, selectedTypes, selectedBrands, fMin, fMax, searchTerm, selectedColor, sortBy, showColorFilter]);

  const visibleVariants = filteredVariants.slice(0, visibleCount);
  const hasMore = filteredVariants.length > visibleCount;

  const hasFilters = selectedTypes.length > 0 || selectedBrands.length > 0
    || selectedColor !== '__all__' || searchTerm !== ''
    || (boundsReady && (fMin > pMin || fMax < pMax));

  const clearAll = () => {
    setSelectedTypes([]); setSelectedBrands([]);
    setSelectedColor('__all__'); setSearchTerm('');
    setPMin(globalMin); setPMax(globalMax);
    setFMin(globalMin); setFMax(globalMax);
  };

  const toggleType  = (t: string) => setSelectedTypes(p  => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleBrand = (b: string) => setSelectedBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"/>
    </div>
  );

  /* ── Sidebar content (reused desktop + mobile) ── */
  const Sidebar = () => (
    <div className="space-y-6">
      {hasFilters && (
        <button onClick={clearAll} className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold py-2 border border-red-200 rounded-xl hover:bg-red-50 transition">
          <X/> {tr('clear_filters')}
        </button>
      )}

      {/* Category */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{tr('filter_categories')}</p>
        <ul className="space-y-0.5">
          {allTypes.map(type => {
            const m = TYPE_META[type] ?? TYPE_META.Other;
            const cnt = allVariants.filter(v => v.type === type).length;
            return (
              <li key={type}>
                <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition group">
                  <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer flex-shrink-0"/>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${m.dot}`}/>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium flex-1">{tr(m.label)}</span>
                  <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md tabular-nums">{cnt}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Color */}
      {showColorFilter && (
        <div className="border-t border-gray-100 pt-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{tr('color')}</p>
          <div className="space-y-0.5">
            {(['__all__', 'colored', 'uncolored'] as const).map(val => (
              <button key={val} onClick={() => setSelectedColor(val)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedColor === val ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className={`w-3 h-3 rounded-full flex-shrink-0 border ${
                  val === 'colored'   ? 'bg-gradient-to-br from-cyan-400 via-fuchsia-400 to-yellow-400 border-gray-200' :
                  val === 'uncolored' ? 'bg-gray-700 border-gray-500' : 'bg-gray-300 border-gray-300'
                }`}/>
                {val === '__all__' ? tr('filter_all') : val === 'colored' ? tr('filter_colored') : tr('filter_uncolored')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      {availableBrands.length > 0 && (
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{tr('filter_brands_label')}</p>
            {selectedBrands.length > 0 && (
              <button onClick={() => setSelectedBrands([])} className="text-xs text-blue-500 hover:text-blue-700 font-medium">{tr('filter_clear')}</button>
            )}
          </div>
          <ul className="space-y-0.5 max-h-52 overflow-y-auto">
            {availableBrands.map(brand => {
              const cnt = allVariants.filter(v => v.brand === brand && (selectedTypes.length === 0 || selectedTypes.includes(v.type))).length;
              return (
                <li key={brand}>
                  <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition group">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer flex-shrink-0"/>
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium flex-1">{brand}</span>
                    <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md tabular-nums">{cnt}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Price range — dual slider */}
      {boundsReady && pMin < pMax && (
        <div className="border-t border-gray-100 pt-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{tr('filter_price')}</p>
          <PriceRangeSlider
            min={pMin} max={pMax}
            low={fMin} high={fMax}
            onLow={setFMin} onHigh={setFMax}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA]" dir={dir}>
      <Navbar/>

      <div className="max-w-[1400px] mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            {categoryTitle ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">الرئيسية</Link>
                  <span className="text-gray-300 text-xs">/</span>
                  <span className="text-xs text-blue-600 font-semibold">{categoryTitle}</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900">{categoryTitle}</h1>
              </>
            ) : (
              <h1 className="text-3xl font-black text-gray-900">{tr('store_title')}</h1>
            )}
            <p className="text-sm text-gray-400 mt-1">
              <span className="font-bold text-gray-600">{filteredVariants.length}</span> {tr('type_count_unit')}
            </p>
          </div>
          {/* Sort — visible on desktop in header */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="hidden sm:block px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
            <option value="newest">{tr('sort_newest')}</option>
            <option value="price-asc">{tr('sort_price_asc')}</option>
            <option value="price-desc">{tr('sort_price_desc')}</option>
          </select>
        </div>

        <div className="flex gap-7 items-start">

          {/* ── Sidebar desktop ── */}
          <aside className="w-60 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <Sidebar/>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">

            {/* Search + mobile filter + mobile sort */}
            <div className="flex items-center gap-2.5 mb-5 flex-wrap">
              {/* Mobile filter */}
              <button onClick={() => setDrawerOpen(o => !o)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h4"/>
                </svg>
                {tr('filter_btn')}
                {hasFilters && <span className="w-2 h-2 bg-blue-600 rounded-full"/>}
              </button>

              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input type="text" placeholder={tr('search_placeholder')} value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setVisibleCount(PAGE); }}
                  className="w-full ps-10 pe-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white shadow-sm"/>
              </div>

              {/* Mobile sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="sm:hidden px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
                <option value="newest">{tr('sort_newest')}</option>
                <option value="price-asc">{tr('sort_price_asc')}</option>
                <option value="price-desc">{tr('sort_price_desc')}</option>
              </select>
            </div>

            {/* Mobile drawer */}
            {drawerOpen && (
              <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-md p-5 mb-5">
                <Sidebar/>
              </div>
            )}

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedTypes.map(t => {
                  const m = TYPE_META[t] ?? TYPE_META.Other;
                  return (
                    <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`}/>
                      {tr(m.label)}
                      <button onClick={() => toggleType(t)} className="hover:text-red-500 transition"><X/></button>
                    </span>
                  );
                })}
                {selectedBrands.map(b => (
                  <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                    {b}
                    <button onClick={() => toggleBrand(b)} className="hover:text-red-500 transition"><X/></button>
                  </span>
                ))}
                {selectedColor !== '__all__' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                    {selectedColor === 'colored' ? tr('filter_colored') : tr('filter_uncolored')}
                    <button onClick={() => setSelectedColor('__all__')} className="hover:text-red-500 transition"><X/></button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                    &ldquo;{searchTerm}&rdquo;
                    <button onClick={() => setSearchTerm('')} className="hover:text-red-500 transition"><X/></button>
                  </span>
                )}
                {boundsReady && (fMin > pMin || fMax < pMax) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                    {fMin.toLocaleString()} — {fMax.toLocaleString()} ₪
                    <button onClick={() => { setFMin(pMin); setFMax(pMax); }} className="hover:text-red-500 transition"><X/></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filteredVariants.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-gray-400 font-medium mb-3">{tr('no_results')}</p>
                {hasFilters && (
                  <button onClick={clearAll} className="text-sm text-blue-600 hover:underline font-semibold">{tr('no_results_clear')}</button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleVariants.map(v => <ProductCard key={v.id} v={v}/>)}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount(c => c + PAGE)}
                      className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm shadow-sm"
                    >
                      {tr('load_more')} · {filteredVariants.length - visibleCount} {tr('remaining')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageInner/>
    </Suspense>
  );
}
