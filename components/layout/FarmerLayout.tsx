'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Tractor, Camera, TrendingUp, Bug, BookOpen, Activity, HelpCircle, Bell, LogOut, Menu, X, Globe, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { DEMO_EMERGENCY_SOP, LANGUAGE_NAMES } from '@/lib/mockData';
import VoiceAssistant from '@/components/VoiceAssistant';
import ChatAssistant from '@/components/ChatAssistant';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, setLanguage, language, t } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sopDismissed, setSopDismissed] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'farmer') { router.push('/login'); }
  }, [user, router]);

  const handleLogout = () => { logout(); router.push('/login'); };

  if (!user) return null;

  const NAV = [
    { href: '/farmer/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/farmer/farms', label: t('my_farms'), icon: Tractor },
    { href: '/farmer/diagnose', label: t('diagnose'), icon: Camera },
    { href: '/farmer/risk-forecast', label: t('risk_forecast'), icon: TrendingUp },
    { href: '/farmer/pest-reports', label: t('pest_reports'), icon: Bug },
    { href: '/farmer/advisories', label: t('advisories'), icon: BookOpen },
    { href: '/farmer/monitoring', label: t('monitoring'), icon: Activity },
    { href: '/farmer/expert-help', label: t('expert_help'), icon: HelpCircle },
    { href: '/farmer/notifications', label: t('notifications'), icon: Bell },
  ];

  const BOTTOM_NAV = [
    { href: '/farmer/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/farmer/diagnose', label: t('diagnose'), icon: Camera },
    { href: '/farmer/risk-forecast', label: t('risk_forecast'), icon: TrendingUp },
    { href: '/farmer/farms', label: t('my_farms'), icon: Tractor },
    { href: '/farmer/notifications', label: t('notifications'), icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-green-800 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-green-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image src="/gramsathi-logo.jpg" alt="GramSathi" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">GramSathi</p>
              <p className="text-green-300 text-xs">{t('farmer_portal') || 'Farmer Portal'}</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white text-green-800 font-bold' : 'text-green-100 hover:bg-green-700 hover:text-white'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
                {href === '/farmer/notifications' && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">3</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-900/60 rounded-xl border border-green-700/60">
            <Globe className="w-4 h-4 text-green-300 flex-shrink-0" />
            <select value={language} onChange={e => setLanguage(e.target.value as any)}
              className="flex-1 bg-transparent text-white text-xs font-medium border-0 outline-none cursor-pointer">
              {Object.entries(LANGUAGE_NAMES).map(([k, v]) => <option key={k} value={k} className="text-gray-800">{v}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-green-700 px-3 py-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-green-700/50 cursor-pointer">
            <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center text-green-900 font-bold text-xs">{user.name.split(' ').map(w => w[0]).join('')}</div>
            <div className="flex-1 min-w-0"><p className="text-white text-xs font-semibold truncate">{user.name}</p><p className="text-green-300 text-xs capitalize">{t('role_farmer') || 'Farmer'}</p></div>
            <button onClick={handleLogout} title="Logout" className="text-green-300 hover:text-white transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5 text-gray-600" /></button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <Link href="/farmer/dashboard" className="text-green-700 font-semibold hover:underline flex items-center gap-1">
              🏠 {user.name}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/farmer/dashboard" className="hover:text-green-700 font-medium hover:underline">
              {t('dashboard')}
            </Link>
            {pathname !== '/farmer/dashboard' && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="font-bold text-gray-800">{NAV.find(n => n.href === pathname)?.label || 'Page'}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/farmer/notifications" className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{user.name.split(' ').map(w => w[0]).join('')}</div>
          </div>
        </header>

        {DEMO_EMERGENCY_SOP.isActive && !sopDismissed && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-bold text-sm">🏛️ {t('emergency_advisory')}</p>
                <p className="text-amber-700 text-xs mt-0.5 font-medium">
                  {(DEMO_EMERGENCY_SOP.translations[language as keyof typeof DEMO_EMERGENCY_SOP.translations] || DEMO_EMERGENCY_SOP.translations.en)?.message}
                </p>
                <p className="text-amber-600 text-xs mt-1">Issued by: {DEMO_EMERGENCY_SOP.adminName} · {DEMO_EMERGENCY_SOP.sentAt.split('T')[0]} · Regions: {DEMO_EMERGENCY_SOP.targetRegions.join(', ')}</p>
              </div>
            </div>
            <button onClick={() => setSopDismissed(true)} className="text-amber-500 hover:text-amber-700 flex-shrink-0"><X className="w-4 h-4" /></button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">{children}</main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 flex">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${active ? 'text-green-700 font-bold' : 'text-gray-400'}`}>
                <Icon className={`w-5 h-5 ${active ? 'text-green-700' : 'text-gray-400'}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <VoiceAssistant />
      <ChatAssistant />
    </div>
  );
}
