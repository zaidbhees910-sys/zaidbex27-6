'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '../../components/ImageUpload';

interface Banner {
  id?: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  image: string;
  active: boolean;
  sortOrder: number;
}

interface Category {
  id?: number;
  title: string;
  description: string;
  image: string;
  link: string;
  icon: string;
  active: boolean;
  sortOrder: number;
  variantIds: number[];
  displayMode: 'products' | 'logo';
}

interface VariantOption {
  id: number;
  name: string;
  image: string;
  colorType: string;
  price: number;
}

interface ProductOption {
  id: number;
  name: string;
  type: string;
  image: string;
  variants: VariantOption[];
}

const BLANK_BANNER: Banner = { title: '', subtitle: '', ctaText: 'عرض المنتجات', ctaLink: '/products', bgColor: '#2563eb', image: '', active: true, sortOrder: 0 };
const BLANK_CAT: Category = { title: '', description: '', image: '', link: '/products', icon: '🛍️', active: true, sortOrder: 0, variantIds: [], displayMode: 'products' };

const BG_PRESETS = [
  { label: 'أزرق', color: '#2563eb' }, { label: 'بنفسجي', color: '#7c3aed' },
  { label: 'أخضر', color: '#059669' }, { label: 'برتقالي', color: '#ea580c' },
  { label: 'أسود', color: '#111827' }, { label: 'رمادي', color: '#374151' },
];

const TYPE_LABEL: Record<string, string> = {
  Printer: 'طابعات', Ink: 'أحبار', Device: 'أجهزة', Gaming: 'جيمينج',
  GamingLaptop: 'لابتوب جيمينج', Other: 'أخرى',
};

export default function HomepageAdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'hero' | 'categories' | 'banners'>('categories');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');

  const [hero, setHero] = useState({ hero_title: '', hero_subtitle: '', hero_badge: '', hero_desc: '' });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductOption[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [hpRes, prodRes] = await Promise.all([
        fetch('/api?action=getHomepageAdmin'),
        fetch('/api?action=getProducts&admin=1'),
      ]);
      if (hpRes.status === 401) { router.push('/admin/login'); return; }
      const d = await hpRes.json();
      const prods = await prodRes.json();
      setHero({
        hero_title:    d.settings.hero_title    || '',
        hero_subtitle: d.settings.hero_subtitle || '',
        hero_badge:    d.settings.hero_badge    || '',
        hero_desc:     d.settings.hero_desc     || '',
      });
      setBanners(d.banners || []);
      setCategories((d.categories || []).map((c: any) => ({
        ...c,
        variantIds: Array.isArray(c.variantIds) ? c.variantIds : [],
        displayMode: c.displayMode || 'products',
      })));
      if (Array.isArray(prods)) {
        setAllProducts(prods.map((p: any) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          image: p.image || p.variants?.[0]?.image || '',
          variants: (p.variants || []).map((v: any) => ({
            id: v.id,
            name: v.name,
            image: v.image || '',
            colorType: v.colorType || '',
            price: v.price || 0,
          })),
        })));
      }
    } catch { router.push('/admin/login'); }
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const flash = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 2500); };

  const saveAllHero = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(hero)) {
      await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'saveHomepageSetting', key, value }) });
    }
    setSaving(false);
    flash('تم حفظ إعدادات الهيرو ✓');
  };

  const saveBanner = async () => {
    if (!editBanner) return;
    setSaving(true);
    await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'upsertBanner', ...editBanner }) });
    setSaving(false);
    setShowBannerForm(false);
    setEditBanner(null);
    fetchData();
    flash('تم حفظ البانر ✓');
  };

  const deleteBanner = async (id: number) => {
    if (!confirm('حذف هذا البانر؟')) return;
    await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'deleteBanner', id }) });
    fetchData();
  };

  const saveCategory = async () => {
    if (!editCategory) return;
    setSaving(true);
    await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'upsertCategory', ...editCategory }) });
    setSaving(false);
    setShowCatForm(false);
    setEditCategory(null);
    fetchData();
    flash('تم حفظ القسم ✓');
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('حذف هذا القسم؟')) return;
    await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'deleteCategory', id }) });
    fetchData();
  };

  const toggleVariant = (variantId: number) => {
    if (!editCategory) return;
    const ids = editCategory.variantIds || [];
    setEditCategory(c => c && ({
      ...c,
      variantIds: ids.includes(variantId) ? ids.filter(id => id !== variantId) : [...ids, variantId],
    }));
  };

  const toggleAllVariants = (product: ProductOption) => {
    if (!editCategory) return;
    const pVariantIds = product.variants.map(v => v.id);
    const allSelected = pVariantIds.every(id => editCategory.variantIds.includes(id));
    if (allSelected) {
      setEditCategory(c => c && ({ ...c, variantIds: c.variantIds.filter(id => !pVariantIds.includes(id)) }));
    } else {
      const newIds = [...editCategory.variantIds];
      for (const id of pVariantIds) if (!newIds.includes(id)) newIds.push(id);
      setEditCategory(c => c && ({ ...c, variantIds: newIds }));
    }
  };

  // Build a map for quick variant lookup
  const variantMap = new Map<number, { name: string; image: string; productName: string }>();
  for (const p of allProducts) {
    for (const v of p.variants) {
      variantMap.set(v.id, { name: v.name, image: v.image, productName: p.name });
    }
  }

  const filteredProducts = allProducts.filter(p =>
    !productSearch ||
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (TYPE_LABEL[p.type] || p.type).includes(productSearch) ||
    p.variants.some(v => v.name.toLowerCase().includes(productSearch.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            لوحة التحكم
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-base font-bold text-gray-900">إدارة الصفحة الرئيسية</h1>
          {saved && (
            <span className="text-sm font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              {saved}
            </span>
          )}
          <Link href="/" target="_blank" className="mr-auto text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            معاينة
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-gray-100">
          {([['categories', '📦 الأقسام'], ['banners', '📢 البانرات'], ['hero', '🎯 الهيرو']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-3 text-sm font-semibold transition border-b-2 -mb-px ${tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── CATEGORIES TAB ── */}
        {tab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">أقسام الصفحة الرئيسية</h2>
                <p className="text-xs text-gray-500 mt-0.5">تحكم بالأقسام والأصناف التي تظهر داخل كل Card</p>
              </div>
              <button onClick={() => { setEditCategory({ ...BLANK_CAT, sortOrder: categories.length + 1 }); setProductSearch(''); setExpandedProductId(null); setShowCatForm(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                + إضافة قسم
              </button>
            </div>

            {/* ── Category Form ── */}
            {showCatForm && editCategory && (
              <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">{editCategory.id ? 'تعديل القسم' : 'قسم جديد'}</h3>
                  <button onClick={() => { setShowCatForm(false); setEditCategory(null); }} className="text-gray-400 hover:text-gray-700 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">الأيقونة (Emoji)</label>
                    <input value={editCategory.icon} onChange={e => setEditCategory(c => c && ({ ...c, icon: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="🖨️" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">الترتيب</label>
                    <input type="number" value={editCategory.sortOrder} onChange={e => setEditCategory(c => c && ({ ...c, sortOrder: +e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">عنوان القسم</label>
                    <input value={editCategory.title} onChange={e => setEditCategory(c => c && ({ ...c, title: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="الطباعة والأحبار" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">وصف مختصر</label>
                    <input value={editCategory.description} onChange={e => setEditCategory(c => c && ({ ...c, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="أحبار BEC وطابعات HP وCanon" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">رابط الصفحة</label>
                    <input value={editCategory.link} onChange={e => setEditCategory(c => c && ({ ...c, link: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="/products?type=Ink" />
                  </div>
                  {/* Display mode toggle */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">طريقة عرض القسم</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditCategory(c => c && ({ ...c, displayMode: 'products' }))}
                        className={`flex-1 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          editCategory.displayMode === 'products'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg">🖼️</span>
                        <span>عرض أصناف المنتجات</span>
                        <span className="text-[10px] font-normal opacity-70">4 صور منتجات داخل الكارت</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditCategory(c => c && ({ ...c, displayMode: 'logo' }))}
                        className={`flex-1 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          editCategory.displayMode === 'logo'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg">🏷️</span>
                        <span>عرض شعار القسم</span>
                        <span className="text-[10px] font-normal opacity-70">صورة / شعار مركزي كبير</span>
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUpload
                      label={editCategory.displayMode === 'logo' ? 'شعار القسم (سيُعرض بحجم كبير في المنتصف)' : 'صورة خلفية القسم (اختياري)'}
                      value={editCategory.image}
                      onChange={url => setEditCategory(c => c && ({ ...c, image: url }))}
                      placeholder={editCategory.displayMode === 'logo' ? 'ارفع شعار القسم...' : 'اسحب صورة خلفية أو اضغط للرفع'}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="cat-active" checked={editCategory.active} onChange={e => setEditCategory(c => c && ({ ...c, active: e.target.checked }))} className="w-4 h-4 rounded text-blue-600" />
                    <label htmlFor="cat-active" className="text-sm text-gray-700">نشط</label>
                  </div>
                </div>

                {/* ── Variant Picker (only in products mode) ── */}
                <div className={`border-t border-gray-100 p-5 ${editCategory.displayMode === 'logo' ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">الأصناف داخل هذا القسم</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {editCategory.variantIds.length > 0
                          ? `${editCategory.variantIds.length} صنف مختار`
                          : 'لم يتم اختيار أصناف — ستظهر الـ Card بخلفية ملونة فقط'}
                      </p>
                    </div>
                    {editCategory.variantIds.length > 0 && (
                      <button onClick={() => setEditCategory(c => c && ({ ...c, variantIds: [] }))}
                        className="text-xs text-red-500 hover:text-red-700 transition">
                        مسح الكل
                      </button>
                    )}
                  </div>

                  {/* Selected chips */}
                  {editCategory.variantIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      {editCategory.variantIds.map(vid => {
                        const v = variantMap.get(vid);
                        return v ? (
                          <span key={vid} className="inline-flex items-center gap-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                            {v.image && <img src={v.image} alt="" className="w-4 h-4 object-contain rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                            <span className="max-w-[120px] truncate">{v.name}</span>
                            <button onClick={() => toggleVariant(vid)} className="text-blue-300 hover:text-blue-700 transition leading-none">×</button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Search */}
                  <div className="relative mb-3">
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                      value={productSearch}
                      onChange={e => { setProductSearch(e.target.value); setExpandedProductId(null); }}
                      placeholder="ابحث عن منتج أو صنف..."
                      className="w-full border border-gray-200 rounded-lg pr-9 pl-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                    />
                  </div>

                  {/* Product list with expandable variants */}
                  <div className="max-h-72 overflow-y-auto space-y-1.5 rounded-xl border border-gray-100 p-2 bg-gray-50">
                    {filteredProducts.map(product => {
                      const isExpanded = expandedProductId === product.id || !!productSearch;
                      const selectedInProduct = product.variants.filter(v => editCategory.variantIds.includes(v.id)).length;
                      const allSelected = product.variants.length > 0 && selectedInProduct === product.variants.length;
                      const thumb = product.image || product.variants[0]?.image || '';

                      return (
                        <div key={product.id} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                          {/* Product row header */}
                          <div
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${selectedInProduct > 0 ? 'bg-blue-50/60' : ''}`}
                            onClick={() => setExpandedProductId(isExpanded && !productSearch ? null : product.id)}
                          >
                            {/* Product thumbnail */}
                            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {thumb ? (
                                <img src={thumb} alt="" className="w-full h-full object-contain mix-blend-multiply"
                                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              ) : (
                                <span className="text-gray-300 text-[10px]">لا صورة</span>
                              )}
                            </div>

                            {/* Product info */}
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {TYPE_LABEL[product.type] || product.type} · {product.variants.length} صنف
                              </p>
                            </div>

                            {/* Selected count badge */}
                            {selectedInProduct > 0 && (
                              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                                {selectedInProduct}/{product.variants.length}
                              </span>
                            )}

                            {/* Select all toggle */}
                            {product.variants.length > 0 && (
                              <button
                                onClick={e => { e.stopPropagation(); toggleAllVariants(product); }}
                                className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition flex-shrink-0 ${
                                  allSelected
                                    ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'
                                    : 'border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100'
                                }`}
                              >
                                {allSelected ? 'إلغاء الكل' : 'اختيار الكل'}
                              </button>
                            )}

                            {/* Expand chevron */}
                            {!productSearch && (
                              <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                              </svg>
                            )}
                          </div>

                          {/* Variants list */}
                          {isExpanded && product.variants.length > 0 && (
                            <div className="border-t border-gray-100 bg-gray-50/60 divide-y divide-gray-100">
                              {product.variants.map(variant => {
                                const selected = editCategory.variantIds.includes(variant.id);
                                return (
                                  <button
                                    key={variant.id}
                                    onClick={() => toggleVariant(variant.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-colors ${
                                      selected ? 'bg-blue-50' : 'hover:bg-white'
                                    }`}
                                  >
                                    {/* Variant image */}
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                      {variant.image ? (
                                        <img src={variant.image} alt="" className="w-full h-full object-contain mix-blend-multiply"
                                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                      ) : (
                                        <span className="text-gray-300 text-[9px]">صورة</span>
                                      )}
                                    </div>

                                    {/* Variant info */}
                                    <div className="flex-1 min-w-0 text-right">
                                      <p className={`text-xs font-medium line-clamp-1 ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {variant.name}
                                      </p>
                                      {variant.price > 0 && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">{variant.price} ₪</p>
                                      )}
                                    </div>

                                    {/* Checkbox */}
                                    <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                      selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                                    }`}>
                                      {selected && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                        </svg>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-6">لا توجد نتائج</p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 flex gap-2">
                  <button onClick={saveCategory} disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                    {saving ? 'جاري الحفظ...' : 'حفظ القسم'}
                  </button>
                  <button onClick={() => { setShowCatForm(false); setEditCategory(null); }}
                    className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* ── Categories List ── */}
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
                      {cat.icon || '🛍️'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base">{cat.icon}</span>
                      <p className="text-sm font-bold text-gray-900">{cat.title}</p>
                      {!cat.active && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">مخفي</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-blue-500 font-mono">{cat.link}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${cat.displayMode === 'logo' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                        {cat.displayMode === 'logo' ? '🏷️ شعار' : '🖼️ منتجات'}
                      </span>
                      {cat.displayMode !== 'logo' && cat.variantIds && cat.variantIds.length > 0 && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                          {cat.variantIds.length} صنف
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Variant thumbnails preview */}
                  {cat.variantIds && cat.variantIds.length > 0 && (
                    <div className="flex -space-x-1 flex-shrink-0">
                      {cat.variantIds.slice(0, 4).map(vid => {
                        const v = variantMap.get(vid);
                        return v ? (
                          <div key={vid} className="w-8 h-8 rounded-lg border-2 border-white bg-gray-50 overflow-hidden">
                            <img src={v.image} alt="" className="w-full h-full object-contain mix-blend-multiply"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                        ) : null;
                      })}
                      {cat.variantIds.length > 4 && (
                        <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          +{cat.variantIds.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditCategory({ ...cat, variantIds: cat.variantIds || [], displayMode: cat.displayMode || 'products' }); setProductSearch(''); setExpandedProductId(null); setShowCatForm(true); }}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                      تعديل
                    </button>
                    <button onClick={() => deleteCategory(cat.id!)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
                  لا توجد أقسام — أضف قسماً جديداً
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BANNERS TAB ── */}
        {tab === 'banners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">بانرات الترويج</h2>
                <p className="text-xs text-gray-500 mt-0.5">بانرات تظهر في الصفحة الرئيسية تحت قسم المنتجات المميزة</p>
              </div>
              <button onClick={() => { setEditBanner({ ...BLANK_BANNER, sortOrder: banners.length + 1 }); setShowBannerForm(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                + إضافة بانر
              </button>
            </div>

            {showBannerForm && editBanner && (
              <div className="bg-white rounded-2xl border border-blue-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">{editBanner.id ? 'تعديل البانر' : 'بانر جديد'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">العنوان</label>
                    <input value={editBanner.title} onChange={e => setEditBanner(b => b && ({ ...b, title: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="عروض الأحبار - خصم 20%" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">النص الفرعي</label>
                    <input value={editBanner.subtitle} onChange={e => setEditBanner(b => b && ({ ...b, subtitle: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="احصل على أفضل الأسعار اليوم" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">نص الزر</label>
                    <input value={editBanner.ctaText} onChange={e => setEditBanner(b => b && ({ ...b, ctaText: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="تسوق الآن" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">رابط الزر</label>
                    <input value={editBanner.ctaLink} onChange={e => setEditBanner(b => b && ({ ...b, ctaLink: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="/products?type=Ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">لون الخلفية</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {BG_PRESETS.map(p => (
                        <button key={p.color} onClick={() => setEditBanner(b => b && ({ ...b, bgColor: p.color }))}
                          className={`w-8 h-8 rounded-lg border-2 transition ${editBanner.bgColor === p.color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{ background: p.color }} title={p.label} />
                      ))}
                    </div>
                    <input type="color" value={editBanner.bgColor} onChange={e => setEditBanner(b => b && ({ ...b, bgColor: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-gray-200 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">الترتيب</label>
                    <input type="number" value={editBanner.sortOrder} onChange={e => setEditBanner(b => b && ({ ...b, sortOrder: +e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" />
                  </div>
                  <div className="sm:col-span-2">
                    <ImageUpload label="صورة خلفية البانر (اختياري)" value={editBanner.image}
                      onChange={url => setEditBanner(b => b && ({ ...b, image: url }))}
                      placeholder="اسحب صورة للبانر أو اضغط للرفع" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="banner-active" checked={editBanner.active} onChange={e => setEditBanner(b => b && ({ ...b, active: e.target.checked }))} className="w-4 h-4 rounded text-blue-600" />
                    <label htmlFor="banner-active" className="text-sm text-gray-700">نشط</label>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">معاينة:</p>
                  <div className="relative rounded-xl overflow-hidden p-6 flex items-center justify-between gap-6"
                    style={editBanner.image ? {
                      backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${editBanner.image})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    } : { background: editBanner.bgColor }}>
                    <div>
                      <p className="text-white font-bold text-lg">{editBanner.title || 'عنوان البانر'}</p>
                      {editBanner.subtitle && <p className="text-white/70 text-sm mt-0.5">{editBanner.subtitle}</p>}
                    </div>
                    {editBanner.ctaText && (
                      <span className="flex-shrink-0 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">
                        {editBanner.ctaText}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveBanner} disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                    {saving ? 'جاري الحفظ...' : 'حفظ البانر'}
                  </button>
                  <button onClick={() => { setShowBannerForm(false); setEditBanner(null); }} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {banners.map(banner => (
                <div key={banner.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="h-20 flex items-center justify-between px-6"
                    style={banner.image ? {
                      backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${banner.image})`,
                      backgroundSize: 'cover',
                    } : { background: banner.bgColor }}>
                    <div>
                      <p className="text-white font-bold">{banner.title}</p>
                      {banner.subtitle && <p className="text-white/70 text-xs">{banner.subtitle}</p>}
                    </div>
                    {banner.ctaText && <span className="bg-white text-gray-900 font-bold px-4 py-1.5 rounded-lg text-sm">{banner.ctaText}</span>}
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-mono flex-1">{banner.ctaLink}</span>
                    {!banner.active && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">مخفي</span>}
                    <button onClick={() => { setEditBanner(banner); setShowBannerForm(true); }} className="px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition">تعديل</button>
                    <button onClick={() => deleteBanner(banner.id!)} className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">حذف</button>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
                  لا توجد بانرات — أضف بانراً جديداً
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── HERO TAB ── */}
        {tab === 'hero' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">إعدادات قسم الهيرو</h2>
              <p className="text-xs text-gray-500">اتركها فارغة لاستخدام النصوص الافتراضية</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">الشارة الصغيرة</label>
              <input value={hero.hero_badge} onChange={e => setHero(h => ({ ...h, hero_badge: e.target.value }))}
                placeholder="مثال: وصل حديثاً"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">العنوان الرئيسي</label>
              <input value={hero.hero_title} onChange={e => setHero(h => ({ ...h, hero_title: e.target.value }))}
                placeholder="مثال: حلول الطباعة والإلكترونيات"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">العنوان الفرعي</label>
              <input value={hero.hero_subtitle} onChange={e => setHero(h => ({ ...h, hero_subtitle: e.target.value }))}
                placeholder="مثال: أحبار أصلية، طابعات، وإكسسوارات تقنية"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">وصف الهيرو</label>
              <textarea value={hero.hero_desc} onChange={e => setHero(h => ({ ...h, hero_desc: e.target.value }))}
                rows={3} placeholder="وصف مختصر يظهر أسفل العنوان..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 resize-none" />
            </div>
            <button onClick={saveAllHero} disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
              {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الهيرو'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
