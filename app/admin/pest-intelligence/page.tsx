'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  AlertTriangle,
  Bug,
  Radio,
  Shield,
  Download,
  Filter,
  RefreshCw,
  Send,
  MapPin,
  TrendingUp,
  Flame,
  Layers,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { toast } from 'sonner';

interface TrapRecord {
  id: string;
  location: string;
  district: string;
  state: string;
  trapType: 'Pheromone' | 'Light' | 'Yellow Sticky';
  pestType: string;
  scientificName: string;
  crop: string;
  lastCount: number;
  etlThreshold: number;
  status: 'normal' | 'monitoring' | 'above_etl' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
}

const INITIAL_TRAPS: TrapRecord[] = [
  {
    id: 'TRAP-MH-01',
    location: 'Shirur Block A',
    district: 'Pune',
    state: 'Maharashtra',
    trapType: 'Pheromone',
    pestType: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    crop: 'Maize & Rice',
    lastCount: 28,
    etlThreshold: 15,
    status: 'above_etl',
    trend: 'increasing',
    lastUpdated: 'Today, 08:30 AM',
  },
  {
    id: 'TRAP-MH-02',
    location: 'Yavat Sector 4',
    district: 'Pune',
    state: 'Maharashtra',
    trapType: 'Yellow Sticky',
    pestType: 'Whitefly',
    scientificName: 'Bemisia tabaci',
    crop: 'Cotton & Chilli',
    lastCount: 14,
    etlThreshold: 20,
    status: 'monitoring',
    trend: 'stable',
    lastUpdated: 'Today, 09:15 AM',
  },
  {
    id: 'TRAP-TS-01',
    location: 'Warangal Rural',
    district: 'Warangal',
    state: 'Telangana',
    trapType: 'Pheromone',
    pestType: 'Pink Bollworm',
    scientificName: 'Pectinophora gossypiella',
    crop: 'Cotton',
    lastCount: 34,
    etlThreshold: 18,
    status: 'critical',
    trend: 'increasing',
    lastUpdated: 'Yesterday, 06:00 PM',
  },
  {
    id: 'TRAP-PB-03',
    location: 'Ludhiana North',
    district: 'Ludhiana',
    state: 'Punjab',
    trapType: 'Light',
    pestType: 'Brown Plant Hopper',
    scientificName: 'Nilaparvata lugens',
    crop: 'Paddy Rice',
    lastCount: 42,
    etlThreshold: 25,
    status: 'above_etl',
    trend: 'increasing',
    lastUpdated: 'Yesterday, 08:45 PM',
  },
  {
    id: 'TRAP-AP-05',
    location: 'Guntur Fields',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    trapType: 'Yellow Sticky',
    pestType: 'Chilli Thrips',
    scientificName: 'Scirtothrips dorsalis',
    crop: 'Chilli',
    lastCount: 12,
    etlThreshold: 20,
    status: 'normal',
    trend: 'decreasing',
    lastUpdated: '2 days ago',
  },
  {
    id: 'TRAP-KA-02',
    location: 'Dharwad Farm Unit',
    district: 'Dharwad',
    state: 'Karnataka',
    trapType: 'Pheromone',
    pestType: 'Stem Borer',
    scientificName: 'Scirpophaga incertulas',
    crop: 'Soybean',
    lastCount: 19,
    etlThreshold: 16,
    status: 'above_etl',
    trend: 'increasing',
    lastUpdated: 'Yesterday, 11:20 AM',
  },
];

const WEEKLY_CATCH_DATA = [
  { week: 'Wk 28', armyworm: 12, bollworm: 8, bph: 15, whitefly: 6 },
  { week: 'Wk 29', armyworm: 16, bollworm: 11, bph: 19, whitefly: 8 },
  { week: 'Wk 30', armyworm: 22, bollworm: 15, bph: 24, whitefly: 10 },
  { week: 'Wk 31', armyworm: 29, bollworm: 24, bph: 33, whitefly: 12 },
  { week: 'Wk 32', armyworm: 38, bollworm: 34, bph: 42, whitefly: 14 },
];

export default function AdminPestIntelligencePage() {
  const [traps] = useState<TrapRecord[]>(INITIAL_TRAPS);
  const [filterPest, setFilterPest] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [selectedTrapForDirective, setSelectedTrapForDirective] = useState<TrapRecord | null>(null);
  const [directiveMessage, setDirectiveMessage] = useState('');
  const [directivePriority, setDirectivePriority] = useState<'high' | 'critical'>('critical');

  const filteredTraps = useMemo(() => {
    return traps.filter(t => {
      const matchPest = filterPest === 'All' || t.pestType === filterPest;
      const matchState = filterState === 'All' || t.state === filterState;
      return matchPest && matchState;
    });
  }, [traps, filterPest, filterState]);

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrapForDirective) return;
    toast.success(
      `Pest containment directive dispatched to ${selectedTrapForDirective.district} extension teams!`
    );
    setSelectedTrapForDirective(null);
    setDirectiveMessage('');
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 text-slate-900 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bug className="w-6 h-6 text-amber-600" />
              National Pest Intelligence & Telemetry Network
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Automated pheromone & optical trap network monitoring, Economic Threshold Level (ETL) breaches, and invasive vector tracking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success('Surveillance feed refreshed with latest IoT telemetry!')}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Refresh telemetry"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Sync IoT</span>
            </button>
            <button
              onClick={() => toast.success('Pest Surveillance Bulletin (PDF) generated!')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" /> Export Pest Bulletin
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Connected Traps</p>
              <Radio className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">1,482</p>
            <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 98.4% online telemetry
            </p>
          </div>

          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-red-700 font-semibold uppercase tracking-wider">ETL Breaches</p>
              <Flame className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-black text-red-700 mt-2">4 Traps</p>
            <p className="text-xs text-red-600 font-medium mt-1">Exceeding economic threshold</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider">Invasive Vector Threat</p>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-700 mt-2">Level 2</p>
            <p className="text-xs text-slate-500 mt-1">Fall Armyworm + Pink Bollworm</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Pheromone Supply</p>
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">18,500 Lures</p>
            <p className="text-xs text-blue-600 font-medium mt-1">Stocked in State KVK depots</p>
          </div>
        </div>

        {/* Invasive Pest Surveillance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  High Surveillance
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Fall Armyworm</h3>
                <p className="text-xs text-slate-500 italic">Spodoptera frugiperda</p>
              </div>
              <span className="text-3xl">🐛</span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Crop:</span>
                <span className="font-semibold text-slate-900">Maize, Sorghum, Rice</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hotspot Zones:</span>
                <span className="font-semibold text-red-600">Pune (MH), Karimnagar (TS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mean Trap Density:</span>
                <span className="font-bold text-amber-700">28 moths/trap/week (ETL: 15)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Critical Warning
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Pink Bollworm</h3>
                <p className="text-xs text-slate-500 italic">Pectinophora gossypiella</p>
              </div>
              <span className="text-3xl">🦗</span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Crop:</span>
                <span className="font-semibold text-slate-900">Bt & Non-Bt Cotton</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hotspot Zones:</span>
                <span className="font-semibold text-amber-700">Warangal, Aurangabad</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mean Trap Density:</span>
                <span className="font-bold text-red-600">34 moths/trap/night (ETL: 18)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Vigilance Active
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Desert Locust Index</h3>
                <p className="text-xs text-slate-500 italic">Schistocerca gregaria</p>
              </div>
              <span className="text-3xl">🌾</span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Western Border:</span>
                <span className="font-semibold text-green-700">Normal / Green Zone</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Radar Swarm Tracking:</span>
                <span className="font-semibold text-slate-900">0 swarms detected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">LWO Coordination:</span>
                <span className="font-semibold text-blue-700">Jodhpur & Bikaner active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Catch Trajectory Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Pest Population Trajectory & Catch Multiplier (Weekly)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Average weekly adult moth catches across high-density trap sectors</p>
            </div>
            <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-medium">
              Automated 7-Day Moving Avg
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_CATCH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArmy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBoll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBph" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="armyworm" name="Fall Armyworm (Maize)" stroke="#ef4444" fillOpacity={1} fill="url(#colorArmy)" strokeWidth={2} />
                <Area type="monotone" dataKey="bollworm" name="Pink Bollworm (Cotton)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBoll)" strokeWidth={2} />
                <Area type="monotone" dataKey="bph" name="Brown Plant Hopper (Paddy)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBph)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Trap Network & ETL Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Live Trap Network & Threshold Monitoring
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time counts with automatic Economic Threshold Level breach highlighting</p>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={filterPest}
                  onChange={e => setFilterPest(e.target.value)}
                  className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
                >
                  <option value="All">All Pests</option>
                  <option value="Fall Armyworm">Fall Armyworm</option>
                  <option value="Pink Bollworm">Pink Bollworm</option>
                  <option value="Whitefly">Whitefly</option>
                  <option value="Brown Plant Hopper">Brown Plant Hopper</option>
                  <option value="Stem Borer">Stem Borer</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={filterState}
                  onChange={e => setFilterState(e.target.value)}
                  className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
                >
                  <option value="All">All States</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] text-slate-600 font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Trap & Location</th>
                  <th className="px-4 py-3">Pest Vector</th>
                  <th className="px-4 py-3">Crop Affected</th>
                  <th className="px-4 py-3">Count vs ETL</th>
                  <th className="px-4 py-3">Severity & Trend</th>
                  <th className="px-4 py-3">Last Sync</th>
                  <th className="px-4 py-3 text-right rounded-r-xl">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTraps.map(trap => {
                  const percentage = Math.min(Math.round((trap.lastCount / trap.etlThreshold) * 100), 200);
                  const isBreached = trap.lastCount >= trap.etlThreshold;

                  return (
                    <tr key={trap.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold">
                            {trap.id}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{trap.location}</p>
                            <p className="text-[11px] text-slate-500">{trap.district}, {trap.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{trap.pestType}</p>
                        <p className="text-[10px] text-slate-500 italic">{trap.scientificName}</p>
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                          {trap.trapType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {trap.crop}
                      </td>
                      <td className="px-4 py-3.5 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                          <span className={isBreached ? 'text-red-600 font-bold' : 'text-green-700 font-bold'}>
                            {trap.lastCount} insects
                          </span>
                          <span className="text-slate-400 font-normal">ETL: {trap.etlThreshold}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percentage > 120
                                ? 'bg-red-500'
                                : percentage >= 100
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {trap.status === 'critical' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded-full text-[10px] font-bold">
                              CRITICAL
                            </span>
                          )}
                          {trap.status === 'above_etl' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold">
                              ABOVE ETL
                            </span>
                          )}
                          {trap.status === 'monitoring' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[10px] font-bold">
                              MONITORING
                            </span>
                          )}
                          {trap.status === 'normal' && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 border border-green-200 rounded-full text-[10px] font-bold">
                              NORMAL
                            </span>
                          )}
                          <span className="text-slate-500 text-[11px] capitalize font-medium">({trap.trend})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-[11px] font-medium">
                        {trap.lastUpdated}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedTrapForDirective(trap);
                            setDirectiveMessage(
                              `URGENT NOTICE: ${trap.pestType} trap readings in ${trap.location} have exceeded economic injury levels. All extension workers in ${trap.district} are directed to initiate mandatory farm inspections and coordinate bio-agent sprays.`
                            );
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <Send className="w-3 h-3" /> Issue Directive
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Issue Containment Directive */}
        {selectedTrapForDirective && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
              <button
                onClick={() => setSelectedTrapForDirective(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Issue Pest Control Directive</h3>
                  <p className="text-xs text-slate-500">
                    District: {selectedTrapForDirective.district} ({selectedTrapForDirective.state}) • Pest: {selectedTrapForDirective.pestType}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <p className="text-slate-600">
                  Current Count: <span className="text-red-600 font-bold">{selectedTrapForDirective.lastCount}</span> (ETL Threshold: {selectedTrapForDirective.etlThreshold})
                </p>
                <p className="text-slate-600">
                  Affected Crops: <span className="text-slate-900 font-semibold">{selectedTrapForDirective.crop}</span>
                </p>
              </div>

              <form onSubmit={handleSendDirective} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Directive Severity
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDirectivePriority('high')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        directivePriority === 'high'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      High Priority (48h Action)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectivePriority('critical')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        directivePriority === 'critical'
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Critical Outbreak (Immediate)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Containment Measures & Instructions
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={directiveMessage}
                    onChange={e => setDirectiveMessage(e.target.value)}
                    placeholder="Specify IPM guidance, emergency biocontrol release, or targeted pheromone lure distribution..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrapForDirective(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch to Extension Fleet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
