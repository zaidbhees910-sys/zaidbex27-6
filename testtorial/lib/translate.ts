// Module-level cache — survives across React renders, cleared on page reload
const _cache = new Map<string, string>();

/**
 * Translate text using Google Translate's unofficial endpoint.
 * Falls back to the original text on any error.
 */
export async function translateText(
  text: string,
  toLang: string,
  fromLang = 'ar',
): Promise<string> {
  if (!text?.trim() || toLang === fromLang || toLang === 'ar') return text;

  const cacheKey = `${fromLang}→${toLang}:${text}`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey)!;

  try {
    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t` +
      `&q=${encodeURIComponent(text)}`;

    const res = await fetch(url);
    if (!res.ok) return text;

    const data = await res.json();
    // Response: [[[translated, original, ...], ...], ...]
    const result = (data[0] as [string][]).map(([s]) => s).join('');
    _cache.set(cacheKey, result);
    return result;
  } catch {
    return text;
  }
}
