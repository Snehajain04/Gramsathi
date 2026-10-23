'use client';

import { useState } from 'react';
import ExtensionLayout from '@/components/layout/ExtensionLayout';
import { DEMO_ALERTS } from '@/lib/mockData';
import { Bell, Send, AlertTriangle, CloudRain, Bug, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getRiskBgClass } from '@/lib/riskEngine';
import type { Alert } from '@/types';

export default function ExtensionAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastVillage, setBroadcastVillage] = useState('All Assigned Villages');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      toast.error('Please enter alert title and message.');
      return;
    }

    const newAlert: Alert = {
      id: `a_${Date.now()}`,
      type: 'early_warning',
      severity: 'high',
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      region: broadcastVillage,
      district: 'Pune',
      state: 'Maharashtra',
      riskFactors: ['Extension field observation', 'Hyperlocal weather alert'],
      recommendedAction: 'Inspect crop immediately and apply preventive IPM steps.',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setAlerts([newAlert, ...alerts]);
    toast.success(`Alert broadcast sent to ~1,240 farmers in ${broadcastVillage}!`);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <ExtensionLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-700" /> Early Warning Bulletins & Alerts
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Disseminate urgent weather risk advisories and outbreak warnings to farmers under your supervision.
          </p>
        </div>

        {/* Quick Broadcast Composer */}
        <div className="card p-5 border border-blue-100 bg-gradient-to-br from-blue-50/40 via-white to-white space-y-4">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
            <Send className="w-4 h-4 text-blue-700" /> Broadcast Field Alert to Farmers
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="field-label">Alert Headline *</label>
                <input
                  required
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  placeholder="e.g., Heavy Rainfall Warning — Inspect Drainage"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Target Area</label>
                <select
                  value={broadcastVillage}
                  onChange={e => setBroadcastVillage(e.target.value)}
                  className="input-field"
                >
                  <option>All Assigned Villages</option>
                  <option>Koregaon Bhima only</option>
                  <option>Shirur Taluka only</option>
                  <option>Daund & Yavat only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Advisory Message *</label>
              <textarea
                required
                rows={2}
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Write concise guidance in simple language..."
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="btn-primary bg-blue-700 hover:bg-blue-800 flex items-center gap-2 text-xs py-2.5 px-5 shadow-sm"
            >
              <Send className="w-4 h-4" /> Send Instant Push & SMS Alert
            </button>
          </form>
        </div>

        {/* Active Alerts List */}
        <div className="space-y-3">
          <h2 className="font-bold text-gray-800 text-lg">Active Local Bulletins</h2>
          {alerts.map(a => (
            <div
              key={a.id}
              className={`card p-5 border-l-4 transition-all ${
                a.severity === 'high' ? 'border-l-red-500' : 'border-l-yellow-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getRiskBgClass(a.severity)}`}>
                      {a.severity.toUpperCase()} ALERT
                    </span>
                    <span className="text-xs text-gray-400">📍 {a.region}, {a.district}</span>
                    <span className="text-xs text-gray-400">📅 {a.createdAt.split('T')[0]}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{a.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{a.message}</p>
                  <p className="text-xs text-gray-400 italic">Action: {a.recommendedAction}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => toast.success(`Alert resubmitted to extension queue`)}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100"
                  >
                    Resend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ExtensionLayout>
  );
}
