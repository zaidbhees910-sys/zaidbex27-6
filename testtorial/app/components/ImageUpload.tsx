'use client';
import { useRef, useState, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label, placeholder = 'اسحب صورة هنا أو' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('الملف ليس صورة'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('الحجم أكبر من 10MB'); return; }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else setError('فشل الرفع');
    } catch { setError('خطأ في الاتصال'); }
    setUploading(false);
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const onPaste = useCallback((e: React.ClipboardEvent) => {
    const file = Array.from(e.clipboardData.files).find(f => f.type.startsWith('image/'));
    if (file) upload(file);
  }, [upload]);

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-gray-600">{label}</label>}

      {value ? (
        /* ── معاينة الصورة ── */
        <div className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-100" style={{ minHeight: 160 }}>
          <img
            src={value}
            alt=""
            className="w-full object-contain mix-blend-multiply p-4"
            style={{ maxHeight: 180 }}
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=خطأ'; }}
          />
          {/* overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-semibold shadow hover:bg-blue-600 hover:text-white transition"
            >
              تغيير
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-white text-red-600 rounded-lg text-xs font-semibold shadow hover:bg-red-600 hover:text-white transition"
            >
              حذف
            </button>
          </div>
        </div>
      ) : (
        /* ── منطقة الرفع ── */
        <div
          onDragEnter={e => { e.preventDefault(); setDragging(true); }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onPaste={onPaste}
          tabIndex={0}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 text-center px-4 py-8 outline-none focus:border-blue-400 ${
            dragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-gray-200 hover:border-blue-300 bg-gray-50/50 hover:bg-blue-50/30'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" style={{ borderWidth: 3 }} />
              <p className="text-xs text-gray-500">جاري الرفع...</p>
            </>
          ) : (
            <>
              {/* أيقونة الرفع */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <svg className={`w-6 h-6 transition-colors ${dragging ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{placeholder}</p>
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                  onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  استعرض الجهاز
                </button>
              </div>
              <p className="text-[11px] text-gray-400">PNG, JPG, WEBP — حتى 10MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }}
      />
    </div>
  );
}
