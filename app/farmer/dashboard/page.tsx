'use client';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { useAuth } from '@/lib/authContext';
import { DEMO_FARMS, DEMO_ALERTS, DEMO_RISK_SCORE, DEMO_SENSORS, CROP_TIMELINE, DEMO_WEATHER, getLocalizedAlerts, getLocalizedCropTimeline } from '@/lib/mockData';
import { getRiskBgClass } from '@/lib/riskEngine';
import Link from 'next/link';
import { Camera, TrendingUp, Bug, MapPin, HelpCircle, Thermometer, Droplets, CloudRain, Wind, AlertTriangle, Calendar } from 'lucide-react';
import LocalPrecautionsCard from '@/components/LocalPrecautionsCard';
import GovernmentSchemesCard from '@/components/GovernmentSchemesCard';
import FarmerNewsCard from '@/components/FarmerNewsCard';
import GramSathiSchemeFinder from '@/components/GramSathiSchemeFinder';
import DailyFarmMissionCard from '@/components/DailyFarmMissionCard';
import SmartFertilizerPlannerCard from '@/components/SmartFertilizerPlannerCard';

const QUICK_ACTIONS = [
  { icon: '📷', label: 'Diagnose Crop', href: '/farmer/diagnose', color: 'bg-green-600 hover:bg-green-700', text: 'text-white' },
  { icon: '🌦', label: 'Check Risk', href: '/farmer/risk-forecast', color: 'bg-blue-600 hover:bg-blue-700', text: 'text-white' },
  { icon: '🐛', label: 'Report Pest', href: '/farmer/pest-reports', color: 'bg-orange-500 hover:bg-orange-600', text: 'text-white' },
  { icon: '📍', label: 'View Alerts', href: '/farmer/notifications', color: 'bg-yellow-500 hover:bg-yellow-600', text: 'text-white' },
  { icon: '👨‍🌾', label: 'Ask Expert', href: '/farmer/expert-help', color: 'bg-purple-600 hover:bg-purple-700', text: 'text-white' },
];

const RISK_ITEMS = [
  { label: 'Disease Risk', key: 'diseaseRisk', score: 'diseaseScore' },
  { label: 'Pest Risk', key: 'pestRisk', score: 'pestScore' },
  { label: 'Weather Risk', key: 'weatherRisk', score: 'weatherScore' },
  { label: 'Overall Crop Health', key: 'overallRisk', score: 'overallScore' },
] as const;

function getHourKey() {
  const h = new Date().getHours();
  if (h < 12) return 'good_morning';
  if (h < 17) return 'good_afternoon';
  return 'good_evening';
}

function RiskBar({ value, risk }: { value: number; risk: string }) {
  const color = risk === 'high' || risk === 'critical' ? 'bg-red-500' : risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function FarmerDashboard() {
  const { user, t, language } = useAuth();
  const farm = DEMO_FARMS[0];

  const localeMap: Record<string, string> = {
    en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN', bn: 'bn-IN', pa: 'pa-IN', or: 'or-IN'
  };
  const formattedDate = new Date().toLocaleDateString(localeMap[language] || 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const quickActions = [
    { icon: '📷', label: t('diagnose_crop'), href: '/farmer/diagnose', color: 'bg-green-600 hover:bg-green-700', text: 'text-white' },
    { icon: '🌦', label: t('check_risk'), href: '/farmer/risk-forecast', color: 'bg-blue-600 hover:bg-blue-700', text: 'text-white' },
    { icon: '🐛', label: t('report_pest'), href: '/farmer/pest-reports', color: 'bg-orange-500 hover:bg-orange-600', text: 'text-white' },
    { icon: '📍', label: t('view_alerts'), href: '/farmer/notifications', color: 'bg-yellow-500 hover:bg-yellow-600', text: 'text-white' },
    { icon: '👨‍🌾', label: t('ask_expert'), href: '/farmer/expert-help', color: 'bg-purple-600 hover:bg-purple-700', text: 'text-white' },
  ];

  const riskItems = [
    { label: t('disease_risk'), key: 'diseaseRisk', score: 'diseaseScore' },
    { label: t('pest_risk'), key: 'pestRisk', score: 'pestScore' },
    { label: t('weather_risk'), key: 'weatherRisk', score: 'weatherScore' },
    { label: t('overall_health'), key: 'overallRisk', score: 'overallScore' },
  ] as const;

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-5xl">

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-200 text-sm">{t(getHourKey()) || 'Good Afternoon'},</p>
              <h1 className="text-xl font-bold mt-0.5">{user?.name || 'Ramesh Patil'} 👋</h1>
              <p className="text-green-200 text-sm mt-1">{formattedDate}</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
              <p className="text-xs text-green-200">{t('overall_health')}</p>
              <p className="text-red-300 font-black text-lg">{t('high')}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-green-200 text-xs">{t('farm')}</p>
              <p className="text-white font-semibold text-sm truncate">{t('patil_rice_farm') || farm.name}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-green-200 text-xs">{t('crop_stage')}</p>
              <p className="text-white font-semibold text-sm">{t('rice_tillering') || 'Rice · Tillering'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-green-200 text-xs">{t('location')}</p>
              <p className="text-white font-semibold text-sm truncate">{farm.district}, MH</p>
            </div>
          </div>

          {/* Weather mini */}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {[
              { icon: '🌡️', label: `${DEMO_WEATHER.temperature}°C` },
              { icon: '💧', label: `${DEMO_WEATHER.humidity}% ${t('humidity') || 'Humidity'}` },
              { icon: '🌧️', label: `${DEMO_WEATHER.rainfall}mm ${t('rain') || 'Rain'}` },
              { icon: '💨', label: `${DEMO_WEATHER.windSpeed} km/h` },
            ].map(w => (
              <div key={w.label} className="bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>{w.icon}</span>
                <span className="text-white text-xs font-medium">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-bold text-gray-800 text-lg mb-3">{t('quick_actions')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickActions.map(a => (
              <Link key={a.label} href={a.href} className={`${a.color} ${a.text} rounded-2xl p-4 flex flex-col items-center gap-2 font-semibold text-sm text-center transition-all hover:scale-105 shadow-sm hover:shadow-md active:scale-100`}>
                <span className="text-2xl">{a.icon}</span>
                <span className="leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 🎯 TODAY'S FARM MISSION (Dynamic Morning Priority Tasks & SIH Demo Switcher) */}
        <DailyFarmMissionCard />

        {/* Risk Summary */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-4">{t('risk_summary')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {riskItems.map(item => {
              const riskVal = DEMO_RISK_SCORE[item.key] as string;
              const scoreVal = DEMO_RISK_SCORE[item.score] as number;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRiskBgClass(riskVal as any)}`}>{t(riskVal) || riskVal.toUpperCase()}</span>
                  </div>
                  <RiskBar value={scoreVal} risk={riskVal} />
                  <p className="text-gray-400 text-xs text-right">{scoreVal}/100</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {DEMO_RISK_SCORE.factors[0].description}
            </p>
          </div>
        </div>

        {/* 🧪 SMART FERTILIZER PLANNER ("Farmers Like You" Soil & Community Engine) */}
        <SmartFertilizerPlannerCard />

        {/* GramSathi Scheme Finder AI Wizard */}
        <GramSathiSchemeFinder />

        {/* Local Farmer Precautions & Weather Suggestions */}
        <LocalPrecautionsCard />

        {/* Government Schemes & Weather Subsidies */}
        <GovernmentSchemesCard />

        {/* Latest Farmer News & Advisories */}
        <FarmerNewsCard />

        {/* Recent Alerts */}
        <div>
          <h2 className="font-bold text-gray-800 text-lg mb-3">{t('recent_alerts') || 'Recent Alerts'}</h2>
          <div className="space-y-3">
            {getLocalizedAlerts(language).map(alert => (
              <div key={alert.id} className={`card p-4 border-l-4 ${alert.severity === 'high' ? 'border-l-red-500' : alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRiskBgClass(alert.severity as any)}`}>{t(alert.severity) || alert.severity.toUpperCase()}</span>
                      <span className="text-gray-500 text-xs">{alert.district}, {alert.state}</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{alert.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{alert.message}</p>
                    <p className="text-gray-400 text-xs mt-1.5 italic">{t('action_label') || 'Action'}: {alert.recommendedAction}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href="/farmer/risk-forecast" className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">{t('view_details') || 'View Details'}</Link>
                  <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">{t('report_observation') || 'Report Observation'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Timeline */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-4">{t('crop_health_timeline') || 'Crop Health Timeline'}</h2>
          <div className="space-y-3">
            {getLocalizedCropTimeline(language).slice(-4).map((ev, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm flex-shrink-0">{ev.icon}</div>
                <div>
                  <p className="text-gray-800 text-sm font-medium">{ev.event}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{ev.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/farmer/monitoring" className="inline-flex items-center gap-1 text-green-700 text-sm font-semibold mt-4 hover:gap-2 transition-all">
            {t('view_full_timeline') || 'View Full Timeline →'}
          </Link>
        </div>

        {/* Sensors */}
        <div>
          <h2 className="font-bold text-gray-800 text-lg mb-3">{t('iot_sensors') || 'IoT Sensors'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DEMO_SENSORS.map(s => (
              <div key={s.id} className={`card p-4 border ${s.status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'}`}>
                <div className="text-2xl mb-1">{s.sensorType === 'temperature' ? '🌡️' : s.sensorType === 'soil_moisture' ? '💧' : s.sensorType === 'humidity' ? '💦' : '🌧️'}</div>
                <p className="text-2xl font-black text-gray-800">{s.value}<span className="text-sm font-normal text-gray-400">{s.unit}</span></p>
                <p className="text-gray-500 text-xs capitalize">{t(s.sensorType) || s.sensorType.replace('_', ' ')}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${s.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{t(s.status) || s.status}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2 text-right">🟢 {t('last_updated_5m') || 'Last updated: 5 minutes ago'}</p>
        </div>
      </div>
    </FarmerLayout>
  );
}
