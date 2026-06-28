'use client';

import { useState, useRef, useEffect, ElementType } from 'react';
import { createPortal } from 'react-dom';
import { useCms } from '../../contexts/CmsContext';

interface Props {
  blockKey:     string;
  defaultValue: string;
  tag?:         ElementType;
  className?:   string;
  style?:       React.CSSProperties;
  multiline?:   boolean;
  /* pass children so existing JSX structure is preserved */
  children?:    React.ReactNode;
}

export function EditableText({
  blockKey, defaultValue, tag: Tag = 'span',
  className, style, multiline = false, children,
}: Props) {
  const { editMode, getBlock, saveBlock, resetBlock } = useCms();
  const cmsValue  = getBlock(blockKey);
  const value     = cmsValue ?? defaultValue;

  const [editing,   setEditing]   = useState(false);
  const [draft,     setDraft]     = useState(value);
  const [saving,    setSaving]    = useState(false);
  const [hovering,  setHovering]  = useState(false);
  const [popupPos,  setPopupPos]  = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLElement>(null);

  /* Sync draft when block value changes externally */
  useEffect(() => { setDraft(value); }, [value]);

  /* Close popup on Escape */
  useEffect(() => {
    if (!editing) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setEditing(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editing]);

  const openPopup = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPopupPos({
      top:   rect.bottom + window.scrollY + 6,
      left:  rect.left   + window.scrollX,
      width: Math.max(rect.width, 300),
    });
    setDraft(value);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveBlock(blockKey, draft);
    setSaving(false);
    if (ok) setEditing(false);
    /* on failure: keep popup open so user can retry */
  };

  const handleReset = async () => {
    await resetBlock(blockKey);
    setEditing(false);
  };

  /* ── Non-edit mode: render normally ─── */
  if (!editMode) {
    return (
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      <Tag className={className} style={style}>{children ?? value}</Tag>
    );
  }

  /* ── Edit mode: render with overlay ─── */
  const isOverridden = cmsValue !== undefined;

  const popup = editing && typeof document !== 'undefined'
    ? createPortal(
        <div
          dir="rtl"
          style={{
            position:   'absolute',
            top:        popupPos.top,
            left:       popupPos.left,
            width:      Math.max(popupPos.width, 320),
            maxWidth:   420,
            zIndex:     999999,
            background: '#0f172a',
            border:     '1px solid #3b82f6',
            borderRadius: 12,
            padding:    '14px 16px',
            boxShadow:  '0 24px 64px rgba(0,0,0,0.7)',
          }}
          /* Stop click propagating to document (would close popups) */
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <span style={{ fontSize:'0.7rem', color:'#60a5fa', fontWeight:700, flex:1 }}>
              ✏️ {blockKey}
            </span>
            {isOverridden && (
              <button
                onClick={handleReset}
                title="إعادة للقيمة الافتراضية"
                style={{ fontSize:'0.68rem', color:'#f87171', background:'none', border:'none', cursor:'pointer', padding:0 }}
              >
                ↺ إعادة تعيين
              </button>
            )}
          </div>

          {/* Input */}
          {multiline ? (
            <textarea
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={4}
              style={{
                width:'100%', background:'#1e293b', color:'#f1f5f9',
                border:'1px solid #334155', borderRadius:7, padding:'8px 10px',
                fontSize:'0.88rem', resize:'vertical', fontFamily:'inherit',
                boxSizing:'border-box', direction:'rtl',
              }}
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              style={{
                width:'100%', background:'#1e293b', color:'#f1f5f9',
                border:'1px solid #334155', borderRadius:7, padding:'8px 10px',
                fontSize:'0.88rem', fontFamily:'inherit', boxSizing:'border-box', direction:'rtl',
              }}
            />
          )}

          {/* Actions */}
          <div style={{ display:'flex', gap:8, marginTop:10 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex:1, padding:'8px 0', borderRadius:7, border:'none',
                background: saving ? '#1d4ed8' : '#2563eb',
                color:'#fff', fontWeight:700, fontSize:'0.82rem', cursor:'pointer',
              }}
            >
              {saving ? '⏳ حفظ...' : '✓ حفظ'}
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding:'8px 14px', borderRadius:7,
                border:'1px solid #334155', background:'transparent',
                color:'#94a3b8', cursor:'pointer', fontSize:'0.82rem',
              }}
            >
              إلغاء
            </button>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Tag
        ref={triggerRef as any}
        className={className}
        style={{
          ...style,
          cursor:        'text',
          outline:       hovering
            ? '2px solid rgba(96,165,250,0.8)'
            : '2px dashed rgba(96,165,250,0.4)',
          outlineOffset: 3,
          borderRadius:  4,
          position:      'relative',
          transition:    'outline-color 0.15s',
          userSelect:    'none',
        }}
        onClick={openPopup}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        title="انقر للتعديل"
      >
        {children ?? value}
        {/* Edit badge */}
        {hovering && (
          <span style={{
            position:   'absolute',
            top:        -20,
            insetInlineEnd: 0,
            background: '#1d4ed8',
            color:      '#fff',
            fontSize:   '0.6rem',
            fontWeight: 700,
            padding:    '2px 7px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex:     9999,
          }}>
            ✏️ تعديل
          </span>
        )}
        {/* Override dot */}
        {isOverridden && !hovering && (
          <span style={{
            position:   'absolute',
            top:        -5,
            insetInlineEnd: -5,
            width:      8, height: 8,
            borderRadius: '50%',
            background: '#f59e0b',
            pointerEvents: 'none',
          }} />
        )}
      </Tag>
      {popup}
    </>
  );
}
