'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../components/ImageUpload';
import { invalidateProductsCache } from '../../lib/products-cache';

interface AttributeOption {
  id: number;
  value: string;
  image: string;
  price: number | null;
  order: number;
}

interface ProductAttribute {
  id: number;
  variantId: number;
  name: string;
  order: number;
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
  colorType?: string;
  featured?: boolean;
  hidden?: boolean;
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
  hidden: boolean;
  variants: Variant[];
}

const BASE_TYPES = ['Printer', 'Ink', 'Device', 'Other'];
const TYPE_LABEL: Record<string, string> = {
  Printer: 'طابعات', Ink: 'أحبار', Device: 'أجهزة', Other: 'أخرى',
};
const getTypeLabel = (type: string) => TYPE_LABEL[type] || type;

const COLOR_TYPES = ['', 'Black', 'Cyan', 'Magenta', 'Yellow', 'Color', 'Non-color'];
const COLOR_LABELS: Record<string, string> = {
  '': 'اختر',
  Black: 'أسود', Cyan: 'سيان', Magenta: 'فوشيا',
  Yellow: 'أصفر', Color: 'ملون', 'Non-color': 'غير ملون',
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consolidating, setConsolidating] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newType, setNewType] = useState('');
  const [showFeaturedSection, setShowFeaturedSection] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [expandedFeaturedProduct, setExpandedFeaturedProduct] = useState<number | null>(null);
  const [togglingVariantId, setTogglingVariantId] = useState<number | null>(null);
  const [hidingId, setHidingId] = useState<number | null>(null);
  const [hidingVariantId, setHidingVariantId] = useState<number | null>(null);
  const [adminSearch, setAdminSearch] = useState('');
  const [managingProduct, setManagingProduct] = useState<Product | null>(null);
  const [modalSearch, setModalSearch] = useState('');
  const [inlineEditingId, setInlineEditingId] = useState<number | null>(null);
  const [inlineData, setInlineData] = useState<typeof variantData | null>(null);
  const [isSavingInline, setIsSavingInline] = useState(false);
  const [attrVariantId, setAttrVariantId] = useState<number | null>(null);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [attrLoading, setAttrLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState('');
  const [editingAttrId, setEditingAttrId] = useState<number | null>(null);
  const [editingAttrName, setEditingAttrName] = useState('');
  const [newOptionVal, setNewOptionVal] = useState<Record<number, string>>({});
  const [newOptionImg, setNewOptionImg] = useState<Record<number, string>>({});
  const [newOptionPrice, setNewOptionPrice] = useState<Record<number, string>>({});
  const [editingOptId, setEditingOptId] = useState<number | null>(null);
  const [editingOptVal, setEditingOptVal] = useState('');
  const [editingOptImg, setEditingOptImg] = useState('');
  const [editingOptPrice, setEditingOptPrice] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    type: 'Device',
    brand: '',
    modelNumber: '',
    colorType: '',
    featured: false,
  });

  const [variantData, setVariantData] = useState({
    name: '',
    brand: '',
    price: '',
    specifications: '',
    image: '',
    gallery: [] as string[],
    stock: '',
    colorType: '',
    productId: 0,
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api?action=getProducts&admin=1');
      const data = await res.json();
      const list: Product[] = Array.isArray(data) ? data : [];
      setProducts(list);
      setCategories([...new Set(list.map(p => p.category))]);
      setManagingProduct(prev => prev ? (list.find(p => p.id === prev.id) || null) : null);
    } catch { setProducts([]); }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api?action=logout', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const resetForm = () => {
    setShowForm(false); setEditingProduct(null);
    setFormData({ name: '', category: '', description: '', image: '', type: 'Device', brand: '', modelNumber: '', colorType: '', featured: false });
    setShowNewCategoryInput(false); setNewCategory('');
    setShowNewTypeInput(false); setNewType('');
  };

  const resetVariantForm = () => {
    setShowVariantForm(false); setEditingVariant(null);
    setVariantData({ name: '', brand: '', price: '', specifications: '', image: '', gallery: [], stock: '', colorType: '', productId: 0 });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, category: product.category,
      description: product.description, image: product.image,
      type: product.type || 'Device', brand: product.brand || '',
      modelNumber: product.modelNumber || '', colorType: product.colorType || '',
      featured: product.featured || false,
    });
    setShowForm(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const payload = { action: editingProduct ? 'updateProduct' : 'createProduct', ...formData, featured: formData.featured };
      const url = editingProduct ? `/api?action=updateProduct&id=${editingProduct.id}` : '/api';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingProduct ? payload : { ...payload, variants: [] }) });
      if (res.ok) { invalidateProductsCache(); await fetchProducts(); resetForm(); }
      else { const e2 = await res.json(); alert(e2.error || 'خطأ'); }
    } catch { alert('خطأ في الاتصال'); }
    setIsSubmitting(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج وجميع أصنافه؟')) return;
    const res = await fetch(`/api?action=deleteProduct&id=${id}`, { method: 'DELETE' });
    if (res.ok) { invalidateProductsCache(); await fetchProducts(); }
  };

  const handleAddVariant = (productId: number) => {
    setVariantData({ name: '', brand: '', price: '', specifications: '', image: '', gallery: [], stock: '', colorType: '', productId });
    setEditingVariant(null); setShowVariantForm(true);
  };

  const handleEditVariant = (variant: Variant, productId: number) => {
    setEditingVariant(variant);
    setVariantData({ name: variant.name, brand: variant.brand || '', price: variant.price.toString(), specifications: variant.specifications || '', image: variant.image || '', gallery: variant.gallery || [], stock: variant.stock?.toString() || '', colorType: variant.colorType || '', productId });
    setShowVariantForm(true);
  };

  const handleDeleteVariant = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) return;
    const res = await fetch(`/api?action=deleteVariant&id=${id}`, { method: 'DELETE' });
    if (res.ok) await fetchProducts();
  };

  const handleSubmitVariant = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const action = editingVariant ? 'updateVariant' : 'addVariant';
      const url = editingVariant ? `/api?action=${action}&id=${editingVariant.id}` : `/api?action=${action}`;
      const res = await fetch(url, { method: editingVariant ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...variantData, price: parseInt(variantData.price), stock: variantData.stock ? parseInt(variantData.stock) : null }) });
      if (res.ok) { invalidateProductsCache(); await fetchProducts(); resetVariantForm(); }
      else { const e2 = await res.json(); alert(e2.error || 'خطأ'); }
    } catch { alert('خطأ في الاتصال'); }
    setIsSubmitting(false);
  };

  const openManageModal = (product: Product) => {
    setManagingProduct(product);
    setModalSearch('');
    setInlineEditingId(null);
    setInlineData(null);
  };

  const closeManageModal = () => {
    setManagingProduct(null);
    setModalSearch('');
    setInlineEditingId(null);
    setInlineData(null);
  };

  const startInlineEdit = (v: Variant) => {
    setInlineEditingId(v.id);
    setInlineData({ name: v.name, brand: v.brand || '', price: v.price.toString(), specifications: v.specifications || '', image: v.image || '', gallery: v.gallery || [], stock: v.stock?.toString() || '', colorType: v.colorType || '', productId: managingProduct!.id });
  };

  const saveInlineEdit = async () => {
    if (!inlineData || !inlineEditingId) return;
    setIsSavingInline(true);
    try {
      const res = await fetch(`/api?action=updateVariant&id=${inlineEditingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateVariant', ...inlineData, price: parseInt(inlineData.price), stock: inlineData.stock ? parseInt(inlineData.stock) : null, gallery: inlineData.gallery || [] }),
      });
      if (res.ok) {
        invalidateProductsCache(); await fetchProducts();
        setInlineEditingId(null); setInlineData(null);
      } else { const e2 = await res.json(); alert(e2.error || 'خطأ'); }
    } catch { alert('خطأ في الاتصال'); }
    setIsSavingInline(false);
  };

  const deleteVariantInModal = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) return;
    const res = await fetch(`/api?action=deleteVariant&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      invalidateProductsCache(); await fetchProducts();
      setManagingProduct(prev => prev ? { ...prev, variants: prev.variants.filter(v => v.id !== id) } : null);
    }
  };

  const handleToggleFeatured = async (id: number, featured: boolean) => {
    setTogglingId(id);
    try {
      await fetch(`/api?action=toggleFeatured&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleFeatured', featured }),
      });
      invalidateProductsCache();
      setProducts(prev => prev.map(p => p.id === id ? { ...p, featured } : p));
    } catch { alert('خطأ في الاتصال'); }
    setTogglingId(null);
  };

  const handleToggleVariantFeatured = async (productId: number, variantId: number, featured: boolean) => {
    setTogglingVariantId(variantId);
    try {
      await fetch(`/api?action=toggleVariantFeatured&id=${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleVariantFeatured', featured }),
      });
      invalidateProductsCache();
      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, variants: p.variants.map(v => v.id === variantId ? { ...v, featured } : v) }
          : p
      ));
    } catch { alert('خطأ في الاتصال'); }
    setTogglingVariantId(null);
  };

  const handleToggleHidden = async (id: number, hidden: boolean) => {
    setHidingId(id);
    try {
      await fetch(`/api?action=toggleHidden&id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleHidden', hidden }),
      });
      invalidateProductsCache();
      setProducts(prev => prev.map(p => p.id === id ? { ...p, hidden } : p));
    } catch { alert('خطأ في الاتصال'); }
    setHidingId(null);
  };

  const handleToggleVariantHidden = async (productId: number, variantId: number, hidden: boolean) => {
    setHidingVariantId(variantId);
    try {
      await fetch(`/api?action=toggleVariantHidden&id=${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleVariantHidden', hidden }),
      });
      invalidateProductsCache();
      const updateVariants = (variants: Variant[]) =>
        variants.map(v => v.id === variantId ? { ...v, hidden } : v);
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, variants: updateVariants(p.variants) } : p
      ));
      setManagingProduct(prev => prev ? { ...prev, variants: updateVariants(prev.variants) } : null);
    } catch { alert('خطأ في الاتصال'); }
    setHidingVariantId(null);
  };

  const handleConsolidateInk = async () => {
    if (!confirm('سيتم دمج جميع منتجات الحبر تحت منتج واحد "حبر BEC"، وستصبح المنتجات الفردية أصنافاً. هل تريد المتابعة؟')) return;
    setConsolidating(true);
    try {
      const res = await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'consolidateInkProducts', parentName: 'حبر BEC' }) });
      const data = await res.json();
      if (data.success) { alert(`تم الدمج بنجاح — ${data.merged} منتج أصبح صنفاً`); invalidateProductsCache(); await fetchProducts(); }
      else alert('حدث خطأ أثناء الدمج');
    } catch { alert('خطأ في الاتصال'); }
    setConsolidating(false);
  };

  const openAttrModal = async (variantId: number) => {
    setAttrVariantId(variantId);
    setAttrLoading(true);
    const res = await fetch(`/api?action=getAttributes&variantId=${variantId}`);
    const data = await res.json();
    setAttributes(Array.isArray(data) ? data : []);
    setAttrLoading(false);
  };

  const closeAttrModal = () => {
    setAttrVariantId(null);
    setAttributes([]);
    setNewAttrName('');
    setEditingAttrId(null);
    setEditingOptId(null);
  };

  const addAttribute = async () => {
    if (!newAttrName.trim() || !attrVariantId) return;
    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createAttribute', variantId: attrVariantId, name: newAttrName.trim() }),
    });
    if (res.ok) {
      const attr = await res.json();
      setAttributes(prev => [...prev, attr]);
      setNewAttrName('');
    }
  };

  const deleteAttribute = async (id: number) => {
    if (!confirm('حذف هذا المعيار وجميع خياراته؟')) return;
    const res = await fetch(`/api?action=deleteAttribute&id=${id}`, { method: 'DELETE' });
    if (res.ok) setAttributes(prev => prev.filter(a => a.id !== id));
  };

  const saveAttrName = async (id: number) => {
    const res = await fetch(`/api?action=updateAttribute&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAttribute', name: editingAttrName }),
    });
    if (res.ok) {
      setAttributes(prev => prev.map(a => a.id === id ? { ...a, name: editingAttrName } : a));
      setEditingAttrId(null);
    }
  };

  const addOption = async (attrId: number) => {
    const val = newOptionVal[attrId]?.trim();
    if (!val) return;
    const priceRaw = newOptionPrice[attrId]?.trim();
    const price = priceRaw ? parseInt(priceRaw) : null;
    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createAttributeOption', attributeId: attrId, value: val, image: newOptionImg[attrId] || '', price }),
    });
    if (res.ok) {
      const opt = await res.json();
      setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, options: [...a.options, opt] } : a));
      setNewOptionVal(prev => ({ ...prev, [attrId]: '' }));
      setNewOptionImg(prev => ({ ...prev, [attrId]: '' }));
      setNewOptionPrice(prev => ({ ...prev, [attrId]: '' }));
    }
  };

  const deleteOption = async (attrId: number, optId: number) => {
    const res = await fetch(`/api?action=deleteAttributeOption&id=${optId}`, { method: 'DELETE' });
    if (res.ok) setAttributes(prev => prev.map(a => a.id === attrId ? { ...a, options: a.options.filter(o => o.id !== optId) } : a));
  };

  const saveOption = async (attrId: number) => {
    const price = editingOptPrice.trim() ? parseInt(editingOptPrice.trim()) : null;
    const res = await fetch(`/api?action=updateAttributeOption&id=${editingOptId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateAttributeOption', value: editingOptVal, image: editingOptImg, price }),
    });
    if (res.ok) {
      setAttributes(prev => prev.map(a => a.id === attrId
        ? { ...a, options: a.options.map(o => o.id === editingOptId ? { ...o, value: editingOptVal, image: editingOptImg, price } : o) }
        : a
      ));
      setEditingOptId(null);
    }
  };

  /* ── Dynamic types (base + any custom from DB) ── */
  const dynamicTypes = [...new Set([...BASE_TYPES, ...products.map(p => p.type).filter(Boolean)])];

  const filtered = products
    .filter(p => typeFilter ? p.type === typeFilter : true)
    .filter(p => {
      if (!adminSearch.trim()) return true;
      const q = adminSearch.trim().toLowerCase();
      const has = (s?: string) => !!s && s.toLowerCase().includes(q);
      return (
        has(p.name) ||
        has(p.brand) ||
        has(p.modelNumber) ||
        has(p.category) ||
        has(p.description) ||
        p.variants?.some(v => has(v.name) || has(v.brand) || has(v.specifications))
      );
    });

  const inkCount = products.filter(p => p.type === 'Ink').length;
  const printerCount = products.filter(p => p.type === 'Printer').length;
  const deviceCount = products.filter(p => p.type === 'Device').length;
  const featuredCount = products.filter(p => p.featured).length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-gray-700 text-lg">جاري التحميل...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-md border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم — BEC</h1>
          <div className="flex items-center gap-3">
            <a href="/?edit=1" target="_blank"
              className="px-4 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-medium flex items-center gap-2">
              ✏️ تعديل الصفحة الرئيسية
            </a>
            <button onClick={handleLogout} className="px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition font-medium">تسجيل الخروج</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'إجمالي المنتجات', value: products.length, color: 'blue' },
            { label: 'منتجات الحبر', value: inkCount, color: 'violet' },
            { label: 'الأجهزة والطابعات', value: printerCount + deviceCount, color: 'emerald' },
            { label: 'منتجات مميزة', value: featuredCount, color: 'amber' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="text-gray-500 text-xs font-medium mb-1">{s.label}</div>
              <div className={`text-3xl font-black text-${s.color}-600`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ════ استكشاف المنتجات ════ */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-8 overflow-hidden">
          <button
            onClick={() => setShowFeaturedSection(s => !s)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <div className="text-right">
                <h2 className="text-sm font-bold text-gray-800">استكشاف المنتجات — الصفحة الرئيسية</h2>
                <p className="text-xs text-gray-500">
                  <span className="text-blue-600 font-semibold">{products.filter(p => p.featured).length}</span> منتج ظاهر حالياً
                </p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showFeaturedSection ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {showFeaturedSection && (
            <div className="border-t border-gray-100 p-6">
              <p className="text-sm text-gray-500 mb-5">
                فعّل المنتجات التي تريدها تظهر في قسم <span className="font-semibold text-gray-700">استكشاف المنتجات</span> على الصفحة الرئيسية.
              </p>
              <div className="space-y-3">
                {products.map(product => {
                  const isExpanded = expandedFeaturedProduct === product.id;
                  const featuredVariants = product.variants?.filter(v => v.featured).length || 0;
                  const totalVariants = product.variants?.length || 0;
                  return (
                    <div key={product.id} className={`rounded-xl border-2 overflow-hidden transition-all ${product.featured ? 'border-blue-400' : 'border-gray-200'}`}>
                      {/* Product row */}
                      <div className={`flex items-center gap-3 p-3 ${product.featured ? 'bg-blue-50' : 'bg-white'}`}>
                        <img
                          src={product.image || '/assets/toner-brand.png'}
                          alt=""
                          className="w-10 h-10 object-contain rounded-lg border border-gray-100 flex-shrink-0 bg-white"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80?text=BEC'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {getTypeLabel(product.type)} · {totalVariants} صنف
                            {product.featured && featuredVariants > 0 && (
                              <span className="text-blue-600 font-semibold"> · {featuredVariants} مفعّل</span>
                            )}
                          </p>
                        </div>
                        {/* Expand variants button */}
                        {product.featured && totalVariants > 0 && (
                          <button
                            onClick={() => setExpandedFeaturedProduct(isExpanded ? null : product.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition flex-shrink-0"
                          >
                            الأصناف
                            <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                            </svg>
                          </button>
                        )}
                        {/* Product toggle */}
                        <button
                          onClick={() => {
                            handleToggleFeatured(product.id, !product.featured);
                            if (product.featured) setExpandedFeaturedProduct(null);
                          }}
                          disabled={togglingId === product.id}
                          className={`w-10 h-6 rounded-full flex-shrink-0 transition-colors duration-200 relative ${product.featured ? 'bg-blue-600' : 'bg-gray-300'} ${togglingId === product.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${product.featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                      </div>

                      {/* Variants panel */}
                      {isExpanded && product.featured && (
                        <div className="border-t border-blue-100 bg-white px-4 py-3 space-y-2">
                          <p className="text-xs text-gray-500 mb-2">
                            اختر الأصناف التي تظهر — إذا لم تختر أياً ستظهر كلها تلقائياً
                          </p>
                          {product.variants?.map(v => (
                            <div key={v.id} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${v.featured ? 'border-blue-300 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                              <img
                                src={v.image || '/assets/toner-brand.png'}
                                alt=""
                                className="w-8 h-8 object-contain rounded border border-gray-100 flex-shrink-0 bg-gray-50"
                                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80?text=BEC'; }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-800 line-clamp-1">{v.name}</p>
                                {v.brand && <p className="text-[10px] text-gray-400">{v.brand}</p>}
                              </div>
                              <span className="text-xs font-bold text-blue-600 flex-shrink-0">{v.price > 0 ? `${v.price} ₪` : ''}</span>
                              <button
                                onClick={() => handleToggleVariantFeatured(product.id, v.id, !v.featured)}
                                disabled={togglingVariantId === v.id}
                                className={`w-9 h-5 rounded-full flex-shrink-0 transition-colors relative ${v.featured ? 'bg-blue-600' : 'bg-gray-300'} ${togglingVariantId === v.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${v.featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {products.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-6">لا توجد منتجات بعد</p>
              )}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 mb-6">
          {/* Row 1: actions + type filter */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { setEditingProduct(null); setFormData({ name: '', category: '', description: '', image: '', type: 'Device', brand: '', modelNumber: '', colorType: '', featured: false }); setShowForm(true); }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm text-sm"
            >
              + إضافة منتج جديد
            </button>
            <a
              href="/admin/homepage"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold border transition bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5"
            >
              🏠 إدارة الصفحة الرئيسية
            </a>
            <button
              onClick={handleConsolidateInk}
              disabled={consolidating || inkCount <= 1}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold border transition disabled:opacity-40 bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
              title="دمج جميع منتجات الحبر تحت منتج واحد"
            >
              {consolidating ? 'جاري الدمج...' : '⟳ دمج أحبار BEC'}
            </button>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter('')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${typeFilter === '' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >الكل</button>
              {dynamicTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${typeFilter === t ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {getTypeLabel(t)}
                  <span className="mr-1.5 text-xs opacity-70">({products.filter(p => p.type === t).length})</span>
                </button>
              ))}
            </div>
          </div>
          {/* Row 2: search */}
          <div className="relative max-w-md">
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="ابحث بالاسم، الماركة، الموديل، الصنف..."
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
            {adminSearch && (
              <button onClick={() => setAdminSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            )}
          </div>
          {adminSearch && (
            <p className="text-xs text-gray-500">
              <span className="font-bold text-gray-700">{filtered.length}</span> نتيجة لـ &ldquo;{adminSearch}&rdquo;
            </p>
          )}
        </div>

        {/* Product form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmitProduct} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">اسم المنتج *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" required />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الفئة *</label>
                  <div className="flex gap-2">
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" required>
                      <option value="">اختر فئة</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="button" onClick={() => setShowNewCategoryInput(!showNewCategoryInput)} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">+ جديد</button>
                  </div>
                  {showNewCategoryInput && (
                    <div className="flex gap-2 mt-2">
                      <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="اسم الفئة الجديدة" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-800" />
                      <button type="button" onClick={() => { if (newCategory.trim()) { setCategories([...categories, newCategory]); setFormData({ ...formData, category: newCategory }); setNewCategory(''); setShowNewCategoryInput(false); } }} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">إضافة</button>
                    </div>
                  )}
                </div>
                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">نوع المنتج *</label>
                  <div className="flex gap-2">
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" required>
                      {[...new Set([...dynamicTypes, formData.type].filter(Boolean))].map(t => (
                        <option key={t} value={t}>{getTypeLabel(t)} ({t})</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setShowNewTypeInput(!showNewTypeInput)} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">+ جديد</button>
                  </div>
                  {showNewTypeInput && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newType}
                        onChange={e => setNewType(e.target.value)}
                        placeholder="اسم النوع (مثال: Headphone)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const trimmed = newType.trim();
                            if (trimmed) { setFormData({ ...formData, type: trimmed }); setNewType(''); setShowNewTypeInput(false); }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = newType.trim();
                          if (trimmed) { setFormData({ ...formData, type: trimmed }); setNewType(''); setShowNewTypeInput(false); }
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >إضافة</button>
                    </div>
                  )}
                </div>
                {/* Brand (product manufacturer) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ماركة المنتج (مثال: BEC, HP)</label>
                  <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="BEC" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
                </div>
                {/* Model Number (for ink) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">رقم الموديل (للحبر)</label>
                  <input type="text" value={formData.modelNumber} onChange={e => setFormData({ ...formData, modelNumber: e.target.value })} placeholder="مثال: CF244A, HP 953XL" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
                </div>
                {/* Color Type — only for Printer and Ink */}
                {(formData.type === 'Printer' || formData.type === 'Ink') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {formData.type === 'Printer' ? 'نوع الطباعة' : 'نوع اللون'}
                    </label>
                    {formData.type === 'Printer' ? (
                      <select
                        value={formData.colorType}
                        onChange={e => setFormData({ ...formData, colorType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                      >
                        <option value="">اختر</option>
                        <option value="Color">ملون</option>
                        <option value="Non-color">غير ملون</option>
                      </select>
                    ) : (
                      <select
                        value={formData.colorType}
                        onChange={e => setFormData({ ...formData, colorType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                      >
                        {COLOR_TYPES.map(c => <option key={c} value={c}>{COLOR_LABELS[c]}</option>)}
                      </select>
                    )}
                  </div>
                )}
                {/* Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">رابط الصورة</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="/assets/toner-brand.png أو رابط خارجي" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
                  {formData.image && <img src={formData.image} alt="preview" className="mt-2 h-16 w-16 object-cover rounded border" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                </div>
              </div>
              {/* Featured toggle */}
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${formData.featured ? 'bg-amber-500' : 'bg-gray-300'}`} onClick={() => setFormData({ ...formData, featured: !formData.featured })}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${formData.featured ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    منتج مميز (يظهر في قسم حبر BEC على الصفحة الرئيسية)
                  </span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">إلغاء</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50">
                  {isSubmitting ? 'جاري الحفظ...' : (editingProduct ? 'تحديث' : 'إضافة')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Variant form */}
        {showVariantForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingVariant ? 'تعديل صنف' : 'إضافة صنف'}
                <span className="text-sm font-normal text-gray-500 mr-3">
                  {products.find(p => p.id === variantData.productId)?.name}
                </span>
              </h2>
              <button onClick={resetVariantForm} className="text-gray-500 hover:text-gray-700 text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmitVariant} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">اسم الصنف *</label>
                  <input type="text" value={variantData.name} onChange={e => setVariantData({ ...variantData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الماركة المتوافقة (Brand)</label>
                  <input type="text" value={variantData.brand} onChange={e => setVariantData({ ...variantData, brand: e.target.value })} placeholder="HP, Canon, Brother..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" list="compat-brands" />
                  <datalist id="compat-brands">
                    {['HP', 'Canon', 'Brother', 'Epson', 'Samsung', 'Xerox', 'Dell', 'Lenovo', 'Asus', 'Ricoh'].map(b => <option key={b} value={b} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">السعر (₪) *</label>
                  <input type="number" value={variantData.price} onChange={e => setVariantData({ ...variantData, price: e.target.value })} placeholder="150" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الكمية (اختياري)</label>
                  <input type="number" value={variantData.stock} onChange={e => setVariantData({ ...variantData, stock: e.target.value })} placeholder="10" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
                </div>
                {(() => {
                  const parentType = products.find(p => p.id === variantData.productId)?.type;
                  return (parentType === 'Ink' || parentType === 'Printer') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {parentType === 'Printer' ? 'نوع الطباعة' : 'نوع اللون'}
                      </label>
                      {parentType === 'Printer' ? (
                        <select value={variantData.colorType} onChange={e => setVariantData({ ...variantData, colorType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800">
                          <option value="">اختر</option>
                          <option value="Color">ملون (طابعة ألوان)</option>
                          <option value="Non-color">غير ملون (أبيض وأسود)</option>
                        </select>
                      ) : (
                        <select value={variantData.colorType} onChange={e => setVariantData({ ...variantData, colorType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800">
                          {COLOR_TYPES.map(c => <option key={c} value={c}>{COLOR_LABELS[c]}</option>)}
                        </select>
                      )}
                    </div>
                  );
                })()}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">صورة الصنف</label>
                  <input type="text" value={variantData.image} onChange={e => setVariantData({ ...variantData, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">المواصفات</label>
                <textarea value={variantData.specifications} onChange={e => setVariantData({ ...variantData, specifications: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetVariantForm} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">إلغاء</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50">
                  {isSubmitting ? 'جاري الحفظ...' : (editingVariant ? 'تحديث الصنف' : 'إضافة الصنف')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">
              {filtered.length} منتج
              {typeFilter && <span className="text-gray-400 font-normal"> — {getTypeLabel(typeFilter)}</span>}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-right">
                  <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">#</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">المنتج</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">النوع / الفئة</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">موديل / لون</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الأصناف</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">لا توجد منتجات</td></tr>
                ) : (
                  filtered.map((product, index) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image || '/assets/toner-brand.png'} alt="" className="w-9 h-9 object-cover rounded-lg border border-gray-100" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80?text=BEC'; }} />
                          <div>
                            <div className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</div>
                            {product.brand && <div className="text-xs text-blue-600 font-medium">{product.brand}</div>}
                            {product.featured && <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">★ مميز</span>}
                            {product.hidden && <span className="inline-block text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full mt-0.5">مخفي</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-gray-700">{getTypeLabel(product.type || 'Device')}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-4 py-3">
                        {product.modelNumber && <div className="text-xs font-mono text-gray-700 line-clamp-1">{product.modelNumber}</div>}
                        {product.colorType && (
                          <span className="inline-block text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full mt-0.5">
                            {COLOR_LABELS[product.colorType] || product.colorType}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openManageModal(product)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition border border-blue-100"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                          {product.variants?.length || 0} صنف
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => handleEditProduct(product)} className="px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded transition border border-blue-200">تعديل</button>
                          <button
                            onClick={() => handleToggleHidden(product.id, !product.hidden)}
                            disabled={hidingId === product.id}
                            className={`px-3 py-1 text-xs font-semibold rounded transition border ${product.hidden ? 'text-green-700 border-green-200 hover:bg-green-50' : 'text-gray-600 border-gray-200 hover:bg-gray-50'} ${hidingId === product.id ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            {product.hidden ? 'إظهار' : 'إخفاء'}
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 rounded transition border border-red-200">حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Attributes Modal ── */}
      {attrVariantId !== null && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeAttrModal(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" dir="rtl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-gray-900">إدارة معايير الصنف</h3>
              <button onClick={closeAttrModal} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">✕</button>
            </div>

            <div className="p-5 space-y-5">
              {attrLoading ? (
                <div className="text-center py-8 text-gray-400">جاري التحميل...</div>
              ) : (
                <>
                  {/* existing attributes */}
                  {attributes.map(attr => (
                    <div key={attr.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* attribute header */}
                      <div className="bg-gray-50 px-4 py-3 flex items-center gap-2">
                        {editingAttrId === attr.id ? (
                          <>
                            <input
                              value={editingAttrName}
                              onChange={e => setEditingAttrName(e.target.value)}
                              className="flex-1 border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                              onKeyDown={e => { if (e.key === 'Enter') saveAttrName(attr.id); }}
                            />
                            <button onClick={() => saveAttrName(attr.id)} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold">حفظ</button>
                            <button onClick={() => setEditingAttrId(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg">إلغاء</button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-bold text-gray-800 text-sm">{attr.name}</span>
                            <button onClick={() => { setEditingAttrId(attr.id); setEditingAttrName(attr.name); }} className="text-xs text-blue-600 hover:underline">تعديل</button>
                            <button onClick={() => deleteAttribute(attr.id)} className="text-xs text-red-500 hover:underline">حذف</button>
                          </>
                        )}
                      </div>

                      {/* options list */}
                      <div className="divide-y divide-gray-50">
                        {attr.options.map(opt => (
                          <div key={opt.id} className="px-4 py-2.5">
                            {editingOptId === opt.id ? (
                              <div className="space-y-2">
                                <input value={editingOptVal} onChange={e => setEditingOptVal(e.target.value)} placeholder="القيمة (مثال: أسود)" className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                                <input value={editingOptImg} onChange={e => setEditingOptImg(e.target.value)} placeholder="رابط الصورة (اختياري)" className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                                <input
                                  type="number"
                                  value={editingOptPrice}
                                  onChange={e => setEditingOptPrice(e.target.value)}
                                  placeholder="سعر مخصص ₪ (اتركه فارغاً لاستخدام سعر الصنف)"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  min="0"
                                />
                                <div className="flex gap-2">
                                  <button onClick={() => saveOption(attr.id)} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold">حفظ</button>
                                  <button onClick={() => setEditingOptId(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg">إلغاء</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                {opt.image && (
                                  <img src={opt.image} alt={opt.value} className="w-10 h-10 object-contain rounded-lg border border-gray-100 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
                                )}
                                <span className="flex-1 text-sm text-gray-700">{opt.value}</span>
                                {opt.price != null && (
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{opt.price} ₪</span>
                                )}
                                {!opt.image && opt.price == null && <span className="text-xs text-gray-300">لا توجد صورة</span>}
                                <button onClick={() => { setEditingOptId(opt.id); setEditingOptVal(opt.value); setEditingOptImg(opt.image); setEditingOptPrice(opt.price != null ? String(opt.price) : ''); }} className="text-xs text-blue-600 hover:underline">تعديل</button>
                                <button onClick={() => deleteOption(attr.id, opt.id)} className="text-xs text-red-500 hover:underline">حذف</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* add option */}
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 space-y-2">
                        <input
                          value={newOptionVal[attr.id] || ''}
                          onChange={e => setNewOptionVal(prev => ({ ...prev, [attr.id]: e.target.value }))}
                          placeholder="اسم الخيار (مثال: أسود)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          onKeyDown={e => { if (e.key === 'Enter') addOption(attr.id); }}
                        />
                        <input
                          value={newOptionImg[attr.id] || ''}
                          onChange={e => setNewOptionImg(prev => ({ ...prev, [attr.id]: e.target.value }))}
                          placeholder="رابط صورة الخيار (اختياري)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                        <input
                          type="number"
                          value={newOptionPrice[attr.id] || ''}
                          onChange={e => setNewOptionPrice(prev => ({ ...prev, [attr.id]: e.target.value }))}
                          placeholder="سعر مخصص ₪ (اختياري — فارغ = سعر الصنف)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          min="0"
                        />
                        <button onClick={() => addOption(attr.id)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                          + إضافة خيار
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* add new attribute */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">إضافة معيار جديد</p>
                    <div className="flex gap-2">
                      <input
                        value={newAttrName}
                        onChange={e => setNewAttrName(e.target.value)}
                        placeholder="اسم المعيار (مثال: اللون، المقاس...)"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        onKeyDown={e => { if (e.key === 'Enter') addAttribute(); }}
                      />
                      <button onClick={addAttribute} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition">
                        إضافة
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal إدارة الأصناف ═══ */}
      {managingProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-10 px-4 pb-4" onClick={e => { if (e.target === e.currentTarget) closeManageModal(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{managingProduct.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{managingProduct.variants.length} صنف</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { closeManageModal(); handleAddVariant(managingProduct.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  إضافة صنف
                </button>
                <button onClick={closeManageModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg">✕</button>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-gray-50 flex-shrink-0">
              <div className="relative">
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder="ابحث في الأصناف بالاسم، الماركة، الموديل..."
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  autoFocus
                />
                {modalSearch && (
                  <button onClick={() => setModalSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                )}
              </div>
              {modalSearch && (
                <p className="text-xs text-gray-400 mt-2">
                  {managingProduct.variants.filter(v => {
                    const q = modalSearch.toLowerCase();
                    return v.name.toLowerCase().includes(q) || v.brand?.toLowerCase().includes(q) || v.specifications?.toLowerCase().includes(q);
                  }).length} نتيجة
                </p>
              )}
            </div>

            {/* Variants list */}
            <div className="overflow-y-auto flex-1 px-6 py-3 space-y-2">
              {managingProduct.variants
                .filter(v => {
                  if (!modalSearch.trim()) return true;
                  const q = modalSearch.trim().toLowerCase();
                  return v.name.toLowerCase().includes(q) || v.brand?.toLowerCase().includes(q) || v.specifications?.toLowerCase().includes(q);
                })
                .map(v => (
                  <div key={v.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    {inlineEditingId === v.id && inlineData ? (
                      /* ── Inline edit form ── */
                      <div className="p-4 bg-blue-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">اسم الصنف *</label>
                            <input type="text" value={inlineData.name} onChange={e => setInlineData({ ...inlineData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-800" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">الماركة المتوافقة</label>
                            <input type="text" value={inlineData.brand} onChange={e => setInlineData({ ...inlineData, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-800" list="modal-compat-brands" />
                            <datalist id="modal-compat-brands">
                              {['HP', 'Canon', 'Brother', 'Epson', 'Samsung', 'Xerox', 'Ricoh', 'Pantum', 'Kyocera', 'Konica Minolta'].map(b => <option key={b} value={b} />)}
                            </datalist>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">نوع اللون</label>
                            <select value={inlineData.colorType} onChange={e => setInlineData({ ...inlineData, colorType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-800">
                              {COLOR_TYPES.map(c => <option key={c} value={c}>{COLOR_LABELS[c]}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">السعر (₪) *</label>
                            <input type="number" value={inlineData.price} onChange={e => setInlineData({ ...inlineData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-800" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">الكمية</label>
                            <input type="number" value={inlineData.stock} onChange={e => setInlineData({ ...inlineData, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-800" />
                          </div>
                          <div className="sm:col-span-2">
                            <ImageUpload
                              label="الصورة الرئيسية"
                              value={inlineData.image}
                              onChange={url => setInlineData({ ...inlineData, image: url })}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              صور إضافية <span className="text-gray-400 font-normal">(حتى 3 — {(inlineData.gallery || []).filter(Boolean).length}/3)</span>
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {[0, 1, 2].map(i => (
                                <ImageUpload
                                  key={i}
                                  placeholder={`صورة ${i + 2}`}
                                  value={(inlineData.gallery || [])[i] || ''}
                                  onChange={url => {
                                    const g = [...(inlineData.gallery || []), '', ''].slice(0, 3) as string[];
                                    g[i] = url;
                                    setInlineData({ ...inlineData, gallery: g.filter(Boolean) });
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">المواصفات</label>
                            <textarea value={inlineData.specifications} onChange={e => setInlineData({ ...inlineData, specifications: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none" />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => { setInlineEditingId(null); setInlineData(null); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">إلغاء</button>
                          <button onClick={saveInlineEdit} disabled={isSavingInline} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                            {isSavingInline ? 'جاري الحفظ...' : 'حفظ'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Variant row ── */
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition">
                        <img src={v.image || '/assets/toner-brand.png'} alt="" className="w-9 h-9 object-contain rounded-lg border border-gray-100 flex-shrink-0 bg-gray-50" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80?text=BEC'; }} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold line-clamp-1 ${v.hidden ? 'text-gray-400' : 'text-gray-800'}`}>{v.name}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            {v.brand && <span className="text-xs text-blue-600 font-medium">{v.brand}</span>}
                            {v.colorType && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{COLOR_LABELS[v.colorType] || v.colorType}</span>}
                            {v.stock != null && <span className="text-[10px] text-gray-400">مخزون: {v.stock}</span>}
                            {v.hidden && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">مخفي</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-black text-blue-600">{v.price > 0 ? `${v.price.toLocaleString()} ₪` : <span className="text-gray-400 text-xs">بدون سعر</span>}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => openAttrModal(v.id)}
                            title="إدارة المعايير"
                            className="text-xs px-2 py-1 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded font-bold transition"
                          >
                            معايير
                          </button>
                          <button onClick={() => startInlineEdit(v)} className="px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition">تعديل</button>
                          <button
                            onClick={() => handleToggleVariantHidden(managingProduct.id, v.id, !v.hidden)}
                            disabled={hidingVariantId === v.id}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition border ${v.hidden ? 'text-green-700 border-green-200 hover:bg-green-50' : 'text-gray-500 border-gray-200 hover:bg-gray-50'} ${hidingVariantId === v.id ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            {v.hidden ? 'إظهار' : 'إخفاء'}
                          </button>
                          <button onClick={() => deleteVariantInModal(v.id)} className="px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">حذف</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              {/* Empty state */}
              {managingProduct.variants.filter(v => {
                if (!modalSearch.trim()) return true;
                const q = modalSearch.trim().toLowerCase();
                return v.name.toLowerCase().includes(q) || v.brand?.toLowerCase().includes(q) || v.specifications?.toLowerCase().includes(q);
              }).length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">لا توجد أصناف تطابق البحث</p>
                  {modalSearch && <button onClick={() => setModalSearch('')} className="text-xs text-blue-500 mt-2 hover:underline">مسح البحث</button>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
