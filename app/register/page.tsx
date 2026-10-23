'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Leaf, Loader2, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';
import { LANGUAGE_NAMES } from '@/lib/mockData';
import type { Language, UserRole } from '@/types';
import VoiceAssistant from '@/components/VoiceAssistant';

const ROLE_DEST: Record<UserRole, string> = {
  farmer: '/farmer/dashboard',
  extension_worker: '/extension/dashboard',
  expert: '/expert/dashboard',
  admin: '/admin/dashboard',
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, setLanguage, language, t } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'farmer' as UserRole, language: 'en' as Language,
    phone: '', state: '', district: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles: { value: UserRole; label: string }[] = [
    { value: 'farmer', label: t('role_farmer') || 'Farmer' },
    { value: 'extension_worker', label: t('extension_worker') || 'Extension Worker' },
    { value: 'expert', label: t('role_expert') || 'Agricultural Expert' },
    { value: 'admin', label: t('role_admin') || 'Admin / Government' },
  ];

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'language') {
      setLanguage(value as Language);
    }
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await register({
      name: form.name, email: form.email, password: form.password,
      role: form.role, language: form.language, phone: form.phone,
      state: form.state, district: form.district,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed.');
      return;
    }

    toast.success('Account created successfully!');
    router.replace(ROLE_DEST[form.role]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-emerald-50 px-4 py-10">
      {/* Top Header with Logo & Language Selector */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-md">
            <img src="/gramsathi-logo.jpg" alt="GramSathi" className="w-10 h-10 object-cover" />
          </div>
          <span className="text-2xl font-extrabold text-green-800">GramSathi</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-stone-200">
          <Globe className="w-4 h-4 text-green-700 flex-shrink-0" />
          <select value={language} onChange={e => { update('language', e.target.value); setLanguage(e.target.value as Language); }}
            className="bg-transparent text-gray-800 text-xs font-semibold border-0 outline-none cursor-pointer">
            {Object.entries(LANGUAGE_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('create_your_account')}</h1>
              <p className="text-gray-500 text-sm">{t('register_sub')}</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4" noValidate>
            <div className="sm:col-span-2">
              <label className="field-label">{t('full_name')} *</label>
              <input required value={form.name} onChange={e => update('name', e.target.value)}
                className="input-field" placeholder="Enter your full name" autoComplete="name" />
            </div>

            <div>
              <label className="field-label">{t('email_address')} *</label>
              <input required type="email" value={form.email} onChange={e => update('email', e.target.value)}
                className="input-field" placeholder="you@example.com" autoComplete="email" />
            </div>

            <div>
              <label className="field-label">{t('phone')}</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                className="input-field" placeholder="+91 98765 43210" autoComplete="tel" />
            </div>

            <div>
              <label className="field-label">{t('password')} *</label>
              <div className="relative">
                <input required minLength={6} type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => update('password', e.target.value)} className="input-field pr-11"
                  placeholder="At least 6 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute inset-y-0 right-3 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label">{t('confirm_password')} *</label>
              <div className="relative">
                <input required type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)} className="input-field pr-11"
                  placeholder="Repeat password" autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-3 text-gray-400">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label">{t('account_type')} *</label>
              <select value={form.role} onChange={e => update('role', e.target.value)}
                className="input-field">
                {roles.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
              </select>
            </div>

            <div>
              <label className="field-label">{t('preferred_language')}</label>
              <select value={form.language} onChange={e => update('language', e.target.value)}
                className="input-field">
                {Object.entries(LANGUAGE_NAMES).map(([key, label]) =>
                  <option key={key} value={key}>{label}</option>
                )}
              </select>
            </div>

            <div>
              <label className="field-label">{t('state')}</label>
              <input value={form.state} onChange={e => update('state', e.target.value)}
                className="input-field" placeholder="e.g. Maharashtra" />
            </div>

            <div>
              <label className="field-label">{t('district')}</label>
              <input value={form.district} onChange={e => update('district', e.target.value)}
                className="input-field" placeholder="e.g. Pune" />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button disabled={loading} type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold rounded-xl py-3 transition-all shadow-md">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t('creating_account')}</> :
                  <>{t('create_account_btn')} <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('already_have_account')}{' '}
            <Link href="/login" className="text-green-700 font-semibold hover:underline">{t('login')}</Link>
          </p>
        </div>
      </div>
      <VoiceAssistant />
    </div>
  );
}
