'use client';
import ExtensionLayout from '@/components/layout/ExtensionLayout';
import { useAuth } from '@/lib/authContext';
import { DEMO_CASES, DEMO_FIELD_VISITS, getLocalizedCases, getLocalizedFieldVisits } from '@/lib/mockData';
import { getRiskBgClass } from '@/lib/riskEngine';
import { toast } from 'sonner';
import { Users, AlertTriangle, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Case, FieldVisit } from '@/types';
import ExtensionRoutePlanner from '@/components/ExtensionRoutePlanner';

export default function ExtensionDashboard() {
  const { t, language } = useAuth();

  const stats = [
    { icon: '👥', label: t('assigned_farmers'), value: '124', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    { icon: '🚨', label: t('active_alerts'), value: '18', color: 'bg-red-50 border-red-200', text: 'text-red-700' },
    { icon: '⏳', label: t('pending_validations'), value: '7', color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' },
    { icon: '📍', label: t('high_risk_areas'), value: '4', color: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  ];

  return (
    <ExtensionLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-800">{t('extension_worker_dashboard') || 'Extension Worker Dashboard'}</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`card p-4 border ${s.color}`}>
              <span className="text-2xl">{s.icon}</span>
              <p className={`text-3xl font-black mt-1 ${s.text}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Priority Cases */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-lg">{t('priority_cases')}</h2>
            <Link href="/extension/cases" className="text-blue-600 text-sm font-semibold hover:underline">{t('view')} →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-blue-50 text-blue-800 text-xs font-semibold">
                <th className="text-left px-3 py-2 rounded-l-lg">{t('farmer_col')}</th>
                <th className="text-left px-3 py-2">{t('village_col')}</th>
                <th className="text-left px-3 py-2">{t('crop_col')}</th>
                <th className="text-left px-3 py-2">{t('problem_col')}</th>
                <th className="text-left px-3 py-2">{t('risk_col')}</th>
                <th className="text-left px-3 py-2 rounded-r-lg">{t('actions_col')}</th>
              </tr></thead>
              <tbody>
                {getLocalizedCases(language).map((c: Case, i: number) => (
                  <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">{c.farmerName.split(' ').map((w: string) => w[0]).join('')}</div>
                        <span className="font-medium text-gray-800 text-xs">{c.farmerName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{c.village}</td>
                    <td className="px-3 py-2.5 text-gray-600 text-xs">{c.crop}</td>
                    <td className="px-3 py-2.5 text-gray-600 text-xs max-w-[150px] truncate">{c.problem}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRiskBgClass(c.riskLevel)}`}>{t(c.riskLevel) || c.riskLevel.toUpperCase()}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => toast.info('Opening case details...')} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100">{t('view')}</button>
                        <button onClick={() => toast.success('Field visit scheduled!')} className="text-xs px-2 py-1 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100">{t('visit')}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature 15: Extension Worker GPS Route Optimization */}
        <ExtensionRoutePlanner />

        {/* Field Visits */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-4">{t('upcoming_field_visits')}</h2>
          <div className="space-y-3">
            {getLocalizedFieldVisits(language).map((v: FieldVisit) => (
              <div key={v.id} className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${v.status === 'scheduled' ? 'bg-blue-50 border-blue-200' : v.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.status === 'completed' ? 'bg-green-100 text-green-700' : v.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{t(v.status) || v.status}</span>
                    {v.scheduledDate && <span className="text-gray-400 text-xs">📅 {v.scheduledDate}</span>}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{v.farmerName} — {v.farmName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{v.notes || v.observations}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toast.success('Visit status updated!')} className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('update') || 'Update'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Villages */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-4">{t('assigned_villages') || 'Assigned Villages'}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'Koregaon Bhima', risk: 'HIGH', farmers: 3, color: 'border-red-200 bg-red-50' },
              { name: 'Shirur', risk: 'MEDIUM', farmers: 5, color: 'border-yellow-200 bg-yellow-50' },
              { name: 'Daund', risk: 'LOW', farmers: 8, color: 'border-green-200 bg-green-50' },
              { name: 'Yavat', risk: 'MEDIUM', farmers: 2, color: 'border-yellow-200 bg-yellow-50' },
            ].map(v => (
              <div key={v.name} className={`rounded-xl border p-3 flex items-center justify-between ${v.color}`}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{v.name}</p>
                    <p className="text-gray-400 text-xs">{v.farmers} {t('farmers_count') || 'farmers'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.risk === 'HIGH' ? 'bg-red-100 text-red-700' : v.risk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{t(v.risk.toLowerCase())?.toUpperCase() || v.risk}</span>
                  <button onClick={() => toast.info(`Viewing farmers in ${v.name}...`)} className="text-xs px-2 py-1 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50">{t('view') || 'View'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ExtensionLayout>
  );
}
