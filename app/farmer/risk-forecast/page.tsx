'use client';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { DEMO_RISK_SCORE, DEMO_WEATHER } from '@/lib/mockData';
import { getRiskBgClass, getRiskColor } from '@/lib/riskEngine';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Thermometer, Droplets, Wind, Gauge } from 'lucide-react';
import SmartMandiMarketplaceCard from '@/components/SmartMandiMarketplaceCard';
import PestTrapSensorCard from '@/components/PestTrapSensorCard';

const RISK_COLORS: Record<string, string> = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };

function RiskCircle({ risk, score, label }: { risk: string; score: number; label: string }) {
  const color = RISK_COLORS[risk];
  const r = 45, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 55 55)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        <text x="55" y="50" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1f2937">{score}</text>
        <text x="55" y="66" textAnchor="middle" fontSize="10" fill={color} fontWeight="700">{risk.toUpperCase()}</text>
      </svg>
      <p className="text-gray-600 text-sm font-medium text-center">{label}</p>
    </div>
  );
}

export default function RiskForecastPage() {
  const { forecast, factors } = DEMO_RISK_SCORE;
  const chartData = forecast.map(d => ({
    day: d.dayLabel,
    'Disease Risk': d.overallScore - 5 + Math.floor(Math.random() * 10),
    'Pest Risk': d.overallScore - 15 + Math.floor(Math.random() * 10),
    'Overall': d.overallScore,
    humidity: d.humidity,
    rainfall: d.rainfall,
  }));

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Crop Risk Forecast</h1>
          <p className="text-gray-500 text-sm mt-1">7-day disease and pest risk prediction based on weather, crop stage, and historical data</p>
        </div>

        {/* Weather */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Current Weather — {DEMO_WEATHER.location}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🌡️', label: 'Temperature', value: `${DEMO_WEATHER.temperature}°C`, sub: 'Feels like 30°C' },
              { icon: '💧', label: 'Humidity', value: `${DEMO_WEATHER.humidity}%`, sub: 'HIGH', warn: true },
              { icon: '🌧️', label: 'Rainfall', value: `${DEMO_WEATHER.rainfall}mm`, sub: 'This week', warn: true },
              { icon: '💨', label: 'Wind Speed', value: `${DEMO_WEATHER.windSpeed} km/h`, sub: DEMO_WEATHER.windDirection },
              { icon: '🌱', label: 'Soil Moisture', value: `${DEMO_WEATHER.soilMoisture}%`, sub: 'Elevated', warn: true },
              { icon: '☀️', label: 'UV Index', value: String(DEMO_WEATHER.uvIndex), sub: 'Moderate' },
              { icon: '⛅', label: 'Condition', value: DEMO_WEATHER.condition, sub: '' },
              { icon: '🕐', label: 'Updated', value: '5 min ago', sub: 'IMD data' },
            ].map(w => (
              <div key={w.label} className={`rounded-xl p-3 ${w.warn ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                <span className="text-2xl">{w.icon}</span>
                <p className="font-bold text-gray-800 text-lg mt-1">{w.value}</p>
                <p className="text-gray-500 text-xs">{w.label}</p>
                {w.sub && <p className={`text-xs font-medium ${w.warn ? 'text-yellow-700' : 'text-gray-400'}`}>{w.sub}</p>}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2">Source: IMD / OpenWeatherMap integration</p>
        </div>

        {/* Risk Gauges */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-6">Overall Risk Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
            <RiskCircle risk={DEMO_RISK_SCORE.diseaseRisk} score={DEMO_RISK_SCORE.diseaseScore} label="Disease Risk" />
            <RiskCircle risk={DEMO_RISK_SCORE.pestRisk} score={DEMO_RISK_SCORE.pestScore} label="Pest Risk" />
            <RiskCircle risk={DEMO_RISK_SCORE.weatherRisk} score={DEMO_RISK_SCORE.weatherScore} label="Weather Risk" />
            <RiskCircle risk={DEMO_RISK_SCORE.overallRisk} score={DEMO_RISK_SCORE.overallScore} label="Overall Risk" />
          </div>
        </div>

        {/* 7-Day Chart */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">7-Day Risk Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDisease" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v, name) => [`${v}/100`, name]} />
              <Legend />
              <ReferenceLine y={55} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'HIGH', fontSize: 10, fill: '#ef4444' }} />
              <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'MEDIUM', fontSize: 10, fill: '#f59e0b' }} />
              <Area type="monotone" dataKey="Disease Risk" stroke="#ef4444" fill="url(#colorDisease)" strokeWidth={2} />
              <Area type="monotone" dataKey="Pest Risk" stroke="#f59e0b" fill="url(#colorPest)" strokeWidth={2} />
              <Area type="monotone" dataKey="Overall" stroke="#22c55e" fill="url(#colorOverall)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Factors */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Risk Factors</h2>
          <div className="space-y-3">
            {factors.map(f => (
              <div key={f.name} className={`flex items-start gap-3 p-3 rounded-xl border ${f.impact === 'high' ? 'bg-red-50 border-red-200' : f.impact === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${f.impact === 'high' ? 'bg-red-100 text-red-700' : f.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{String(f.impact).toUpperCase()}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.name}: <span className="font-normal text-gray-600">{String(f.value)}</span></p>
                  <p className="text-gray-500 text-xs mt-0.5">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 4: Pest Trap & Soil Sensor Fusion Engine */}
        <PestTrapSensorCard />

        {/* Feature 5: 5-Day Detailed Crop Disease Forecasting Engine */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">5-Day Detailed Crop Disease Forecasting Engine</h2>
              <p className="text-xs text-gray-500">Day-by-day predictive risk breakdown with underlying weather & local outbreak evidence</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
              Peak Outbreak Expected: Day 3-4
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left font-bold border-b border-gray-200">
                  <th className="p-2.5 rounded-l-xl">Day</th>
                  <th className="p-2.5">Disease Risk</th>
                  <th className="p-2.5">Pest Risk</th>
                  <th className="p-2.5">Weather Conditions</th>
                  <th className="p-2.5 rounded-r-xl">Why? (Evidence Factors)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/80">
                  <td className="p-2.5 font-bold text-gray-900">Today</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-bold">🟡 Medium (48%)</span></td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold">🟢 Low (24%)</span></td>
                  <td className="p-2.5 font-medium">Humid (88%), 27°C</td>
                  <td className="p-2.5 text-gray-600">Elevated relative humidity + past leaf blast history on lower tillers.</td>
                </tr>
                <tr className="hover:bg-gray-50/80 bg-orange-50/30">
                  <td className="p-2.5 font-bold text-gray-900">Tomorrow</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">🟠 High (68%)</span></td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-bold">🟡 Medium (42%)</span></td>
                  <td className="p-2.5 font-medium">Rain Expected (14.5mm)</td>
                  <td className="p-2.5 text-gray-600">Rainfall droplets disperse fungal spores across plant canopy.</td>
                </tr>
                <tr className="hover:bg-gray-50/80 bg-red-50/40">
                  <td className="p-2.5 font-bold text-gray-900">Day 3</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">🔴 Very High (88%)</span></td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">🟠 High (65%)</span></td>
                  <td className="p-2.5 font-medium">Rain + High Humidity</td>
                  <td className="p-2.5 text-red-700 font-semibold">High humidity + rainfall + flowering stage + 3 confirmed nearby outbreaks.</td>
                </tr>
                <tr className="hover:bg-gray-50/80 bg-red-50/40">
                  <td className="p-2.5 font-bold text-gray-900">Day 4</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">🔴 Very High (84%)</span></td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">🔴 High (72%)</span></td>
                  <td className="p-2.5 font-medium">Warm & Humid (90%)</td>
                  <td className="p-2.5 text-red-700 font-semibold">Pheromone trap count threshold exceeded (+112% moth count).</td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="p-2.5 font-bold text-gray-900">Day 5</td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">🟠 High (62%)</span></td>
                  <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">🟠 High (58%)</span></td>
                  <td className="p-2.5 font-medium">Cloudy, Wind 16km/h</td>
                  <td className="p-2.5 text-gray-600">Bio-fungicide spray effect expected to reduce spore germination.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Smart Mandi Price & FPO Bidding Intelligence */}
        <SmartMandiMarketplaceCard />

        {/* Advisory box */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800">Action Recommended</p>
              <p className="text-red-700 text-sm mt-1">{DEMO_RISK_SCORE.factors[0].description}</p>
              <p className="text-gray-500 text-xs mt-2 italic">Note: This forecast is based on weather and crop context. Actual disease/pest presence requires field inspection and expert confirmation.</p>
            </div>
          </div>
        </div>

        {/* Day cards */}
        <div>
          <h2 className="font-bold text-gray-800 mb-3">Daily Forecast</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {DEMO_RISK_SCORE.forecast.map(d => (
              <div key={d.date} className={`flex-shrink-0 w-36 card p-3 border-t-4 ${d.overallScore >= 55 ? 'border-t-red-500' : d.overallScore >= 35 ? 'border-t-yellow-500' : 'border-t-green-500'}`}>
                <p className="font-bold text-gray-700 text-sm">{d.dayLabel}</p>
                <p className="text-gray-400 text-xs">{d.date}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">🌡️ Temp</span><span className="font-medium">{d.temp}°C</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">💧 Hum</span><span className="font-medium">{d.humidity}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">🌧️ Rain</span><span className="font-medium">{d.rainfall}mm</span></div>
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRiskBgClass(d.diseaseRisk)}`}>{d.diseaseRisk.toUpperCase()}</span>
                </div>
                <p className="text-xl font-black text-center mt-1 text-gray-800">{d.overallScore}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
