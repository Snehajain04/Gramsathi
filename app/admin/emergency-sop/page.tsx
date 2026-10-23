'use client';
import AdminLayout from '@/components/layout/AdminLayout';
import { useState } from 'react';
import { DEMO_EMERGENCY_SOP, LANGUAGE_NAMES } from '@/lib/mockData';
import { toast } from 'sonner';
import { Radio, AlertTriangle, X, CheckCircle2, Send } from 'lucide-react';
import type { Language } from '@/types';

const LANGS: Language[] = ['en','hi','mr','te','ta','kn','bn','pa','or'];
const SEVERITIES = [
  { val: 'advisory', label: 'Advisory', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { val: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { val: 'critical', label: 'Critical', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { val: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-700 border-red-300' },
];

const STATES = ['Maharashtra','Punjab','Andhra Pradesh','Telangana','Odisha','Karnataka','West Bengal','Tamil Nadu','Bihar','Gujarat','Rajasthan','Madhya Pradesh'];
const CROPS_LIST = ['Rice','Wheat','Maize','Cotton','Tomato','Sugarcane','Soybean','Groundnut','Onion','Potato'];

const HISTORY = [
  { title: 'Pink Bollworm Alert — Cotton', sev: 'warning', regions: 'Vidarbha', sent: '2024-08-01', reach: '3,240', status: 'Active' },
  { title: 'Locust Advisory — Rajasthan Border', sev: 'critical', regions: 'Rajasthan, Gujarat', sent: '2024-07-15', reach: '8,100', status: 'Expired' },
  { title: 'BLB Risk — Kharif Rice', sev: 'advisory', regions: 'Odisha, WB', sent: '2024-07-02', reach: '5,600', status: 'Expired' },
  { title: 'FAW Emergency — Maize Belt', sev: 'emergency', regions: 'Karnataka, Telangana', sent: '2024-06-18', reach: '2,870', status: 'Expired' },
  { title: 'Wheat Rust Advisory — Rabi', sev: 'advisory', regions: 'Punjab, Haryana', sent: '2024-03-10', reach: '12,000', status: 'Expired' },
];

const SEV_BADGE: Record<string, string> = {
  advisory: 'bg-blue-900/30 text-blue-300',
  warning: 'bg-yellow-900/30 text-yellow-300',
  critical: 'bg-orange-900/30 text-orange-300',
  emergency: 'bg-red-900/30 text-red-300',
};

export default function EmergencySOPPage() {
  const [severity, setSeverity] = useState('warning');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [crops, setCrops] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState(false);

  const toggleRegion = (r: string) => setRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  const toggleCrop = (c: string) => setCrops(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) { toast.error('Enter a title and message first.'); return; }
    if (regions.length === 0) { toast.error('Select at least one target region.'); return; }
    setConfirmModal(true);
  };

  const confirmSend = async () => {
    setConfirmModal(false);
    await new Promise(r => setTimeout(r, 800));
    const reach = regions.length * Math.floor(Math.random() * 1000 + 500);
    toast.success(`✅ Emergency SOP broadcast sent to ${reach.toLocaleString()} farmers in ${regions.join(', ')}!`, { duration: 6000 });
    setTitle(''); setMessage(''); setRegions([]); setCrops([]);
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 text-white max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Radio className="w-6 h-6 text-red-400 animate-blinkDot" /> Emergency SOP Broadcaster</h1>
          <p className="text-gray-400 text-sm mt-1">Broadcast emergency agricultural advisories to farmers across regions</p>
        </div>

        {/* Active SOP */}
        {DEMO_EMERGENCY_SOP.isActive && (
          <div className="bg-red-950/60 border border-red-800/60 rounded-2xl p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 animate-blinkDot" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-700 text-red-200 text-xs font-bold px-2 py-0.5 rounded-full">🔴 ACTIVE SOP</span>
                    <span className="text-gray-400 text-xs">Sent: {DEMO_EMERGENCY_SOP.sentAt.split('T')[0]}</span>
                  </div>
                  <p className="font-bold text-white text-lg">{DEMO_EMERGENCY_SOP.title}</p>
                  <p className="text-gray-300 text-sm mt-1 max-w-xl leading-relaxed">{DEMO_EMERGENCY_SOP.message}</p>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="bg-gray-800 px-2 py-1 rounded-lg text-gray-300">Regions: {DEMO_EMERGENCY_SOP.targetRegions.join(', ')}</span>
                    <span className="bg-gray-800 px-2 py-1 rounded-lg text-gray-300">Crops: {DEMO_EMERGENCY_SOP.targetCrops?.join(', ') || 'All Crops'}</span>
                    <span className="bg-gray-800 px-2 py-1 rounded-lg text-gray-300">Translations: 9/9 languages</span>
                    <span className="bg-gray-800 px-2 py-1 rounded-lg text-gray-300">Reach: ~2,847 farmers</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success('SOP extended by 7 days.')} className="px-3 py-2 bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-600">Extend</button>
                <button onClick={() => toast.info('SOP deactivated.')} className="px-3 py-2 bg-red-700 text-white rounded-xl text-sm font-semibold hover:bg-red-800">Deactivate</button>
              </div>
            </div>

            {/* Translations preview */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGS.slice(0, 6).map(lang => {
                const tr = DEMO_EMERGENCY_SOP.translations[lang as keyof typeof DEMO_EMERGENCY_SOP.translations];
                return tr ? (
                  <div key={lang} className="bg-gray-900/50 rounded-xl p-2">
                    <p className="text-gray-400 text-xs font-semibold">{LANGUAGE_NAMES[lang]}</p>
                    <p className="text-gray-300 text-xs mt-0.5 line-clamp-2">{tr.message}</p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Create New SOP */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
          <h2 className="font-bold text-white text-lg">📢 Send New Emergency Advisory</h2>

          {/* Severity */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">Severity Level</p>
            <div className="grid grid-cols-4 gap-2">
              {SEVERITIES.map(s => (
                <button key={s.val} onClick={() => setSeverity(s.val)}
                  className={`border rounded-xl py-2 text-xs font-bold transition-all ${severity === s.val ? s.color + ' ring-2 ring-current ring-offset-1 ring-offset-gray-900' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">Advisory Title (English) *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., High Fall Armyworm Risk in Kharif Maize" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none focus:border-green-500" />
          </div>

          {/* Message */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">Advisory Message (English) *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Detailed advisory message for farmers..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none focus:border-green-500 resize-none" />
          </div>

          {/* Target Regions */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">Target States/Regions *</p>
            <div className="flex flex-wrap gap-2">
              {STATES.map(s => (
                <button key={s} onClick={() => toggleRegion(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${regions.includes(s) ? 'bg-green-600 text-white border-green-600' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Target Crops */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">Target Crops</p>
            <div className="flex flex-wrap gap-2">
              {CROPS_LIST.map(c => (
                <button key={c} onClick={() => toggleCrop(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${crops.includes(c) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Translation notice */}
          <div className="bg-green-900/30 border border-green-800/50 rounded-xl p-3 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-xs">Auto-translation to 9 Indian languages is enabled. Messages will be translated using AI and sent in each farmer's preferred language.</p>
          </div>

          <button onClick={handleSend} className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg text-base">
            <Send className="w-5 h-5" /> Send to All Farmers in Selected Regions
          </button>
        </div>

        {/* History Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="font-bold text-white text-lg mb-4">Broadcast History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-gray-400 text-xs font-semibold border-b border-gray-800">
                <th className="text-left pb-2">Title</th>
                <th className="text-left pb-2">Severity</th>
                <th className="text-left pb-2">Regions</th>
                <th className="text-left pb-2">Sent</th>
                <th className="text-left pb-2">Reach</th>
                <th className="text-left pb-2">Status</th>
              </tr></thead>
              <tbody>
                {HISTORY.map((h, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-3 text-gray-300 text-xs">{h.title}</td>
                    <td className="py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SEV_BADGE[h.sev]}`}>{h.sev}</span></td>
                    <td className="py-3 text-gray-400 text-xs">{h.regions}</td>
                    <td className="py-3 text-gray-400 text-xs">{h.sent}</td>
                    <td className="py-3 text-gray-300 text-xs">{h.reach}</td>
                    <td className="py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${h.status === 'Active' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slideUp">
            <div className="text-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white">Confirm Broadcast</h2>
              <p className="text-gray-400 text-sm mt-2">This will send an emergency alert to all farmers in: <strong className="text-white">{regions.join(', ')}</strong></p>
              <p className="text-red-400 text-xs mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(false)} className="flex-1 border border-gray-700 text-gray-300 font-semibold rounded-xl py-2.5 hover:bg-gray-800 text-sm">Cancel</button>
              <button onClick={confirmSend} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-2.5 text-sm">Send Now</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
