'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCms } from '../contexts/CmsContext';
import { EditableText } from './cms/EditableText';
import { EditableImage } from './cms/EditableImage';

/* ─── Service Slides ──────────────────────────────────────── */
const SLIDES = [
  {
    badge:    'حلول الطباعة للشركات',
    h1:       'حلول',
    h1Grad:   'طباعة احترافية',
    h1Sub:    'للشركات والمكاتب',
    desc:     'أحبار BEC الأصلية وطابعات HP وCanon وBrother مع عقود توريد وصيانة مستمرة',
    cta1:     { label: '🖨️ حلول الطباعة', href: '#printer-card' },
    cta2:     { label: '🎮 تجميع Gaming',  href: '/gaming-build' },
    imageSrc: '/assets/hero-slide-printing.png',
    imgScale: 1.05,
  },
  {
    badge:    'تجميعات Gaming احترافية',
    h1:       'ابني',
    h1Grad:   'جهازك المثالي',
    h1Sub:    'بالمواصفات التي تريدها',
    desc:     'تجميعات Gaming مخصصة، لابتوبات Lenovo Legion بأحدث المعالجات وكروت الشاشة',
    cta1:     { label: '🎮 تجميع Gaming',    href: '/gaming-build' },
    cta2:     { label: '📞 تواصل معنا',      href: '#contact' },
    imageSrc: '/assets/hero-slide-gaming.png',
    imgScale: 1.05,
  },
  {
    badge:    'أجهزة وإكسسوارات',
    h1:       'أجهزة',
    h1Grad:   'أصلية معتمدة',
    h1Sub:    'للشركات والأفراد',
    desc:     'لابتوبات، سماعات، ساعات ذكية وإكسسوارات من أفضل العلامات العالمية',
    cta1:     { label: '💻 تصفح المنتجات', href: '/products' },
    cta2:     { label: '📞 تواصل معنا',    href: '#contact' },
    imageSrc: '/assets/hero-slide-devices.png',
    imgScale: 1.05,
  },
  {
    badge:    'الشبكات والدعم الفني',
    h1:       'دعم',
    h1Grad:   'فني متكامل',
    h1Sub:    'للشركات والمؤسسات',
    desc:     'إعداد شبكات، صيانة دورية، ودعم تقني متواصل يضمن استمرارية عملك',
    cta1:     { label: '📞 تواصل معنا', href: '#contact' },
    cta2:     { label: '💼 خدماتنا',    href: '#services' },
    imageSrc: '/assets/hero-slide-network.png',
    imgScale: 1.05,
  },
];

/* ─── Brand Ticker ────────────────────────────────────────── */
const BRANDS = ['Canon', 'HP', 'Epson', 'Brother', 'Lenovo', 'Dell', 'Asus', 'Samsung'];
function BrandTicker() {
  const track = [...BRANDS, ...BRANDS];
  return (
    <div className="w-full overflow-hidden select-none" style={{
      WebkitMaskImage: 'linear-gradient(to right,transparent,white 15%,white 85%,transparent)',
      maskImage:       'linear-gradient(to right,transparent,white 15%,white 85%,transparent)',
    }}>
      <div className="flex w-max" style={{ gap: 56, animation: 'hTicker 28s linear infinite' }}>
        {track.map((b, i) => (
          <span key={i} style={{ fontSize:'0.62rem', fontWeight:800, textTransform:'uppercase',
            letterSpacing:'0.3em', color:'rgba(255,255,255,0.55)', whiteSpace:'nowrap' }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Particle Canvas ─────────────────────────────────────── */
type Pt = { x:number; y:number; vx:number; vy:number; r:number; a:number };
function ParticleCanvas() {
  const cvs  = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const raf  = useRef<number>(0);
  const pts  = useRef<Pt[]>([]);
  const init = useCallback(() => {
    const c=cvs.current, w=wrap.current; if(!c||!w) return;
    const ctx=c.getContext('2d'); if(!ctx) return;
    const W=Math.floor(w.offsetWidth), H=Math.floor(w.offsetHeight);
    c.width=W; c.height=H;
    pts.current=Array.from({length:Math.min(50,Math.floor(W*H/15000))},()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
      r:Math.random()*1.1+.4, a:Math.random()*.22+.07,
    }));
  },[]);
  const draw = useCallback(()=>{
    const c=cvs.current, ctx=c?.getContext('2d'); if(!c||!ctx) return;
    const {width:W,height:H}=c;
    ctx.clearRect(0,0,W,H);
    const p=pts.current;
    for(let i=0;i<p.length;i++) for(let j=i+1;j<p.length;j++){
      const dx=p[i].x-p[j].x, dy=p[i].y-p[j].y, d=Math.hypot(dx,dy);
      if(d<130){ ctx.beginPath(); ctx.strokeStyle=`rgba(96,165,250,${.07*(1-d/130)})`; ctx.lineWidth=.5; ctx.moveTo(p[i].x,p[i].y); ctx.lineTo(p[j].x,p[j].y); ctx.stroke(); }
    }
    for(const pt of p){
      pt.x+=pt.vx; pt.y+=pt.vy;
      if(pt.x<0) pt.x=W; if(pt.x>W) pt.x=0;
      if(pt.y<0) pt.y=H; if(pt.y>H) pt.y=0;
      ctx.beginPath(); ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(96,165,250,${pt.a})`; ctx.fill();
    }
    raf.current=requestAnimationFrame(draw);
  },[]);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    init(); draw();
    const ro=new ResizeObserver(init); if(wrap.current) ro.observe(wrap.current);
    return ()=>{ ro.disconnect(); cancelAnimationFrame(raf.current); };
  },[init,draw]);
  return <div ref={wrap} className="absolute inset-0 pointer-events-none"><canvas ref={cvs} className="w-full h-full"/></div>;
}

/* ─── Props ───────────────────────────────────────────────── */
interface HeroProps {
  onContactClick?: () => void;
  titleOverride?:  string;
  subtitleOverride?: string;
  badgeOverride?:  string;
  descOverride?:   string;
  heroImages?: Array<{ img:string; label:string }>;
  heroImageSrc?:   string;
  titleHighlight?: string;
}

/* ─── Hero ────────────────────────────────────────────────── */
export function HeroSection(_props: HeroProps) {
  const [show,     setShow]     = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [slideIn,  setSlideIn]  = useState(true);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideToRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { dir } = useLanguage();
  const { getBlock } = useCms();

  useEffect(()=>{ const t=setTimeout(()=>setShow(true),80); return ()=>clearTimeout(t); },[]);

  /* Auto-cycle every 5 s */
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSlideIn(false);
      slideToRef.current = setTimeout(() => {
        setSlideIdx(i => (i + 1) % SLIDES.length);
        setSlideIn(true);
      }, 380);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current)  clearInterval(intervalRef.current);
      if (slideToRef.current)   clearTimeout(slideToRef.current);
    };
  }, [startTimer]);

  const goToSlide = (i: number) => {
    if (i === slideIdx) return;
    if (slideToRef.current) clearTimeout(slideToRef.current);
    setSlideIn(false);
    slideToRef.current = setTimeout(() => { setSlideIdx(i); setSlideIn(true); }, 380);
    startTimer();
  };

  const rawSlide = SLIDES[slideIdx];
  /* CMS overrides per slide */
  const sk = (k: string) => `hero.slide.${slideIdx}.${k}`;
  const slide = {
    ...rawSlide,
    badge:    getBlock(sk('badge'))    ?? rawSlide.badge,
    h1:       getBlock(sk('h1'))       ?? rawSlide.h1,
    h1Grad:   getBlock(sk('h1Grad'))   ?? rawSlide.h1Grad,
    h1Sub:    getBlock(sk('h1Sub'))    ?? rawSlide.h1Sub,
    desc:     getBlock(sk('desc'))     ?? rawSlide.desc,
    imageSrc: getBlock(sk('image'))    ?? rawSlide.imageSrc,
  };

  const appear = (d=0) => ({
    style: { transitionDelay:`${d}ms`, transitionDuration:'700ms' } as React.CSSProperties,
    className: `transition-all ${show?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`,
  });

  return (
    <section dir={dir} className="relative flex flex-col overflow-hidden"
      style={{ minHeight:'72vh', background:'linear-gradient(150deg,#030d1c 0%,#060f20 38%,#0a1528 70%,#040a18 100%)' }}>

      <style>{`
        @keyframes hTicker { to { transform: translateX(-50%); } }
        @keyframes hFloat  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-16px)} }
        @keyframes hPulse  { 0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.88;transform:translate(-50%,-50%) scale(1.06)} }
        @keyframes hPing   { 0%{transform:scale(1);opacity:.75} 100%{transform:scale(2.6);opacity:0} }
        .h-float { animation: hFloat 7s ease-in-out infinite; }
        .h-pulse { animation: hPulse 5s ease-in-out infinite; }
      `}</style>

      <ParticleCanvas />

      {/* Tech grid — fine */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:'linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)',
        backgroundSize:'68px 68px',
      }}/>
      {/* Tech grid — coarse */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:'linear-gradient(rgba(59,130,246,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.07) 1px,transparent 1px)',
        backgroundSize:'340px 340px',
      }}/>

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:'absolute', top:'-15%', right:'-12%', width:900, height:900, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(37,99,235,0.14) 0%,transparent 60%)' }}/>
        <div style={{ position:'absolute', bottom:'-18%', left:'-8%', width:650, height:650, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(79,70,229,0.10) 0%,transparent 58%)' }}/>
        <div style={{ position:'absolute', top:'30%', left:'38%', width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(30,64,175,0.08) 0%,transparent 60%)' }}/>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none z-10"
        style={{ height:120, background:'linear-gradient(to top,#030d1c,transparent)' }}/>

      {/* ════ MAIN ════ */}
      <div className="relative z-10 flex-1 flex items-center"
        style={{ padding:'6rem 1.5rem 3rem' }}>
        <div className="w-full" style={{ maxWidth:1380, margin:'0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center"
            style={{ gap:'clamp(2rem,5vw,5rem)' }}>

            {/* ── IMAGE ── */}
            <div {...appear(140)} className="flex items-center justify-center">
              <div style={{ position:'relative', width:'100%', maxWidth:960 }}>
                <div className="h-pulse" style={{
                  position:'absolute', left:'50%', top:'50%',
                  transform:'translate(-50%,-50%)',
                  width:'95%', height:'80%',
                  background:'radial-gradient(ellipse,rgba(37,99,235,0.52) 0%,rgba(79,70,229,0.20) 40%,transparent 70%)',
                  filter:'blur(90px)', borderRadius:'50%',
                  pointerEvents:'none', zIndex:0,
                }}/>
                <div style={{
                  position:'absolute', left:'10%', bottom:'-4%',
                  width:'80%', height:'22%',
                  background:'radial-gradient(ellipse,rgba(37,99,235,0.38) 0%,transparent 70%)',
                  filter:'blur(38px)', borderRadius:'50%',
                  pointerEvents:'none', zIndex:0,
                }}/>
                {/* Image — screen blend removes dark/white bg, only glowing product stays */}
                <EditableImage
                  blockKey={sk('image')}
                  defaultSrc={rawSlide.imageSrc}
                  alt={slide.badge}
                  className="h-float"
                  imgStyle={{
                    position:'relative', zIndex:1,
                    display:'block',
                    width:'100%', height:580,
                    objectFit:'contain',
                    transform:`scale(${rawSlide.imgScale})`,
                    transformOrigin:'center center',
                    mixBlendMode: 'screen',
                    filter:'brightness(1.6) contrast(1.05) saturate(1.25) drop-shadow(0 0 60px rgba(37,99,235,0.9)) drop-shadow(0 0 120px rgba(96,165,250,0.55))',
                    opacity: slideIn ? 1 : 0,
                    transition: 'opacity 0.38s ease',
                  }}
                />
              </div>
            </div>

            {/* ── TEXT ── */}
            <div {...appear(0)} style={{ display:'flex', flexDirection:'column', textAlign: dir==='rtl'?'right':'left', position:'relative' }}>

              {/* ── Slide content — fades on change ── */}
              <div style={{
                transition: 'opacity 0.38s ease, transform 0.38s ease',
                opacity:   slideIn ? 1 : 0,
                transform: slideIn ? 'translateY(0)' : 'translateY(14px)',
              }}>

                {/* Badge */}
                <div style={{ marginBottom:'1.8rem' }}>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:9,
                    padding:'10px 24px', borderRadius:999,
                    border:'1px solid rgba(96,165,250,0.28)',
                    background:'rgba(37,99,235,0.10)',
                    color:'#93c5fd', fontSize:'1rem', fontWeight:700, letterSpacing:'0.05em',
                  }}>
                    <span style={{ position:'relative', display:'inline-flex', width:8, height:8, flexShrink:0 }}>
                      <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#60a5fa',
                        animation:'hPing 2.2s ease-out infinite' }}/>
                      <span style={{ position:'relative', width:8, height:8, borderRadius:'50%',
                        background:'#60a5fa', boxShadow:'0 0 10px #60a5fa' }}/>
                    </span>
                    <EditableText blockKey={sk('badge')} defaultValue={rawSlide.badge} tag="span" />
                  </span>
                </div>

                {/* H1 */}
                <div style={{ marginBottom:'1.2rem', position:'relative', zIndex:1 }}>
                  <h1 style={{ fontWeight:900, lineHeight:1.06, letterSpacing:'-0.02em',
                    margin:0, fontSize:'clamp(2.8rem,5.5vw,5rem)' }}>
                    <EditableText blockKey={sk('h1')} defaultValue={rawSlide.h1} tag="span" style={{ display:'block', color:'#fff' }} />
                    <EditableText blockKey={sk('h1Grad')} defaultValue={rawSlide.h1Grad} tag="span" style={{ display:'block',
                      backgroundImage:'linear-gradient(125deg,#60a5fa 0%,#3b82f6 45%,#818cf8 100%)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                    }} />
                    <EditableText blockKey={sk('h1Sub')} defaultValue={rawSlide.h1Sub} tag="span" style={{ display:'block', color:'rgba(255,255,255,0.65)' }} />
                  </h1>
                </div>

                {/* Divider */}
                <div style={{ marginBottom:'1.5rem', position:'relative', zIndex:1 }}>
                  <div style={{ width:48, height:3, borderRadius:99, background:'linear-gradient(90deg,#3b82f6,#818cf8)' }}/>
                </div>

                {/* Description */}
                <div style={{ marginBottom:'2rem', position:'relative', zIndex:1 }}>
                  <EditableText blockKey={sk('desc')} defaultValue={rawSlide.desc} tag="p" multiline
                    style={{ color:'rgba(255,255,255,0.40)', fontSize:'1rem', lineHeight:1.85, maxWidth:'30rem', margin:0 }} />
                </div>

                {/* CTAs */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:'1.4rem', position:'relative', zIndex:1 }}>
                  <a href={slide.cta1.href}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:9,
                      padding:'14px 28px', borderRadius:13, fontWeight:700, fontSize:'0.9rem',
                      color:'#fff', textDecoration:'none',
                      background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
                      boxShadow:'0 8px 26px rgba(37,99,235,0.45)',
                    }}>
                    {slide.cta1.label}
                  </a>
                  <a href={slide.cta2.href}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:9,
                      padding:'14px 28px', borderRadius:13, fontWeight:700, fontSize:'0.9rem',
                      color:'rgba(255,255,255,0.82)', textDecoration:'none',
                      background:'rgba(255,255,255,0.06)',
                      backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
                      border:'1px solid rgba(255,255,255,0.14)',
                    }}>
                    {slide.cta2.label}
                  </a>
                </div>

                {/* Slide indicators */}
                <div style={{ display:'flex', gap:8, marginBottom:'1.8rem' }}>
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      aria-label={`الشريحة ${i + 1}`}
                      style={{
                        height: 4, borderRadius: 99, padding: 0, border: 'none', cursor: 'pointer',
                        width: i === slideIdx ? 36 : 8,
                        background: i === slideIdx ? '#60a5fa' : 'rgba(255,255,255,0.18)',
                        transition: 'all 0.35s ease',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

              </div>{/* end slide content */}

              {/* Stats — always visible, outside slide fade */}
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:'1.6rem',
                  display:'flex', flexWrap:'wrap', gap:'2.4rem' }}>
                  {[
                    { val:'+7',   lbl:'سنوات خبرة',        clr:'#60a5fa' },
                    { val:'+50',  lbl:'عميل شركة',          clr:'#34d399' },
                    { val:'∞',    lbl:'عقود طباعة مستمرة', clr:'#a78bfa' },
                    { val:'+500', lbl:'منتج',               clr:'#fb923c' },
                  ].map(s=>(
                    <div key={s.lbl}>
                      <div style={{ color:s.clr, fontWeight:900, fontSize:'1.9rem', lineHeight:1, letterSpacing:'-0.02em' }}>{s.val}</div>
                      <div style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.75rem', fontWeight:500, marginTop:5 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Brand ticker */}
      <div className="relative z-10" style={{ padding:'0 1.5rem 2rem' }}>
        <p style={{ textAlign:'center', fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.3em',
          textTransform:'uppercase', color:'rgba(255,255,255,0.45)', marginBottom:'0.5rem', userSelect:'none' }}>
          علامات نثق بها
        </p>
        <BrandTicker />
      </div>
    </section>
  );
}
