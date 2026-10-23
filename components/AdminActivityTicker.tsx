'use client';
import { useState, useEffect } from 'react';
import { Activity, Send, Bell, Users, AlertTriangle, CheckCircle, MapPin, Zap } from 'lucide-react';

// ── Mock activity entries ─────────────────────────────────────
const INITIAL_ACTIVITIES = [
  { id: 1, type: 'alert' as const, message: '🚨 New outbreak: Rice Blast in Nashik · 3 farms', time: '2m ago', district: 'Nashik' },
  { id: 2, type: 'broadcast' as const, message: '📢 SOP Broadcast sent to 1,247 farmers in Pune', time: '8m ago', district: 'Pune' },
  { id: 3, type: 'resolved' as const, message: '✅ Fall Armyworm contained in Wardha · 847 notified', time: '22m ago', district: 'Wardha' },
  { id: 4, type: 'report' as const, message: '📊 Dr. Sharma validated 7 expert cases today', time: '35m ago', district: 'Aurangabad' },
  { id: 5, type: 'user' as const, message: '👨‍🌾 +37 new farmers registered this hour', time: '41m ago', district: 'All' },
  { id: 6, type: 'alert' as const, message: '⚠️ High humidity (91%) — Fungal risk elevated for 72hr', time: '1h ago', district: 'Vidarbha' },
  { id: 7, type: 'broadcast' as const, message: '📢 Emergency SOP for Cotton Bollworm activated', time: '2h ago', district: 'Yavatmal' },
  { id: 8, type: 'resolved' as const, message: '✅ Powdery Mildew alert closed — 23 farms treated', time: '3h ago', district: 'Kolhapur' },
];

const ACTIVITY_DOT: Record<string, string> = {
  alert: 'bg-rose-500',
  broadcast: 'bg-indigo-500',
  resolved: 'bg-emerald-500',
  report: 'bg-purple-500',
  user: 'bg-amber-500',
};

const BROADCAST_TARGETS = ['All Farmers', 'Nashik District', 'Pune District', 'Vidarbha Region', 'Marathwada', 'Konkan'];

export default function AdminActivityTicker() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('All Farmers');
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);

  // Simulate live incoming events
  useEffect(() => {
    const LIVE_EVENTS = [
      '🆕 New disease report filed in Solapur · Cotton BLB',
      '👩‍🔬 Expert Dr. Kulkarni verified 3 cases',
      '📍 Satellite scan flagged high-risk zone in Amravati',
      '🌡️ Temperature drop detected — pest activity may increase',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const msg = LIVE_EVENTS[idx % LIVE_EVENTS.length];
      idx++;
      setActivities(prev => [
        {
          id: Date.now(),
          type: 'alert' as const,
          message: msg,
          time: 'just now',
          district: 'Live',
        },
        ...prev.slice(0, 11),
      ]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    const newActivity = {
      id: Date.now(),
      type: 'broadcast' as const,
      message: `📢 Broadcast to ${broadcastTarget}: "${broadcastMsg}"`,
      time: 'just now',
      district: broadcastTarget,
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 11)]);
    setLastSent(broadcastMsg);
    setBroadcastMsg('');
    setSending(false);
  };

  return (
    <div className="space-y-4">
      {/* Broadcast Form */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">📡 Emergency Broadcast</h3>
            <p className="text-slate-500 text-xs">Send instant alerts to farmers/extension workers</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <select
              value={broadcastTarget}
              onChange={e => setBroadcastTarget(e.target.value)}
              className="flex-shrink-0 bg-slate-50 text-slate-800 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              {BROADCAST_TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="text"
              value={broadcastMsg}
              onChange={e => setBroadcastMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBroadcast()}
              placeholder="Type emergency alert message..."
              className="flex-1 bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400"
            />
            <button
              onClick={handleBroadcast}
              disabled={sending || !broadcastMsg.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              {sending ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
          {lastSent && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-800 text-xs font-medium">Sent: &quot;{lastSent}&quot;</p>
            </div>
          )}
        </div>
      </div>

      {/* Live Activity Ticker */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Live Activity Feed</h3>
              <p className="text-slate-500 text-xs">Real-time system events · Updates every 15s</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-700 text-xs font-bold">LIVE</span>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {activities.map((a, i) => (
            <div
              key={a.id}
              className={`flex items-start gap-3 px-4.5 py-3 transition-all hover:bg-slate-50/80 ${i === 0 ? 'animate-slideDown' : ''}`}
            >
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${ACTIVITY_DOT[a.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 text-xs font-medium leading-relaxed">{a.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-500 text-[10px] font-medium">{a.time}</span>
                  {a.district !== 'All' && (
                    <span className="flex items-center gap-0.5 text-[10px] text-slate-500 font-semibold">
                      <MapPin className="w-2.5 h-2.5" />{a.district}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200">
          <p className="text-slate-500 text-xs text-center flex items-center justify-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Showing {activities.length} recent events · Auto-refreshes
          </p>
        </div>
      </div>
    </div>
  );
}
