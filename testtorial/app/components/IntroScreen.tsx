'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function IntroScreen({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const { tr } = useLanguage();

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 520);
    const t3 = setTimeout(() => setStage(3), 820);

    let raf: number;
    const t4 = setTimeout(() => {
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const p = Math.min(100, ((now - start) / dur) * 100);
        setProgress(p);
        if (p < 100) {
          raf = requestAnimationFrame(tick);
        } else {
          setTimeout(() => {
            setExiting(true);
            setTimeout(onDone, 800);
          }, 250);
        }
      };
      raf = requestAnimationFrame(tick);
    }, 820);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(raf);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#080C18] flex flex-col items-center justify-center transition-transform duration-700 ease-in ${
        exiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <style>{`
        @keyframes intro-ping {
          0%   { transform: scale(1);    opacity: 0.5; }
          70%  { transform: scale(1.18); opacity: 0;   }
          100% { transform: scale(1.18); opacity: 0;   }
        }
        .intro-ping { animation: intro-ping 2s ease-out infinite; }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-blue-600/20 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] bg-cyan-500/10 rounded-full blur-[60px]" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-blue-500/30 rounded-tr-xl opacity-60" />
      <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-blue-500/30 rounded-tl-xl opacity-60" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-blue-500/30 rounded-br-xl opacity-60" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-blue-500/30 rounded-bl-xl opacity-60" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Logo box */}
        <div
          className={`mb-8 transition-all duration-700 ease-out ${
            stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-[28px] bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]">
              <span className="text-5xl font-black text-white tracking-tight select-none" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                BEC
              </span>
            </div>
            {/* Pulse ring */}
            <div className="intro-ping absolute inset-0 rounded-[28px] border-2 border-blue-400/40" />
          </div>
        </div>

        {/* Brand name */}
        <div
          className={`mb-10 transition-all duration-700 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">{tr('about_h2_1')}</h1>
          <p
            className="text-sm font-semibold tracking-[0.25em] uppercase"
            style={{
              background: 'linear-gradient(90deg, #60a5fa, #a5f3fc, #60a5fa)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Banyas Electronics Co.
          </p>
        </div>

        {/* Progress bar */}
        <div
          className={`w-56 transition-all duration-500 ${
            stage >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #22d3ee, #3b82f6)',
                boxShadow: '0 0 10px rgba(96,165,250,0.9)',
                transition: 'none',
              }}
            />
          </div>
          <p className="text-center text-white/25 text-[11px] mt-3 tracking-[0.2em] uppercase font-medium select-none">
            {tr('intro_loading')}
          </p>
        </div>
      </div>
    </div>
  );
}
