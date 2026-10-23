'use client';
import ExpertLayout from '@/components/layout/ExpertLayout';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { toast } from 'sonner';
import { CheckCircle2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { DISEASE_TREND_DATA } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QUEUE = [
  { id: 'DX-001', farmer: 'Ramesh Patil', location: 'Pune, MH', crop: 'Rice', aiResult: 'Leaf Blast', confidence: 92, priority: 'HIGH', stage: 'Tillering' },
  { id: 'DX-002', farmer: 'Vijay More', location: 'Nashik, MH', crop: 'Maize', aiResult: 'Fall Armyworm', confidence: 87, priority: 'HIGH', stage: 'Vegetative' },
  { id: 'DX-003', farmer: 'Sanjay Deshmukh', location: 'Aurangabad', crop: 'Soybean', aiResult: 'Leaf Spot', confidence: 75, priority: 'MEDIUM', stage: 'Flowering' },
  { id: 'DX-004', farmer: 'Rekha Shinde', location: 'Pune, MH', crop: 'Tomato', aiResult: 'Early Blight', confidence: 83, priority: 'MEDIUM', stage: 'Fruiting' },
  { id: 'DX-005', farmer: 'Anil Kumar', location: 'Ludhiana, PB', crop: 'Wheat', aiResult: 'Yellow Rust', confidence: 91, priority: 'HIGH', stage: 'Grain fill' },
];

type Verdict = 'confirmed' | 'rejected' | 'needs_info' | null;

export default function ExpertDashboard() {
  const { t } = useAuth();
  const [selectedCase, setSelectedCase] = useState<typeof QUEUE[0] | null>(null);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [severity, setSeverity] = useState('moderate');
  const [comments, setComments] = useState('');
  const [queue, setQueue] = useState(QUEUE);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comments.trim()) { toast.error('Please enter review comments.'); return; }
    if (!verdict) { toast.error('Please select a verdict.'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setQueue(prev => prev.filter(c => c.id !== selectedCase?.id));
    toast.success(`Review submitted for ${selectedCase?.farmer}. Farmer has been notified.`);
    setSelectedCase(null);
    setVerdict(null);
    setComments('');
    setSubmitting(false);
  };

  const stats = [
    { icon: '⏳', label: t('pending_reviews'), value: String(queue.length), color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' },
    { icon: '✅', label: t('completed_today'), value: '3', color: 'bg-green-50 border-green-200', text: 'text-green-700' },
    { icon: '🚨', label: t('high_priority'), value: '2', color: 'bg-red-50 border-red-200', text: 'text-red-700' },
    { icon: '📊', label: t('avg_confidence'), value: '88%', color: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  ];

  return (
    <ExpertLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('expert_dashboard') || 'Expert Dashboard'}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('expert_dashboard_sub')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`card p-4 border ${s.color}`}>
              <span className="text-2xl">{s.icon}</span>
              <p className={`text-3xl font-black mt-1 ${s.text}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Review Queue */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-4">{t('review_queue_title')} ({queue.length} {t('pending_cases') || 'pending'})</h2>
          {queue.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="font-bold text-gray-700">All cases reviewed!</p>
              <p className="text-gray-400 text-sm">Great work. No pending reviews.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map(c => (
                <div key={c.id} className={`border rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap hover:bg-gray-50 transition-colors ${c.priority === 'HIGH' ? 'border-red-200 bg-red-50/50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">{c.farmer.split(' ').map(w => w[0]).join('')}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{c.farmer} · {c.location}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{c.crop} · {c.stage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-xs">{c.aiResult}</p>
                      <p className="text-gray-400 text-xs">{c.confidence}% {t('confidence') || 'confidence'}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{t(c.priority.toLowerCase()) || c.priority}</span>
                    <button onClick={() => { setSelectedCase(c); setVerdict(null); setComments(''); }} className="btn-primary text-xs py-1.5 px-3">{t('review') || 'Review'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trend Charts */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Disease Trends (6 months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={DISEASE_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {['blast','blight','mildew','armyworm'].map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={['#ef4444','#f59e0b','#22c55e','#8b5cf6'][i]} strokeWidth={2} dot={false} name={key.charAt(0).toUpperCase() + key.slice(1)} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4 animate-slideUp">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Expert Review — {selectedCase.id}</h2>
              <button onClick={() => setSelectedCase(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Case Info */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-2 font-semibold uppercase">Farmer Info</p>
                  <p className="font-bold text-gray-800">{selectedCase.farmer}</p>
                  <p className="text-gray-500 text-sm">{selectedCase.location}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-2 font-semibold uppercase">AI Result</p>
                  <p className="font-bold text-gray-800">{selectedCase.aiResult}</p>
                  <p className="text-gray-500 text-sm">{selectedCase.crop} · {selectedCase.stage} · {selectedCase.confidence}% confidence</p>
                </div>
              </div>

              {/* Image placeholder */}
              <div className="bg-green-50 border border-green-200 rounded-xl h-32 flex items-center justify-center">
                <div className="text-center text-green-600">
                  <div className="text-4xl mb-1">🌿</div>
                  <p className="text-sm font-medium">Crop Image</p>
                  <p className="text-xs text-green-400">Submitted by farmer</p>
                </div>
              </div>

              {/* Verdict */}
              <div>
                <p className="font-semibold text-gray-800 mb-2">Expert Verdict *</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'confirmed' as Verdict, label: '✅ Confirm Diagnosis', color: 'bg-green-100 text-green-700 border-green-300' },
                    { val: 'rejected' as Verdict, label: '❌ Different Disease', color: 'bg-red-100 text-red-700 border-red-300' },
                    { val: 'needs_info' as Verdict, label: '❓ Needs More Info', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
                    { val: null, label: '🔵 Inconclusive', color: 'bg-blue-100 text-blue-700 border-blue-300' },
                  ].map(v => (
                    <button key={String(v.val)} onClick={() => setVerdict(v.val)}
                      className={`border rounded-xl py-2.5 text-sm font-semibold transition-all ${verdict === v.val ? v.color + ' ring-2 ring-offset-1 ring-current' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <p className="font-semibold text-gray-800 mb-2">Severity Assessment</p>
                <div className="flex gap-2">
                  {['mild','moderate','severe','critical'].map(s => (
                    <button key={s} onClick={() => setSeverity(s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${severity === s ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Expert Comments *</label>
                <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} placeholder="Describe your findings, confirm or correct the AI result, and provide management advice..." className="input-field" />
              </div>

              {/* AI Safety note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-amber-800 text-xs">⚠️ Your expert validation will be shown to the farmer. Do NOT prescribe specific chemical doses. Refer to official product labels and local authority guidance only.</p>
              </div>

              <button onClick={handleSubmit} disabled={submitting} className="w-full btn-primary py-3 text-base disabled:bg-gray-300">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : '✅ Submit Expert Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ExpertLayout>
  );
}
