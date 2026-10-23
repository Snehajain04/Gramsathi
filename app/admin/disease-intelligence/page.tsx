'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import { Activity, ShieldAlert, AlertTriangle, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const PATHOGEN_DATA = [
  { pathogen: 'Rice Blast', type: 'Fungal', cases: 412, states: 'MH, OD, PB', risk: 'HIGH', optimalWeather: '24-28°C, >80% RH' },
  { pathogen: 'Bacterial Leaf Blight', type: 'Bacterial', cases: 298, states: 'AP, WB, TS', risk: 'HIGH', optimalWeather: '25-34°C, High Rain' },
  { pathogen: 'Yellow Rust', type: 'Fungal', cases: 184, states: 'PB, HR', risk: 'MEDIUM', optimalWeather: '10-20°C, Morning Dew' },
  { pathogen: 'Early Blight', type: 'Fungal', cases: 165, states: 'MH, KA', risk: 'MEDIUM', optimalWeather: '24-30°C, Alternating Wet/Dry' },
  { pathogen: 'Soybean Rust', type: 'Fungal', cases: 120, states: 'MH, MP', risk: 'LOW', optimalWeather: '18-26°C, Prolonged Leaf Wetness' },
  { pathogen: 'Red Rot', type: 'Fungal', cases: 85, states: 'MH, UP', risk: 'MEDIUM', optimalWeather: '27-32°C, Waterlogging' },
];

const SURVEILLANCE_CHART = [
  { week: 'Week 28', blast: 45, blight: 28, rust: 12 },
  { week: 'Week 29', blast: 68, blight: 34, rust: 18 },
  { week: 'Week 30', blast: 110, blight: 56, rust: 24 },
  { week: 'Week 31', blast: 195, blight: 89, rust: 30 },
  { week: 'Week 32', blast: 280, blight: 140, rust: 42 },
];

export default function AdminDiseaseIntelligencePage() {
  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-indigo-600" /> State Disease Intelligence & Surveillance
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Epidemiological pathogen tracking, infection vectors, and early warning threshold monitoring.
            </p>
          </div>
          <button
            onClick={() => toast.success('Disease surveillance dossier exported!')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 self-start shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" /> Download Epidemiological Dossier
          </button>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Pathogens</p>
            <p className="text-2xl font-black text-slate-900 mt-1">14</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Under genome tracking</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Critical Outbreaks</p>
            <p className="text-2xl font-black text-rose-600 mt-1">3 Districts</p>
            <p className="text-xs text-rose-600 font-semibold mt-0.5">Pune, Nashik, Krishna</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Spore Transmission</p>
            <p className="text-2xl font-black text-amber-600 mt-1">Elevated</p>
            <p className="text-xs text-amber-600 font-semibold mt-0.5">High monsoon humidity</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Containment Index</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">84%</p>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5">IPM protocol response</p>
          </div>
        </div>

        {/* Pathogen Incidence Curve */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <h2 className="font-bold text-slate-900 text-base mb-1">Weekly Outbreak Progression Velocity</h2>
          <p className="text-xs text-slate-500 mb-4">Confirmed incident trajectory across Kharif monitoring stations</p>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={SURVEILLANCE_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#ffffff' }} />
              <Legend />
              <Line type="monotone" dataKey="blast" name="Rice Leaf Blast" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="blight" name="Bacterial Blight" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="rust" name="Yellow Rust" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pathogens Surveillance Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4.5 border-b border-slate-200/80">
            <h3 className="font-bold text-slate-900 text-base">Tracked Agricultural Pathogens</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Pathogen</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3">Active Cases</th>
                  <th className="px-4 py-3">Hotspot States</th>
                  <th className="px-4 py-3">Conducive Weather</th>
                  <th className="px-4 py-3">Threat Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PATHOGEN_DATA.map(p => (
                  <tr key={p.pathogen} className="hover:bg-slate-50/80 text-xs transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.pathogen}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{p.type}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-900">{p.cases}</td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">{p.states}</td>
                    <td className="px-4 py-3 text-slate-500 font-normal">{p.optimalWeather}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.risk === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        p.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {p.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
