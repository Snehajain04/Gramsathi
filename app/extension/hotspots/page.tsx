'use client';

import { useState } from 'react';
import ExtensionLayout from '@/components/layout/ExtensionLayout';
import dynamic from 'next/dynamic';
import { HOTSPOT_DATA } from '@/lib/mockData';
import { MapPin, Filter, AlertTriangle, TrendingUp, Layers } from 'lucide-react';

const HotspotMap = dynamic(() => import('@/components/maps/HotspotMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[420px] bg-blue-50/50 rounded-2xl text-blue-700">
      Loading GIS Map...
    </div>
  ),
});

export default function ExtensionHotspotsPage() {
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const filtered = HOTSPOT_DATA.filter(h => {
    const matchCrop = selectedCrop === 'ALL' || h.crop === selectedCrop;
    const matchType = selectedType === 'ALL' || h.issueType === selectedType;
    return matchCrop && matchType;
  });

  return (
    <ExtensionLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-700" /> Local GIS Outbreak Hotspots
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Geographic clustering of verified crop infections and trap threshold violations in your coverage blocks.
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">🔴 High Severity</span>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">🟡 Moderate</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="card p-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="text-gray-500 flex items-center gap-1.5"><Filter className="w-4 h-4" /> Filters:</span>
          <div className="flex gap-2">
            {['ALL', 'Rice', 'Maize', 'Soybean', 'Tomato', 'Cotton'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCrop === c ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            {['ALL', 'disease', 'pest'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  selectedType === type ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive GIS Map */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Outbreak Distribution ({filtered.length} Clusters Detected)
            </h2>
            <span className="text-xs text-gray-400">Click circle marker for incident breakdown</span>
          </div>
          <HotspotMap data={filtered} height="420px" />
        </div>

        {/* Hotspot Data Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-base">District & Taluka Cluster Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-50 text-blue-900 text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Affected Crop</th>
                  <th className="px-4 py-3">Pathogen / Pest</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Reports</th>
                  <th className="px-4 py-3">Trend</th>
                  <th className="px-4 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50 text-xs transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{h.district}, {h.state}</td>
                    <td className="px-4 py-3 text-gray-700">{h.crop}</td>
                    <td className="px-4 py-3 font-bold text-gray-800">{h.issue}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{h.issueType}</td>
                    <td className="px-4 py-3 font-semibold text-blue-700">{h.reportCount} cases</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">
                      {h.trend === 'increasing' ? '📈 Rising' : h.trend === 'decreasing' ? '📉 Falling' : '➡️ Stable'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        h.riskLevel === 'high' || h.riskLevel === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : h.riskLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
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
    </ExtensionLayout>
  );
}
