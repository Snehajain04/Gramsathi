'use client';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { DEMO_SENSORS, getLocalizedCropTimeline } from '@/lib/mockData';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, AlertTriangle, XCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';
import SatelliteNDVIDroneCard from '@/components/SatelliteNDVIDroneCard';

const SENSOR_ICONS: Record<string, string> = { temperature: '🌡️', soil_moisture: '💧', humidity: '💦', rainfall: '🌧️' };

const MONITORING_TASKS_I18N: Record<string, {
  task: string; freq: string; last: string; next: string; status: string; warn?: boolean;
}[]> = {
  en: [
    { task: 'Field Inspection', freq: 'Every 2 days', last: 'Aug 4', next: 'Aug 6', status: 'Due soon', warn: true },
    { task: 'Trap Count Check', freq: 'Weekly', last: 'Aug 2', next: 'Aug 9', status: 'Normal', warn: false },
    { task: 'Soil Test', freq: 'Monthly', last: 'Jul 15', next: 'Aug 15', status: 'Normal', warn: false },
    { task: 'Expert Consultation', freq: 'As needed', last: 'Jul 28', next: '—', status: 'On demand', warn: false },
  ],
  hi: [
    { task: 'खेत का निरीक्षण', freq: 'हर 2 दिन', last: '4 अगस्त', next: '6 अगस्त', status: 'जल्द देय', warn: true },
    { task: 'कीट जाल गिनती', freq: 'साप्ताहिक', last: '2 अगस्त', next: '9 अगस्त', status: 'सामान्य', warn: false },
    { task: 'मृदा परीक्षण', freq: 'मासिक', last: '15 जुलाई', next: '15 अगस्त', status: 'सामान्य', warn: false },
    { task: 'विशेषज्ञ सलाह', freq: 'आवश्यकतानुसार', last: '28 जुलाई', next: '—', status: 'मांग पर', warn: false },
  ],
  mr: [
    { task: 'शेताची पाहणी', freq: 'दर २ दिवसांनी', last: '४ ऑगस्ट', next: '६ ऑगस्ट', status: 'लवकरच देय', warn: true },
    { task: 'कामगंध सापळा मोजणी', freq: 'साप्ताहिक', last: '२ ऑगस्ट', next: '९ ऑगस्ट', status: 'सामान्य', warn: false },
    { task: 'माती परीक्षण', freq: 'मासिक', last: '१५ जुलै', next: '१५ ऑगस्ट', status: 'सामान्य', warn: false },
    { task: 'तज्ज्ञ सल्ला', freq: 'गरजेनुसार', last: '२८ जुलै', next: '—', status: 'मागणीनुसार', warn: false },
  ],
  te: [
    { task: 'పొలం తనిఖీ', freq: 'ప్రతి 2 రోజులకు', last: 'ఆగస్టు 4', next: 'ఆగస్టు 6', status: 'త్వరలో వర్తించు', warn: true },
    { task: 'పురుగుల ట్రాప్ గణన', freq: 'వారానికొకసారి', last: 'ఆగస్టు 2', next: 'ఆగస్టు 9', status: 'సాధారణం', warn: false },
    { task: 'నేల పరీక్ష', freq: 'నెలవారీ', last: 'జూలై 15', next: 'ఆగస్టు 15', status: 'సాధారణం', warn: false },
    { task: 'నిపుణుల సంప్రదింపు', freq: 'అవసరాన్ని బట్టి', last: 'జూలై 28', next: '—', status: 'డిమాండ్‌పై', warn: false },
  ]
};

const IOT_SENSORS_I18N: Record<string, { name: string; status: string; ok: boolean; warn?: boolean }[]> = {
  en: [
    { name: 'Temperature Sensor', status: 'Connected', ok: true },
    { name: 'Humidity Sensor', status: 'Connected', ok: true },
    { name: 'Rainfall Gauge', status: 'Connected', ok: true },
    { name: 'Soil Moisture Sensor', status: 'Low Battery ⚠️', ok: false, warn: true },
    { name: 'Smart Pest Trap', status: 'Not Connected', ok: false },
  ],
  hi: [
    { name: 'तापमान सेंसर', status: 'कनेक्टेड', ok: true },
    { name: 'आर्द्रता सेंसर', status: 'कनेक्टेड', ok: true },
    { name: 'वर्षा गेज', status: 'कनेक्टेड', ok: true },
    { name: 'मृदा नमी सेंसर', status: 'कम बैटरी ⚠️', ok: false, warn: true },
    { name: 'स्मार्ट कीट जाल', status: 'कनेक्टेड नहीं', ok: false },
  ],
  mr: [
    { name: 'तापमान सेन्सर', status: 'कनेक्टेड', ok: true },
    { name: 'आर्द्रता सेन्सर', status: 'कनेक्टेड', ok: true },
    { name: 'पाऊस मापक', status: 'कनेक्टेड', ok: true },
    { name: 'माती ओलावा सेन्सर', status: 'कमी बॅटरी ⚠️', ok: false, warn: true },
    { name: 'स्मार्ट कीड सापळा', status: 'कनेक्ट केलेले नाही', ok: false },
  ],
  te: [
    { name: 'ఉష్ణోగ్రత సెన్సార్', status: 'కనెక్ట్ అయింది', ok: true },
    { name: 'తేమ సెన్సార్', status: 'కనెక్ట్ అయింది', ok: true },
    { name: 'వర్షపాత గేజ్', status: 'కనెక్ట్ అయింది', ok: true },
    { name: 'నేల తేమ సెన్సార్', status: 'తక్కువ బ్యాటరీ ⚠️', ok: false, warn: true },
    { name: 'స్మార్ట్ పెస్ట్ ట్రాప్', status: 'కనెక్ట్ కాలేదు', ok: false },
  ]
};

const TL_COLORS: Record<string, string> = {
  milestone: 'bg-green-100 text-green-700', alert: 'bg-red-100 text-red-700',
  diagnosis: 'bg-blue-100 text-blue-700', expert: 'bg-purple-100 text-purple-700',
  advisory: 'bg-orange-100 text-orange-700', visit: 'bg-teal-100 text-teal-700',
};

export default function MonitoringPage() {
  const { language, t } = useAuth();

  const tasks = MONITORING_TASKS_I18N[language] || MONITORING_TASKS_I18N.hi || MONITORING_TASKS_I18N.en;
  const sensors = IOT_SENSORS_I18N[language] || IOT_SENSORS_I18N.hi || IOT_SENSORS_I18N.en;
  const timelineData = getLocalizedCropTimeline(language);

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('monitoring') || 'Crop Health Monitoring'}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('monitoring_sub') || 'IoT sensors, timeline, and monitoring schedule'}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-blinkDot" />
            {t('live_badge') || 'Live'} · 5 min ago
          </div>
        </div>

        {/* Sentinel-2 Satellite NDVI Canopy & Precision Drone Spraying */}
        <SatelliteNDVIDroneCard />

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DEMO_SENSORS.map(s => {
            const trendData = (s.trend || [27,28,27,29,30,28,27]).map((v: number, i: number) => ({ i, v }));
            return (
              <div key={s.id} className={`card p-4 ${s.status === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{SENSOR_ICONS[s.sensorType]}</span>
                  <span className={`w-2 h-2 rounded-full ${s.status === 'normal' ? 'bg-green-500' : s.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                </div>
                <p className="text-2xl font-black text-gray-800">{s.value}<span className="text-sm font-normal text-gray-400">{s.unit}</span></p>
                <p className="text-gray-500 text-xs capitalize mb-2">{t(s.sensorType) || s.sensorType.replace('_', ' ')}</p>
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <Line type="monotone" dataKey="v" stroke={s.status === 'warning' ? '#f59e0b' : '#22c55e'} dot={false} strokeWidth={1.5} />
                      <Tooltip formatter={(v) => [v, s.sensorType]} labelFormatter={() => ''} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${s.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{t(s.status) || s.status}</span>
              </div>
            );
          })}
        </div>

        {/* Crop Timeline */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">{t('crop_health_timeline') || 'Crop Health Timeline'}</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
            <div className="space-y-4">
              {timelineData.map((ev, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 ${TL_COLORS[ev.type] || 'bg-gray-100 text-gray-700'}`}>{ev.icon}</div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800 text-sm">{ev.event}</p>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">📅 {ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monitoring Schedule */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">{t('monitoring_schedule') || 'Monitoring Schedule'}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left bg-green-50 text-green-800 text-xs font-semibold">
                <th className="px-3 py-2 rounded-l-lg">{t('task_col') || 'Task'}</th>
                <th className="px-3 py-2">{t('freq_col') || 'Frequency'}</th>
                <th className="px-3 py-2">{t('last_done_col') || 'Last Done'}</th>
                <th className="px-3 py-2">{t('next_due_col') || 'Next Due'}</th>
                <th className="px-3 py-2 rounded-r-lg">{t('status_col') || 'Status'}</th>
              </tr></thead>
              <tbody>
                {tasks.map((tItem, i) => (
                  <tr key={tItem.task} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2.5 font-medium text-gray-800">{tItem.task}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{tItem.freq}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{tItem.last}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{tItem.next}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tItem.warn ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{tItem.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* IoT Connection Status */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">{t('smart_sensor_integration') || 'Smart Sensor Integration'}</h2>
            <button onClick={() => toast.info('Opening sensor setup wizard...')} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 text-green-700 font-semibold rounded-xl hover:bg-green-100">
              <Plus className="w-3.5 h-3.5" /> {t('add_sensor') || '+ Add Sensor'}
            </button>
          </div>
          <div className="space-y-2">
            {sensors.map(s => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  {s.ok ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : s.warn ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> : <XCircle className="w-5 h-5 text-gray-300" />}
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.ok ? 'bg-green-100 text-green-700' : s.warn ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
