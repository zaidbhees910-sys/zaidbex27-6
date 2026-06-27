'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

const FEATURES = [
  { icon: '🔧', title: 'أحدث القطع والتقنيات',          desc: 'نستخدم فقط أحدث المعالجات وكروت الشاشة من أفضل العلامات العالمية.' },
  { icon: '🎯', title: 'تجميع احترافي وترتيب داخلي',   desc: 'تجميع دقيق ومنظّم مع إدارة كابلات احترافية وتبريد مثالي.' },
  { icon: '⚙️', title: 'مواصفات مناسبة لاحتياجك',      desc: 'نساعدك تختار القطع الأنسب لميزانيتك واستخداماتك.' },
  { icon: '🚀', title: 'أداء قوي وتجربة مميزة',          desc: 'أجهزة تشغّل أقوى الألعاب والتطبيقات بأعلى إعدادات.' },
  { icon: '🤝', title: 'دعم قبل وبعد الشراء',            desc: 'فريقنا معك من الاستشارة حتى ما بعد الاستلام.' },
];

const SECTIONS = [
  {
    tag: 'Gaming Performance',
    title: 'أجهزة Gaming خارقة',
    emoji: '🎮',
    desc: 'تجميعات مجهزة بأحدث المعالجات وكروت الشاشة لتقديم تجربة لعب قوية وسلسة مع أعلى جودة ممكنة.',
    img: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1200&q=85',
    accent: '#818cf8',
    glow: 'rgba(129,140,248,0.35)',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    reverse: false,
  },
  {
    tag: 'Custom Build',
    title: 'تجميع حسب طلبك',
    emoji: '⚙️',
    desc: 'اختر استخدامك وميزانيتك ونحن نختار لك أفضل القطع ونقوم بالتجميع والتركيب باحتراف.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.30)',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    reverse: true,
  },
  {
    tag: 'Work & Study',
    title: 'أجهزة للعمل والدراسة',
    emoji: '💻',
    desc: 'أجهزة سريعة وموثوقة للبرمجة، التصميم، المونتاج والاستخدام اليومي.',
    img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=85',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.30)',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    reverse: false,
  },
];

export default function GamingBuildPage() {
  return (
    <div className="min-h-screen bg-[#05080f] text-white" dir="rtl">
      <Navbar />

      <style>{`
        @keyframes gbFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes gbPulse  { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes gbScan   { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes gbGlow   { 0%,100%{box-shadow:0 0 20px rgba(129,140,248,0.4)} 50%{box-shadow:0 0 45px rgba(129,140,248,0.8)} }
        .gb-float { animation: gbFloat 6s ease-in-out infinite; }
        .gb-pulse { animation: gbPulse 4s ease-in-out infinite; }
        .gb-glow  { animation: gbGlow  3s ease-in-out infinite; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 60% 30%,rgba(99,102,241,0.18) 0%,transparent 65%)' }}/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 40% at 20% 80%,rgba(34,211,238,0.08) 0%,transparent 60%)' }}/>
          {/* Grid */}
          <div style={{ position:'absolute', inset:0,
            backgroundImage:'linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px)',
            backgroundSize:'60px 60px' }}/>
          {/* Scan line */}
          <div style={{ position:'absolute', left:0, right:0, height:2,
            background:'linear-gradient(90deg,transparent,rgba(129,140,248,0.4),transparent)',
            animation:'gbScan 8s linear infinite', top:0 }}/>
        </div>

        <div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div className="text-right order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-bold mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block"/>
                Gaming Premium · BEC
              </span>

              <h1 className="font-black leading-[1.05] mb-6" style={{ fontSize:'clamp(2.8rem,5.5vw,5rem)' }}>
                <span className="block text-white">ابنِ جهازك</span>
                <span className="block" style={{
                  backgroundImage:'linear-gradient(125deg,#818cf8 0%,#6366f1 40%,#22d3ee 80%)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                }}>المثالي معنا 🚀</span>
              </h1>

              <p className="text-white/50 text-base leading-relaxed mb-8 max-w-lg">
                نوفر لك خدمة تجميع أقوى وأحدث أجهزة الكمبيوتر الجيمنج المصممة لتشغيل أقوى الألعاب بأفضل أداء، مع إمكانية بناء جهاز خاص بك حسب احتياجاتك وميزانيتك.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="#contact-gaming"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background:'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow:'0 8px 32px rgba(99,102,241,0.45)' }}>
                  🚀 اطلب تجميعتك الآن
                </Link>
                <Link href="/products?category=gaming&sort=price-desc"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white/80 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5">
                  🎮 تصفح الأجهزة
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/8">
                {[
                  { val:'+500', lbl:'منتج', clr:'#818cf8' },
                  { val:'+50',  lbl:'عميل شركة', clr:'#22d3ee' },
                  { val:'7+',   lbl:'سنوات خبرة', clr:'#a78bfa' },
                ].map(s => (
                  <div key={s.lbl}>
                    <div style={{ color:s.clr, fontWeight:900, fontSize:'2rem', lineHeight:1 }}>{s.val}</div>
                    <div className="text-white/30 text-xs mt-1">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative gb-float">
                <div className="absolute -inset-6 rounded-full pointer-events-none gb-pulse"
                  style={{ background:'radial-gradient(ellipse,rgba(99,102,241,0.45) 0%,rgba(34,211,238,0.15) 40%,transparent 70%)', filter:'blur(40px)' }}/>
                <img
                  src="https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=900&q=90"
                  alt="Gaming PC"
                  className="relative z-10 rounded-3xl object-cover w-full max-w-[520px]"
                  style={{ boxShadow:'0 0 60px rgba(99,102,241,0.3), 0 30px 80px rgba(0,0,0,0.6)', aspectRatio:'4/3' }}
                />
                {/* Corner accents */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-400/60 rounded-tr-lg pointer-events-none"/>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-lg pointer-events-none"/>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ SECTIONS ══════════════════════════════════════════════ */}
      {SECTIONS.map((sec, i) => (
        <section key={i} className="py-24 px-6 lg:px-10 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute pointer-events-none" style={{
            [sec.reverse ? 'left' : 'right']: '-10%', top:'20%',
            width:500, height:500, borderRadius:'50%',
            background:`radial-gradient(circle,${sec.glow} 0%,transparent 65%)`,
            filter:'blur(60px)',
          }}/>

          <div className="relative z-10 max-w-[1380px] mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${sec.reverse ? 'lg:[direction:ltr]' : ''}`}>

              {/* Text */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold mb-5 ${sec.badge}`}>
                  {sec.tag}
                </span>
                <h2 className="font-black mb-5" style={{ fontSize:'clamp(2rem,4vw,3rem)', lineHeight:1.1 }}>
                  <span className="text-white">{sec.title} </span>
                  <span>{sec.emoji}</span>
                </h2>
                <p className="text-white/45 text-base leading-relaxed max-w-md">{sec.desc}</p>

                <div className="mt-8 h-[2px] w-16 rounded-full" style={{ background:`linear-gradient(90deg,${sec.accent},transparent)` }}/>
              </div>

              {/* Image */}
              <div className={sec.reverse ? 'lg:order-first' : ''}>
                <div className="relative rounded-3xl overflow-hidden"
                  style={{ boxShadow:`0 0 50px ${sec.glow}, 0 20px 60px rgba(0,0,0,0.5)`, aspectRatio:'16/10' }}>
                  <img src={sec.img} alt={sec.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"/>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:'linear-gradient(to top,rgba(5,8,15,0.5) 0%,transparent 50%)' }}/>
                </div>
              </div>

            </div>
          </div>
        </section>
      ))}

      {/* ══ FEATURES ══════════════════════════════════════════════ */}
      <section className="py-24 px-6 lg:px-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize:'60px 60px' }}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse,rgba(99,102,241,0.10),transparent 70%)', filter:'blur(60px)' }}/>

        <div className="relative z-10 max-w-[1380px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 border border-indigo-500/20 px-5 py-2 rounded-full mb-5">
              مميزاتنا
            </span>
            <h2 className="font-black text-4xl md:text-5xl text-white">لماذا تختارنا؟ ⭐</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="group relative rounded-2xl p-7 border border-white/6 bg-white/[0.03] backdrop-blur-sm hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-400 hover:-translate-y-1 text-right overflow-hidden"
                style={{ boxShadow:'0 4px 30px rgba(0,0,0,0.3)' }}>
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                  style={{ background:'radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.12),transparent 70%)' }}/>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl"
                    style={{ background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)' }}>
                    {f.icon}
                  </div>
                  <h3 className="font-black text-white text-lg mb-3">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════ */}
      <section id="contact-gaming" className="relative py-28 px-6 overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="w-full h-full object-cover opacity-[0.12]"
          />
          <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom,#05080f 0%,rgba(5,8,15,0.5) 40%,rgba(5,8,15,0.5) 60%,#05080f 100%)' }}/>
          {/* Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px]"
            style={{ background:'radial-gradient(ellipse,rgba(99,102,241,0.22) 0%,rgba(34,211,238,0.08) 50%,transparent 75%)', filter:'blur(60px)' }}/>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full mb-6">
            ابدأ الآن
          </span>
          <h2 className="font-black text-white mb-6" style={{ fontSize:'clamp(2.5rem,5vw,4rem)', lineHeight:1.05 }}>
            جاهز تبني جهازك؟ 🔥
          </h2>
          <p className="text-white/40 text-lg mb-10 leading-relaxed">
            تواصل معنا الآن وسنساعدك ببناء جهاز أحلامك بأفضل المواصفات وأنسب الأسعار.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#contact"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1 gb-glow"
              style={{ background:'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow:'0 8px 32px rgba(99,102,241,0.5)' }}>
              📞 تواصل معنا للطلب والاستفسار
            </Link>
            <Link href="/products?category=gaming&sort=price-desc"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-white/80 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
              🎮 تصفح الأجهزة
            </Link>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <div className="border-t border-white/6 py-8 text-center text-white/20 text-sm">
        © {new Date().getFullYear()} BEC — Banyas Electronics Co.
      </div>
    </div>
  );
}
