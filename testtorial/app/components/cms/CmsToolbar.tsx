'use client';

import { useCms } from '../../contexts/CmsContext';

export function CmsToolbar() {
  const { isAdmin, editMode, setEditMode, unsaved } = useCms();

  if (!isAdmin) return null;

  return (
    <div
      dir="rtl"
      style={{
        position:   'fixed',
        top: 0, right: 0, left: 0,
        zIndex:     99999,
        height:     52,
        display:    'flex',
        alignItems: 'center',
        gap:        10,
        padding:    '0 1.25rem',
        background: editMode
          ? 'linear-gradient(135deg,#1e40af 0%,#1d4ed8 100%)'
          : 'rgba(10,15,30,0.96)',
        backdropFilter: 'blur(14px)',
        borderBottom: editMode
          ? '2px solid rgba(96,165,250,0.6)'
          : '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.3s, border-color 0.3s',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Brand */}
      <span style={{ color:'#60a5fa', fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.04em' }}>
        🛠️ BEC Visual CMS
      </span>

      {/* Edit mode toggle */}
      <button
        onClick={() => setEditMode(!editMode)}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        7,
          padding:    '6px 16px',
          borderRadius: 8,
          border:     'none',
          cursor:     'pointer',
          fontWeight: 700,
          fontSize:   '0.8rem',
          background: editMode ? '#fff' : 'rgba(96,165,250,0.18)',
          color:      editMode ? '#1d4ed8' : '#93c5fd',
          transition: 'all 0.2s',
        }}
      >
        <span>{editMode ? '✖' : '✏️'}</span>
        {editMode ? 'إيقاف التعديل' : 'تفعيل التعديل'}
      </button>

      {/* Unsaved indicator */}
      {editMode && unsaved > 0 && (
        <span style={{
          background: '#f59e0b',
          color:      '#1c1917',
          fontSize:   '0.72rem',
          fontWeight: 700,
          padding:    '3px 9px',
          borderRadius: 20,
          animation:  'pulse 1.5s infinite',
        }}>
          ● جاري الحفظ...
        </span>
      )}

      {editMode && unsaved === 0 && (
        <span style={{ color:'#34d399', fontSize:'0.74rem', fontWeight:700 }}>
          ✓ محفوظ
        </span>
      )}

      {/* Spacer */}
      <span style={{ flex: 1 }} />

      {/* Help hint */}
      {editMode && (
        <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.7rem' }}>
          انقر على أي عنصر لتعديله
        </span>
      )}

      {/* Admin panel */}
      <a
        href="/admin"
        style={{
          padding:      '5px 13px',
          borderRadius: 7,
          border:       '1px solid rgba(255,255,255,0.15)',
          background:   'rgba(255,255,255,0.07)',
          color:        '#e2e8f0',
          fontSize:     '0.78rem',
          fontWeight:   600,
          textDecoration: 'none',
          whiteSpace:   'nowrap',
        }}
      >
        لوحة التحكم ↗
      </a>
    </div>
  );
}

/* Spacer that pushes page content below the fixed toolbar */
export function CmsPageSpacer() {
  const { isAdmin } = useCms();
  return isAdmin ? <div style={{ height: 52 }} /> : null;
}
