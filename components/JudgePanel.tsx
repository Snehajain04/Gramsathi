'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Award, X, ChevronDown, ChevronUp, ExternalLink, User, Briefcase, FlaskConical, ShieldCheck } from 'lucide-react';

// ── Demo credential sets ──────────────────────────────────────
const DEMO_ROLES = [
  {
    role: 'Farmer',
    emoji: '👨‍🌾',
    email: 'farmer@demo.com',
    password: 'demo123',
    href: '/farmer/dashboard',
    color: 'from-green-500 to-emerald-600',
    icon: User,
    features: ['AI Crop Diagnosis', 'Voice Advisory', 'Community Feed', 'Risk Forecast'],
  },
  {
    role: 'Extension Worker',
    emoji: '📋',
    email: 'extension@demo.com',
    password: 'demo123',
    href: '/extension/dashboard',
    color: 'from-blue-500 to-cyan-600',
    icon: Briefcase,
    features: ['Case Management', 'Field Visits', 'Hotspot View', 'Farmer Directory'],
  },
  {
    role: 'Agricultural Expert',
    emoji: '🔬',
    email: 'expert@demo.com',
    password: 'demo123',
    href: '/expert/dashboard',
    color: 'from-purple-500 to-violet-600',
    icon: FlaskConical,
    features: ['AI Review Queue', 'Trend Analysis', 'Expert Broadcast', 'Validation'],
  },
  {
    role: 'Admin / Govt',
    emoji: '🏛️',
    email: 'admin@demo.com',
    password: 'demo123',
    href: '/admin/dashboard',
    color: 'from-amber-500 to-orange-600',
    icon: ShieldCheck,
    features: ['GIS Intelligence', 'Outbreak Monitor', 'SOP Broadcast', 'Analytics'],
  },
];

const SIH_CHECKLIST = [
  '✅ AI Crop Diagnosis (Gemini Flash / Mock fallback)',
  '✅ Voice Advisory — 9 Indian languages (Web Speech API)',
  '✅ GIS Hotspot Map (Leaflet)',
  '✅ Radar Chart Dashboard (Recharts)',
  '✅ Community Alert Crowdfeed',
  '✅ Expert Validation Workflow',
  '✅ Multilingual i18n (9 languages)',
  '✅ PWA Manifest — works on 2G',
  '✅ XAI Explainable AI output',
  '✅ Emergency SOP Broadcast',
];

export default function JudgePanel() {
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  if (!open) return null;

  const copyCredentials = (email: string, pw: string, role: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${pw}`).catch(() => {});
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-80 shadow-2xl rounded-2xl overflow-hidden border border-amber-300/50 animate-slideInRight">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-white" />
          <div>
            <span className="font-bold text-white text-sm">GramSathi Demo Panel</span>
            <span className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">Evaluator Guide</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(o => !o)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
            title="Close judge panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="bg-white max-h-[70vh] overflow-y-auto">
          {/* Tagline */}
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
            <p className="text-amber-800 text-xs font-medium">
              🏆 GramSathi — Agriculture Intelligence Portal · Govt. of Maharashtra
            </p>
            <p className="text-amber-600 text-xs mt-0.5">Quick-access demo panel for evaluators</p>
          </div>

          {/* Role quick-access */}
          <div className="px-4 py-3 border-b border-gray-100">
            <h4 className="font-bold text-gray-800 text-xs mb-2.5 uppercase tracking-wider">
              Quick Role Access
            </h4>
            <div className="space-y-2">
              {DEMO_ROLES.map(r => {
                const Icon = r.icon;
                return (
                  <div key={r.role} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{r.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-semibold text-xs">{r.role}</p>
                      <p className="text-gray-400 text-[10px] truncate">{r.email} · {r.password}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyCredentials(r.email, r.password, r.role)}
                        className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors font-medium"
                      >
                        {copiedRole === r.role ? '✓' : 'Copy'}
                      </button>
                      <Link
                        href={r.href}
                        className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-gradient-to-r ${r.color} text-white rounded font-semibold hover:opacity-90 transition-opacity`}
                      >
                        Go <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature checklist */}
          <div className="px-4 py-3 border-b border-gray-100">
            <h4 className="font-bold text-gray-800 text-xs mb-2 uppercase tracking-wider">
              SIH Feature Checklist
            </h4>
            <div className="space-y-1">
              {SIH_CHECKLIST.map((item, i) => (
                <p key={i} className="text-xs text-gray-600">{item}</p>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="px-4 py-3">
            <h4 className="font-bold text-gray-800 text-xs mb-2 uppercase tracking-wider">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'Gemini 1.5 Flash', 'Recharts', 'Leaflet GIS', 'Web Speech API', 'PWA'].map(t => (
                <span key={t} className="text-[10px] font-semibold px-2 py-0.5 bg-gray-900 text-white rounded-md">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
