'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Map, AlertTriangle, FileText, Activity, Radio, BarChart3, LogOut, Menu, X, ChevronRight, Building2, Globe } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { DEMO_EMERGENCY_SOP, LANGUAGE_NAMES } from '@/lib/mockData';
import VoiceAssistant from '@/components/VoiceAssistant';
import ChatAssistant from '@/components/ChatAssistant';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, setLanguage, language, t } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/login'); }
  }, [user, router]);

  if (!user) return null;

  const NAV = [
    { href: '/admin/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/hotspots', label: t('gis_hotspots'), icon: Map },
    { href: '/admin/disease-intelligence', label: t('disease_intelligence'), icon: Activity },
    { href: '/admin/pest-intelligence', label: t('pest_intelligence'), icon: AlertTriangle },
    { href: '/admin/ai-analytics', label: t('ai_analytics'), icon: BarChart3 },
    { href: '/admin/emergency-sop', label: t('emergency_sop'), icon: Radio },
    { href: '/admin/users', label: t('users'), icon: Users },
    { href: '/admin/reports', label: t('reports'), icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* ── Sidebar ── always visible on lg+, slide-in on mobile */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-indigo-900
          border-r border-indigo-800
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              <Image src="/gramsathi-logo.jpg" alt="GramSathi" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">GramSathi</p>
              <p className="text-indigo-200 text-xs">{t('govt_portal') || 'Government Portal'}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-indigo-200 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Govt badge */}
        <div className="px-3 py-2.5 border-b border-indigo-800">
          <div className="px-3 py-2 bg-indigo-950/70 border border-indigo-700/60 rounded-xl">
            <p className="text-amber-300 text-xs font-bold">🏛️ {t('govt_maharashtra')}</p>
            <p className="text-indigo-200 text-xs">Agriculture Department</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-white text-indigo-950 shadow-md'
                    : 'text-indigo-100 hover:bg-indigo-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-700' : 'text-indigo-200'}`} />
                <span>{label}</span>
                {href === '/admin/emergency-sop' && DEMO_EMERGENCY_SOP.isActive && (
                  <span className="ml-auto w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Language selector */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-950/80 rounded-xl border border-indigo-700/60">
            <Globe className="w-4 h-4 text-indigo-300 flex-shrink-0" />
            <select value={language} onChange={e => setLanguage(e.target.value as any)}
              className="flex-1 bg-transparent text-white text-xs font-medium border-0 outline-none cursor-pointer">
              {Object.entries(LANGUAGE_NAMES).map(([k, v]) => <option key={k} value={k} className="text-gray-800">{v}</option>)}
            </select>
          </div>
        </div>

        {/* User footer */}
        <div className="border-t border-indigo-800 px-3 py-3">
          <div className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-indigo-800/70 cursor-pointer transition-colors">
            <div className="w-9 h-9 bg-indigo-700 border border-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
              {user.name.split(' ').map((w: string) => w[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{user.name}</p>
              <p className="text-indigo-200 text-xs">Administrator</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              title="Logout"
              className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-indigo-700/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb — desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <Link href="/admin/dashboard" className="text-slate-900 font-bold hover:text-indigo-600 hover:underline">
              {user.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/admin/dashboard" className="text-slate-600 font-medium hover:text-indigo-600 hover:underline">
              Dashboard
            </Link>
            {pathname !== '/admin/dashboard' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900">{NAV.find(n => n.href === pathname)?.label || 'Page'}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* SOP badge */}
            {DEMO_EMERGENCY_SOP.isActive && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-700 text-xs font-bold">SOP ACTIVE</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-700 text-xs font-bold">Live System</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <VoiceAssistant />
      <ChatAssistant />
    </div>
  );
}
