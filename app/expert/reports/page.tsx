'use client';

import ExpertLayout from '@/components/layout/ExpertLayout';
import { FileText, Download, CheckCircle2, TrendingUp, BarChart2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ExpertReportsPage() {
  const handleDownload = (name: string) => {
    toast.success(`Report "${name}" generated and download started!`);
  };

  return (
    <ExpertLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-700" /> Research & Intelligence Reports
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Certified technical briefings, AI verification audits, and regional epidemiological bulletins.
            </p>
          </div>
          <button
            onClick={() => handleDownload('Weekly_Agronomic_Briefing_Aug2024.pdf')}
            className="btn-primary bg-purple-700 hover:bg-purple-800 flex items-center gap-2 text-sm self-start shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Latest Briefing
          </button>
        </div>

        {/* AI Performance Audit */}
        <div className="card p-5 border border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-white">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
            <h2 className="font-bold text-gray-900 text-lg">AI Vision Model Validation Audit</h2>
          </div>
          <p className="text-gray-600 text-xs mb-4">
            Comparison between preliminary computer vision model predictions and certified agronomic specialist ground truth.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400">Total Validations</p>
              <p className="text-2xl font-black text-gray-800 mt-1">1,482</p>
              <p className="text-[11px] text-green-600 mt-0.5">Verified cases</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400">Model Accuracy</p>
              <p className="text-2xl font-black text-purple-700 mt-1">93.4%</p>
              <p className="text-[11px] text-purple-600 mt-0.5">Agreement rate</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400">False Positives</p>
              <p className="text-2xl font-black text-amber-600 mt-1">4.2%</p>
              <p className="text-[11px] text-amber-500 mt-0.5">Over-sensitivity</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400">Avg Review Time</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">1.8h</p>
              <p className="text-[11px] text-emerald-500 mt-0.5">Response latency</p>
            </div>
          </div>
        </div>

        {/* Downloadable Reports Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-base">Published Scientific Bulletins</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { title: 'Maharashtra Kharif 2024 Rice Blast Surveillance', period: 'Aug 1–5, 2024', size: '2.4 MB', type: 'PDF' },
              { title: 'Spodoptera Frugiperda Trap Density Analysis', period: 'July 2024', size: '1.8 MB', type: 'PDF' },
              { title: 'Tomato Early vs Late Blight Differentiation Matrix', period: 'June–July 2024', size: '850 KB', type: 'PDF' },
              { title: 'Soil Micro-nutrient Impact on Fungal Pathogen Severity', period: 'Q2 2024', size: '3.1 MB', type: 'PDF' },
            ].map(r => (
              <div key={r.title} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-gray-800 text-sm">{r.title}</h4>
                  <p className="text-xs text-gray-400">Period: {r.period} · File Size: {r.size} ({r.type})</p>
                </div>
                <button
                  onClick={() => handleDownload(r.title + '.' + r.type.toLowerCase())}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}
