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
  saveBlock:    (key: string, value: string, type?: string) => Promise<void>;
  resetBlock:   (key: string) => Promise<void>;
  unsaved:      number;
}

/* ─── Context ────────────────────────────────────────────── */
const CmsContext = createContext<CmsContextType>({
  isAdmin:     false,
  editMode:    false,
  setEditMode: () => {},
  blocks:      {},
  getBlock:    () => undefined,
  saveBlock:   async () => {},
  resetBlock:  async () => {},
  unsaved:     0,
});

/* ─── Provider ───────────────────────────────────────────── */
export function CmsProvider({ children }: { children: ReactNode }) {
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [blocks,   setBlocks]   = useState<Record<string, string>>({});
  const [unsaved,  setUnsaved]  = useState(0);
  const inFlight = useRef(new Set<string>());

  /* Check admin auth once on mount */
  useEffect(() => {
    fetch('/api/cms?action=checkAuth')
      .then(r => r.json())
      .then(d => setIsAdmin(d.isAdmin === true))
      .catch(() => {});
  }, []);

  /* Load CMS blocks for homepage */
  useEffect(() => {
    fetch('/api/cms?action=getBlocks&page=home')
      .then(r => r.json())
      .then(d => { if (d && typeof d === 'object') setBlocks(d); })
      .catch(() => {});
  }, []);

  const getBlock = useCallback((key: string) => blocks[key], [blocks]);

  /* Persist one block to DB */
  const saveBlock = useCallback(async (key: string, value: string, type = 'text') => {
    setBlocks(prev => ({ ...prev, [key]: value }));
    if (!inFlight.current.has(key)) {
      setUnsaved(n => n + 1);
      inFlight.current.add(key);
    }
    await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageSlug: 'home', blockKey: key, blockType: type, value }),
    });
    inFlight.current.delete(key);
    setUnsaved(n => Math.max(0, n - 1));
  }, []);

  /* Remove a block from DB (reset to default) */
  const resetBlock = useCallback(async (key: string) => {
    await fetch('/api/cms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageSlug: 'home', blockKey: key }),
    });
    setBlocks(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return (
    <CmsContext.Provider value={{ isAdmin, editMode, setEditMode, blocks, getBlock, saveBlock, resetBlock, unsaved }}>
      {children}
    </CmsContext.Provider>
  );
}

export const useCms = () => useContext(CmsContext);
