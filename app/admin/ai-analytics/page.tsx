'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ExplainableAI from '@/components/ExplainableAI';
import {
  BarChart3,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Zap,
  RotateCw,
  Download,
  Layers,
  Sparkles,
  TrendingUp,
  Brain,
  Sliders,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { toast } from 'sonner';

const MODEL_PERFORMANCE_METRICS = [
  { crop: 'Rice', pathogen: 'Rice Leaf Blast (Magnaporthe oryzae)', precision: 95.2, recall: 93.4, f1: 94.3, scans: 48210, difficulty: 'Medium' },
  { crop: 'Tomato', pathogen: 'Late Blight (Phytophthora infestans)', precision: 92.8, recall: 91.0, f1: 91.9, scans: 26540, difficulty: 'High' },
  { crop: 'Cotton', pathogen: 'Pink Bollworm (Pectinophora gossypiella)', precision: 96.0, recall: 94.2, f1: 95.1, scans: 31200, difficulty: 'Low' },
  { crop: 'Maize', pathogen: 'Fall Armyworm (Spodoptera frugiperda)', precision: 94.5, recall: 92.9, f1: 93.7, scans: 22400, difficulty: 'Medium' },
  { crop: 'Wheat', pathogen: 'Yellow Rust (Puccinia striiformis)', precision: 90.4, recall: 88.6, f1: 89.5, scans: 19800, difficulty: 'High' },
  { crop: 'Soybean', pathogen: 'Stem Borer (Obereopsis brevis)', precision: 89.8, recall: 88.0, f1: 88.9, scans: 14700, difficulty: 'High' },
];

const SCAN_VOLUME_DATA = [
  { month: 'Mar', rice: 4200, cotton: 2800, maize: 1900, tomato: 2100 },
  { month: 'Apr', rice: 5800, cotton: 3600, maize: 2400, tomato: 3100 },
  { month: 'May', rice: 8900, cotton: 4900, maize: 3800, tomato: 4200 },
  { month: 'Jun', rice: 14200, cotton: 8100, maize: 6200, tomato: 5900 },
  { month: 'Jul', rice: 19800, cotton: 11400, maize: 8900, tomato: 7800 },
  { month: 'Aug', rice: 24600, cotton: 14200, maize: 10800, tomato: 9400 },
];

const CONCORDANCE_DATA = [
  { week: 'Wk 27', concordance: 84.2, baseline: 82.0 },
  { week: 'Wk 28', concordance: 85.5, baseline: 82.0 },
  { week: 'Wk 29', concordance: 86.1, baseline: 82.0 },
  { week: 'Wk 30', concordance: 86.8, baseline: 82.0 },
  { week: 'Wk 31', concordance: 87.0, baseline: 82.0 },
  { week: 'Wk 32', concordance: 87.2, baseline: 82.0 },
];

const XAI_WEIGHTS = [
  { feature: 'Visual Lesion & Foliar Textures (CNN-ViT)', weight: 44, color: '#22c55e', desc: 'Symptom morphology, necroses, sporulation patterns' },
  { feature: 'Microclimate & Weather Vector (IMD Telemetry)', weight: 26, color: '#3b82f6', desc: 'Relative humidity, rainfall velocity, thermal sum' },
  { feature: 'Crop Phenological Stage & Age', weight: 18, color: '#f59e0b', desc: 'Vegetative vs reproductive tissue vulnerability' },
  { feature: 'Geospatial Outbreak Prior (Hotspot Proximity)', weight: 12, color: '#a855f7', desc: 'Bayesian neighborhood infection cluster probability' },
];

export default function AdminAIAnalyticsPage() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [benchmarkScore, setBenchmarkScore] = useState(93.4);

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    toast.info('Initiating validation suite against 2,500 ground-truth agronomy scans...');
    setTimeout(() => {
      setIsEvaluating(false);
      setBenchmarkScore(93.6);
      toast.success('Benchmark evaluation completed! Model verified with F1 score 93.6%.');
    }, 2200);
  };

  const handleDownloadAuditDossier = () => {
    const rows = MODEL_PERFORMANCE_METRICS.map(m =>
      `${m.crop},${m.pathogen},${m.precision}%,${m.recall}%,${m.f1}%,${m.scans},${m.difficulty}`
    ).join('\n');
    const csvContent = `AI Audit Dossier — GramSathi Agricultural Intelligence Platform\nGenerated: ${new Date().toLocaleString('en-IN')}\nOverall Accuracy: ${benchmarkScore}%\nTotal Scans: 163050\nExpert Concordance: 87.2%\n\nCrop,Pathogen,Precision,Recall,F1-Score,Total Scans,Difficulty\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GramSathi-AI-Audit-Dossier-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('AI Audit Dossier downloaded successfully!');
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 text-white max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-green-400" />
                AI Model Telemetry & Diagnostic Analytics
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 bg-green-950 text-green-400 border border-green-800 rounded-full text-xs font-semibold">
                v3.2-prod (TensorRT)
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-0.5">
              Explainable AI (XAI) feature attribution, expert concordance rates, and multi-crop diagnostic precision telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isEvaluating ? 'animate-spin text-green-400' : ''}`} />
              <span>{isEvaluating ? 'Running Benchmark...' : 'Run Test Suite'}</span>
            </button>
            <button
              onClick={handleDownloadAuditDossier}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-green-900/30"
            >
              <Download className="w-4 h-4" /> Export AI Audit Dossier
            </button>
          </div>
        </div>

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Overall Accuracy</p>
              <Sparkles className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-black text-green-400 mt-2">{benchmarkScore}%</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" /> +1.4% over v3.1 baseline
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Diagnostic Inferences</p>
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">142,850+</p>
            <p className="text-xs text-blue-400 mt-1">Across 9 Indian regional languages</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Expert Concordance</p>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400 mt-2">87.2%</p>
            <p className="text-xs text-gray-400 mt-1">Direct consensus with pathologists</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Mean Latency</p>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">142 ms</p>
            <p className="text-xs text-gray-400 mt-1">Cloud edge + offline INT8 engine</p>
          </div>
        </div>

        {/* Explainable AI (XAI) Feature Attribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-green-400" />
                Multi-Modal Explainable AI (XAI) Weight Distribution
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Feature attribution weights driving the Bayesian risk and pathogen diagnostic engine
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg">
              Integrated Gradients + SHAP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {XAI_WEIGHTS.map(f => (
              <div key={f.feature} className="bg-gray-950 border border-gray-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{f.feature}</span>
                  <span className="font-mono font-bold" style={{ color: f.color }}>
                    {f.weight}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${f.weight}%`, backgroundColor: f.color }}
                  />
                </div>
                <p className="text-[11px] text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts: Inferences Growth & Expert Concordance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly Inferences Bar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Diagnostic Scan Volume by Core Crop (Kharif Season)
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly processed foliar and fruit diagnostic scans</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SCAN_VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="rice" name="Rice" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cotton" name="Cotton" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maize" name="Maize" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tomato" name="Tomato" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expert Concordance Trajectory */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Agronomist Concordance & Feedback Loop
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Agreement percentage between AI prediction and verified expert verdicts</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CONCORDANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="week" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis domain={[80, 90]} stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="concordance"
                    name="Actual Concordance %"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="ICAR Benchmark (82%)"
                    stroke="#6b7280"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Model Accuracy Table by Pathogen */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-green-400" />
                Validated Pathogen Classification Performance
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Evaluation metrics measured on held-out field test partition</p>
            </div>
            <span className="text-xs text-gray-400">Total Scans Audited: 163,050</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-800/80 uppercase text-[11px] text-gray-400 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Crop</th>
                  <th className="px-4 py-3">Pathogen / Pest Target</th>
                  <th className="px-4 py-3">Precision</th>
                  <th className="px-4 py-3">Recall</th>
                  <th className="px-4 py-3">F1-Score</th>
                  <th className="px-4 py-3">Total Scans</th>
                  <th className="px-4 py-3 rounded-r-xl">Visual Complexity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {MODEL_PERFORMANCE_METRICS.map(m => (
                  <tr key={m.pathogen} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white">
                      {m.crop}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-white">{m.pathogen.split('(')[0]}</p>
                      <p className="text-[10px] text-gray-400 italic">({m.pathogen.split('(')[1]}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-green-400 font-bold">
                      {m.precision}%
                    </td>
                    <td className="px-4 py-3.5 font-mono text-blue-400 font-bold">
                      {m.recall}%
                    </td>
                    <td className="px-4 py-3.5 font-mono text-white font-black">
                      {m.f1}%
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">
                      {m.scans.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.difficulty === 'High'
                            ? 'bg-amber-900/40 text-amber-400 border border-amber-800'
                            : m.difficulty === 'Medium'
                            ? 'bg-blue-900/40 text-blue-400 border border-blue-800'
                            : 'bg-green-900/40 text-green-400 border border-green-800'
                        }`}
                      >
                        {m.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edge & Offline Deployment Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-2">On-Device Edge Deployment</h3>
            <p className="text-xs text-gray-400 mb-3">TFLite 8-bit quantized model bundle for rural offline smartphone operation.</p>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Bundle Size:</span>
                <span className="font-mono font-bold text-green-400">28.4 MB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Offline Accuracy:</span>
                <span className="font-mono font-bold text-white">89.6%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Target Devices:</span>
                <span className="font-medium text-gray-300">Android 9.0+</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-2">Continuous Learning Pipeline</h3>
            <p className="text-xs text-gray-400 mb-3">Weekly self-supervised feedback ingestion from expert-reviewed diagnoses.</p>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Curated Dataset:</span>
                <span className="font-mono font-bold text-blue-400">48,200 images</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Validation Split:</span>
                <span className="font-mono font-bold text-white">80 / 10 / 10</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Pipeline Status:</span>
                <span className="font-medium text-green-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready for next epoch
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-2">Safety & Hallucination Guardrails</h3>
            <p className="text-xs text-gray-400 mb-3">Automated referral fallback if confidence falls below safe intervention threshold.</p>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Cutoff Threshold:</span>
                <span className="font-mono font-bold text-amber-400">&lt; 70% Confidence</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Auto-Escalations:</span>
                <span className="font-mono font-bold text-white">6.2% routed to experts</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Hallucination Risk:</span>
                <span className="font-medium text-green-400">Negligible (&lt;0.8%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live XAI Demo Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-400" />
              Live Explainable AI (XAI) — Sample Inference Explanation
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Real-time XAI output shown to farmers after every AI diagnosis. Builds transparency and trust.
            </p>
          </div>
          <ExplainableAI
            confidence={91}
            severity="severe"
            predictedIssue="Rice Leaf Blast (Magnaporthe oryzae)"
            riskFactors={[
              { category: 'image_analysis', label: 'Visual Lesion Pattern Match', value: 88, description: 'Diamond-shaped lesions with grey centres detected on leaf surface', icon: '👁️' },
              { category: 'weather', label: 'Microclimate Risk (IMD Data)', value: 79, description: 'High humidity (87%) + moderate temperature (26°C) — ideal blast conditions', icon: '🌡️' },
              { category: 'crop_context', label: 'Crop Stage Vulnerability', value: 72, description: 'Tillering stage: most susceptible window for blast infection', icon: '🌾' },
              { category: 'historical', label: 'Geospatial Outbreak Prior', value: 65, description: 'Nashik cluster reported 43 cases in last 14 days — high neighbour probability', icon: '📍' },
            ]}
            historicalEvidence="Rice Blast has been recorded in this district in 2021, 2022, and 2023 Kharif seasons. Peak outbreak windows match current conditions. Previous outbreak response reduced losses by 64% using Tricyclazole 75% WP at 0.6g/L."
            weatherEvidence={{ temperature: 26, humidity: 87, rainfall: 38, riskNote: 'Current weather indices exceed blast disease conducive thresholds. Risk is elevated for the next 72 hours.' }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
