'use client';
import { useState } from 'react';
import { getLocalizedGovernmentSchemes } from '@/lib/mockData';
import { GovernmentScheme, RuralCategory } from '@/types';
import { useAuth } from '@/lib/authContext';
import { ExternalLink, ShieldCheck, Search, Filter, Info, PhoneCall, CheckCircle, Sparkles, MapPin, FileCheck } from 'lucide-react';

const SCHEMES_I18N: Record<string, {
  headerTitle: string;
  headerSub: string;
  portalBadge: string;
  searchPlaceholder: string;
  stateScopeLabel: string;
  allIndiaLabel: string;
  keyBenefitLabel: string;
  docButtonLabel: string;
  officialPortalLabel: string;
  benefitsModalTitle: string;
  docsModalTitle: string;
  categories: Record<string, string>;
}> = {
  en: {
    headerTitle: 'Rural Citizen Welfare & Scheme Database',
    headerSub: '12 Core MVP Welfare Schemes across Agriculture, Employment, Women SHGs, Housing & Artisans',
    portalBadge: 'myScheme & Odisha Portals',
    searchPlaceholder: 'Search schemes, benefits, documents...',
    stateScopeLabel: 'State Scope:',
    allIndiaLabel: 'All India',
    keyBenefitLabel: 'Key Benefit & Transfer',
    docButtonLabel: 'Documents & How to Apply',
    officialPortalLabel: 'Official Portal',
    benefitsModalTitle: '💰 Benefits & Direct Transfer',
    docsModalTitle: '📋 Required Documents',
    categories: {
      'All': 'All',
      'Farmer Schemes': '🌾 Farmer Schemes',
      'Rural Employment': '💼 Rural Employment',
      'Women & SHGs': '👩‍🌾 Women & SHGs',
      'Housing': '🏠 Housing',
      'Water & Infrastructure': '💧 Water & Infrastructure',
      'Healthcare': '🏥 Healthcare',
      'Education & Skills': '🎓 Education & Skills',
      'Artisans & Small Business': '🛠️ Artisans & Small Business',
    }
  },
  hi: {
    headerTitle: 'ग्रामीण नागरिक कल्याण एवं योजना डेटाबेस',
    headerSub: 'कृषि, रोजगार, महिला SHG, आवास और कारीगरों के लिए 12 प्रमुख कल्याणकारी योजनाएं',
    portalBadge: 'myScheme और ओडिशा पोर्टल',
    searchPlaceholder: 'योजनाएं, लाभ, दस्तावेज खोजें...',
    stateScopeLabel: 'राज्य दायरा:',
    allIndiaLabel: 'पूरा भारत',
    keyBenefitLabel: 'मुख्य लाभ और डीबीटी स्थानांतरण',
    docButtonLabel: 'दस्तावेज और आवेदन प्रक्रिया',
    officialPortalLabel: 'आधिकारिक पोर्टल',
    benefitsModalTitle: '💰 लाभ और प्रत्यक्ष अंतरण',
    docsModalTitle: '📋 आवश्यक दस्तावेज',
    categories: {
      'All': 'सभी',
      'Farmer Schemes': '🌾 किसान योजनाएं',
      'Rural Employment': '💼 ग्रामीण रोजगार',
      'Women & SHGs': '👩‍🌾 महिला एवं स्वयं सहायता समूह',
      'Housing': '🏠 आवास योजनाएं',
      'Water & Infrastructure': '💧 जल एवं बुनियादी ढांचा',
      'Healthcare': '🏥 स्वास्थ्य सेवाएं',
      'Education & Skills': '🎓 शिक्षा एवं कौशल विकास',
      'Artisans & Small Business': '🛠️ कारीगर एवं लघु उद्योग',
    }
  },
  mr: {
    headerTitle: 'ग्रामीण नागरिक कल्याण व योजना डेटाबेस',
    headerSub: 'शेती, रोजगार, महिला बचत गट, घरकुल आणि कारागिरांसाठी १२ प्रमुख योजना',
    portalBadge: 'myScheme व ओडिशा पोर्टल',
    searchPlaceholder: 'योजना, फायदे, कागदपत्रे शोधा...',
    stateScopeLabel: 'राज्य क्षेत्र:',
    allIndiaLabel: 'संपूर्ण भारत',
    keyBenefitLabel: 'प्रमुख फायदे व थेट मदत',
    docButtonLabel: 'कागदपत्रे व अर्ज कसा करावा',
    officialPortalLabel: 'अधिकृत पोर्टल',
    benefitsModalTitle: '💰 फायदे आणि थेट हस्तांतरण',
    docsModalTitle: '📋 आवश्यक कागदपत्रे',
    categories: {
      'All': 'सर्व',
      'Farmer Schemes': '🌾 शेतकरी योजना',
      'Rural Employment': '💼 ग्रामीण रोजगार',
      'Women & SHGs': '👩‍🌾 महिला व बचत गट',
      'Housing': '🏠 घरकुल योजना',
      'Water & Infrastructure': '💧 पाणी व पायाभूत सुविधा',
      'Healthcare': '🏥 आरोग्य सेवा',
      'Education & Skills': '🎓 शिक्षण व कौशल्य',
      'Artisans & Small Business': '🛠️ कारागीर व छोटे व्यवसाय',
    }
  },
  or: {
    headerTitle: 'ଗ୍ରାମୀଣ ନାଗରିକ କଲ୍ୟାଣ ଓ ଯୋଜନା ଡାଟାବେସ୍',
    headerSub: 'କୃଷି, ରୋଜଗାର, ମହିଳା SHG, ଆବାସ ଓ କାରିଗରଙ୍କ ପାଇଁ ୧୨ଟି ମୁଖ୍ୟ ଯୋଜନା',
    portalBadge: 'myScheme ଓ ଓଡ଼ିଶା ପୋର୍ଟାଲ',
    searchPlaceholder: 'ଯୋଜନା, ଲାଭ, କାଗଜପତ୍ର ଖୋଜନ୍ତୁ...',
    stateScopeLabel: 'ରାଜ୍ୟ ପରିସର:',
    allIndiaLabel: 'ସମଗ୍ର ଭାରତ',
    keyBenefitLabel: 'ମୁଖ୍ୟ ଲାଭ ଓ ସହାୟତା',
    docButtonLabel: 'କାଗଜପତ୍ର ଓ ଆବେଦନ ପ୍ରକ୍ରିୟା',
    officialPortalLabel: 'ଅଫିସିଆଲ୍ ପୋର୍ଟାଲ୍',
    benefitsModalTitle: '💰 ଲାଭ ଓ ସିଧାସଳଖ ସହାୟତା',
    docsModalTitle: '📋 ଆବଶ୍ୟକ କାଗଜପତ୍ର',
    categories: {
      'All': 'ସମସ୍ତ',
      'Farmer Schemes': '🌾 କୃଷକ ଯୋଜନା',
      'Rural Employment': '💼 ଗ୍ରାମୀଣ ରୋଜଗାର',
      'Women & SHGs': '👩‍🌾 ମହିଳା ଓ SHG',
      'Housing': '🏠 ଆବାସ ଯୋଜନା',
      'Water & Infrastructure': '💧 ଜଳ ଓ ଭିତ୍ତିଭୂମି',
      'Healthcare': '🏥 ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
      'Education & Skills': '🎓 ଶିକ୍ଷା ଓ କୌଶଳ',
      'Artisans & Small Business': '🛠️ କାରିଗର ଓ କ୍ଷୁଦ୍ର ବ୍ୟବସାୟ',
    }
  }
};

export default function GovernmentSchemesCard() {
  const { language } = useAuth();
  const i18n = SCHEMES_I18N[language] || SCHEMES_I18N['hi'] || SCHEMES_I18N['en'];

  const [selectedRuralCategory, setSelectedRuralCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalScheme, setActiveModalScheme] = useState<GovernmentScheme | null>(null);

  const ruralCategories: string[] = [
    'All',
    'Farmer Schemes',
    'Rural Employment',
    'Women & SHGs',
    'Housing',
    'Water & Infrastructure',
    'Healthcare',
    'Education & Skills',
    'Artisans & Small Business'
  ];

  const filteredSchemes = getLocalizedGovernmentSchemes(language).filter(scheme => {
    const matchesRuralCat = selectedRuralCategory === 'All' || scheme.ruralCategory === selectedRuralCategory;
    const matchesState = selectedState === 'All' || scheme.stateScope === selectedState || scheme.stateScope === 'All India';
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRuralCat && matchesState && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl text-lg font-bold">🏛️</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{i18n.headerTitle}</h2>
              <p className="text-xs text-gray-500">{i18n.headerSub}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {i18n.portalBadge}
          </span>
        </div>
      </div>

      {/* State Filter + Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder={i18n.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* State Scope Selector */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl w-full sm:w-auto text-xs">
          <span className="px-2 text-gray-500 font-medium">{i18n.stateScopeLabel}</span>
          {['All', 'Odisha', 'Maharashtra'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedState === st
                  ? 'bg-white text-emerald-800 shadow-2xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {st === 'All' ? i18n.allIndiaLabel : st}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Rural Categories Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {ruralCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedRuralCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedRuralCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {i18n.categories[cat] || cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map(scheme => (
          <div
            key={scheme.id}
            className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-emerald-50/30 via-white to-gray-50/50 hover:border-emerald-300 transition-all hover:shadow-md flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl p-1 bg-white rounded-lg border border-gray-100 shadow-2xs">{scheme.icon}</span>
                <div className="flex items-center gap-1">
                  {scheme.stateScope !== 'All India' && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {scheme.stateScope}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {i18n.categories[scheme.ruralCategory] || scheme.ruralCategory}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{scheme.title}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{scheme.shortDesc}</p>

              <div className="mt-3 space-y-1 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">{i18n.keyBenefitLabel}</p>
                <p className="text-xs text-emerald-950 font-medium line-clamp-2">{scheme.benefits[0]}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveModalScheme(scheme)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <FileCheck className="w-3.5 h-3.5" />
                {i18n.docButtonLabel}
              </button>
              <a
                href={scheme.officialLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs"
              >
                {i18n.officialPortalLabel}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail Modal */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeModalScheme.icon}</span>
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {activeModalScheme.ruralCategory} • {activeModalScheme.stateScope}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-1">{activeModalScheme.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModalScheme(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">{activeModalScheme.shortDesc}</p>

            {/* Benefits */}
            <div className="space-y-1.5 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">{i18n.benefitsModalTitle}</h4>
              <ul className="space-y-1 text-xs text-emerald-800">
                {activeModalScheme.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{i18n.docsModalTitle}</h4>
              <ul className="space-y-1 text-xs text-gray-700">
                {activeModalScheme.requiredDocuments.map((doc, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href={activeModalScheme.officialLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                {i18n.officialPortalLabel} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
