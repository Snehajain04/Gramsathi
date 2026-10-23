'use client';

import { useState } from 'react';
import ExpertLayout from '@/components/layout/ExpertLayout';
import { Search, Filter, CheckCircle2, AlertTriangle, FileText, Calendar, MapPin, Activity } from 'lucide-react';
import { toast } from 'sonner';

const DIAGNOSES_LIST = [
  { id: 'DX-098', farmer: 'Ramesh Patil', location: 'Koregaon Bhima, Pune', crop: 'Rice', issue: 'Rice Leaf Blast', verifiedBy: 'Dr. Priya Sharma', date: '2024-08-04', badge: 'expert_verified', severity: 'moderate', advice: 'Avoid excess nitrogen fertilization; apply Trichoderma bioagent at base.' },
  { id: 'DX-095', farmer: 'Vijay More', location: 'Shirur, Pune', crop: 'Maize', issue: 'Fall Armyworm', verifiedBy: 'Dr. Priya Sharma', date: '2024-08-02', badge: 'field_confirmed', severity: 'severe', advice: 'Handpick egg masses; apply Bt formulation into whorl; monitor pheromone traps.' },
  { id: 'DX-091', farmer: 'Sanjay Deshmukh', location: 'Daund, Pune', crop: 'Soybean', issue: 'Soybean Rust', verifiedBy: 'Dr. A. K. Verma', date: '2024-07-30', badge: 'expert_verified', severity: 'mild', advice: 'Improve field aeration; check soil drainage; monitor canopy humidity.' },
  { id: 'DX-089', farmer: 'Rekha Shinde', location: 'Yavat, Pune', crop: 'Tomato', issue: 'Early Blight', verifiedBy: 'Dr. Priya Sharma', date: '2024-07-28', badge: 'expert_verified', severity: 'moderate', advice: 'Remove lower infected leaves; apply copper hydroxide spray as per package label.' },
  { id: 'DX-085', farmer: 'Sunil Jadhav', location: 'Haveli, Pune', crop: 'Sugarcane', issue: 'Red Rot', verifiedBy: 'Dr. B. R. Pawar', date: '2024-07-25', badge: 'field_confirmed', severity: 'severe', advice: 'Uproot severely wilted clumps; treat setts with biofungicide before replanting.' },
];

export default function ExpertDiagnosesPage() {
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<typeof DIAGNOSES_LIST[0] | null>(null);

  const crops = ['ALL', 'Rice', 'Maize', 'Soybean', 'Tomato', 'Sugarcane'];

  const filtered = DIAGNOSES_LIST.filter(item => {
    const matchCrop = selectedCrop === 'ALL' || item.crop === selectedCrop;
    const matchSearch = item.farmer.toLowerCase().includes(search.toLowerCase()) ||
      item.issue.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchCrop && matchSearch;
  });

  return (
    <ExpertLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-700" /> Validated Diagnoses
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Historical archive of expert-reviewed crop conditions, verified pathology, and advisory recommendations.
            </p>
          </div>
          <button
            onClick={() => toast.success('Diagnoses history exported to CSV!')}
            className="btn-outline border-purple-300 text-purple-700 hover:bg-purple-50 text-sm self-start"
          >
            Export Log (.CSV)
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search farmer or disease..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            {crops.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCrop === c
                    ? 'bg-purple-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnosis List */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-purple-50 text-purple-900 text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Case ID</th>
                  <th className="px-4 py-3">Farmer & Location</th>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Confirmed Issue</th>
                  <th className="px-4 py-3">Badge Status</th>
                  <th className="px-4 py-3">Verified By</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-gray-600">{d.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-xs">{d.farmer}</p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {d.location}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700 text-xs">{d.crop}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900 text-xs">{d.issue}</p>
                      <span className="text-[10px] text-purple-700 font-semibold capitalize">{d.severity}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        d.badge === 'expert_verified'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {d.badge === 'expert_verified' ? 'Expert Verified' : 'Field Confirmed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{d.verifiedBy}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedDiagnosis(d)}
                        className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnosis Detail Modal */}
        {selectedDiagnosis && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-slideUp">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedDiagnosis.issue}</h3>
                  <p className="text-xs text-gray-400">Diagnosis ID: {selectedDiagnosis.id} · {selectedDiagnosis.date}</p>
                </div>
                <button onClick={() => setSelectedDiagnosis(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">
                  ✕
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Farmer:</span>
                  <span className="font-semibold text-gray-800">{selectedDiagnosis.farmer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-semibold text-gray-800">{selectedDiagnosis.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Crop:</span>
                  <span className="font-semibold text-gray-800">{selectedDiagnosis.crop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verified By:</span>
                  <span className="font-semibold text-purple-700">{selectedDiagnosis.verifiedBy}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-700 mb-1">Official Management Guidance:</p>
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-900 leading-relaxed">
                  {selectedDiagnosis.advice}
                </div>
              </div>

              <button
                onClick={() => setSelectedDiagnosis(null)}
                className="w-full btn-primary bg-purple-700 hover:bg-purple-800 py-2 text-sm"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </div>
    </ExpertLayout>
  );
}
