'use client';

import React from 'react';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  TrendingUp, 
  Database, 
  Sparkles, 
  RefreshCw,
  Award
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function ContinuousLearningDashboard() {
  const { language } = useAuth();

  const metrics = {
    totalPredictions: 1250,
    expertConfirmed: 1087,
    expertRejected: 103,
    moreInfoNeeded: 60,
    agreementRate: 86.9,
    datasetImages: 18420,
    validatedImages: 13820,
    previousAccuracy: 89.2,
    currentAccuracy: 92.1,
    modelVersion: 'v2.4 (Active)',
    lastUpdated: '21 Sept 2026'
  };

  const disagreementDiseases = [
    { disease: 'Early Bacterial Blight vs Fungal Spot', total: 42, disagreement: '18% Disagreement', reason: 'Visual lesion similarity under high humidity' },
    { disease: 'Cotton Bollworm vs Spodoptera', total: 31, disagreement: '14% Disagreement', reason: 'Overlapping frass patterns in young bolls' },
    { disease: 'Soybean Rust vs Nitrogen Deficit', total: 28, disagreement: '9% Disagreement', reason: 'Yellowing leaves confounded by soil salinity' }
  ];

  return (
    <div className="card p-5 sm:p-6 bg-white border border-purple-100 shadow-md rounded-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-purple-100 text-purple-800 rounded-2xl">
            <Brain className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Continuous Learning & AI–Human Disagreement Dashboard
              <span className="text-[10px] bg-purple-100 text-purple-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Model {metrics.modelVersion}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Closed-loop feedback pipeline: Expert validation feeds into automated training dataset quality check & model retraining.
            </p>
          </div>
        </div>

        <span className="text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 px-3 py-1 rounded-full">
          Accuracy: {metrics.currentAccuracy}% (↑ +{ (metrics.currentAccuracy - metrics.previousAccuracy).toFixed(1) }%)
        </span>
      </div>

      {/* Feature 12: AI + Human Disagreement Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200">
          <span className="text-[10px] text-purple-700 font-bold block uppercase">AI–Human Agreement</span>
          <p className="text-2xl font-black text-purple-950 mt-1">{metrics.agreementRate}%</p>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">1,087 Confirmed</span>
        </div>

        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
          <span className="text-[10px] text-emerald-700 font-bold block uppercase">Expert Confirmed</span>
          <p className="text-2xl font-black text-emerald-950 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {metrics.expertConfirmed}
          </p>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Added to Training Set</span>
        </div>

        <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200">
          <span className="text-[10px] text-red-700 font-bold block uppercase">Expert Rejected</span>
          <p className="text-2xl font-black text-red-950 mt-1 flex items-center gap-1">
            <XCircle className="w-5 h-5 text-red-600" /> {metrics.expertRejected}
          </p>
          <span className="text-[10px] text-red-700 block mt-0.5">Flagged for Retraining</span>
        </div>

        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
          <span className="text-[10px] text-amber-700 font-bold block uppercase">Need Info / Re-scan</span>
          <p className="text-2xl font-black text-amber-950 mt-1 flex items-center gap-1">
            <HelpCircle className="w-5 h-5 text-amber-600" /> {metrics.moreInfoNeeded}
          </p>
          <span className="text-[10px] text-amber-700 block mt-0.5">Lab/Photo Pending</span>
        </div>
      </div>

      {/* Feature 13: Continuous Learning Pipeline & Dataset Dashboard */}
      <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-2xl border border-purple-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-700" />
            <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wide">
              Model Training Dataset Pipeline Progress
            </h3>
          </div>
          <span className="text-xs text-purple-800 font-medium">Last updated: {metrics.lastUpdated}</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-gray-500 block">Total Dataset Images:</span>
            <span className="font-bold text-gray-900">{metrics.datasetImages.toLocaleString('en-IN')} Images</span>
          </div>
          <div>
            <span className="text-gray-500 block">Expert Validated Dataset:</span>
            <span className="font-bold text-emerald-700">{metrics.validatedImages.toLocaleString('en-IN')} Images (75%)</span>
          </div>
          <div>
            <span className="text-gray-500 block">Validation Accuracy Trend:</span>
            <span className="font-bold text-purple-900">{metrics.previousAccuracy}% → {metrics.currentAccuracy}%</span>
          </div>
        </div>

        {/* Workflow Pipeline Steps */}
        <div className="pt-2 text-[11px] font-semibold text-purple-900 flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-1 bg-white rounded-lg border border-purple-200">1. Field Upload</span> →
          <span className="px-2 py-1 bg-white rounded-lg border border-purple-200">2. Expert Review</span> →
          <span className="px-2 py-1 bg-white rounded-lg border border-purple-200">3. Quality Check</span> →
          <span className="px-2 py-1 bg-white rounded-lg border border-purple-200">4. Auto Dataset Ingestion</span> →
          <span className="px-2 py-1 bg-purple-700 text-white rounded-lg font-bold">5. Model v2.4 Active</span>
        </div>
      </div>

      {/* Disagreement Breakdown Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
          High-Disagreement Diseases (Targeted for Next Training Cycle)
        </h3>
        <div className="space-y-2 text-xs">
          {disagreementDiseases.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900">{item.disease}</p>
                <p className="text-gray-500 text-[11px] mt-0.5">Confounding Factor: {item.reason}</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap">
                {item.disagreement}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
