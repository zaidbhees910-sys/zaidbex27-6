/* eslint-disable @typescript-eslint/no-explicit-any */
let _data: any[] | null = null;
let _ts = 0;
const TTL_MS = 60_000;

export async function fetchAllProducts(): Promise<any[]> {
  if (_data && Date.now() - _ts < TTL_MS) return _data;
  try {
    const res = await fetch('/api?action=getProducts');
    const json = await res.json();
    if (Array.isArray(json)) {
      _data = json;
      _ts = Date.now();
    }
  } catch { /* serve stale data on transient network failure */ }
  return _data ?? [];
}

export function invalidateProductsCache(): void {
  _data = null;
  _ts = 0;
}
