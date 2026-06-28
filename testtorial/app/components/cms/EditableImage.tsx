'use client';

import { useRef, useState } from 'react';
import { useCms } from '../../contexts/CmsContext';

interface Props {
  blockKey:    string;
  defaultSrc:  string;
  alt?:        string;
  className?:  string;
  style?:      React.CSSProperties;
  imgStyle?:   React.CSSProperties;
}

export function EditableImage({ blockKey, defaultSrc, alt, className, style, imgStyle }: Props) {
  const { editMode, getBlock, saveBlock, resetBlock } = useCms();
  const src       = getBlock(blockKey) ?? defaultSrc;
  const isOverridden = getBlock(blockKey) !== undefined;

  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [hovered,   setHovered]   = useState(false);
  const fileRef   = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('اختر ملف صورة'); return; }
    if (file.size > 8 * 1024 * 1024)    { setError('الحد الأقصى 8 ميجابايت'); return; }
    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) {
        await saveBlock(blockKey, data.url, 'image');
      } else {
        setError('فشل الرفع');
      }
    } catch {
      setError('خطأ في الاتصال');
    } finally {
      setUploading(false);
    }
  };

  /* Non-edit: plain image */
  if (!editMode) {
    return <img src={src} alt={alt} className={className} style={style ?? imgStyle} />;
  }

  const showOverlay = hovered || uploading;

  return (
    <span
      className={className}
      style={{ position:'relative', display:'inline-block', cursor:'pointer', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !uploading && fileRef.current?.click()}
      title="انقر لتغيير الصورة"
    >
      <img
        src={src}
        alt={alt}
        style={{
          ...imgStyle,
          display:    'block',
          outline:    '2px dashed rgba(96,165,250,0.5)',
          outlineOffset: 3,
          borderRadius: 6,
          transition: 'opacity 0.2s',
          opacity:    showOverlay ? 0.55 : 1,
        }}
      />

      {/* Hover overlay */}
      {showOverlay && (
        <span style={{
          position:        'absolute',
          inset:           0,
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             6,
          pointerEvents:   'none',
        }}>
          {uploading ? (
            <>
              <span style={{ fontSize:'1.6rem' }}>⏳</span>
              <span style={{ color:'#fff', fontSize:'0.78rem', fontWeight:700, textShadow:'0 1px 4px #000' }}>
                جاري الرفع...
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize:'1.8rem' }}>🖼️</span>
              <span style={{ color:'#fff', fontSize:'0.78rem', fontWeight:700, textShadow:'0 1px 4px #000' }}>
                تغيير الصورة
              </span>
              {isOverridden && (
                <button
                  onClick={async e => { e.stopPropagation(); await resetBlock(blockKey); }}
                  style={{
                    background:'rgba(220,38,38,0.85)', color:'#fff', border:'none',
                    borderRadius:5, padding:'3px 8px', fontSize:'0.65rem',
                    fontWeight:700, cursor:'pointer', pointerEvents:'all',
                  }}
                >
                  ↺ الصورة الأصلية
                </button>
              )}
            </>
          )}
        </span>
      )}

      {/* Error */}
      {error && (
        <span style={{
          position:'absolute', bottom:-22, insetInlineStart:0,
          color:'#f87171', fontSize:'0.68rem', fontWeight:700,
          background:'rgba(0,0,0,0.7)', padding:'2px 6px', borderRadius:4,
          whiteSpace:'nowrap',
        }}>
          ⚠ {error}
        </span>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display:'none' }}
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </span>
  );
}
