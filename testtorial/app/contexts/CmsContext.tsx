'use client';

import {
  createContext, useContext, useState, useEffect,
  useCallback, useRef, ReactNode,
} from 'react';

/* ─── Types ──────────────────────────────────────────────── */
interface CmsContextType {
  isAdmin:      boolean;
  editMode:     boolean;
  setEditMode:  (v: boolean) => void;
  blocks:       Record<string, string>;
  getBlock:     (key: string) => string | undefined;
  saveBlock:    (key: string, value: string, type?: string) => Promise<boolean>;
  resetBlock:   (key: string) => Promise<void>;
  unsaved:      number;
  saveError:    string;
}

/* ─── Context ────────────────────────────────────────────── */
const CmsContext = createContext<CmsContextType>({
  isAdmin:     false,
  editMode:    false,
  setEditMode: () => {},
  blocks:      {},
  getBlock:    () => undefined,
  saveBlock:   async () => false,
  resetBlock:  async () => {},
  unsaved:     0,
  saveError:   '',
});

/* ─── Provider ───────────────────────────────────────────── */
export function CmsProvider({
  children,
  initialEditMode = false,
}: {
  children: ReactNode;
  initialEditMode?: boolean;
}) {
  const [isAdmin,        setIsAdmin]        = useState(false);
  const [authChecked,    setAuthChecked]    = useState(false);
  const [requestedEdit,  setRequestedEdit]  = useState(initialEditMode);
  const [blocks,         setBlocks]         = useState<Record<string, string>>({});
  const [unsaved,        setUnsaved]        = useState(0);
  const [saveError,      setSaveError]      = useState('');
  const inFlight  = useRef(new Set<string>());
  const blocksRef = useRef<Record<string, string>>({});

  /* Keep ref in sync so saveBlock closure doesn't capture stale blocks */
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  /* Check admin auth on mount */
  useEffect(() => {
    fetch('/api/cms?action=checkAuth')
      .then(r => r.json())
      .then(d => {
        setIsAdmin(d.isAdmin === true);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  /* Load CMS blocks for homepage */
  useEffect(() => {
    fetch('/api/cms?action=getBlocks&page=home')
      .then(r => r.json())
      .then(d => { if (d && typeof d === 'object') setBlocks(d); })
      .catch(() => {});
  }, []);

  /* editMode only activates when user is confirmed admin */
  const editMode = isAdmin && requestedEdit;

  const setEditMode = useCallback((v: boolean) => setRequestedEdit(v), []);
  const getBlock    = useCallback((key: string) => blocks[key], [blocks]);

  /* Persist one block — returns true on success */
  const saveBlock = useCallback(async (
    key: string, value: string, type = 'text',
  ): Promise<boolean> => {
    /* Snapshot previous value for rollback */
    const prev = blocksRef.current[key];

    /* Optimistic update */
    setBlocks(p => ({ ...p, [key]: value }));
    if (!inFlight.current.has(key)) {
      setUnsaved(n => n + 1);
      inFlight.current.add(key);
    }
    setSaveError('');

    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug: 'home', blockKey: key, blockType: type, value }),
      });

      inFlight.current.delete(key);
      setUnsaved(n => Math.max(0, n - 1));

      if (!res.ok) {
        /* Roll back optimistic update */
        setBlocks(p => {
          const next = { ...p };
          if (prev !== undefined) next[key] = prev;
          else delete next[key];
          return next;
        });

        if (res.status === 401) {
          setSaveError('انتهت جلسة الأدمن — يرجى تسجيل الدخول من جديد');
          /* Redirect to login after short delay */
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 2000);
        } else {
          const body = await res.json().catch(() => ({}));
          setSaveError((body as { error?: string }).error || 'فشل الحفظ');
        }
        return false;
      }

      return true;
    } catch {
      /* Network error — roll back */
      setBlocks(p => {
        const next = { ...p };
        if (prev !== undefined) next[key] = prev;
        else delete next[key];
        return next;
      });
      inFlight.current.delete(key);
      setUnsaved(n => Math.max(0, n - 1));
      setSaveError('خطأ في الشبكة — تحقق من الاتصال');
      return false;
    }
  }, []);

  /* Remove a block from DB (reset to default) */
  const resetBlock = useCallback(async (key: string) => {
    const res = await fetch('/api/cms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageSlug: 'home', blockKey: key }),
    });
    if (res.ok) {
      setBlocks(p => {
        const next = { ...p };
        delete next[key];
        return next;
      });
    }
  }, []);

  /* If ?edit=1 is in URL but user is not admin after auth resolves → redirect */
  useEffect(() => {
    if (authChecked && requestedEdit && !isAdmin) {
      window.location.href = '/admin/login';
    }
  }, [authChecked, requestedEdit, isAdmin]);

  return (
    <CmsContext.Provider value={{
      isAdmin, editMode, setEditMode,
      blocks, getBlock, saveBlock, resetBlock,
      unsaved, saveError,
    }}>
      {children}
      {/* Global save-error toast */}
      {saveError && (
        <div dir="rtl" style={{
          position:'fixed', bottom:24, insetInlineEnd:24, zIndex:999999,
          background:'#991b1b', color:'#fff',
          padding:'12px 20px', borderRadius:10,
          fontSize:'0.82rem', fontWeight:700,
          boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
          maxWidth:340,
        }}>
          ⚠️ {saveError}
        </div>
      )}
    </CmsContext.Provider>
  );
}

export const useCms = () => useContext(CmsContext);
