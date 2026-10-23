'use client';
import { useState } from 'react';
import { getLocalizedGovernmentSchemes } from '@/lib/mockData';
import { GovernmentScheme, RuralCategory } from '@/types';
import { useAuth } from '@/lib/authContext';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  User,
  Briefcase,
  Home,
  ShieldCheck,
  PhoneCall,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

interface UserProfile {
  state: 'Odisha' | 'Maharashtra' | 'All India';
  district: string;
  age: number;
  gender: 'female' | 'male' | 'any';
  occupation: string;
  isLandowner: boolean;
  isSHGMember: boolean;
  housingType: 'kutcha' | 'pucca';
}

const WIZARD_I18N: Record<string, {
  tag: string;
  title: string;
  sub: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  stateLabel: string;
  districtLabel: string;
  ageLabel: string;
  genderLabel: string;
  femaleOption: string;
  maleOption: string;
  otherOption: string;
  nextStep2: string;
  occupationLabel: string;
  shgQuestion: string;
  shgSub: string;
  shgYes: string;
  shgNo: string;
  landQuestion: string;
  landSub: string;
  landYes: string;
  landNo: string;
  nextStep3: string;
  housingLabel: string;
  kutchaTitle: string;
  kutchaSub: string;
  puccaTitle: string;
  puccaSub: string;
  calculateBtn: string;
  backBtn: string;
  foundSchemesTitle: string;
  modifyAnswers: string;
  matchScore: string;
  keyBenefit: string;
  docButton: string;
  portalBtn: string;
  checklistTitle: string;
  howToApplyTitle: string;
  nearestCenter: string;
  closeBtn: string;
}> = {
  en: {
    tag: 'AI Rural Welfare Assistant',
    title: 'GramSathi Scheme Finder',
    sub: 'Personalized government scheme eligibility calculator for rural citizens & farmers',
    step1Title: 'Step 1 of 4: Your Location & Demographics',
    step2Title: 'Step 2 of 4: Your Occupation & Community Role',
    step3Title: 'Step 3 of 4: Housing & Infrastructure Status',
    step4Title: 'Step 4 of 4: Your Matched Welfare Schemes',
    stateLabel: 'State',
    districtLabel: 'District',
    ageLabel: 'Age (Years)',
    genderLabel: 'Gender',
    femaleOption: 'Female (Women SHG & Maternal Schemes)',
    maleOption: 'Male',
    otherOption: 'Other / Prefer not to say',
    nextStep2: 'Next: Occupation & SHG Status',
    occupationLabel: 'Primary Rural Occupation',
    shgQuestion: 'Member of Self Help Group (SHG)?',
    shgSub: 'Unlocks DAY-NRLM & Lakhpati Didi loans',
    shgYes: 'Yes (Member)',
    shgNo: 'No',
    landQuestion: 'Do you own agricultural land?',
    landSub: 'Required for PM-KISAN landholder DBT',
    landYes: 'Yes (Landowner)',
    landNo: 'No (Landless)',
    nextStep3: 'Next: Housing & Welfare Status',
    housingLabel: 'Current Housing Type',
    kutchaTitle: '🛖 Kutcha / Dilapidated House',
    kutchaSub: 'Mud/Thatch roof. High eligibility for PMAY-G ₹1.20 Lakh assistance.',
    puccaTitle: '🏠 Permanent Pucca House',
    puccaSub: 'Concrete construction already complete.',
    calculateBtn: '🚀 Calculate Eligible Schemes',
    backBtn: 'Back',
    foundSchemesTitle: 'Eligible Government Schemes for You!',
    modifyAnswers: 'Modify Answers',
    matchScore: 'Match',
    keyBenefit: 'Key Benefit',
    docButton: 'Required Documents & Apply',
    portalBtn: 'Portal',
    checklistTitle: '📋 Interactive Required Documents Checklist',
    howToApplyTitle: '📍 How to Apply Step-by-Step',
    nearestCenter: 'Nearest Assistance',
    closeBtn: 'Close',
  },
  hi: {
    tag: 'AI ग्रामीण कल्याण सहायक',
    title: 'ग्रामसाथी योजना खोजकर्ता (Scheme Finder)',
    sub: 'ग्रामीण नागरिकों और किसानों के लिए व्यक्तिगत सरकारी योजना पात्रता कैलकुलेटर',
    step1Title: 'चरण 1/4: आपका स्थान और जनसांख्यिकी',
    step2Title: 'चरण 2/4: आपका व्यवसाय और सामुदायिक भूमिका',
    step3Title: 'चरण 3/4: आवास और बुनियादी ढांचा स्थिति',
    step4Title: 'चरण 4/4: आपकी पात्र सरकारी योजनाएं',
    stateLabel: 'राज्य',
    districtLabel: 'जिला',
    ageLabel: 'आयु (वर्ष)',
    genderLabel: 'लिंग',
    femaleOption: 'महिला (महिला SHG और मातृ कल्याण योजनाएं)',
    maleOption: 'पुरुष',
    otherOption: 'अन्य',
    nextStep2: 'आगे बढ़ें: व्यवसाय और SHG स्थिति',
    occupationLabel: 'प्राथमिक ग्रामीण व्यवसाय',
    shgQuestion: 'क्या आप स्वयं सहायता समूह (SHG) के सदस्य हैं?',
    shgSub: 'DAY-NRLM और लखपति दीदी ऋण अनलॉक करता है',
    shgYes: 'हां (सदस्य हैं)',
    shgNo: 'नहीं',
    landQuestion: 'क्या आपके पास कृषि भूमि है?',
    landSub: 'PM-KISAN भूमिधारक DBT के लिए आवश्यक',
    landYes: 'हां (भूमिस्वामी)',
    landNo: 'नहीं (भूमिहीन)',
    nextStep3: 'आगे बढ़ें: आवास स्थिति',
    housingLabel: 'वर्तमान आवास का प्रकार',
    kutchaTitle: '🛖 कच्चा / जर्जर मकान',
    kutchaSub: 'मिट्टी/फूस की छत। PMAY-G ₹1.20 लाख सहायता के लिए उच्च पात्रता।',
    puccaTitle: '🏠 पक्का मकान',
    puccaSub: 'कंक्रीट का पक्का निर्माण।',
    calculateBtn: '🚀 पात्र योजनाओं की गणना करें',
    backBtn: 'पीछे जाएं',
    foundSchemesTitle: 'आपके लिए पात्र सरकारी योजनाएं!',
    modifyAnswers: 'उत्तर बदलें',
    matchScore: 'मैच',
    keyBenefit: 'मुख्य लाभ',
    docButton: 'आवश्यक दस्तावेज और आवेदन करें',
    portalBtn: 'पोर्टल',
    checklistTitle: '📋 आवश्यक दस्तावेजों की चेकलिस्ट',
    howToApplyTitle: '📍 आवेदन करने के चरण',
    nearestCenter: 'निकटतम सहायता केंद्र',
    closeBtn: 'बंद करें',
  },
  mr: {
    tag: 'AI ग्रामीण कल्याण सहाय्यक',
    title: 'ग्रामसाथी योजना शोधक (Scheme Finder)',
    sub: 'ग्रामीण नागरिक व शेतकऱ्यांसाठी वैयक्तिक शासकीय योजना पात्रता कॅल्क्युलेटर',
    step1Title: 'टप्पा १/४: तुमचे स्थान व वय',
    step2Title: 'टप्पा २/४: तुमचा व्यवसाय व बचत गट नोंद',
    step3Title: 'टप्पा ३/४: घराचा प्रकार व पायाभूत सुविधा',
    step4Title: 'टप्पा ४/४: तुमच्यासाठी पात्र शासकीय योजना',
    stateLabel: 'राज्य',
    districtLabel: 'जिल्हा',
    ageLabel: 'वय (वर्षे)',
    genderLabel: 'लिंग',
    femaleOption: 'महिला (महिला बचत गट व माता बाल योजना)',
    maleOption: 'पुरुष',
    otherOption: 'इतर',
    nextStep2: 'पुढे चला: व्यवसाय व बचत गट',
    occupationLabel: 'मुख्य ग्रामीण व्यवसाय',
    shgQuestion: 'तुम्ही स्वयं सहाय्यता गटाचे (SHG) सदस्य आहात का?',
    shgSub: 'NRLM व लखपती दीदी कर्ज योजनेसाठी पात्र',
    shgYes: 'होय (सदस्य आहे)',
    shgNo: 'नाही',
    landQuestion: 'तुमच्या नावावर शेतजमीन आहे का?',
    landSub: 'पीएम-किसान योजनेसाठी आवश्यक',
    landYes: 'होय (जमीनदार)',
    landNo: 'नाही (भूमिहीन)',
    nextStep3: 'पुढे चला: घराची माहिती',
    housingLabel: 'घराचा प्रकार',
    kutchaTitle: '🛖 कच्चे घर / झोपडी',
    kutchaSub: 'मातीचे/कौलारू घर. प्रधानमंत्री आवास योजनेसाठी उच्च पात्रता.',
    puccaTitle: '🏠 पक्के घर',
    puccaSub: 'आरसीसी/सिमेंटचे पक्के घर.',
    calculateBtn: '🚀 पात्र योजना शोधा',
    backBtn: 'मागे',
    foundSchemesTitle: 'तुमच्यासाठी पात्र शासकीय योजना!',
    modifyAnswers: 'माहिती बदला',
    matchScore: 'पात्रता',
    keyBenefit: 'मुख्य फायदा',
    docButton: 'आवश्यक कागदपत्रे व अर्ज',
    portalBtn: 'पोर्टल',
    checklistTitle: '📋 आवश्यक कागदपत्रांची यादी',
    howToApplyTitle: '📍 अर्ज कसा करावा (टप्पे)',
    nearestCenter: 'जवळचे मदत केंद्र',
    closeBtn: 'बंद करा',
  },
  or: {
    tag: 'AI ଗ୍ରାମୀଣ କଲ୍ୟାଣ ସହାୟକ',
    title: 'ଗ୍ରାମସାଥୀ ଯୋଜନା ଖୋଜକ (Scheme Finder)',
    sub: 'ଗ୍ରାମୀଣ ନାଗରିକ ଓ ଚାଷୀଙ୍କ ପାଇଁ ବ୍ୟକ୍ତିଗତ ସରକାରୀ ଯୋଜନା ଯୋଗ୍ୟତା କାଲକୁଲେଟର',
    step1Title: 'ପର୍ଯ୍ୟାୟ ୧/୪: ଆପଣଙ୍କ ସ୍ଥାନ ଓ ବୟସ',
    step2Title: 'ପର୍ଯ୍ୟାୟ ୨/୪: ଆପଣଙ୍କ ବୃତ୍ତି ଓ SHG ସ୍ଥିତି',
    step3Title: 'ପର୍ଯ୍ୟାୟ ୩/୪: ଘର ଓ ଭିତ୍ତିଭୂମି ସ୍ଥିତି',
    step4Title: 'ପର୍ଯ୍ୟାୟ ୪/୪: ଆପଣଙ୍କ ଯୋଗ୍ୟ ସରକାରୀ ଯୋଜନା',
    stateLabel: 'ରାଜ୍ୟ',
    districtLabel: 'ଜିଲ୍ଲା',
    ageLabel: 'ବୟସ (ବର୍ଷ)',
    genderLabel: 'ଲିଙ୍ଗ',
    femaleOption: 'ମହିଳା (ମହିଳା SHG ଓ ମାତୃ ମଙ୍ଗଳ ଯୋଜନା)',
    maleOption: 'ପୁରୁଷ',
    otherOption: 'ଅନ୍ୟାନ୍ୟ',
    nextStep2: 'ଆଗକୁ ବଢନ୍ତୁ: ବୃତ୍ତି ଓ SHG',
    occupationLabel: 'ମୁଖ୍ୟ ଗ୍ରାମୀଣ ବୃତ୍ତି',
    shgQuestion: 'ଆପଣ ସ୍ୱୟଂ ସହାୟକ ଗୋଷ୍ଠୀ (SHG) ର ସଦସ୍ୟ କି?',
    shgSub: 'NRLM ଓ ଲଖପତି ଦିଦି ଋଣ ଯୋଜନା ପାଇଁ ଯୋଗ୍ୟ',
    shgYes: 'ହଁ (ସଦସ୍ୟ ଅଟନ୍ତି)',
    shgNo: 'ନାହିଁ',
    landQuestion: 'ଆପଣଙ୍କର ଚାଷ ଜମି ଅଛି କି?',
    landSub: 'ପ୍ରଧାନମନ୍ତ୍ରୀ କିଷାନ ଯୋଜନା ପାଇଁ ଆବଶ୍ୟକ',
    landYes: 'ହଁ (ଜମିମାଲିକ)',
    landNo: 'ନାହିଁ (ଭୂମିହୀନ)',
    nextStep3: 'ଆଗକୁ ବଢନ୍ତୁ: ଘରର ସ୍ଥିତି',
    housingLabel: 'ଘରର ପ୍ରକାର',
    kutchaTitle: '🛖 କଚ୍ଚା ଘର / ଚାଳ ଘର',
    kutchaSub: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଆବାସ ଯୋଜନାରେ ୧.୨୦ ଲକ୍ଷ ସହାୟତା ପାଇଁ ଯୋଗ୍ୟ।',
    puccaTitle: '🏠 ପକ୍କା ଘର',
    puccaSub: 'କଂକ୍ରିଟ୍ ଛାତ ଘର।',
    calculateBtn: '🚀 ଯୋଗ୍ୟ ଯୋଜନା ହିସାବ କରନ୍ତୁ',
    backBtn: 'ପଛକୁ',
    foundSchemesTitle: 'ଆପଣଙ୍କ ପାଇଁ ଯୋଗ୍ୟ ସରକାରୀ ଯୋଜନା!',
    modifyAnswers: 'ତଥ୍ୟ ବଦଳାନ୍ତୁ',
    matchScore: 'ଯୋଗ୍ୟତା',
    keyBenefit: 'ମୁଖ୍ୟ ଲାଭ',
    docButton: 'ଆବଶ୍ୟକ କାଗଜପତ୍ର ଓ ଆବେଦନ',
    portalBtn: 'ପୋର୍ଟାଲ',
    checklistTitle: '📋 ଆବଶ୍ୟକ କାଗଜପତ୍ର ତାଲିକା',
    howToApplyTitle: '📍 ଆବେଦନ ପ୍ରକ୍ରିୟା',
    nearestCenter: 'ନିକଟତମ ସହାୟତା କେନ୍ଦ୍ର',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
  }
};

export default function GramSathiSchemeFinder() {
  const { language } = useAuth();
  const i18n = WIZARD_I18N[language] || WIZARD_I18N['hi'] || WIZARD_I18N['en'];

  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({
    state: 'Odisha',
    district: 'Puri',
    age: 32,
    gender: 'female',
    occupation: 'Small Farmer',
    isLandowner: true,
    isSHGMember: true,
    housingType: 'kutcha',
  });

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState<GovernmentScheme | null>(null);

  const occupationsList = [
    'Small Farmer',
    'Marginal Farmer',
    'Landless Agricultural Laborer',
    'Rural Worker',
    'Traditional Artisan (Carpenter/Potter/Mason/Tailor)',
    'Unemployed Youth',
    'Student',
    'Homemaker / SHG Member'
  ];

  const calculateMatchScore = (scheme: GovernmentScheme): number => {
    let score = 70;
    if (scheme.stateScope === profile.state || scheme.stateScope === 'All India') {
      score += 15;
    } else {
      score -= 30;
    }

    const crit = scheme.eligibilityCriteria;
    if (crit) {
      if (crit.gender && crit.gender !== 'any') {
        if (crit.gender === profile.gender) score += 10;
        else score -= 40;
      }
      if (crit.occupations && crit.occupations.length > 0) {
        const occMatch = crit.occupations.some(o =>
          profile.occupation.toLowerCase().includes(o.toLowerCase()) ||
          o.toLowerCase().includes(profile.occupation.toLowerCase())
        );
        if (occMatch) score += 15;
      }
      if (crit.requiresSHG) {
        if (profile.isSHGMember) score += 10;
        else score -= 25;
      }
      if (crit.requiresLand !== undefined) {
        if (crit.requiresLand === profile.isLandowner) score += 10;
        else if (crit.requiresLand && !profile.isLandowner) score -= 20;
      }
      if (crit.requiresKutchaHouse) {
        if (profile.housingType === 'kutcha') score += 15;
      }
    }

    return Math.max(10, Math.min(99, score));
  };

  const schemesList = getLocalizedGovernmentSchemes(language);
  const rankedSchemes = schemesList
    .map(scheme => ({ scheme, matchScore: calculateMatchScore(scheme) }))
    .filter(item => item.matchScore >= 50)
    .sort((a, b) => b.matchScore - a.matchScore);

  const toggleDocCheck = (docName: string) => {
    setCheckedDocs(prev => ({ ...prev, [docName]: !prev[docName] }));
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-green-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl border border-emerald-700/50 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 flex items-center justify-center text-2xl shadow-inner">
            🤖
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30 mb-1">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              {i18n.tag}
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white leading-snug">{i18n.title}</h2>
            <p className="text-xs text-emerald-200/80">
              {i18n.sub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                step === s
                  ? 'bg-emerald-400 text-emerald-950 ring-4 ring-emerald-400/30 scale-110'
                  : step > s
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/40'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Location & Demographics */}
      {step === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{i18n.step1Title}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{i18n.stateLabel}</label>
              <select
                value={profile.state}
                onChange={e => setProfile({ ...profile, state: e.target.value as any })}
                className="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Odisha">Odisha (Chief Minister Schemes Enabled)</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="All India">All India / Other State</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{i18n.districtLabel}</label>
              <input
                type="text"
                value={profile.district}
                onChange={e => setProfile({ ...profile, district: e.target.value })}
                className="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                placeholder="Enter District"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{i18n.ageLabel}</label>
              <input
                type="number"
                value={profile.age}
                onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) || 18 })}
                className="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">{i18n.genderLabel}</label>
              <select
                value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value as any })}
                className="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="female">{i18n.femaleOption}</option>
                <option value="male">{i18n.maleOption}</option>
                <option value="any">{i18n.otherOption}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg text-sm"
            >
              {i18n.nextStep2}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Occupation & Role */}
      {step === 2 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>{i18n.step2Title}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-200 mb-2">{i18n.occupationLabel}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {occupationsList.map(occ => (
                <button
                  key={occ}
                  onClick={() => setProfile({ ...profile, occupation: occ })}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                    profile.occupation === occ
                      ? 'bg-emerald-400 text-emerald-950 border-emerald-300 font-bold shadow-md'
                      : 'bg-emerald-950/60 text-emerald-100 border-emerald-800/60 hover:border-emerald-500'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-emerald-950/60 rounded-xl border border-emerald-800/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{i18n.shgQuestion}</p>
                <p className="text-[11px] text-emerald-300">{i18n.shgSub}</p>
              </div>
              <button
                onClick={() => setProfile({ ...profile, isSHGMember: !profile.isSHGMember })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  profile.isSHGMember ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-900 text-emerald-300'
                }`}
              >
                {profile.isSHGMember ? i18n.shgYes : i18n.shgNo}
              </button>
            </div>

            <div className="p-3.5 bg-emerald-950/60 rounded-xl border border-emerald-800/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{i18n.landQuestion}</p>
                <p className="text-[11px] text-emerald-300">{i18n.landSub}</p>
              </div>
              <button
                onClick={() => setProfile({ ...profile, isLandowner: !profile.isLandowner })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  profile.isLandowner ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-900 text-emerald-300'
                }`}
              >
                {profile.isLandowner ? i18n.landYes : i18n.landNo}
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 bg-emerald-900/80 text-emerald-200 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> {i18n.backBtn}
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl flex items-center gap-2 text-sm shadow-lg"
            >
              {i18n.nextStep3}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Housing Status */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
            <Home className="w-4 h-4 text-emerald-400" />
            <span>{i18n.step3Title}</span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-emerald-200">{i18n.housingLabel}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setProfile({ ...profile, housingType: 'kutcha' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  profile.housingType === 'kutcha'
                    ? 'bg-emerald-400 text-emerald-950 border-emerald-300 font-bold shadow-md'
                    : 'bg-emerald-950/60 text-emerald-100 border-emerald-800/60'
                }`}
              >
                <div className="text-lg mb-1">{i18n.kutchaTitle}</div>
                <p className="text-[11px] opacity-80">{i18n.kutchaSub}</p>
              </button>

              <button
                onClick={() => setProfile({ ...profile, housingType: 'pucca' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  profile.housingType === 'pucca'
                    ? 'bg-emerald-400 text-emerald-950 border-emerald-300 font-bold shadow-md'
                    : 'bg-emerald-950/60 text-emerald-100 border-emerald-800/60'
                }`}
              >
                <div className="text-lg mb-1">{i18n.puccaTitle}</div>
                <p className="text-[11px] opacity-80">{i18n.puccaSub}</p>
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-emerald-900/80 text-emerald-200 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> {i18n.backBtn}
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 font-extrabold rounded-xl flex items-center gap-2 text-sm shadow-xl"
            >
              {i18n.calculateBtn}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Recommendations */}
      {step === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/50 pb-3">
            <div>
              <h3 className="text-lg font-black text-emerald-300">
                {rankedSchemes.length} {i18n.foundSchemesTitle}
              </h3>
              <p className="text-xs text-emerald-200/80">
                Matched for {profile.occupation} in {profile.state} ({profile.gender === 'female' ? 'Female' : 'Male'}, Age {profile.age})
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
            >
              {i18n.modifyAnswers}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rankedSchemes.map(({ scheme, matchScore }) => (
              <div
                key={scheme.id}
                className="bg-emerald-950/80 rounded-2xl border border-emerald-700/60 p-4 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-2xl p-1 bg-emerald-900/60 rounded-xl border border-emerald-700">{scheme.icon}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200">
                        {scheme.ruralCategory}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                        {matchScore}% {i18n.matchScore}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">{scheme.title}</h4>
                  <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">{scheme.shortDesc}</p>

                  <div className="mt-3 space-y-1 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/40">
                    <p className="text-[10px] font-bold text-emerald-300 uppercase">{i18n.keyBenefit}</p>
                    <p className="text-xs text-emerald-100">{scheme.benefits[0]}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-emerald-800/60 gap-2">
                  <button
                    onClick={() => setSelectedSchemeDetail(scheme)}
                    className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    {i18n.docButton}
                  </button>
                  <a
                    href={scheme.officialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    {i18n.portalBtn} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail & Document Checklist Drawer Modal */}
      {selectedSchemeDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-emerald-600 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-emerald-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedSchemeDetail.icon}</span>
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                    {selectedSchemeDetail.ruralCategory}
                  </span>
                  <h3 className="font-black text-white text-base mt-1">{selectedSchemeDetail.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="text-emerald-400 hover:text-white font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-emerald-200">{selectedSchemeDetail.shortDesc}</p>

            {/* Benefits */}
            <div className="space-y-1.5 bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">💰 Scheme Benefits & Transfer</p>
              <ul className="space-y-1 text-xs text-emerald-100">
                {selectedSchemeDetail.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Document Checklist */}
            <div className="space-y-2 bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/80">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {i18n.checklistTitle}
                </p>
                <span className="text-[10px] text-emerald-400">Click to check off</span>
              </div>
              <div className="space-y-1.5">
                {selectedSchemeDetail.requiredDocuments.map((doc, idx) => {
                  const isChecked = !!checkedDocs[doc];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleDocCheck(doc)}
                      className={`w-full p-2 rounded-lg text-xs flex items-center justify-between transition-all border ${
                        isChecked
                          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800/60 hover:border-emerald-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span className={isChecked ? 'line-through opacity-80' : ''}>{doc}</span>
                      </span>
                      <span className="text-[10px] font-bold">{isChecked ? 'READY' : 'REQUIRED'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step-by-step How to Apply */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-emerald-300 uppercase">{i18n.howToApplyTitle}</p>
              <ol className="space-y-1 text-xs text-emerald-200">
                {selectedSchemeDetail.howToApply.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-800 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Assistance Center */}
            <div className="flex items-center gap-2 text-xs text-emerald-200 bg-emerald-900/80 p-2.5 rounded-xl border border-emerald-700/60">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{i18n.nearestCenter}: <strong>{selectedSchemeDetail.assistanceCenter}</strong></span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-emerald-800">
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-emerald-300 hover:text-white"
              >
                {i18n.closeBtn}
              </button>
              <a
                href={selectedSchemeDetail.officialLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-300 flex items-center gap-1.5"
              >
                Open Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
