'use client';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { DEMO_PEST_TRAPS } from '@/lib/mockData';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, X, Bug, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid } from 'recharts';

const PEST_TYPES = ['Fall Armyworm','Aphids','Stem Borer','Whitefly','Thrips','Fruit Borer','Pink Bollworm','Helicoverpa','Other'];
const ETL_TABLE = [
  { pest:'Fall Armyworm', crop:'Maize/Rice', etl:'15 moths/trap/week', action:'Field inspection + biopesticide' },
  { pest:'Whitefly', crop:'Cotton/Tomato', etl:'20 per plant', action:'Sticky traps + neem spray' },
  { pest:'Aphids', crop:'Wheat/Mustard', etl:'25 per tiller', action:'Predator release + soap spray' },
  { pest:'Stem Borer', crop:'Rice', etl:'10 moths/trap/week', action:'Light trap + pheromone trap' },
  { pest:'Thrips', crop:'Chilli/Onion', etl:'10 per leaf', action:'Blue sticky traps + neem oil' },
];

export default function PestReportsPage() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ pest: 'Fall Armyworm', crop: 'Rice', count: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pest report submitted successfully! Extension worker will be notified.');
    setModal(false);
    setForm({ pest: 'Fall Armyworm', crop: 'Rice', count: '', notes: '' });
  };

  // chart data from trap readings
  const chartData = [
    { date: 'Aug 1', Trap1: 8, Trap2: 3 },
    { date: 'Aug 2', Trap1: 12, Trap2: 5 },
    { date: 'Aug 3', Trap1: 18, Trap2: 7 },
    { date: 'Aug 4', Trap1: 23, Trap2: 9 },
    { date: 'Aug 5', Trap1: 28, Trap2: 12 },
  ];

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pest Monitoring</h1>
            <p className="text-gray-500 text-sm mt-1">Track pheromone trap counts and ETL thresholds</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Report Pest
          </button>
        </div>

        {/* Trap Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {DEMO_PEST_TRAPS.map(trap => {
            const aboveETL = trap.lastCount > trap.etlThreshold;
            return (
              <div key={trap.id} className={`card p-5 border-l-4 ${aboveETL ? 'border-l-red-500' : 'border-l-yellow-400'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${aboveETL ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {aboveETL ? '🚨 Above ETL' : '⚠️ Monitoring'}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{trap.trapType} trap</span>
                    </div>
                    <h3 className="font-bold text-gray-800">{trap.pestType}</h3>
                    <p className="text-gray-500 text-xs">{trap.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-gray-800">{trap.lastCount}</p>
                    <p className="text-gray-400 text-xs">ETL: {trap.etlThreshold}</p>
                  </div>
                </div>

                {/* Mini sparkline */}
                <div className="h-12 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trap.readings.map((r, i) => ({ d: i, v: r.count }))}>
                      <Line type="monotone" dataKey="v" stroke={aboveETL ? '#ef4444' : '#f59e0b'} dot={false} strokeWidth={2} />
                      <ReferenceLine y={trap.etlThreshold} stroke="#94a3b8" strokeDasharray="2 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toast.success('Trap count updated!')} className="flex-1 text-xs py-2 bg-green-50 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-colors">+ Add Reading</button>
                  <button className="flex-1 text-xs py-2 bg-gray-50 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">View History</button>
                </div>

                {aboveETL && (
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-xs font-medium flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Count exceeds ETL. Field inspection recommended.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trend Chart */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Pest Trap Trend (5 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={15} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'ETL (FAW)', fontSize: 10, fill: '#ef4444' }} />
              <Line type="monotone" dataKey="Trap1" stroke="#ef4444" strokeWidth={2} name="FAW Pheromone Trap" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Trap2" stroke="#f59e0b" strokeWidth={2} name="Sticky Trap" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ETL Table */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Economic Threshold Levels (ETL) Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-green-50 text-green-800 text-xs font-semibold">
                <th className="text-left px-3 py-2 rounded-l-lg">Pest</th>
                <th className="text-left px-3 py-2">Crop</th>
                <th className="text-left px-3 py-2">ETL Threshold</th>
                <th className="text-left px-3 py-2 rounded-r-lg">Recommended Action</th>
              </tr></thead>
              <tbody>
                {ETL_TABLE.map((r, i) => (
                  <tr key={r.pest} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2.5 font-medium text-gray-800">{r.pest}</td>
                    <td className="px-3 py-2.5 text-gray-600 text-xs">{r.crop}</td>
                    <td className="px-3 py-2.5 text-orange-700 font-semibold text-xs">{r.etl}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slideUp">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Report Pest Sighting</h2>
                <button onClick={() => setModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Pest Type</label>
                  <select value={form.pest} onChange={e => setForm({...form, pest: e.target.value})} className="input-field">
                    {PEST_TYPES.map(p => <option key={p}>{p}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                  <input value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Count / Number Observed</label>
                  <input type="number" value={form.count} onChange={e => setForm({...form, count: e.target.value})} placeholder="e.g., 23" className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="input-field" /></div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 btn-primary">Submit Report</button>
                  <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold rounded-xl py-2.5 hover:bg-gray-50 text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
