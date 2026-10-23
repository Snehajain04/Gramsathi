'use client';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { DEMO_ADVISORIES, DEMO_EMERGENCY_SOP, LANGUAGE_NAMES } from '@/lib/mockData';
import { getTranslation } from '@/lib/i18n';
import { useAuth } from '@/lib/authContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, Globe, Download } from 'lucide-react';
import type { Language } from '@/types';
import { exportToPDF } from '@/lib/pdfExport';

const LANGS: Language[] = ['en','hi','mr','te','ta','kn','bn','pa','or'];
const FLAGS: Record<Language, string> = { en:'🇬🇧', hi:'🇮🇳', mr:'🇮🇳', te:'🇮🇳', ta:'🇮🇳', kn:'🇮🇳', bn:'🇧🇩', pa:'🇮🇳', or:'🇮🇳' };

export default function AdvisoriesPage() {
  const { language, t } = useAuth();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleStep = (key: string) => setCompleted(prev => ({ ...prev, [key]: !prev[key] }));

  const handleDownloadPDF = () => {
    const activeTrans = DEMO_EMERGENCY_SOP.translations[language as Language] || DEMO_EMERGENCY_SOP.translations.en;
    exportToPDF({
      title: activeTrans.title,
      subtitle: activeTrans.message,
      category: 'GOVERNMENT EMERGENCY ADVISORY',
      author: 'Collector Rajesh Yadav · State Agriculture Dept',
      filename: 'GramSathi-Emergency-Advisory.pdf',
      sections: [
        {
          heading: 'Affected Regions & Target Crops',
          items: [
            `Regions: ${DEMO_EMERGENCY_SOP.targetRegions.join(', ')}`,
            `Crops: ${DEMO_EMERGENCY_SOP.targetCrops?.join(', ') || 'All crops'}`,
            `Issued Date: ${DEMO_EMERGENCY_SOP.sentAt.split('T')[0]}`
          ]
        },
        {
          heading: 'Immediate Advisory Directive',
          content: activeTrans.message
        },
        {
          heading: 'Action Plan for Farmers',
          items: [
            'Inspect Rice crops daily for leaf blast lesions during morning hours.',
            'Contact local Krishi Vigyan Kendra (KVK) or Extension Worker immediately.',
            'Avoid excessive nitrogen fertilizer application under humid conditions.'
          ]
        }
      ]
    });
    toast.success('Advisory PDF Generated!');
  };

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800">{t('advisories')}</h1>

        {/* Emergency SOP */}
        {DEMO_EMERGENCY_SOP.isActive && (
          <div className="bg-red-600 text-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 animate-blinkDot" />
              <div className="flex-1">
                <p className="text-red-100 text-xs font-semibold uppercase tracking-wider mb-1">🏛️ Government of Maharashtra · Emergency Advisory</p>
                <h2 className="font-bold text-lg mb-2">
                  {(DEMO_EMERGENCY_SOP.translations[language as Language] || DEMO_EMERGENCY_SOP.translations.en).title}
                </h2>
                <p className="text-red-100 text-sm leading-relaxed">
                  {(DEMO_EMERGENCY_SOP.translations[language as Language] || DEMO_EMERGENCY_SOP.translations.en).message}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="bg-red-700 px-2 py-1 rounded-lg">Issued: {DEMO_EMERGENCY_SOP.sentAt.split('T')[0]}</span>
                  <span className="bg-red-700 px-2 py-1 rounded-lg">Regions: {DEMO_EMERGENCY_SOP.targetRegions.join(', ')}</span>
                  <span className="bg-red-700 px-2 py-1 rounded-lg">Crops: {DEMO_EMERGENCY_SOP.targetCrops?.join(', ') || 'All crops'}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleDownloadPDF} className="px-4 py-2 bg-white text-red-700 font-semibold rounded-xl text-sm hover:bg-red-50 transition-colors flex items-center gap-1.5 shadow-sm">
                    <Download className="w-4 h-4" /> Read Full Advisory / Save PDF
                  </button>
                  <button onClick={() => toast.success('Link copied!')} className="px-4 py-2 bg-red-700 text-white font-semibold rounded-xl text-sm hover:bg-red-800 transition-colors">Share</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advisory Cards */}
        {DEMO_ADVISORIES.map(adv => {
          const totalSteps = adv.steps.length;
          const doneSteps = adv.steps.filter((_, i) => completed[`${adv.id}-${i}`]).length;
          return (
            <div key={adv.id} className={`card p-5 border-l-4 ${adv.riskLevel === 'high' ? 'border-l-red-500' : adv.riskLevel === 'medium' ? 'border-l-yellow-400' : 'border-l-green-500'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${adv.riskLevel === 'high' ? 'bg-red-100 text-red-700' : adv.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{adv.riskLevel.toUpperCase()}</span>
                  <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${adv.status === 'active' ? 'bg-blue-100 text-blue-700' : adv.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{adv.status}</span>
                </div>
                <span className="text-gray-400 text-xs">{adv.createdAt.split('T')[0]}</span>
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-1">{adv.title}</h3>
              <p className="text-gray-600 text-sm mb-3">📍 Why: {adv.reason}</p>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{doneSteps}/{totalSteps} steps</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${(doneSteps/totalSteps)*100}%` }} />
                </div>
              </div>

              {/* Steps */}
              <ul className="space-y-1.5 mb-4">
                {adv.steps.map((step, i) => {
                  const key = `${adv.id}-${i}`;
                  return (
                    <li key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => toggleStep(key)}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${completed[key] ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                        {completed[key] && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm leading-relaxed ${completed[key] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{step.action}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => toast.info('Opening full advisory...')} className="text-xs px-3 py-1.5 bg-green-50 text-green-700 font-semibold rounded-xl hover:bg-green-100">View Full Advisory</button>
                <button onClick={() => toast.success('Expert notified!')} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100">Contact Expert</button>
                <button onClick={() => toast.success('Advisory marked as completed!')} className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 font-semibold rounded-xl hover:bg-gray-100">Mark Completed</button>
              </div>
            </div>
          );
        })}

        {/* Language Demo */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-1 flex items-center gap-2"><Globe className="w-5 h-5 text-green-600" /> This message in your language</h2>
          <p className="text-gray-500 text-xs mb-4">GramSathi AI supports 9 Indian languages. Same advisory translated automatically.</p>
          <div className="space-y-2">
            {LANGS.map(lang => (
              <div key={lang} className={`flex items-start gap-3 p-3 rounded-xl ${lang === language ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                <span className="text-xl flex-shrink-0">{FLAGS[lang]}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700">{LANGUAGE_NAMES[lang]}</p>
                  <p className="text-gray-600 text-sm mt-0.5">{getTranslation(lang, 'risk_high_msg')}</p>
                </div>
                {lang === language && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Your language</span>}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => toast.success('Advisory report downloading...')} className="w-full btn-outline gap-2">
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>
    </FarmerLayout>
  );
}
