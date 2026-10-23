'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield, Leaf, Camera, CloudRain, MapPin, UserCheck, BookOpen,
  Globe, Users, Target, ChevronRight, Star, Zap, CheckCircle2,
  Wheat, AlertTriangle, X, Menu, Mic, Brain, BarChart3,
  Smartphone, Award, TrendingUp, Bug
} from 'lucide-react';
import { LANGUAGE_NAMES } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';
import dynamic from 'next/dynamic';

const CommunityFeed = dynamic(() => import('@/components/CommunityFeed'), { ssr: false });
const CropRiskRadar = dynamic(() => import('@/components/CropRiskRadar'), { ssr: false });
const GovernmentSchemesCard = dynamic(() => import('@/components/GovernmentSchemesCard'), { ssr: false });
const LocalPrecautionsCard = dynamic(() => import('@/components/LocalPrecautionsCard'), { ssr: false });
const FarmerNewsCard = dynamic(() => import('@/components/FarmerNewsCard'), { ssr: false });
const GramSathiSchemeFinder = dynamic(() => import('@/components/GramSathiSchemeFinder'), { ssr: false });
const VoiceAssistant = dynamic(() => import('@/components/VoiceAssistant'), { ssr: false });

// ── Animated counter hook ──────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return count;
}

// ── Floating leaf particle component ──────────────────────────
function FloatingLeaf({ delay, left, size }: { delay: number; left: number; size: number }) {
  return (
    <div
      className="absolute pointer-events-none opacity-25 animate-leafFall"
      style={{
        left: `${left}%`,
        top: '-20px',
        fontSize: `${size}px`,
        '--leaf-delay': `${delay}s`,
        '--leaf-duration': `${9 + (size % 4)}s`,
      } as React.CSSProperties}
    >
      {size % 3 === 0 ? '🍃' : '🌿'}
    </div>
  );
}

export default function LandingPage() {
  const { language, setLanguage, t } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sopDismissed, setSopDismissed] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Intersection Observer for stats counter animation
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count1 = useCountUp(10847, 2200, statsVisible);
  const count2 = useCountUp(93, 1500, statsVisible);
  const count3 = useCountUp(9, 1000, statsVisible);
  const count4 = useCountUp(312, 2000, statsVisible);

  const tickerItems = [
    t('ticker_1'),
    t('ticker_2'),
    t('ticker_3'),
    t('ticker_4'),
    t('ticker_5'),
    t('ticker_6'),
    t('ticker_7'),
  ];
  const tickerText = tickerItems.join('  ·  ');

  const features = [
    { icon: Camera, title: t('feat_ai_diag_title'), desc: t('feat_ai_diag_desc'), color: 'bg-green-100 text-green-700', badge: 'Computer Vision' },
    { icon: CloudRain, title: t('feat_weather_title'), desc: t('feat_weather_desc'), color: 'bg-blue-100 text-blue-700', badge: 'Predictive AI' },
    { icon: MapPin, title: t('feat_gis_title'), desc: t('feat_gis_desc'), color: 'bg-red-100 text-red-700', badge: 'Geospatial' },
    { icon: UserCheck, title: t('feat_expert_title'), desc: t('feat_expert_desc'), color: 'bg-purple-100 text-purple-700', badge: 'Human-in-loop' },
    { icon: BookOpen, title: t('feat_ipm_title'), desc: t('feat_ipm_desc'), color: 'bg-orange-100 text-orange-700', badge: 'Safe Inputs' },
    { icon: Globe, title: t('feat_multilingual_title'), desc: t('feat_multilingual_desc'), color: 'bg-teal-100 text-teal-700', badge: 'Voice TTS' },
  ];

  const uniqueFeatures = [
    { icon: Brain, title: t('diff_xai_title'), desc: t('diff_xai_desc'), color: 'from-violet-500 to-purple-600' },
    { icon: Mic, title: t('diff_voice_title'), desc: t('diff_voice_desc'), color: 'from-blue-500 to-cyan-600' },
    { icon: Users, title: t('diff_community_title'), desc: t('diff_community_desc'), color: 'from-green-500 to-emerald-600' },
    { icon: BarChart3, title: t('diff_dashboard_title'), desc: t('diff_dashboard_desc'), color: 'from-amber-500 to-orange-600' },
    { icon: Smartphone, title: t('diff_pwa_title'), desc: t('diff_pwa_desc'), color: 'from-rose-500 to-pink-600' },
  ];

  const roles = [
    { title: t('role_farmer'), emoji: '👨‍🌾', desc: t('role_farmer_desc'), color: 'from-green-500 to-emerald-600', href: '/login' },
    { title: t('role_extension'), emoji: '📋', desc: t('role_extension_desc'), color: 'from-blue-500 to-cyan-600', href: '/login' },
    { title: t('role_expert'), emoji: '🔬', desc: t('role_expert_desc'), color: 'from-purple-500 to-violet-600', href: '/login' },
    { title: t('role_admin'), emoji: '🏛️', desc: t('role_admin_desc'), color: 'from-amber-500 to-orange-600', href: '/login' },
  ];

  const testimonials = [
    { name: 'Ramesh Patil', location: 'Pune, Maharashtra', quote: t('test_quote_1'), rating: 5, crop: 'Rice' },
    { name: 'Sunita Devi', location: 'Muzaffarpur, Bihar', quote: t('test_quote_2'), rating: 5, crop: 'Wheat' },
    { name: 'Venkatesh Reddy', location: 'Kurnool, Andhra Pradesh', quote: t('test_quote_3'), rating: 5, crop: 'Cotton' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Emergency SOP Banner */}
      {!sopDismissed && (
        <div className="bg-gradient-to-r from-red-700 to-red-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 z-50 relative">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-blinkDot" />
            <p className="text-sm font-medium truncate">
              <span className="font-bold">🚨 {t('emergency_advisory')} — </span>
              {t('sop_banner_text')}{' '}
              <Link href="/login" className="underline font-semibold">{t('view_sop')}</Link>
            </p>
          </div>
          <button onClick={() => setSopDismissed(true)} className="p-1 rounded hover:bg-red-800 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Alert Ticker */}
      <div className="bg-green-900 text-green-100 py-2 overflow-hidden relative ticker-wrap">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-r-lg z-10 relative">
            {t('live_badge')}
          </div>
          <div
            className="animate-ticker inline-flex gap-12 whitespace-nowrap text-xs font-medium"
            onMouseEnter={() => setTickerPaused(true)}
            onMouseLeave={() => setTickerPaused(false)}
            style={{ animationPlayState: tickerPaused ? 'paused' : 'running' }}
          >
            <span>{tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-md border border-green-100">
              <img src="/gramsathi-logo.jpg" alt="GramSathi" className="w-10 h-10 object-cover" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-tight block">
                Gram<span className="text-gradient">Sathi</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {[
              { href: '#how-it-works', label: t('nav_how_it_works') },
              { href: '#features', label: t('nav_features') },
              { href: '#schemes-news', label: t('nav_schemes_news') },
              { href: '#unique', label: t('nav_why_us') },
              { href: '#roles', label: t('nav_for_whom') },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-gray-600 hover:text-green-700 font-medium text-sm transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-green-400"
            >
              {Object.entries(LANGUAGE_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <Link href="/login" className="px-4 py-2 text-green-700 font-semibold text-sm border border-green-200 rounded-xl hover:bg-green-50 transition-all">{t('login')}</Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">{t('get_started_free')}</Link>
          </div>

          <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 animate-slideDown space-y-2">
            <Link href="/login" className="block btn-primary text-center py-2.5">{t('login')}</Link>
            <Link href="/register" className="block btn-outline text-center py-2.5">{t('get_started_free')}</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-hero-gradient pt-14 pb-24 relative overflow-hidden">
        {/* Floating leaves */}
        {[...Array(8)].map((_, i) => (
          <FloatingLeaf key={i} delay={i * 2.1} left={10 + i * 11} size={16 + (i % 3) * 6} />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-slideInLeft">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-xl leading-relaxed">
              {t('hero_sub')}
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all text-base">
                <Camera className="w-5 h-5" /> {t('diagnose_my_crop')}
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all text-base shadow-sm">
                <Shield className="w-5 h-5" /> {t('check_crop_risk')}
              </Link>
            </div>

            {/* Quick role buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { icon: '👨‍🌾', label: t('role_farmer'), color: 'bg-green-50 text-green-800 border-green-200' },
                { icon: '📋', label: t('role_extension'), color: 'bg-blue-50 text-blue-800 border-blue-200' },
                { icon: '🔬', label: t('role_expert'), color: 'bg-purple-50 text-purple-800 border-purple-200' },
                { icon: '🏛️', label: t('role_admin'), color: 'bg-amber-50 text-amber-800 border-amber-200' },
              ].map(r => (
                <Link key={r.label} href="/login" className={`inline-flex items-center gap-1.5 px-3 py-2 font-semibold rounded-lg border text-sm hover:scale-105 transition-all ${r.color}`}>
                  <span>{r.icon}</span> {r.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {[t('free_for_farmers'), t('works_on_2g'), t('govt_maharashtra'), t('expert_validated'), t('voice_tts')].map(tItem => (
                <div key={tItem} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>{tItem}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Scanning Card */}
          <div className="animate-slideInRight">
            <div className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 rounded-3xl p-6 shadow-2xl border border-emerald-700/40 max-w-sm mx-auto animate-float">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-blinkDot" />
                  <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">{t('ai_scanning_live')}</span>
                </div>
                <span className="text-white/50 text-xs">GramSathi v2.1</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-green-900/60 h-36 border border-emerald-700/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wheat className="w-16 h-16 text-green-400/40" />
                </div>
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scanLine" style={{ top: '50%' }} />
                <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 px-3 py-2">
                  <p className="text-emerald-300 text-xs font-semibold">⚠️ {t('leaf_blast_detected')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: t('disease_risk'), val: t('high'), color: 'text-red-400 bg-red-400/20' },
                  { label: t('pest_risk'), val: t('medium'), color: 'text-yellow-400 bg-yellow-400/20' },
                  { label: t('weather_risk'), val: t('high'), color: 'text-orange-400 bg-orange-400/20' },
                ].map(r => (
                  <div key={r.label} className={`${r.color} rounded-xl px-2 py-2 text-center border border-white/10`}>
                    <p className="text-xs font-bold text-white/90">{r.label}</p>
                    <p className={`text-sm font-black ${r.color.split(' ')[0]}`}>{r.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-xl p-3 mb-3">
                <p className="text-white/50 text-xs">{t('crop_health_score')}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="w-full bg-white/20 rounded-full h-2 mr-3">
                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '72%' }} />
                  </div>
                  <span className="text-white font-bold text-sm">72%</span>
                </div>
              </div>
              {/* Voice Advisory indicator */}
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <Mic className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200 text-xs">{t('voice_advisory_available')}</span>
              </div>
              <p className="text-white/30 text-xs mt-3 text-center">{t('preliminary_warning')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="bg-green-gradient py-14" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { val: `${count1.toLocaleString()}+`, label: t('farmers_supported'), icon: '👨‍🌾', sub: t('across_maharashtra') },
            { val: `${count2}%`, label: t('ai_detection_accuracy'), icon: '🎯', sub: t('expert_validated_sub') },
            { val: count3.toString(), label: t('indian_languages'), icon: '🌐', sub: t('including_voice_tts') },
            { val: `${count4}+`, label: t('crop_reports_filed'), icon: '📊', sub: t('this_season') },
          ].map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="text-white font-extrabold text-3xl mb-1 animate-countUp">{s.val}</div>
              <div className="text-green-100 text-sm font-medium">{s.label}</div>
              <div className="text-green-300 text-xs mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-3">{t('how_it_works_title')}</h2>
          <p className="section-sub mb-14">{t('how_it_works_sub')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: t('how_step_1_title'), desc: t('how_step_1_desc'), icon: '📷' },
              { step: '2', title: t('how_step_2_title'), desc: t('how_step_2_desc'), icon: '🤖' },
              { step: '3', title: t('how_step_3_title'), desc: t('how_step_3_desc'), icon: '📋' },
              { step: '4', title: t('how_step_4_title'), desc: t('how_step_4_desc'), icon: '✅' },
            ].map(s => (
              <div key={s.step} className="card p-6 card-hover relative overflow-hidden">
                <div className="absolute top-3 right-3 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-black text-sm">
                  {s.step}
                </div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-3">{t('features_title')}</h2>
          <p className="section-sub mb-14">{t('features_sub')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-6 card-hover border border-gray-100 relative overflow-hidden">
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{f.badge}</span>
                  <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  <Link href="/login" className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold mt-4 hover:gap-2 transition-all">
                    {t('explore')} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Government Schemes, Local Precautions & Latest Farmer News */}
      <section id="schemes-news" className="py-20 bg-gradient-to-b from-gray-50 via-emerald-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-800 text-sm font-semibold mb-4">
              {t('govt_assistance_tag')}
            </div>
            <h2 className="section-heading">{t('govt_assistance_title')}</h2>
            <p className="section-sub">
              {t('govt_assistance_sub')}
            </p>
          </div>

          <div className="space-y-8">
            <GramSathiSchemeFinder />
            <LocalPrecautionsCard />
            <GovernmentSchemesCard />
            <FarmerNewsCard />
          </div>
        </div>
      </section>

      {/* Unique Features / Why Us */}
      <section id="unique" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 border border-amber-200 rounded-full text-amber-800 text-sm font-semibold mb-4">
              <Award className="w-4 h-4" /> {t('unique_tag')}
            </div>
            <h2 className="section-heading">{t('unique_title')}</h2>
            <p className="section-sub">{t('unique_sub')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={`gradient-border p-6 card-hover ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-3">{t('roles_title')}</h2>
          <p className="section-sub mb-14">{t('roles_sub')}</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {roles.map(r => (
              <div key={r.title} className="card p-6 card-hover border border-gray-100 flex flex-col">
                <div className={`w-14 h-14 bg-gradient-to-br ${r.color} rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-md`}>{r.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{r.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{r.desc}</p>
                <Link href={r.href} className="mt-4 btn-primary text-center text-sm py-2.5">{t('login_as')} {r.title}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Alert Feed + Radar Chart */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 border border-green-200 rounded-full text-green-800 text-sm font-semibold mb-4">
              <Users className="w-4 h-4" /> {t('community_tag')}
            </div>
            <h2 className="section-heading">{t('community_title')}</h2>
            <p className="section-sub">{t('community_sub')}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <CommunityFeed maxItems={3} />
            <CropRiskRadar
              title={t('live_risk_intel')}
              showNPK={true}
              soilN={62}
              soilP={45}
              soilK={71}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading mb-14">{t('testimonials_title')}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(tItem => (
              <div key={tItem.name} className="card p-6 border border-green-100">
                <div className="flex mb-3">
                  {[...Array(tItem.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{tItem.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                    {tItem.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{tItem.name}</p>
                    <p className="text-gray-400 text-xs">{tItem.location} · {tItem.crop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {t('cta_title')}
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            {t('cta_sub')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="px-8 py-3.5 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:bg-green-50 transition-all text-base hover:scale-105">
              🚀 {t('get_started_free')}
            </Link>
            <Link href="/login" className="px-8 py-3.5 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-base">
              🔑 {t('demo_login')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-700" />
              </div>
              <span className="font-bold text-xl">GramSathi</span>
            </div>
            <p className="text-green-300 text-sm mb-2">{t('tagline')}</p>
            <p className="text-green-400 text-xs">{t('footer_sub')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-8">
            {[
              { label: t('role_farmer'), href: '/login' },
              { label: t('role_extension'), href: '/login' },
              { label: t('role_expert'), href: '/login' },
              { label: t('role_admin'), href: '/login' },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-green-300 hover:text-white text-sm transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-green-800 pt-6 text-center">
            <p className="text-green-500 text-xs">{t('footer_warning')}</p>
          </div>
        </div>
      </footer>
      <VoiceAssistant />
    </div>
  );
}
