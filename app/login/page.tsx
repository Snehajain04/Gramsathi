'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Leaf, Shield, ArrowRight, Loader2, CheckCircle2, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';
import { LANGUAGE_NAMES } from '@/lib/mockData';
import type { Language } from '@/types';
import VoiceAssistant from '@/components/VoiceAssistant';

const DEMO_CREDS = [
  { roleKey: 'role_farmer', email: 'farmer@demo.com', badge: 'bg-green-100 text-green-700', dest: '/farmer/dashboard' },
  { roleKey: 'extension_worker', email: 'worker@demo.com', badge: 'bg-blue-100 text-blue-700', dest: '/extension/dashboard' },
  { roleKey: 'role_expert', email: 'expert@demo.com', badge: 'bg-purple-100 text-purple-700', dest: '/expert/dashboard' },
  { roleKey: 'role_admin', email: 'admin@demo.com', badge: 'bg-amber-100 text-amber-700', dest: '/admin/dashboard' },
];

const ROLE_DEST: Record<string, string> = {
  farmer: '/farmer/dashboard',
  extension_worker: '/extension/dashboard',
  expert: '/expert/dashboard',
  admin: '/admin/dashboard',
};

export default function LoginPage() {
  const router = useRouter();
  const { login, setLanguage, language, t } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filled, setFilled] = useState('');

  const fill = (cred: typeof DEMO_CREDS[0]) => {
    setEmail(cred.email);
    setPassword('demo123');
    setFilled(cred.email);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Enter both email and password.'); return; }
    setLoading(true);
    setError('');
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.success) { setError(result.error || 'Invalid credentials. Use demo123 as password.'); return; }
    toast.success('Welcome to GramSathi!');
    const saved = localStorage.getItem('gramsathi_user') || localStorage.getItem('cropshield_user');
    if (saved) {
      const u = JSON.parse(saved);
      router.push(ROLE_DEST[u.role] || '/farmer/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center shadow"><img src="/gramsathi-logo.jpg" alt="GramSathi" className="w-10 h-10 object-cover" /></div>
          <div><h1 className="text-xl font-bold text-white">GramSathi</h1><p className="text-green-200 text-xs">Agri Intelligence Portal</p></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6">🌾</div>
          <h2 className="text-3xl font-bold text-white mb-3">{t('hero_title') || 'See the Risk. Act Early.'}</h2>
          <p className="text-green-200 text-base max-w-sm mx-auto leading-relaxed">{t('hero_sub') || 'AI-powered crop disease detection and pest forecasting for 10,000+ Indian farmers.'}</p>
          <div className="flex justify-center gap-10 mt-8">
            {[{v:'93%',l:t('ai_detection_accuracy')},{v:'9',l:t('indian_languages')},{v:'24/7',l:t('monitoring')}].map(s => (
              <div key={s.l} className="text-center"><p className="text-2xl font-black text-lime-300">{s.v}</p><p className="text-green-200 text-xs">{s.l}</p></div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-green-300 text-sm text-center">Government of Maharashtra · Agriculture Department</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-yellow-50 px-4 py-10 relative">
        {/* Language selector in top corner */}
        <div className="w-full max-w-md flex justify-between items-center mb-4">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-xl overflow-hidden flex items-center justify-center shadow"><img src="/gramsathi-logo.jpg" alt="GramSathi" className="w-8 h-8 object-cover" /></div>
            <span className="font-bold text-green-800 text-lg">GramSathi</span>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-stone-200">
            <Globe className="w-4 h-4 text-green-700 flex-shrink-0" />
            <select value={language} onChange={e => setLanguage(e.target.value as Language)}
              className="bg-transparent text-gray-800 text-xs font-semibold border-0 outline-none cursor-pointer">
              {Object.entries(LANGUAGE_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{t('welcome_back')}</h2>
            <p className="text-gray-500 text-sm mb-6">{t('sign_in_sub')}</p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email_address')}</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" className="input-field pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold rounded-xl py-2.5 text-sm transition-all shadow-md">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t('signing_in')}</> : <>{t('sign_in_btn')}<ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div><div className="relative flex justify-center text-xs text-gray-400"><span className="bg-white px-3">{t('quick_demo_access')}</span></div></div>

            <div className="rounded-2xl border border-green-100 overflow-hidden text-xs">
              <div className="bg-green-50 px-3 py-2 flex justify-between text-green-700 font-semibold"><span>{t('role') || 'Role'}</span><span>{t('email_demo_label') || 'Email (demo123)'}</span></div>
              {DEMO_CREDS.map(c => (
                <button key={c.email} onClick={() => fill(c)} className={`w-full flex items-center justify-between px-3 py-2.5 border-t border-green-50 text-left hover:bg-green-50 transition-colors ${filled === c.email ? 'bg-green-100' : ''}`}>
                  <span className={`badge px-2 py-0.5 rounded-full font-semibold text-xs ${c.badge}`}>{t(c.roleKey) || c.roleKey}</span>
                  <span className="text-gray-500 font-mono">{c.email}</span>
                  {filled === c.email ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <ArrowRight className="w-3 h-3 text-gray-300" />}
                </button>
              ))}
              <p className="text-center text-gray-400 py-2 text-[11px]">{t('click_to_autofill')}</p>
            </div>

            <p className="mt-5 text-center text-xs text-gray-400">
              {t('dont_have_account')} <Link href="/register" className="text-green-700 font-semibold hover:underline">{t('register_here')}</Link>
            </p>
          </div>
        </div>
      </div>
      <VoiceAssistant />
    </div>
  );
}
