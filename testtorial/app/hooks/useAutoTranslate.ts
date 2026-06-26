'use client';

import { useState, useEffect, useRef } from 'react';
import { translateText } from '../../lib/translate';

/** Translate a single string. Returns the original while translating. */
export function useAutoTranslate(text: string, lang: string): string {
  const [out, setOut] = useState(text);
  const prev = useRef('');

  useEffect(() => {
    const key = `${lang}:${text}`;
    if (key === prev.current) return;
    prev.current = key;

    setOut(text); // show original immediately
    if (lang === 'ar' || !text?.trim()) return;

    let active = true;
    translateText(text, lang).then(t => { if (active) setOut(t); });
    return () => { active = false; };
  }, [text, lang]);

  return out;
}

/** Translate a Record of strings in one effect. Keys are preserved; only values are translated. */
export function useAutoTranslateBatch(
  texts: Record<string, string>,
  lang: string,
): Record<string, string> {
  const [out, setOut] = useState<Record<string, string>>(texts);
  const serialised = JSON.stringify(texts);
  const prev = useRef('');

  useEffect(() => {
    const key = `${lang}:${serialised}`;
    if (key === prev.current) return;
    prev.current = key;

    setOut(texts); // reset to originals first
    if (lang === 'ar') return;

    let active = true;
    Promise.all(
      Object.entries(texts).map(([k, v]) =>
        translateText(v, lang).then(t => [k, t] as [string, string]),
      ),
    ).then(pairs => {
      if (active) setOut(Object.fromEntries(pairs));
    });
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, serialised]);

  return out;
}
