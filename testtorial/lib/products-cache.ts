/**
 * Module-level client-side cache for the products list.
 * Lives in the JS module scope → persists across SPA navigations without
 * re-fetching, just like a global variable. TTL of 60 s prevents stale data.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
let _data: any[] | null = null;
let _ts = 0;
const TTL_MS = 60_000;

export async function fetchAllProducts(): Promise<any[]> {
  if (_data && Date.now() - _ts < TTL_MS) return _data;
  const res = await fetch('/api?action=getProducts');
  const json = await res.json();
  _data = Array.isArray(json) ? json : [];
  _ts = Date.now();
  return _data;
}

export function invalidateProductsCache(): void {
  _data = null;
  _ts = 0;
}
