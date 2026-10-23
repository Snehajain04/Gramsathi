'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ClipboardCheck, Activity, TrendingUp, BookOpen, FileText, LogOut, Menu, X, ChevronRight, Globe } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { LANGUAGE_NAMES } from '@/lib/mockData';
import VoiceAssistant from '@/components/VoiceAssistant';
import ChatAssistant from '@/components/ChatAssistant';

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, setLanguage, language, t } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'expert') { router.push('/login'); }
  }, [user, router]);

  if (!user) return null;

  const NAV = [
    { href: '/expert/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/expert/review-queue', label: t('review_queue'), icon: ClipboardCheck },
    { href: '/expert/diagnoses', label: t('my_diagnoses'), icon: Activity },
    { href: '/expert/trends', label: t('disease_trends'), icon: TrendingUp },
    { href: '/expert/advisories', label: t('advisories'), icon: BookOpen },
    { href: '/expert/reports', label: t('reports'), icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-purple-800 z-40 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image src="/gramsathi-logo.jpg" alt="GramSathi" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">GramSathi</p>
              <p className="text-purple-200 text-xs">{t('expert_portal') || 'Expert Portal'}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/70"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white text-purple-800 font-bold' : 'text-purple-100 hover:bg-purple-700 hover:text-white'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
                {href === '/expert/review-queue' && <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">5</span>}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-900/60 rounded-xl border border-purple-700/60">
            <Globe className="w-4 h-4 text-purple-200 flex-shrink-0" />
            <select value={language} onChange={e => setLanguage(e.target.value as any)}
              className="flex-1 bg-transparent text-white text-xs font-medium border-0 outline-none cursor-pointer">
              {Object.entries(LANGUAGE_NAMES).map(([k, v]) => <option key={k} value={k} className="text-gray-800">{v}</option>)}
            </select>
          </div>
        </div>
        <div className="border-t border-purple-700 px-3 py-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 bg-violet-400 rounded-full flex items-center justify-center text-white font-bold text-xs">{user.name.split(' ').map((w: string) => w[0]).join('')}</div>
            <div className="flex-1 min-w-0"><p className="text-white text-xs font-semibold truncate">{user.name}</p><p className="text-purple-200 text-xs">{t('role_expert') || 'Agricultural Expert'}</p></div>
            <button onClick={() => { logout(); router.push('/login'); }} className="text-purple-200 hover:text-white"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5 text-gray-600" /></button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <Link href="/expert/dashboard" className="text-purple-700 font-semibold hover:underline">
              {user.name}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/expert/dashboard" className="hover:text-purple-700 font-medium hover:underline">
              {t('dashboard')}
            </Link>
            {pathname !== '/expert/dashboard' && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="font-bold text-gray-800">{NAV.find(n => n.href === pathname)?.label || 'Page'}</span>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <VoiceAssistant />
      <ChatAssistant />
    </div>
  );
}
