'use client';

import { useState, useEffect, useRef } from 'react';

interface HeroSlide {
  id: number;
  badge: string;
  h1: string;
  h1Grad: string;
  h1Sub: string;
  desc: string;
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
  imageSrc: string;
  imgScale: number;
  sortOrder: number;
  active: boolean;
}

const EMPTY: Omit<HeroSlide, 'id' | 'sortOrder'> = {
  badge: '', h1: '', h1Grad: '', h1Sub: '', desc: '',
  cta1Label: '', cta1Href: '', cta2Label: '', cta2Href: '',
  imageSrc: '', imgScale: 1.05, active: true,
};

const DEFAULT_SLIDES: Omit<HeroSlide, 'id' | 'sortOrder'>[] = [
  {
    badge:     'حلول الطباعة للشركات',
    h1:        'حلول',
    h1Grad:    'طباعة احترافية',
    h1Sub:     'للشركات والمكاتب',
    desc:      'أحبار BEC الأصلية وطابعات HP وCanon وBrother مع عقود توريد وصيانة مستمرة',
    cta1Label: '🖨️ حلول الطباعة',
    cta1Href:  '#printer-card',
    cta2Label: '🎮 تجميع Gaming',
    cta2Href:  '/gaming-build',
    imageSrc:  '/assets/hero-slide-printing.png',
    imgScale:  1.05,
    active:    true,
  },
  {
    badge:     'تجميعات Gaming احترافية',
    h1:        'ابني',
    h1Grad:    'جهازك المثالي',
    h1Sub:     'بالمواصفات التي تريدها',
    desc:      'تجميعات Gaming مخصصة، لابتوبات Lenovo Legion بأحدث المعالجات وكروت الشاشة',
    cta1Label: '🎮 تجميع Gaming',
    cta1Href:  '/gaming-build',
    cta2Label: '📞 تواصل معنا',
    cta2Href:  '#contact',
    imageSrc:  '/assets/hero-slide-gaming.png',
    imgScale:  1.05,
    active:    true,
  },
  {
    badge:     'أجهزة وإكسسوارات',
    h1:        'أجهزة',
    h1Grad:    'أصلية معتمدة',
    h1Sub:     'للشركات والأفراد',
    desc:      'لابتوبات، سماعات، ساعات ذكية وإكسسوارات من أفضل العلامات العالمية',
    cta1Label: '💻 تصفح المنتجات',
    cta1Href:  '/products',
    cta2Label: '📞 تواصل معنا',
    cta2Href:  '#contact',
    imageSrc:  '/assets/hero-slide-devices.png',
    imgScale:  1.05,
    active:    true,
  },
  {
    badge:     'الشبكات والدعم الفني',
    h1:        'دعم',
    h1Grad:    'فني متكامل',
    h1Sub:     'للشركات والمؤسسات',
    desc:      'إعداد شبكات، صيانة دورية، ودعم تقني متواصل يضمن استمرارية عملك',
    cta1Label: '📞 تواصل معنا',
    cta1Href:  '#contact',
    cta2Label: '💼 خدماتنا',
    cta2Href:  '#services',
    imageSrc:  '/assets/hero-slide-network.png',
    imgScale:  1.05,
    active:    true,
  },
];

export default function HeroSlidesSection() {
  const [open,       setOpen]       = useState(false);
  const [slides,     setSlides]     = useState<HeroSlide[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState<HeroSlide | null>(null);
  const [form,       setForm]       = useState({ ...EMPTY });
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [seeding,    setSeeding]    = useState(false);
  const [error,      setError]      = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero-slides?all=1');
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch { setSlides([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (open) fetchSlides(); }, [open]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setError('');
    setShowForm(true);
  };

  const openEdit = (s: HeroSlide) => {
    setEditing(s);
    setForm({
      badge: s.badge, h1: s.h1, h1Grad: s.h1Grad, h1Sub: s.h1Sub,
      desc: s.desc, cta1Label: s.cta1Label, cta1Href: s.cta1Href,
      cta2Label: s.cta2Label, cta2Href: s.cta2Href,
      imageSrc: s.imageSrc, imgScale: s.imgScale, active: s.active,
    });
    setError('');
    setShowForm(true);
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('اختر ملف صورة'); return; }
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setForm(f => ({ ...f, imageSrc: data.url }));
      else setError('فشل رفع الصورة');
    } catch { setError('خطأ في الرفع'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.h1Grad && !form.h1 && !form.h1Sub) { setError('أدخل عنواناً على الأقل'); return; }
    setSaving(true);
    setError('');
    try {
      const method = editing ? 'PUT' : 'POST';
      const body   = editing ? { id: editing.id, ...form } : form;
      const res    = await fetch('/api/hero-slides', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError((d as { error?: string }).error || `خطأ ${res.status}`);
        return;
      }
      setShowForm(false);
      await fetchSlides();
    } catch { setError('خطأ في الاتصال'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (slide: HeroSlide) => {
    setTogglingId(slide.id);
    try {
      await fetch('/api/hero-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slide.id, active: !slide.active }),
      });
      setSlides(s => s.map(x => x.id === slide.id ? { ...x, active: !slide.active } : x));
    } finally { setTogglingId(null); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف الشريحة؟ لا يمكن التراجع.')) return;
    setDeletingId(id);
    try {
      await fetch('/api/hero-slides', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setSlides(s => s.filter(x => x.id !== id));
    } finally { setDeletingId(null); }
  };

  const seedDefaults = async () => {
    setSeeding(true);
    setError('');
    try {
      for (const s of DEFAULT_SLIDES) {
        const res = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(`خطأ ${res.status}: ${(d as {error?:string}).error || 'فشل الإضافة'}`);
          setSeeding(false);
          return;
        }
      }
      await fetchSlides();
    } catch (e) {
      setError(`خطأ في الاتصال: ${e instanceof Error ? e.message : 'unknown'}`);
    } finally { setSeeding(false); }
  };

  const moveOrder = async (slide: HeroSlide, dir: -1 | 1) => {
    const idx     = slides.findIndex(s => s.id === slide.id);
    const partner = slides[idx + dir];
    if (!partner) return;
    const newList = [...slides];
    newList[idx]       = { ...slide,   sortOrder: partner.sortOrder };
    newList[idx + dir] = { ...partner, sortOrder: slide.sortOrder };
    newList.sort((a, b) => a.sortOrder - b.sortOrder);
    setSlides(newList);
    await Promise.all([
      fetch('/api/hero-slides', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: slide.id,   sortOrder: partner.sortOrder }) }),
      fetch('/api/hero-slides', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: partner.id, sortOrder: slide.sortOrder }) }),
    ]);
  };

  const F = (key: keyof typeof form, label: string, opts?: { type?: string; placeholder?: string; textarea?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {opts?.textarea ? (
        <textarea
          rows={2}
          value={String(form[key])}
          placeholder={opts.placeholder}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-none"
        />
      ) : (
        <input
          type={opts?.type || 'text'}
          value={String(form[key])}
          placeholder={opts?.placeholder}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
        />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-8 overflow-hidden">
      {/* Header — click to expand */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 text-lg">🎞️</div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-gray-800">شرائح الـ Hero</h2>
            <p className="text-xs text-gray-500">
              <span className="text-violet-600 font-semibold">{slides.filter(s => s.active).length || '—'}</span>
              {slides.length > 0 ? ` / ${slides.length} شريحة` : ' انقر لعرض الشرائح'}
            </p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-6">

          {/* Add button */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">الشرائح تظهر بالتسلسل في الـ animation. يمكنك إضافة، تعديل، إعادة ترتيب، وإخفاء أي شريحة.</p>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition flex-shrink-0 mr-4"
            >
              <span>+</span> إضافة شريحة
            </button>
          </div>

          {/* Slides list */}
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">جاري التحميل...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🎞️</div>
              <p className="text-sm text-gray-500 mb-1">لا توجد شرائح في قاعدة البيانات</p>
              <p className="text-xs text-gray-400 mb-5">الموقع يعرض الشرائح الافتراضية من الكود — أضفها هنا لتتمكن من تعديلها</p>
              <button
                onClick={seedDefaults}
                disabled={seeding}
                className={`inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-violet-700 transition ${seeding ? 'opacity-60 cursor-wait' : ''}`}
              >
                {seeding ? '⏳ جاري الإضافة...' : '✦ إضافة الشرائح الافتراضية (4 شرائح)'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, idx) => (
                <div key={slide.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${slide.active ? 'border-violet-200 bg-violet-50/40' : 'border-gray-200 bg-gray-50 opacity-60'}`}>

                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 flex items-center justify-center">
                    {slide.imageSrc ? (
                      <img src={slide.imageSrc} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">🖼️</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {slide.h1Grad || slide.h1 || slide.h1Sub || '—'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{slide.badge}</p>
                  </div>

                  {/* Order buttons */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => moveOrder(slide, -1)}
                      disabled={idx === 0}
                      className="w-6 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 disabled:opacity-20 transition text-xs"
                      title="للأعلى"
                    >▲</button>
                    <button
                      onClick={() => moveOrder(slide, 1)}
                      disabled={idx === slides.length - 1}
                      className="w-6 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 disabled:opacity-20 transition text-xs"
                      title="للأسفل"
                    >▼</button>
                  </div>

                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggle(slide)}
                    disabled={togglingId === slide.id}
                    className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${slide.active ? 'bg-violet-600' : 'bg-gray-300'} ${togglingId === slide.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                    title={slide.active ? 'إخفاء' : 'إظهار'}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${slide.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(slide)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition flex-shrink-0"
                  >تعديل</button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(slide.id)}
                    disabled={deletingId === slide.id}
                    className={`px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition flex-shrink-0 ${deletingId === slide.id ? 'opacity-50 cursor-wait' : ''}`}
                  >حذف</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ADD / EDIT MODAL ────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-gray-800">{editing ? 'تعديل شريحة' : 'إضافة شريحة جديدة'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>

            <div className="p-6 space-y-4">

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">صورة الشريحة</label>
                <div className="flex gap-3 items-start">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-24 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-violet-400 bg-gray-50 hover:bg-violet-50 flex items-center justify-center cursor-pointer transition flex-shrink-0 overflow-hidden"
                    title="انقر لرفع صورة"
                  >
                    {form.imageSrc ? (
                      <img src={form.imageSrc} alt="" className="w-full h-full object-contain" />
                    ) : uploading ? (
                      <span className="text-xs text-gray-400">⏳</span>
                    ) : (
                      <span className="text-2xl">🖼️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.imageSrc}
                      placeholder="رابط الصورة أو ارفع ملف"
                      onChange={e => setForm(f => ({ ...f, imageSrc: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition"
                    >
                      {uploading ? '⏳ جاري الرفع...' : '📁 رفع صورة'}
                    </button>
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
              </div>

              {/* Badge */}
              {F('badge', 'الشارة (Badge)', { placeholder: 'مثال: حلول الطباعة للشركات' })}

              {/* H1 lines */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">العنوان الرئيسي (3 أسطر)</p>
                {F('h1', 'السطر الأول', { placeholder: 'مثال: حلول' })}
                {F('h1Grad', 'السطر الثاني — بتأثير اللون', { placeholder: 'مثال: طباعة احترافية' })}
                {F('h1Sub', 'السطر الثالث', { placeholder: 'مثال: للشركات والمكاتب' })}
              </div>

              {/* Description */}
              {F('desc', 'الوصف', { placeholder: 'وصف قصير يظهر أسفل العنوان', textarea: true })}

              {/* CTAs */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">أزرار الـ CTA</p>
                <div className="grid grid-cols-2 gap-3">
                  {F('cta1Label', 'زر 1 — النص', { placeholder: '🖨️ حلول الطباعة' })}
                  {F('cta1Href',  'زر 1 — الرابط', { placeholder: '#printer-card' })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {F('cta2Label', 'زر 2 — النص', { placeholder: '🎮 تجميع Gaming' })}
                  {F('cta2Href',  'زر 2 — الرابط', { placeholder: '/gaming-build' })}
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700">الشريحة مفعّلة</label>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`w-10 h-6 rounded-full relative transition-colors ${form.active ? 'bg-violet-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  ⚠️ {error}
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex-1 bg-violet-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-violet-700 transition ${saving ? 'opacity-60 cursor-wait' : ''}`}
              >
                {saving ? '⏳ جاري الحفظ...' : editing ? '✓ حفظ التعديلات' : '+ إضافة الشريحة'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
