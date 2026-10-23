'use client';

import { useState } from 'react';
import ExpertLayout from '@/components/layout/ExpertLayout';
import { toast } from 'sonner';
import { CheckCircle2, X, AlertTriangle, Loader2, Filter, Search, ShieldCheck } from 'lucide-react';
import { getRiskBgClass } from '@/lib/riskEngine';

const INITIAL_QUEUE = [
  { id: 'DX-101', farmer: 'Ramesh Patil', location: 'Pune, Maharashtra', crop: 'Rice', stage: 'Tillering', aiResult: 'Rice Leaf Blast', confidence: 92, priority: 'HIGH', date: '2024-08-05', symptoms: ['Diamond lesions', 'Gray centers', 'Yellow halo'] },
  { id: 'DX-102', farmer: 'Vijay More', location: 'Nashik, Maharashtra', crop: 'Maize', stage: 'Vegetative', aiResult: 'Fall Armyworm', confidence: 87, priority: 'HIGH', date: '2024-08-05', symptoms: ['Shot-holes', 'Frass in whorl', 'Windowing'] },
  { id: 'DX-103', farmer: 'Sanjay Deshmukh', location: 'Aurangabad, Maharashtra', crop: 'Soybean', stage: 'Flowering', aiResult: 'Soybean Rust', confidence: 78, priority: 'MEDIUM', date: '2024-08-04', symptoms: ['Brown pustules', 'Lower leaf yellowing'] },
  { id: 'DX-104', farmer: 'Rekha Shinde', location: 'Pune, Maharashtra', crop: 'Tomato', stage: 'Fruiting', aiResult: 'Early Blight', confidence: 84, priority: 'MEDIUM', date: '2024-08-04', symptoms: ['Target board spots', 'Concentric rings'] },
  { id: 'DX-105', farmer: 'Anil Kumar', location: 'Ludhiana, Punjab', crop: 'Wheat', stage: 'Grain filling', aiResult: 'Yellow Rust', confidence: 93, priority: 'HIGH', date: '2024-08-03', symptoms: ['Linear yellow stripes', 'Pustules on leaf veins'] },
  { id: 'DX-106', farmer: 'Pooja Reddy', location: 'Krishna, Andhra Pradesh', crop: 'Rice', stage: 'Heading', aiResult: 'Bacterial Leaf Blight', confidence: 89, priority: 'HIGH', date: '2024-08-03', symptoms: ['Wavy margins', 'Milky ooze', 'Tip drying'] },
  { id: 'DX-107', farmer: 'Gopal Sahu', location: 'Sambalpur, Odisha', crop: 'Rice', stage: 'Tillering', aiResult: 'Sheath Blight', confidence: 76, priority: 'LOW', date: '2024-08-02', symptoms: ['Oval greenish-gray spots', 'Lower leaf sheath'] },
];

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState<typeof INITIAL_QUEUE[0] | null>(null);
  const [verdict, setVerdict] = useState<'confirmed' | 'rejected' | 'inconclusive' | 'needs_more_info'>('confirmed');
  const [confirmedDisease, setConfirmedDisease] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = queue.filter(item => {
    const matchPri = filterPriority === 'ALL' || item.priority === filterPriority;
    const matchSearch = item.farmer.toLowerCase().includes(search.toLowerCase()) ||
      item.crop.toLowerCase().includes(search.toLowerCase()) ||
      item.aiResult.toLowerCase().includes(search.toLowerCase());
    return matchPri && matchSearch;
  });

  const handleOpenReview = (c: typeof INITIAL_QUEUE[0]) => {
    setSelectedCase(c);
    setConfirmedDisease(c.aiResult);
    setVerdict('confirmed');
    setSeverity(c.priority === 'HIGH' ? 'severe' : 'moderate');
    setComments(`AI prediction for ${c.aiResult} verified based on visual leaf symptom cluster.`);
  };

  const handleSubmitReview = async () => {
    if (!comments.trim()) {
      toast.error('Please enter scientific management advice for the farmer.');
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));

    setQueue(prev => prev.filter(c => c.id !== selectedCase?.id));
    toast.success(`Verification submitted for ${selectedCase?.farmer}! Farmer has received the official expert stamp.`);
    setSubmitting(false);
    setSelectedCase(null);
  };

  return (
    <ExpertLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-purple-700" /> AI Review Queue
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Review and validate preliminary computer vision diagnoses before official farmer advisories are confirmed.
            </p>
          </div>
          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full self-start">
            {queue.length} Cases Pending
          </span>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search farmer, crop, disease..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(pri => (
              <button
                key={pri}
                onClick={() => setFilterPriority(pri)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterPriority === pri
                    ? 'bg-purple-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {pri}
              </button>
            ))}
          </div>
        </div>

        {/* Queue List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-lg">No cases pending in this category</h3>
              <p className="text-gray-500 text-sm mt-1">All farmer inquiries have been addressed.</p>
            </div>
          ) : (
            filtered.map(c => (
              <div
                key={c.id}
                className="card p-5 border-l-4 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-purple-600"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{c.id}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      c.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.priority} PRIORITY
                    </span>
                    <span className="text-xs text-gray-400">📅 {c.date}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{c.farmer}</h3>
                    <span className="text-xs text-gray-500">· {c.location}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Target: <strong className="text-gray-800">{c.crop}</strong> ({c.stage} stage)
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.symptoms.map(s => (
                      <span key={s} className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400">AI Assessment</p>
                    <p className="font-bold text-gray-800 text-sm">{c.aiResult}</p>
                    <p className="text-xs text-green-600 font-semibold">{c.confidence}% Match</p>
                  </div>
                  <button
                    onClick={() => handleOpenReview(c)}
                    className="btn-primary bg-purple-700 hover:bg-purple-800 py-2 px-4 text-xs shadow-sm"
                  >
                    Perform Review →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-slideUp my-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Validate AI Diagnosis — {selectedCase.id}</h3>
                  <p className="text-xs text-gray-500">Farmer: {selectedCase.farmer} ({selectedCase.location})</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Case Summary */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-2xl p-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Crop & Stage:</span>
                  <span className="font-bold text-gray-800">{selectedCase.crop} · {selectedCase.stage}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">AI Detected Issue:</span>
                  <span className="font-bold text-purple-700">{selectedCase.aiResult} ({selectedCase.confidence}%)</span>
                </div>
              </div>

              {/* Verdict Buttons */}
              <div>
                <label className="field-label">Expert Scientific Verdict *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'confirmed', label: '✅ Confirm' },
                    { id: 'rejected', label: '❌ Override' },
                    { id: 'inconclusive', label: '⚠️ Inconclusive' },
                    { id: 'needs_more_info', label: '❓ Need Photo' },
                  ].map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVerdict(v.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        verdict === v.id
                          ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirmed / Corrected Disease Name */}
              <div>
                <label className="field-label">Official Disease / Pest Diagnosis</label>
                <input
                  value={confirmedDisease}
                  onChange={e => setConfirmedDisease(e.target.value)}
                  className="input-field text-sm font-semibold"
                />
              </div>

              {/* Severity Assessment */}
              <div>
                <label className="field-label">Confirmed Severity Level</label>
                <div className="flex gap-2">
                  {(['mild', 'moderate', 'severe'] as const).map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase border ${
                        severity === sev
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Management Advice */}
              <div>
                <label className="field-label">IPM Advice & Scientific Recommendations *</label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Provide IPM measures, field sanitation instructions, and official non-chemical guidelines..."
                  className="input-field text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitReview}
                  className="flex-1 btn-primary bg-purple-700 hover:bg-purple-800 py-2.5 text-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Publish to Farmer'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 text-sm px-6"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExpertLayout>
  );
}
