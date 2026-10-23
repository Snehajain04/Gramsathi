'use client';

import ExpertLayout from '@/components/layout/ExpertLayout';
import { DISEASE_TREND_DATA, STATE_RISK_DATA } from '@/lib/mockData';
import { TrendingUp, Activity, Bug, CloudSun, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ExpertTrendsPage() {
  return (
    <ExpertLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-700" /> Epidemiological & Outbreak Trends
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Pathogen progression models, pest population dynamics, and seasonal crop risk analysis.
          </p>
        </div>

        {/* Top summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card p-4 border border-purple-100 bg-purple-50/40">
            <p className="text-xs text-purple-700 font-semibold uppercase">Surveillance Span</p>
            <p className="text-2xl font-black text-purple-900 mt-1">6 Months</p>
            <p className="text-xs text-purple-600 mt-0.5">Kharif + Pre-Rabi 2024</p>
          </div>
          <div className="card p-4 border border-red-100 bg-red-50/40">
            <p className="text-xs text-red-700 font-semibold uppercase">Dominant Pathogen</p>
            <p className="text-2xl font-black text-red-900 mt-1">Rice Blast</p>
            <p className="text-xs text-red-600 mt-0.5">Pyricularia oryzae</p>
          </div>
          <div className="card p-4 border border-amber-100 bg-amber-50/40">
            <p className="text-xs text-amber-700 font-semibold uppercase">Invasive Pest</p>
            <p className="text-2xl font-black text-amber-900 mt-1">FAW</p>
            <p className="text-xs text-amber-600 mt-0.5">Spodoptera frugiperda</p>
          </div>
          <div className="card p-4 border border-emerald-100 bg-emerald-50/40">
            <p className="text-xs text-emerald-700 font-semibold uppercase">Predicted Peak</p>
            <p className="text-2xl font-black text-emerald-900 mt-1">Mid August</p>
            <p className="text-xs text-emerald-600 mt-0.5">High humidity window</p>
          </div>
        </div>

        {/* 6-Month Multi-Disease Curve */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Pathogen Incidence Dynamics (Mar–Aug)</h2>
              <p className="text-gray-400 text-xs">Number of reported cluster outbreaks per 1,000 surveyed hectares</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
              Live Field Reports
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={DISEASE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBlast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBlight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorArmyworm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="blast" name="Rice Leaf Blast" stroke="#ef4444" fill="url(#colorBlast)" strokeWidth={2} />
              <Area type="monotone" dataKey="blight" name="Bacterial Blight" stroke="#f59e0b" fill="url(#colorBlight)" strokeWidth={2} />
              <Area type="monotone" dataKey="armyworm" name="Fall Armyworm" stroke="#8b5cf6" fill="url(#colorArmyworm)" strokeWidth={2} />
              <Line type="monotone" dataKey="mildew" name="Powdery Mildew" stroke="#22c55e" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* State Disease vs Pest Breakdown */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-2">Regional Vulnerability Indices</h2>
          <p className="text-gray-400 text-xs mb-4">Comparative disease risk index vs pest pressure score across monitored agricultural zones</p>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={STATE_RISK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="state" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="diseaseRisk" name="Disease Risk (0-100)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pestRisk" name="Pest Risk (0-100)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expert Insights */}
        <div className="card p-5 space-y-3 bg-gradient-to-r from-purple-50 via-white to-purple-50/30 border border-purple-100">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            🔬 Key Agronomic Insights & Meteorological Correlation
          </h3>
          <ul className="space-y-2 text-xs text-gray-700 leading-relaxed list-disc list-inside">
            <li><strong>Rice Leaf Blast Surge:</strong> Relative humidity above 80% combined with sustained temperatures of 24–28°C in Pune and Nashik creates ideal germination conditions for Magnaporthe oryzae.</li>
            <li><strong>Fall Armyworm Whorl Activity:</strong> Trap counts in Kharif maize have breached the 15 moths/week ETL threshold across 4 blocks in Telangana and Maharashtra.</li>
            <li><strong>Rabi Preventive Window:</strong> Soil moisture saturation indicates favorable planting conditions for Wheat in Punjab, with low yellow rust spore load predicted till November.</li>
          </ul>
        </div>
      </div>
    </ExpertLayout>
  );
}
