'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import dynamic from 'next/dynamic';
import { HOTSPOT_DATA } from '@/lib/mockData';
import { Map, Filter, Download, AlertTriangle, Shield, Layers } from 'lucide-react';
import { toast } from 'sonner';

const HotspotMap = dynamic(() => import('@/components/maps/HotspotMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-slate-100 rounded-2xl text-slate-500 font-medium">
      Loading State GIS Outbreak Map...
    </div>
  ),
});

export default function AdminHotspotsPage() {
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  const states = ['ALL', 'Maharashtra', 'Punjab', 'Andhra Pradesh', 'Telangana', 'Odisha', 'Karnataka', 'West Bengal', 'Tamil Nadu'];
  const crops = ['ALL', 'Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Soybean', 'Groundnut'];

  const filtered = HOTSPOT_DATA.filter(h => {
    const matchState = selectedState === 'ALL' || h.state === selectedState;
    const matchCrop = selectedCrop === 'ALL' || h.crop === selectedCrop;
    return matchState && matchCrop;
  });

  const totalReports = filtered.reduce((acc, h) => acc + h.reportCount, 0);
  const highRiskCount = filtered.filter(h => h.riskLevel === 'high' || h.riskLevel === 'critical').length;

  const handleExportCSV = () => {
    const headers = ['District', 'State', 'Crop', 'Issue', 'Issue Type', 'Risk Level', 'Report Count', 'Trend', 'Latitude', 'Longitude'];
    const rows = filtered.map(h =>
      [h.district, h.state, h.crop, `"${h.issue}"`, h.issueType, h.riskLevel, h.reportCount, h.trend, h.lat, h.lng].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GramSathi-GIS-Hotspots-${selectedState.replace(/ /g, '_')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`GIS Hotspot CSV exported — ${filtered.length} clusters downloaded!`);
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Map className="w-6 h-6 text-indigo-600" /> State-level GIS Outbreak Surveillance
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Geographic Information System tracking multi-district disease epidemics and pest cluster movements.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 self-start shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export Shapefile / CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Clusters</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{filtered.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">District hotspots</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Severe / Critical</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{highRiskCount}</p>
            <p className="text-xs text-rose-600 mt-0.5 font-semibold">Immediate intervention</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Incident Reports</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{totalReports}</p>
            <p className="text-xs text-indigo-600 mt-0.5 font-semibold">Confirmed cases</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Early Warning Lead Time</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">3.4 Days</p>
            <p className="text-xs text-emerald-600 mt-0.5 font-semibold">Prior to full spread</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center gap-4 text-xs font-semibold shadow-xs">
          <span className="text-slate-700 flex items-center gap-1.5 font-bold"><Filter className="w-4 h-4 text-indigo-600" /> Filter By State:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-xl">
            {states.map(s => (
              <button
                key={s}
                onClick={() => setSelectedState(s)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                  selectedState === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-700 font-bold">Crop:</span>
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-indigo-600"
            >
              {crops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* GIS Map */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-indigo-600" /> Interactive National Hotspot Topography
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" /> Moderate
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2" /> Low
            </div>
          </div>
          <HotspotMap data={filtered} height="480px" />
        </div>

        {/* Hotspots Data Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4.5 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">District Outbreak Surveillance Records</h3>
            <span className="text-xs text-slate-500 font-semibold">{filtered.length} active surveillance clusters</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">District & State</th>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Pathogen / Pest</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Confirmed Cases</th>
                  <th className="px-4 py-3">Spread Trend</th>
                  <th className="px-4 py-3">Alert Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50/80 text-xs transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{h.district}, {h.state}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{h.crop}</td>
                    <td className="px-4 py-3 font-bold text-indigo-700">{h.issue}</td>
                    <td className="px-4 py-3 capitalize text-slate-600 font-medium">{h.issueType}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-900">{h.reportCount}</td>
                    <td className="px-4 py-3 text-slate-600 font-semibold capitalize">
                      {h.trend === 'increasing' ? '📈 Accelerating' : h.trend === 'decreasing' ? '📉 Containing' : '➡️ Stable'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        h.riskLevel === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : h.riskLevel === 'high'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {h.riskLevel.toUpperCase()}
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
