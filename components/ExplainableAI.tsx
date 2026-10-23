'use client';
import { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Info, TrendingUp, Thermometer, Leaf, Clock, Eye } from 'lucide-react';

interface XAIFactor {
  category: string;
  label: string;
  value: number;
  description: string;
  icon: string;
}

interface ExplainableAIProps {
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  predictedIssue: string;
  riskFactors: XAIFactor[];
  historicalEvidence?: string;
  weatherEvidence?: {
    temperature: number;
    humidity: number;
    rainfall: number;
    riskNote: string;
  };
  compact?: boolean;
}

const SEVERITY_CONFIG = {
  mild:     { color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-200', bar: 'bg-green-500',  label: 'Mild' },
  moderate: { color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200', bar: 'bg-amber-500',  label: 'Moderate' },
  severe:   { color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200',bar: 'bg-orange-500', label: 'Severe' },
  critical: { color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',   bar: 'bg-red-500',    label: 'Critical' },
};

const FACTOR_ICONS: Record<string, React.ElementType> = {
  image_analysis: Eye,
  weather: Thermometer,
  crop_context: Leaf,
  historical: Clock,
  soil: TrendingUp,
};

function CircularProgress({ value, color }: { value: number; color: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width="80" height="80" className="-rotate-90">
      <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle
        cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

export default function ExplainableAI({
  confidence,
  severity,
  predictedIssue,
  riskFactors,
  historicalEvidence,
  weatherEvidence,
  compact = false,
}: ExplainableAIProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.moderate;

  const svgColors: Record<string, string> = {
    mild: '#22c55e', moderate: '#f59e0b', severe: '#f97316', critical: '#ef4444',
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
        <Brain className={`w-5 h-5 flex-shrink-0 ${cfg.color}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold ${cfg.color}`}>AI Confidence: {confidence}%</p>
          <p className="text-gray-500 text-xs truncate">{predictedIssue}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
          {cfg.label}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-white" />
          <h3 className="text-white font-bold text-base">🔍 Explainable AI — Why this result?</h3>
        </div>
        <p className="text-violet-200 text-xs">GramSathi XAI Engine · Transparent AI for Indian Farmers</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Confidence + Severity */}
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center">
            <CircularProgress value={confidence} color={svgColors[severity] || '#f59e0b'} />
            <div className="absolute flex flex-col items-center">
              <span className={`text-xl font-black ${cfg.color}`}>{confidence}%</span>
              <span className="text-gray-400 text-[10px]">confidence</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Predicted Issue</p>
            <p className="text-gray-900 font-bold text-lg leading-tight">{predictedIssue}</p>
            <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
              <span className="w-2 h-2 rounded-full" style={{ background: svgColors[severity] }} />
              {cfg.label} Severity
            </div>
          </div>
        </div>

        {/* Factor Bars */}
        {riskFactors.length > 0 && (
          <div className="space-y-3">
            <p className="text-gray-700 font-bold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              Contributing Factors
            </p>
            {riskFactors.map((factor, i) => {
              const IconComp = FACTOR_ICONS[factor.category] || Info;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{factor.icon}</span>
                      <span className="text-gray-700 text-xs font-semibold">{factor.label}</span>
                    </div>
                    <span className="text-gray-600 text-xs font-bold">{factor.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${factor.value}%`, background: svgColors[severity] || '#8b5cf6' }}
                    />
                  </div>
                  <p className="text-gray-400 text-[11px]">{factor.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Weather Evidence */}
        {weatherEvidence && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-700 font-bold text-sm mb-2 flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> Weather Evidence
            </p>
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div className="text-center">
                <p className="text-blue-900 font-black text-lg">{weatherEvidence.temperature}°C</p>
                <p className="text-blue-500 text-[11px]">Temperature</p>
              </div>
              <div className="text-center">
                <p className="text-blue-900 font-black text-lg">{weatherEvidence.humidity}%</p>
                <p className="text-blue-500 text-[11px]">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-blue-900 font-black text-lg">{weatherEvidence.rainfall}mm</p>
                <p className="text-blue-500 text-[11px]">Rainfall</p>
              </div>
            </div>
            <p className="text-blue-600 text-xs">{weatherEvidence.riskNote}</p>
          </div>
        )}

        {/* Historical Evidence - Expandable */}
        {historicalEvidence && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-500" /> Historical Evidence
              </span>
              {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expanded && (
              <div className="px-4 py-3 text-gray-600 text-xs leading-relaxed border-t border-gray-100">
                {historicalEvidence}
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-amber-700 text-[11px] leading-relaxed">
            ⚠️ <strong>AI Disclaimer:</strong> This result is generated by GramSathi AI and is for guidance only. Always consult a certified agricultural expert or KVK before taking action.
          </p>
        </div>
      </div>
    </div>
  );
}
