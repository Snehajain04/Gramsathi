'use client';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';

// ── Soil NPK + environmental factors radar ────────────────────
interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

interface CropRadarProps {
  /** Pre-built data array or use defaults */
  data?: RadarDataPoint[];
  title?: string;
  /** Show the soil NPK sub-panel */
  showNPK?: boolean;
  soilN?: number;
  soilP?: number;
  soilK?: number;
}

const DEFAULT_DATA: RadarDataPoint[] = [
  { subject: 'Disease Risk',    value: 78, fullMark: 100 },
  { subject: 'Pest Risk',       value: 55, fullMark: 100 },
  { subject: 'Weather Risk',    value: 82, fullMark: 100 },
  { subject: 'Soil Health',     value: 65, fullMark: 100 },
  { subject: 'Crop Stage Risk', value: 70, fullMark: 100 },
  { subject: 'History Risk',    value: 60, fullMark: 100 },
];

// Color for risk levels
function riskColor(val: number) {
  if (val >= 75) return 'text-red-600 bg-red-100';
  if (val >= 55) return 'text-amber-600 bg-amber-100';
  return 'text-green-600 bg-green-100';
}

function riskLabel(val: number) {
  if (val >= 75) return 'HIGH';
  if (val >= 55) return 'MED';
  return 'LOW';
}

// Custom tooltip
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{payload: RadarDataPoint}> }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-gray-800">{d.subject}</p>
        <p className={`font-black text-lg mt-1 ${d.value >= 75 ? 'text-red-600' : d.value >= 55 ? 'text-amber-600' : 'text-green-600'}`}>
          {d.value}%
        </p>
        <p className="text-gray-400">{riskLabel(d.value)} risk level</p>
      </div>
    );
  }
  return null;
}

export default function CropRiskRadar({
  data = DEFAULT_DATA,
  title = 'Crop Risk Intelligence',
  showNPK = true,
  soilN = 62,
  soilP = 45,
  soilK = 71,
}: CropRadarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm">📊 {title}</h3>
        <p className="text-gray-400 text-xs mt-0.5">Multi-factor agricultural risk assessment</p>
      </div>

      {/* Radar Chart */}
      <div className="px-4 pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 9 }}
              tickCount={4}
            />
            <Radar
              name="Risk Level"
              dataKey="value"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ fill: '#16a34a', r: 4, strokeWidth: 0 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk legend pills */}
      <div className="px-5 pb-4 grid grid-cols-3 gap-2">
        {data.slice(0, 6).map(d => (
          <div key={d.subject} className="text-center">
            <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${riskColor(d.value)}`}>
              {riskLabel(d.value)} {d.value}%
            </div>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">{d.subject.replace(' Risk', '')}</p>
          </div>
        ))}
      </div>

      {/* Soil NPK Panel */}
      {showNPK && (
        <div className="mx-4 mb-4 bg-green-50 rounded-xl border border-green-100 p-3">
          <p className="font-bold text-green-800 text-xs mb-2.5">🌱 Soil NPK Analysis</p>
          <div className="space-y-2">
            {[
              { label: 'Nitrogen (N)', val: soilN, color: 'bg-blue-500' },
              { label: 'Phosphorus (P)', val: soilP, color: 'bg-orange-500' },
              { label: 'Potassium (K)', val: soilK, color: 'bg-purple-500' },
            ].map(n => (
              <div key={n.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{n.label}</span>
                  <span className={`font-bold ${n.val < 40 ? 'text-red-600' : n.val < 60 ? 'text-amber-600' : 'text-green-600'}`}>
                    {n.val}% {n.val < 40 ? '⚠️ Low' : n.val < 60 ? '~ Moderate' : '✅ Good'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`${n.color} h-1.5 rounded-full transition-all`}
                    style={{ width: `${n.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
