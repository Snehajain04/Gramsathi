'use client';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { DEMO_NOTIFICATIONS } from '@/lib/mockData';
import { useState } from 'react';
import { toast } from 'sonner';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';

const TYPE_ICON: Record<string, string> = {
  emergency_sop: '🚨', risk_increase: '📈', expert_validation: '✅',
  diagnosis_complete: '📷', field_visit: '🚜', weather: '🌦️', advisory: '📋',
};

const TYPE_COLOR: Record<string, string> = {
  emergency_sop: 'bg-red-50 border-red-200', risk_increase: 'bg-orange-50 border-orange-200',
  expert_validation: 'bg-green-50 border-green-200', diagnosis_complete: 'bg-blue-50 border-blue-200',
  field_visit: 'bg-amber-50 border-amber-200', weather: 'bg-sky-50 border-sky-200',
  advisory: 'bg-purple-50 border-purple-200',
};

const FILTERS = ['All','Alerts','Advisories','Expert','Weather','Government'];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(DEMO_NOTIFICATIONS);
  const [filter, setFilter] = useState('All');

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const remove = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const markAll = () => { setNotifs(prev => prev.map(n => ({ ...n, isRead: true }))); toast.success('All notifications marked as read'); };
  const clearAll = () => { setNotifs([]); toast.info('All notifications cleared'); };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const filtered = filter === 'All' ? notifs :
    filter === 'Alerts' ? notifs.filter(n => n.type === 'emergency_sop' || n.type === 'risk_increase' || n.type === 'high_risk_alert' || n.type === 'pest_alert') :
    filter === 'Advisories' ? notifs.filter(n => n.type === 'emergency_sop' || n.type === 'diagnosis_complete') :
    filter === 'Expert' ? notifs.filter(n => n.type === 'expert_validation' || n.type === 'extension_message') :
    filter === 'Weather' ? notifs.filter(n => n.type === 'weather_warning') :
    filter === 'Government' ? notifs.filter(n => n.type === 'emergency_sop') : notifs;

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-green-600" /> Notifications
              {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={markAll} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 text-green-700 font-semibold rounded-xl hover:bg-green-100"><CheckCheck className="w-3.5 h-3.5" /> Mark All Read</button>
            <button onClick={clearAll} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /> Clear</button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
          ))}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">✅</div>
            <p className="font-bold text-gray-700 text-lg">You're all caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No notifications in this category.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => (
              <div key={n.id} className={`rounded-2xl border p-4 flex items-start gap-3 transition-all ${!n.isRead ? (TYPE_COLOR[n.type] || 'bg-blue-50 border-blue-200') : 'bg-white border-gray-100'}`}
                onClick={() => markRead(n.id)}>
                <span className="text-2xl flex-shrink-0">{TYPE_ICON[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                    <button onClick={e => { e.stopPropagation(); remove(n.id); }} className="text-gray-300 hover:text-red-500 flex-shrink-0"><X className="w-4 h-4" /></button>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-gray-400 text-xs">{n.createdAt.split('T')[0]}</span>
                    {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
