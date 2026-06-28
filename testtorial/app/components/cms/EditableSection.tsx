'use client';

import { ReactNode } from 'react';
import { useCms } from '../../contexts/CmsContext';

interface Props {
  blockKey:       string;
  label:          string;
  defaultVisible?: boolean;
  children:       ReactNode;
}

export function EditableSection({ blockKey, label, defaultVisible = true, children }: Props) {
  const { editMode, getBlock, saveBlock } = useCms();

  const raw       = getBlock(blockKey);
  const isVisible = raw !== undefined ? raw !== 'false' : defaultVisible;

  const toggle = async () => saveBlock(blockKey, String(!isVisible), 'boolean');

  /* Visitors never see hidden sections */
  if (!editMode && !isVisible) return null;

  return (
    <div style={{ position: 'relative' }}>

      {/* Edit mode badge + toggle */}
      {editMode && (
        <div
          dir="rtl"
          style={{
            position:   'absolute',
            top:        8,
            insetInlineEnd: 12,
            zIndex:     1000,
            display:    'flex',
            gap:        8,
            alignItems: 'center',
          }}
        >
          <span style={{
            fontSize:   '0.68rem',
            background: 'rgba(37,99,235,0.9)',
            color:      '#fff',
            padding:    '3px 8px',
            borderRadius: 4,
            fontWeight: 700,
          }}>
            {label}
          </span>
          <button
            onClick={toggle}
            style={{
              padding:      '4px 12px',
              borderRadius: 20,
              border:       'none',
              cursor:       'pointer',
              fontSize:     '0.72rem',
              fontWeight:   700,
              background:   isVisible ? '#059669' : '#dc2626',
              color:        '#fff',
              transition:   'background 0.2s',
            }}
          >
            {isVisible ? '👁️ مرئي' : '🚫 مخفي'}
          </button>
        </div>
      )}

      {/* Dashed border in edit mode */}
      {editMode && (
        <div style={{
          position:    'absolute',
          inset:       0,
          outline:     isVisible
            ? '2px dashed rgba(96,165,250,0.25)'
            : '2px dashed rgba(220,38,38,0.45)',
          outlineOffset: -2,
          pointerEvents: 'none',
          zIndex:      999,
          borderRadius: 2,
        }} />
      )}

      {/* Content */}
      <div style={{
        opacity:    !isVisible && editMode ? 0.35 : 1,
        transition: 'opacity 0.3s',
      }}>
        {children}
      </div>
    </div>
  );
}
