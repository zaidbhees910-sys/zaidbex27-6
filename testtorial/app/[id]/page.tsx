'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { useAutoTranslateBatch } from '../hooks/useAutoTranslate';
import { fetchAllProducts } from '../../lib/products-cache';

interface AttributeOption {
  id: number;
  value: string;
  image: string;
  price: number | null;
}

interface ProductAttribute {
  id: number;
  name: string;
  options: AttributeOption[];
}

interface Variant {
  id: number;
  name: string;
  brand: string;
  price: number;
  specifications: string;
  image: string;
  gallery?: string[];
  stock?: number;
  attributes?: ProductAttribute[];
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  type: string;
  brand: string;
  modelNumber: string;
  colorType: string;
  featured: boolean;
  variants: Variant[];
}

type Props = { params: Promise<{ id: string }> }

export default function ProductPage({ params }: Props) {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => { params.then(p => setProductId(parseInt(p.id))); }, [params]);

  useEffect(() => {
    fetchAllProducts().then(d => setAllProducts(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setProduct(null);
    setSelectedVariant(null);
    fetch(`/api?action=getProduct&id=${productId}`)
      .then(r => { if (!r.ok) throw new Error('api'); return r.json(); })
      .then(data => {
        if (!data || !Array.isArray(data.variants)) { setLoading(false); return; }
        setProduct(data);
        const variantId = searchParams.get('variant');
        const found = variantId
          ? data.variants.find((v: Variant) => v.id === parseInt(variantId))
          : null;
        setSelectedVariant(found || data.variants[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId, searchParams]);

  const { tr, dir } = useLanguage();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">{tr('loading')}</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{tr('notFound')}</h1>
        <Link href="/products" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold">
          {tr('browseProducts')}
        </Link>
      </div>
    </div>
  );

  return (
    <ProductDetail
      product={product}
      variant={selectedVariant}
      allProducts={allProducts}
      tr={tr}
      dir={dir}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */
function parseSpecs(text: string) {
  if (!text) return [];
  return text.split('\n').map(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return { key: '', value: line.trim() };
    return { key: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
  }).filter(s => s.value);
}

function SpecIcon({ specKey }: { specKey: string }) {
  const k = specKey.toLowerCase();

  /* ── Smartwatch ── */
  if (k.includes('ips') || (k.includes('شاشة') && k.includes('ips'))) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="3" strokeWidth="1.5"/>
      <path d="M9 5h6M9 19h6" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 9h8M8 12h5" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  if (k.includes('resolution') || k.includes('pixel') || k.includes('دقة') || k.includes('بكسل')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
      <path d="M3 8h18M3 13h18M8 3v18M13 3v18" strokeWidth="1" strokeDasharray="2 1.5"/>
    </svg>
  );
  if (k.includes('standby') || k.includes('استعداد') || (k.includes('battery') && k.includes('time')) || (k.includes('بطارية') && (k.includes('وقت') || k.includes('عمر')))) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="7" width="18" height="10" rx="2" strokeWidth="1.5"/>
      <path d="M20 10v4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 12h4M13 10v4" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 10.5v3" strokeWidth="2" strokeLinecap="round" stroke="currentColor"/>
    </svg>
  );
  if (k.includes('full square') || k.includes('amoled') || k.includes('شاشة مربعة') || k.includes('شاشة كاملة')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="3" strokeWidth="1.5"/>
      <rect x="7" y="7" width="10" height="10" rx="1" strokeWidth="1.5" strokeDasharray="0"/>
    </svg>
  );
  if (k.includes('magnetic') || k.includes('مغناطيسي') || k.includes('شاحن') || k.includes('charger')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 5v14M7 8l5-3 5 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12a7 7 0 0014 0" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="19" r="1.5" strokeWidth="1.5"/>
    </svg>
  );
  if (k.includes('bluetooth') || k.includes('call') || k.includes('مكالمة') || k.includes('بلوتوث')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6 7l12 10-6 5V2l6 5L6 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (k.includes('nfc') || k.includes('contactless') || k.includes('لا سلكي') || k.includes('تقريبي')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 12a3 3 0 006 0" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 12a7 7 0 0014 0" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 12a11 11 0 0122 0" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (k.includes('smart') || k.includes('app') || k.includes('تطبيق') || k.includes('ذكي')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="9" height="9" rx="2" strokeWidth="1.5"/>
      <rect x="13" y="3" width="9" height="9" rx="2" strokeWidth="1.5"/>
      <rect x="2" y="13" width="9" height="9" rx="2" strokeWidth="1.5"/>
      <rect x="13" y="13" width="9" height="9" rx="2" strokeWidth="1.5"/>
    </svg>
  );

  /* ── Health / Fitness ── */
  if (k.includes('heart') || k.includes('pulse') || k.includes('نبض') || k.includes('قلب')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 12h2l1.5-3 2 6 1.5-3H17" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (k.includes('step') || k.includes('خطوات') || k.includes('مشي') || k.includes('pedometer')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M13 4a1 1 0 102 0 1 1 0 00-2 0zM9 8a1 1 0 102 0 1 1 0 00-2 0z" strokeWidth="1.5"/>
      <path d="M10.5 9l-2 5h4l1.5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 14H6M15.5 19l2 1" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (k.includes('water') || k.includes('waterproof') || k.includes('مقاوم') || k.includes('ماء') || k.includes('atm') || k.includes('ip6') || k.includes('ip5')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 17a3 3 0 006-2" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  if (k.includes('gps') || k.includes('location') || k.includes('موقع')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="4" strokeWidth="1.5"/>
      <path d="M12 2v2M12 18v2M2 10h2M18 10h2" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 10v4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (k.includes('sleep') || k.includes('نوم')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (k.includes('oxygen') || k.includes('spo2') || k.includes('اكسجين') || k.includes('أكسجين')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
      <path d="M8 12h8M12 8v8" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="3" strokeWidth="1.3"/>
    </svg>
  );

  /* ── Battery ── */
  if (k.includes('battery') || k.includes('بطارية') || k.includes('mah') || k.includes('charging') || k.includes('شحن')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="7" width="18" height="10" rx="2" strokeWidth="1.5"/>
      <path d="M20 10.5v3" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M7 12l2.5-3.5L12 12l2.5-3.5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  /* ── Display / Screen ── */
  if (k.includes('display') || k.includes('screen') || k.includes('شاشة') || k.includes('monitor') || k.includes('inch') || k.includes('بوصة') || k.includes('size') || k.includes('حجم')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="14" rx="2" strokeWidth="1.5"/>
      <path d="M8 22h8M12 18v4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── GPU / Graphics ── */
  if (k.includes('gpu') || k.includes('graphic') || k.includes('vga') || k.includes('كرت الشاشة') || k.includes('كارت') || k.includes('شاشة رسومية') || k.includes('رسوميات') || k.includes('nvidia') || k.includes('amd') || k.includes('geforce') || k.includes('radeon') || k.includes('vram')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* PCB board */}
      <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="1.5"/>
      {/* GPU chip */}
      <rect x="7" y="9" width="6" height="6" rx="1" strokeWidth="1.5"/>
      {/* chip pins top */}
      <path d="M9 6V4M12 6V4" strokeWidth="1.3" strokeLinecap="round"/>
      {/* chip pins bottom */}
      <path d="M9 18v2M12 18v2" strokeWidth="1.3" strokeLinecap="round"/>
      {/* fan circle */}
      <circle cx="17.5" cy="12" r="2.2" strokeWidth="1.3"/>
      <path d="M17.5 10.3v.5M17.5 13.2v.5M15.8 12h.5M18.7 12h.5" strokeWidth="1" strokeLinecap="round"/>
      {/* heatsink fins */}
      <path d="M3 9h3M3 12h3M3 15h3" strokeWidth="1" strokeLinecap="round" opacity=".5"/>
    </svg>
  );

  /* ── CPU / Processor ── */
  if (k.includes('processor') || k.includes('cpu') || k.includes('معالج') || k.includes('chip') || k.includes('core') || k.includes('نواة')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5"/>
      <rect x="9" y="9" width="6" height="6" strokeWidth="1.5"/>
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── RAM / Memory ── */
  if (k.includes('ram') || k.includes('رام') || k.includes('الرام') || k.includes('memory') || k.includes('ذاكرة') || k.includes('mb') || k.includes('gb')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* PCB body */}
      <rect x="1" y="6" width="22" height="9" rx="1.5" strokeWidth="1.5"/>
      {/* Memory chips on board */}
      <rect x="3.5" y="8" width="4" height="5" rx="0.8" strokeWidth="1.3"/>
      <rect x="10" y="8" width="4" height="5" rx="0.8" strokeWidth="1.3"/>
      <rect x="16.5" y="8" width="4" height="5" rx="0.8" strokeWidth="1.3"/>
      {/* Connector pins — bottom only */}
      <path d="M5 15v3M8 15v2M11 15v3M14 15v2M17 15v3M20 15v2" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );

  /* ── Storage / Disk ── */
  if (k.includes('storage') || k.includes('disk') || k.includes('تخزين') || k.includes('ssd') || k.includes('hdd') || k.includes('flash') || k.includes('فلاش')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="10" ry="5" strokeWidth="1.5"/>
      <path d="M2 12v5c0 2.76 4.48 5 10 5s10-2.24 10-5v-5" strokeWidth="1.5"/>
      <circle cx="16" cy="12" r="1" fill="currentColor"/>
    </svg>
  );

  /* ── Camera ── */
  if (k.includes('camera') || k.includes('كاميرا') || k.includes('megapixel') || k.includes('ميغابكسل') || k.includes('mp')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="13" r="4" strokeWidth="1.5"/>
    </svg>
  );

  /* ── OS / Software ── */
  if (k.includes('os') || k.includes('system') || k.includes('android') || k.includes('windows') || k.includes('نظام')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="1.5"/>
      <path d="M8 21h8M12 17v4M7 7h10M7 11h6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── WiFi / Wireless ── */
  if (k.includes('wifi') || k.includes('wireless') || k.includes('واي فاي') || k.includes('لاسلكي')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M1.75 8.5a15.5 15.5 0 0120.5 0M5.5 12.5a11 11 0 0113 0M9.5 16.5a6 6 0 015 0" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  );

  /* ── Network / Connectivity ── */
  if (k.includes('connect') || k.includes('network') || k.includes('lan') || k.includes('ethernet') || k.includes('اتصال') || k.includes('شبكة')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="9" y="2" width="6" height="4" rx="1" strokeWidth="1.5"/>
      <rect x="2" y="15" width="6" height="4" rx="1" strokeWidth="1.5"/>
      <rect x="16" y="15" width="6" height="4" rx="1" strokeWidth="1.5"/>
      <path d="M12 6v4M5 15v-3h14v3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  /* ── USB / Ports ── */
  if (k.includes('usb') || k.includes('port') || k.includes('منفذ') || k.includes('hdmi')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2v12M8 10l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 18h10a2 2 0 000-4H7a2 2 0 000 4z" strokeWidth="1.5"/>
    </svg>
  );

  /* ── Print Speed ── */
  if (k.includes('speed') || k.includes('ppm') || k.includes('سرعة')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
      <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── Print / Duplex ── */
  if (k.includes('duplex') || k.includes('print') || k.includes('طباعة')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6 9V2h12v7" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="3" y="9" width="18" height="9" rx="1" strokeWidth="1.5"/>
      <path d="M6 18v4h12v-4" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="18" cy="13.5" r="1" fill="currentColor"/>
    </svg>
  );

  /* ── Scan / Copy ── */
  if (k.includes('scan') || k.includes('copy') || k.includes('مسح') || k.includes('نسخ')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1" opacity="0.5"/>
      <path d="M2 9h20" strokeWidth="2" strokeLinecap="round" stroke="currentColor"/>
    </svg>
  );

  /* ── Fax ── */
  if (k.includes('fax') || k.includes('فاكس')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="5" y="8" width="14" height="12" rx="2" strokeWidth="1.5"/>
      <path d="M7 8V5a2 2 0 012-2h6a2 2 0 012 2v3" strokeWidth="1.5"/>
      <path d="M9 14h6M9 17h4" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="12" r="1" fill="currentColor"/>
    </svg>
  );

  /* ── Paper / Size ── */
  if (k.includes('paper') || k.includes('a4') || k.includes('ورق') || k.includes('حجم الورق')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 2v6h6M8 13h8M8 17h5" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── Ink / Toner / Yield ── */
  if (k.includes('toner') || k.includes('ink') || k.includes('yield') || k.includes('cartridge') || k.includes('حبر') || k.includes('خرطوشة') || k.includes('صفحات')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 3h6l1 6H8L9 3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="6" y="9" width="12" height="12" rx="2" strokeWidth="1.5"/>
      <path d="M12 13v4M10 15h4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── Weight ── */
  if (k.includes('weight') || k.includes('وزن') || k.includes('gram') || k.includes('جرام') || k.includes('kg') || k.includes('كغ')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 3a2 2 0 100 4 2 2 0 000-4z" strokeWidth="1.5"/>
      <path d="M6 7h12l2 14H4L6 7z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 14h6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── Dimensions ── */
  if (k.includes('dimension') || k.includes('size') || k.includes('أبعاد') || k.includes('ابعاد') || k.includes('مقاس') || k.includes('mm') || k.includes('cm')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M3 21L21 3" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 8V3h5M21 16v5h-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  /* ── Color Type ── */
  if (k.includes('color') || k.includes('colour') || k.includes('لون') || k.includes('cyan') || k.includes('magenta')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="9" r="5" strokeWidth="1.5"/>
      <circle cx="15" cy="9" r="5" strokeWidth="1.5"/>
      <circle cx="12" cy="15" r="5" strokeWidth="1.5"/>
    </svg>
  );

  /* ── Sensor ── */
  if (k.includes('sensor') || k.includes('حساس')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 5a10 10 0 0114 0M7 7a7 7 0 0110 0" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="3" strokeWidth="1.5"/>
      <path d="M12 17v3" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── Notification / Alert ── */
  if (k.includes('notification') || k.includes('alert') || k.includes('إشعار') || k.includes('تنبيه')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── Voice / Speaker / Microphone ── */
  if (k.includes('speaker') || k.includes('mic') || k.includes('voice') || k.includes('صوت') || k.includes('مكبر') || k.includes('ميكروفون')) return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" strokeWidth="1.5"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  /* ── Default ── */
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
      <path d="M12 8v4M12 16h.01" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Color name → CSS color map (Arabic + English)
───────────────────────────────────────────────────────────────── */
const COLOR_NAME_MAP: Record<string, string> = {
  // Arabic — with and without hamza
  اسود: '#111111', أسود: '#111111',
  ابيض: '#f5f5f5', أبيض: '#f5f5f5',
  احمر: '#e53e3e', أحمر: '#e53e3e',
  اخضر: '#38a169', أخضر: '#38a169',
  ازرق: '#3182ce', أزرق: '#3182ce',
  اصفر: '#d69e2e', أصفر: '#d69e2e',
  برتقالي: '#dd6b20', بنفسجي: '#805ad5',
  وردي: '#d53f8c', زهري: '#d53f8c', رمادي: '#718096', بني: '#92400e', بيج: '#d4a96a',
  ذهبي: '#b7791f', فضي: '#a0aec0', كحلي: '#1a365d', زيتي: '#4a5e23',
  تركوازي: '#319795', لبني: '#fef9c3', كريمي: '#fffbeb',
  ارجواني: '#702459', أرجواني: '#702459',
  // English
  black: '#111111', white: '#f5f5f5', red: '#e53e3e', green: '#38a169',
  blue: '#3182ce', yellow: '#d69e2e', orange: '#dd6b20', purple: '#805ad5',
  pink: '#d53f8c', gray: '#718096', grey: '#718096', brown: '#92400e',
  gold: '#b7791f', silver: '#a0aec0', navy: '#1a365d', olive: '#4a5e23',
  teal: '#319795', beige: '#d4a96a', cream: '#fffbeb',
};

const resolveColor = (name: string): string => {
  const t = name.trim();
  if (COLOR_NAME_MAP[t]) return COLOR_NAME_MAP[t];
  const norm = t.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه');
  for (const [k, v] of Object.entries(COLOR_NAME_MAP)) {
    if (k.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه') === norm) return v;
  }
  return '#d1d5db';
};

/* ─────────────────────────────────────────────────────────────────
   Product Detail Page
───────────────────────────────────────────────────────────────── */
const COLOR_DOT: Record<string, string> = {
  Black: '#111', Cyan: '#00b4d8', Magenta: '#e91e8c',
  Yellow: '#f4c430', Color: '#888', 'Non-color': '#9ca3af',
};

function ProductDetail({
  product,
  variant,
  allProducts,
  tr,
  dir,
}: {
  product: Product;
  variant: Variant | null;
  allProducts: Product[];
  tr: (key: string) => string;
  dir: 'rtl' | 'ltr';
}) {
  const { lang } = useLanguage();

  const [selectedOptions, setSelectedOptions] = useState<Record<number, AttributeOption | null>>({});

  // Auto-translate admin-entered content when language is not Arabic
  const autoTr = useAutoTranslateBatch({
    name: variant?.name || product.name,
    productName: product.name,
    category: product.category,
    specs: variant?.specifications || '',
  }, lang);

  const isInk = product.type === 'Ink';

  // Gallery: main image + up to 3 extra from variant.gallery
  const attrs = variant?.attributes || [];
  const hasAttrs = attrs.length > 0;
  const attrImage = Object.values(selectedOptions).find(o => o?.image)?.image || null;
  const mainImage = attrImage || variant?.image || product.image;
  const extraImages = attrImage ? [] : (variant?.gallery || []).filter(Boolean);
  const allImages = [mainImage, ...extraImages].filter(Boolean);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  // Reset to first image when variant changes
  useEffect(() => { setActiveImageIdx(0); }, [variant?.id]);

  const displayImage = allImages[activeImageIdx] || mainImage;
  const image = displayImage;

  // Compute active price: selected option price overrides variant price
  const selectedOptionPrice = Object.values(selectedOptions)
    .map(o => o?.price)
    .filter((p): p is number => p != null)
    .at(-1) ?? null;
  const displayPrice = selectedOptionPrice ?? variant?.price ?? null;
  const specs = parseSpecs(autoTr.specs || variant?.specifications || '');
  const keySpecs = specs.filter(s => s.key).slice(0, 4);

  // Color label from LanguageContext (no API call needed — fixed values)
  const COLOR_TR: Record<string, string> = {
    Black: tr('color_val_black'), Cyan: tr('color_val_cyan'), Magenta: tr('color_val_magenta'),
    Yellow: tr('color_val_yellow'), Color: tr('color_val_mixed'), 'Non-color': '',
  };
  const colorAr = COLOR_TR[product.colorType] || '';
  const colorDot = COLOR_DOT[product.colorType] || '#9ca3af';

  const whatsappMsg = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن: ${product.name}${variant ? ` - ${variant.name}` : ''}`
  );
  const whatsappUrl = `https://wa.me/972568800999?text=${whatsappMsg}`;

  const currentBrand = variant?.brand || '';
  const currentCategory = product.category;
  const currentPrice = variant?.price ?? 0;

  /* 1 — Other variants of the SAME product (highest priority) */
  const sameProductVariants = (product.variants ?? [])
    .filter(v => v.id !== (variant?.id ?? -1))
    .map(v => ({
      id: v.id, name: v.name, brand: v.brand || currentBrand,
      price: v.price, image: v.image,
      productId: product.id, category: product.category,
      productType: product.type, isSameProduct: true, score: 100,
    }));

  /* 2 — Variants from other products, scored by similarity */
  const crossRelated = allProducts
    .filter(p => p.id !== product.id)
    .flatMap(p => (p.variants ?? []).map(v => {
      const sameType     = p.type === product.type;
      const sameCategory = p.category === currentCategory;
      const sameBrand    = !!currentBrand && v.brand === currentBrand;
      const priceClose   = currentPrice > 0 && Math.abs(v.price - currentPrice) / currentPrice < 0.4;
      const score = (sameType ? 5 : 0) + (sameCategory ? 3 : 0) + (sameBrand ? 2 : 0) + (priceClose ? 2 : 0);
      return {
        id: v.id, name: v.name, brand: v.brand, price: v.price, image: v.image,
        productId: p.id, category: p.category, productType: p.type,
        isSameProduct: false, score,
      };
    }))
    .filter(v => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(2, 8 - sameProductVariants.length));

  const related = [...sameProductVariants, ...crossRelated];

  return (
    <div className="min-h-screen bg-[#F7F8FA]" dir={dir}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">{tr('home')}</Link>
          <svg className="w-3 h-3 rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          <Link href="/products" className="hover:text-blue-600 transition-colors">{tr('products')}</Link>
          <svg className="w-3 h-3 rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-700 font-medium truncate">{variant?.name || product.name}</span>
        </nav>

        {/* ═══ قسم المنتج الرئيسي ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 mb-14">

          {/* صورة المنتج + gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* الصورة الرئيسية */}
            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden" style={{ minHeight: 380 }}>
              {/* شارة الحبر الأصلي */}
              {isInk && (
                <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-blue-200">
                  {tr('originalInk')}
                </div>
              )}

              {/* الصورة */}
              <div className="flex items-center justify-center p-8" style={{ minHeight: 380 }}>
                <img
                  src={image}
                  alt={variant?.name || product.name}
                  className="max-h-[340px] w-full object-contain transition-all duration-300 mix-blend-multiply"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x500?text=BEC'; }}
                />
              </div>

              {/* أسهم التنقل */}
              {allImages.length > 1 && (<>
                <button
                  onClick={() => setActiveImageIdx(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-600 group transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
                <button
                  onClick={() => setActiveImageIdx(i => (i + 1) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-600 group transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>

                {/* نقاط التنقل */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`rounded-full transition-all duration-200 ${activeImageIdx === i ? 'w-5 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
                    />
                  ))}
                </div>
              </>)}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white flex items-center justify-center transition-all duration-200 ${
                      activeImageIdx === i
                        ? 'ring-2 ring-blue-600 ring-offset-2 shadow-md'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-contain p-1.5 mix-blend-multiply" onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div className="flex flex-col gap-6">

            {/* الفئة والبراند */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {autoTr.category}
              </span>
              {product.brand && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {product.brand}
                </span>
              )}
              {variant?.brand && variant.brand !== product.brand && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  {tr('compatible_with')} {variant.brand}
                </span>
              )}
              {isInk && product.colorType && product.colorType !== 'Non-color' && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: colorDot }} />
                  {colorAr}
                </span>
              )}
            </div>

            {/* اسم المنتج */}
            <div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight mb-1">
                {autoTr.name}
              </h1>
              {variant && variant.name !== product.name && (
                <p className="text-gray-400 text-sm">{autoTr.productName}</p>
              )}
              {/* BEC ink: model number */}
              {isInk && product.modelNumber && (
                <p className="mt-2 text-sm font-mono text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-lg">
                  {product.modelNumber}
                </p>
              )}
            </div>

            {/* BEC Ink info row */}
            {isInk && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: tr('brand'), value: product.brand || 'BEC', icon: '🏷️' },
                  { label: tr('printer'), value: variant?.brand || '—', icon: '🖨️' },
                  ...(colorAr ? [{ label: tr('color'), value: colorAr, icon: '🎨' }] : []),
                  ...(product.modelNumber ? [{ label: tr('model'), value: product.modelNumber, icon: '📋' }] : []),
                ].slice(0, 4).map(item => (
                  <div key={item.label} className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
                    <div className="text-xs text-blue-500 font-medium mb-1">{item.icon} {item.label}</div>
                    <div className="text-sm font-bold text-gray-800 truncate">{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* السعر */}
            {variant && displayPrice != null && (
              <div className="bg-gradient-to-l from-blue-600 to-blue-700 rounded-2xl px-6 py-5 text-white">
                <p className="text-blue-200 text-xs font-medium mb-1">{tr('price')}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight transition-all duration-200">
                    {displayPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-bold text-blue-200">₪</span>
                </div>
              </div>
            )}

            {/* معايير الصنف (اللون، المقاس...) */}
            {hasAttrs && (
              <div className="space-y-4">
                {attrs.map(attr => {
                  const isColorAttr = /^(لون|color|couleur|farbe)$/i.test(attr.name.trim());
                  return (
                    <div key={attr.id}>
                      <p className="text-sm font-bold text-gray-700 mb-2.5">{attr.name}:</p>
                      <div className="flex flex-wrap gap-2">
                        {attr.options.map(opt => {
                          const isSelected = selectedOptions[attr.id]?.id === opt.id;
                          const toggle = () => setSelectedOptions(prev => ({
                            ...prev,
                            [attr.id]: prev[attr.id]?.id === opt.id ? null : opt,
                          }));

                          if (isColorAttr) {
                            const css = resolveColor(opt.value);
                            return (
                              <button
                                key={opt.id}
                                onClick={toggle}
                                title={opt.value}
                                className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none ${
                                  isSelected
                                    ? 'border-blue-600 scale-110 shadow-md'
                                    : 'border-gray-300 hover:scale-105 hover:border-gray-400'
                                }`}
                                style={{ backgroundColor: css }}
                              >
                                {isSelected && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-4 h-4 drop-shadow" fill="white" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  </span>
                                )}
                              </button>
                            );
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={toggle}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              {opt.image && (
                                <img
                                  src={opt.image}
                                  alt={opt.value}
                                  className="w-5 h-5 object-contain rounded"
                                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}
                              {opt.value}
                              {isSelected && (
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* أبرز المواصفات — أيقونات */}
            {keySpecs.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {keySpecs.map((spec, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <SpecIcon specKey={spec.key} />
                    </div>
                    <div className="min-w-0">
                      <p dir="auto" className="text-[10px] text-gray-400 font-medium leading-none mb-1" style={{ unicodeBidi: 'plaintext' }}>{spec.key}</p>
                      <p dir="auto" className="text-xs font-bold text-gray-800 leading-snug line-clamp-2" style={{ unicodeBidi: 'plaintext' }}>{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* ═══ قسم التفاصيل — عرض كامل ═══ */}
        <div className="flex flex-col gap-8">

          {/* المواصفات التقنية الكاملة */}
          {specs.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h2 className="text-lg font-bold text-gray-900">{tr('specs')}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-6 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                  >
                    {spec.key ? (
                      <>
                        <span
                          dir="auto"
                          className="font-semibold text-gray-500 text-xs min-w-[140px] flex-shrink-0 pt-0.5"
                          style={{ unicodeBidi: 'plaintext' }}
                        >
                          {spec.key}
                        </span>
                        {(spec.key === 'الطابعات المتوافقة' || /compat|printer|imprimante|drucker/i.test(spec.key)) ? (
                          <ul className="flex flex-col gap-1">
                            {spec.value.split(/[،,]/).map((p, pi) => p.trim() && (
                              <li
                                key={pi}
                                dir="auto"
                                className="flex items-center gap-2 text-gray-800 font-medium text-sm"
                                style={{ unicodeBidi: 'plaintext' }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                {p.trim().replace(/^•\s*/, '')}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span
                            dir="auto"
                            className="text-gray-800 font-medium leading-relaxed"
                            style={{ unicodeBidi: 'plaintext' }}
                          >
                            {spec.value}
                          </span>
                        )}
                      </>
                    ) : (
                      <span
                        dir="auto"
                        className="text-gray-700 leading-relaxed"
                        style={{ unicodeBidi: 'plaintext' }}
                      >
                        {spec.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA واتساب */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="text-center mb-5">
              <p className="text-gray-400 text-sm mb-1">{tr('contactQuestion')}</p>
              <p className="text-gray-900 font-bold text-lg">{tr('contactUs')}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-base bg-[#25D366] text-white hover:bg-[#20b859] transition-all duration-200 shadow-lg shadow-green-100 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.032 2.001c-5.523 0-10 4.477-10 10 0 1.752.457 3.47 1.322 4.99L2 22l5.204-1.332c1.466.804 3.107 1.23 4.828 1.23 5.523 0 10-4.477 10-10s-4.477-10-10-10z"/>
                <path fill="white" d="M16.634 14.345c-.261-.131-1.54-.76-1.78-.847-.239-.087-.413-.131-.586.131-.173.262-.674.847-.826 1.021-.152.174-.304.196-.565.065-.261-.131-1.102-.406-2.099-1.297-.776-.693-1.3-1.549-1.452-1.812-.152-.262-.016-.403.114-.533.117-.117.261-.304.391-.456.13-.152.174-.261.261-.435.087-.174.043-.327-.022-.457-.065-.131-.586-1.414-.803-1.936-.212-.509-.427-.44-.586-.448-.152-.007-.326-.008-.5-.008-.174 0-.456.065-.695.326-.239.262-.913.893-.913 2.179s.936 2.528 1.066 2.702c.13.174 1.837 2.81 4.456 3.937.623.268 1.109.428 1.488.548.625.196 1.194.168 1.644.102.502-.074 1.54-.63 1.757-1.238.217-.608.217-1.129.152-1.238-.065-.109-.239-.174-.5-.305z"/>
              </svg>
              {tr('whatsapp')}
            </a>
            <a
              href="/#contact"
              className="flex items-center justify-center gap-2 w-full py-3 mt-3 rounded-xl text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {tr('otherContact')}
            </a>
          </div>

        </div>

        {/* ═══ أجهزة قد تعجبك ═══ */}
        {related.length > 0 && (
          <div className="mt-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-blue-600 rounded-full"/>
                <h2 className="text-xl font-bold text-gray-900">أجهزة قد تعجبك</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">{related.length}</span>
              </div>
              <Link href="/products"
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors">
                {tr('viewAll')}
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </Link>
            </div>

            {/* Cards — horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4
                            sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 sm:overflow-visible sm:pb-0">
              {related.map(v => (
                <Link
                  key={v.id}
                  href={`/${v.productId}?variant=${v.id}`}
                  className="flex-none w-44 sm:w-auto bg-white rounded-2xl border border-gray-100
                             hover:border-blue-200 hover:shadow-xl transition-all duration-300
                             hover:-translate-y-1 overflow-hidden group flex flex-col"
                >
                  {/* Image area */}
                  <div className="relative h-36 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
                    {/* Same-product badge */}
                    {v.isSameProduct && (
                      <span className="absolute top-2 start-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        صنف آخر
                      </span>
                    )}
                    {v.productType === 'Ink' && !v.isSameProduct && (
                      <span className="absolute top-2 start-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white">
                        BEC
                      </span>
                    )}
                    <img
                      src={v.image || 'https://placehold.co/400x300?text=BEC'}
                      alt={v.name}
                      className="h-24 w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=BEC'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    {v.brand && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{v.brand}</span>
                    )}
                    <h3 className="font-bold text-gray-900 text-xs leading-snug line-clamp-2 flex-1">{v.name}</h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="font-black text-blue-600 text-sm">
                        {v.price.toLocaleString()}
                        <span className="text-[11px] font-normal text-gray-400 mr-0.5">₪</span>
                      </span>
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md">
                        {v.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
