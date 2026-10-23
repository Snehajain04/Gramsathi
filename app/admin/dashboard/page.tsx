'use client';
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/authContext';
import { HOTSPOT_DATA, DEMO_ALERTS, DEMO_DASHBOARD_STATS, DISEASE_TREND_DATA, STATE_RISK_DATA } from '@/lib/mockData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, MapPin, AlertTriangle, Activity, Bug, Map, Clock, Target, X, Send, Bell, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminActivityTicker from '@/components/AdminActivityTicker';
import ContinuousLearningDashboard from '@/components/ContinuousLearningDashboard';

const HotspotMap = dynamic(() => import('@/components/maps/HotspotMap'), { ssr: false, loading: () => <div className="flex items-center justify-center h-[420px] bg-slate-100 rounded-2xl text-slate-500 font-medium">Loading map...</div> });

const PIE_DATA = [
  { name: 'Rice', value: 35 }, { name: 'Maize', value: 20 }, { name: 'Cotton', value: 15 },
  { name: 'Tomato', value: 15 }, { name: 'Others', value: 15 },
];
const PIE_COLORS = ['#16a34a','#2563eb','#d97706','#dc2626','#7c3aed'];

type ModalType = 'alert' | 'workers' | 'advisory' | null;

export default function AdminDashboard() {
  const { t } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedAlert, setSelectedAlert] = useState<typeof DEMO_ALERTS[0] | null>(null);
  const [advisoryText, setAdvisoryText] = useState('');
  const [alertsSent, setAlertsSent] = useState<Set<string>>(new Set());

  const statCards = [
    { label: t('total_farmers'), value: '10,847', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+247 this week' },
    { label: t('total_farms'), value: '18,293', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+89 this week' },
    { label: t('active_alerts'), value: '47', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+12 today' },
    { label: t('disease_reports'), value: '312', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+8% this month' },
    { label: t('pest_reports_stat'), value: '198', icon: Bug, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: '+23 today' },
    { label: t('high_risk_districts'), value: '8', icon: Map, color: 'text-red-600', bg: 'bg-red-50', trend: '3 new' },
    { label: t('pending_cases'), value: '64', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-12 resolved' },
    { label: t('ai_accuracy'), value: '93%', icon: Target, color: 'text-teal-600', bg: 'bg-teal-50', trend: '+1.2% this month' },
  ];

  const openAlertModal = (alert: typeof DEMO_ALERTS[0], type: ModalType) => {
    setSelectedAlert(alert);
    setActiveModal(type);
  };

  const handleSendAlert = () => {
    if (selectedAlert) {
      setAlertsSent(prev => new Set(prev).add(selectedAlert.id));
      toast.success(`🚨 Farmer alert sent for ${selectedAlert.district}! SMS dispatched to 847 farmers.`);
      setActiveModal(null);
    }
  };

  const handleNotifyWorkers = () => {
    if (selectedAlert) {
      toast.success(`📢 Extension workers notified for ${selectedAlert.district}! 12 field officers alerted.`);
      setActiveModal(null);
    }
  };

  const handlePublishAdvisory = () => {
    if (!advisoryText.trim()) { toast.error('Please write the advisory message'); return; }
    toast.success('✅ Advisory published! Visible to all farmers in affected regions.');
    setAdvisoryText('');
    setActiveModal(null);
  };

  return (
    <>
      <AdminLayout>
        <div className="p-4 lg:p-6 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{t('agri_intelligence_dashboard') || 'Agricultural Intelligence Dashboard'}</h1>
              <p className="text-slate-600 text-sm mt-0.5">{t('admin_dashboard_sub')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-200">● {t('sop_active') || 'SOP ACTIVE'}</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-200">● {t('live_system') || 'Live System'}</span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {statCards.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{s.label}</span>
                    <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.trend}</p>
                </div>
              );
            })}
          </div>

          {/* Hotspot Map */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                🗺️ {t('live_hotspot_map') || 'Live Disease & Pest Hotspot Map'}
              </h2>
              <div className="flex gap-2 text-xs flex-wrap">
                {[['🔴','Critical'],['🟠','High'],['🟡','Medium'],['🟢','Low']].map(([dot, label]) => (
                  <span key={label} className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-semibold border border-slate-200">{dot} {label}</span>
                ))}
              </div>
            </div>
            <HotspotMap data={HOTSPOT_DATA} height="420px" />
            <p className="text-slate-500 text-xs mt-2 font-medium">Circle size = report volume · Click any marker for details</p>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Disease Trend */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 mb-4 text-base">Disease Trend (6 months)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={DISEASE_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#ffffff' }} />
                  <Legend />
                  {['blast','blight','mildew','armyworm'].map((key, i) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={['#dc2626','#d97706','#16a34a','#7c3aed'][i]} strokeWidth={2.5} dot={false} name={key.charAt(0).toUpperCase() + key.slice(1)} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Crop Distribution */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 mb-4 text-base">Crop-wise Reports</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#ffffff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {PIE_DATA.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} /><span className="text-slate-600">{d.name}</span></div>
                    <span className="text-slate-900 font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* State Risk Bar Chart */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-4 text-base">State-wise Disease Risk Index</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={STATE_RISK_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="state" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#ffffff' }} />
                <Bar dataKey="diseaseRisk" name="Disease Risk" radius={[4, 4, 0, 0]}>
                  {STATE_RISK_DATA.map((d, i) => <Cell key={i} fill={d.diseaseRisk >= 70 ? '#dc2626' : d.diseaseRisk >= 50 ? '#d97706' : '#16a34a'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Early Warning Alerts */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-4 text-base">🚨 Early Warning Alerts</h3>
            <div className="space-y-3">
              {DEMO_ALERTS.map(alert => (
                <div key={alert.id} className={`rounded-xl border p-4.5 transition-all ${alert.severity === 'high' ? 'bg-rose-50/70 border-rose-200' : 'bg-amber-50/70 border-amber-200'}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${alert.severity === 'high' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'}`}>{alert.severity.toUpperCase()}</span>
                        <span className="text-slate-600 text-xs font-semibold">{alert.district}, {alert.state} · {alert.affectedCrop || 'Rice'}</span>
                      </div>
                      <p className="text-slate-900 font-bold text-base">{alert.title}</p>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">{alert.message}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openAlertModal(alert, 'alert')}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs ${alertsSent.has(alert.id) ? 'bg-slate-200 text-slate-500 cursor-default' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
                        disabled={alertsSent.has(alert.id)}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        {alertsSent.has(alert.id) ? 'Sent ✓' : 'Send Alert'}
                      </button>
                      <button onClick={() => openAlertModal(alert, 'workers')} className="text-xs px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs">
                        <Send className="w-3.5 h-3.5" /> Notify Workers
                      </button>
                      <button onClick={() => openAlertModal(alert, 'advisory')} className="text-xs px-3 py-1.5 bg-white text-slate-700 border border-slate-300 font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-xs">
                        <FileText className="w-3.5 h-3.5" /> Create Advisory
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features 12 & 13: Continuous Learning & AI-Human Disagreement Hub */}
          <ContinuousLearningDashboard />

          {/* Live Activity Feed + Broadcast */}
          <AdminActivityTicker />
        </div>
      </AdminLayout>

      {/* ── Alert Modal ── */}
      {activeModal === 'alert' && selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-black text-lg flex items-center gap-2"><Bell className="w-5 h-5 text-rose-600" /> Send Farmer Alert</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
              <p className="text-rose-900 font-bold text-sm">{selectedAlert.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{selectedAlert.district}, {selectedAlert.state}</p>
              <p className="text-slate-700 text-xs mt-2 leading-relaxed">{selectedAlert.message}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 font-medium">
              <p>📱 <strong className="text-slate-900 font-bold">847 farmers</strong> in {selectedAlert.district} will receive SMS</p>
              <p>📬 App push notification will be dispatched</p>
              <p>🏛️ Notification will appear in farmer dashboards</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">Cancel</button>
              <button onClick={handleSendAlert} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
                <Send className="w-4 h-4" /> Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notify Workers Modal ── */}
      {activeModal === 'workers' && selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-black text-lg flex items-center gap-2"><Send className="w-5 h-5 text-indigo-600" /> Notify Extension Workers</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <p className="text-indigo-950 font-bold text-sm">{selectedAlert.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{selectedAlert.district}, {selectedAlert.state}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 font-medium">
              <p>👷 <strong className="text-slate-900 font-bold">12 field extension officers</strong> will be notified</p>
              <p>⏱️ Field visit SLA: 48-hour response required</p>
              <p>📋 Case will be created and tracked in their dashboard</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">Cancel</button>
              <button onClick={handleNotifyWorkers} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4" /> Notify Workers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Advisory Modal ── */}
      {activeModal === 'advisory' && selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-black text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-600" /> Create Advisory</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 p-1"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-slate-600 text-xs">For: <strong className="text-slate-900">{selectedAlert.district}</strong> — {selectedAlert.title}</p>
            <textarea
              rows={5}
              value={advisoryText}
              onChange={e => setAdvisoryText(e.target.value)}
              placeholder="Write the official advisory message for farmers in this region... (e.g. Apply Tricyclazole 75% WP at 0.6g/L water. Drain excess water from fields...)"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none font-normal"
            />
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">Cancel</button>
              <button onClick={handlePublishAdvisory} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
                <Send className="w-4 h-4" /> Publish Advisory
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
