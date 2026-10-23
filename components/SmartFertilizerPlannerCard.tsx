'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import {
  TestTube,
  Users,
  Award,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Filter,
  Sparkles,
  Info,
  ChevronDown,
  Layers,
  Leaf
} from 'lucide-react';

interface FertilizerOption {
  id: string;
  name: string;
  manufacturer: string;
  suitabilityMatch: number; // e.g. 94%
  scientificMatch: number; // e.g. 96%
  farmerRating: number; // e.g. 4.6
  reviewCount: number; // e.g. 142
  farmersLikeYouStat: string; // e.g. "88% of 142 farmers with similar low-N soil reported 15%+ yield increase"
  approxCost: string;
  nutrientRatio: string;
  recommendedDose: string;
  positiveFeedback: string;
  commonConcern: string;
  badgeTag: string;
  badgeBg: string;
}

const FERTILIZER_DEMO_DATA: Record<string, {
  headerTitle: string;
  headerSub: string;
  soilContextTitle: string;
  filterButtonText: string;
  options: FertilizerOption[];
}> = {
  en: {
    headerTitle: 'Smart Soil & Fertilizer Recommendation Engine',
    headerSub: 'Scientific ICAR Soil-Test Suitability 🧪 + Verified Community Experience ("Farmers Like You") 👨‍🌾',
    soilContextTitle: 'Your Field Soil Test Context',
    filterButtonText: 'Filtered by "Farmers Like You" (Same Crop + Similar Soil + Local District)',
    options: [
      {
        id: 'f-1',
        name: 'Bio-NPK & Bio-Zinc Granules (Eco-Nutrient Booster)',
        manufacturer: 'IFFCO Agro-Tech',
        suitabilityMatch: 94,
        scientificMatch: 96,
        farmerRating: 4.6,
        reviewCount: 142,
        farmersLikeYouStat: '88% of 142 farmers in Pune/Guntur with similar low-N soil reported 15%+ yield increase',
        approxCost: '₹450 / 50kg bag',
        nutrientRatio: 'N-P-K (12-18-10) + 0.5% Micro-Zinc',
        recommendedDose: '50 kg / acre (Basal application during tillering)',
        positiveFeedback: 'Rapid root development and deep green leaf color within 10 days of application.',
        commonConcern: 'Must be applied during early morning hours on moist soil for best microbial survival.',
        badgeTag: 'TOP MATCH FOR YOUR SOIL',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      },
      {
        id: 'f-2',
        name: 'Neem-Coated Urea + Single Super Phosphate (SSP) Mix',
        manufacturer: 'Mahadhan Fertilisers',
        suitabilityMatch: 87,
        scientificMatch: 91,
        farmerRating: 4.2,
        reviewCount: 98,
        farmersLikeYouStat: '79% of 98 local tomato/paddy farmers reported good vegetative growth',
        approxCost: '₹320 / 50kg bag',
        nutrientRatio: 'N-P-K (20-10-0) + 16% Sulfur',
        recommendedDose: '45 kg / acre (Split into 2 doses)',
        positiveFeedback: 'Very cost-effective with steady, prolonged nitrogen release without burning roots.',
        commonConcern: 'Risk of nitrogen leaching if heavy rainfall occurs within 48 hours of application.',
        badgeTag: 'HIGH COST EFFICIENCY',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300'
      },
      {
        id: 'f-3',
        name: 'Enriched Vermicompost + Azotobacter Bio-Inoculant',
        manufacturer: 'Organic India Krishi',
        suitabilityMatch: 82,
        scientificMatch: 85,
        farmerRating: 4.8,
        reviewCount: 110,
        farmersLikeYouStat: '92% of organic & progressive farmers reported long-term soil health improvement',
        approxCost: '₹280 / 50kg bag',
        nutrientRatio: 'Organic Nitrogen (3%) + Beneficial Rhizobacteria',
        recommendedDose: '200 kg / acre (Top dressing around root zone)',
        positiveFeedback: 'Greatly improves soil moisture retention and earthworm activity.',
        commonConcern: 'Slower initial response — takes 15-20 days to show visible leaf greening.',
        badgeTag: 'BEST SOIL HEALTH IMPACT',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300'
      }
    ]
  },
  mr: {
    headerTitle: 'स्मार्ट माती व खत शिफारस प्रणाली',
    headerSub: 'शास्त्रीय माती चाचणी योग्यता 🧪 + सत्यापित शेतकरी अनुभव ("तुमच्यासारखे शेतकरी") 👨‍🌾',
    soilContextTitle: 'तुमच्या शेताचा माती चाचणी अहवाल',
    filterButtonText: 'तुमच्यासारखे शेतकरी (समान पीक + समान माती + स्थानिक जिल्हा)',
    options: [
      {
        id: 'f-1',
        name: 'बायो-NPK आणि बायो-झिंक ग्रॅन्युअल्स (इको-न्यूट्रिएंट बूस्टर)',
        manufacturer: 'इफ्को ॲग्रो-टेक',
        suitabilityMatch: 94,
        scientificMatch: 96,
        farmerRating: 4.6,
        reviewCount: 142,
        farmersLikeYouStat: 'पुणे जिल्ह्यातील १४२ समान शेतकर्‍यांपैकी ८८% शेतकर्‍यांनी १५%+ उत्पादन वाढ नोंदवली',
        approxCost: '₹४५० / ५० किलो बॅग',
        nutrientRatio: 'N-P-K (१२-१८-१०) + ०.५% मायक्रो-झिंक',
        recommendedDose: '५० किलो / एकर (फुटवे अवस्थेत बेसल डोस)',
        positiveFeedback: 'फवारणीनंतर १० दिवसांत मुळांची वेगाने वाढ व पानांना गडद हिरवा रंग येतो.',
        commonConcern: 'जीवाणू जिवंत राहण्यासाठी सकाळी ओल्या मातीत देणे आवश्यक आहे.',
        badgeTag: 'मातीसाठी सर्वोत्तम पर्याय',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      },
      {
        id: 'f-2',
        name: 'निंबोळी लेपित युरिया + सिंगल सुपर फॉस्फेट (SSP) मिश्रण',
        manufacturer: 'महाधन फर्टिलायझर्स',
        suitabilityMatch: 87,
        scientificMatch: 91,
        farmerRating: 4.2,
        reviewCount: 98,
        farmersLikeYouStat: '९८ स्थानिक भात/टोमॅटो उत्पादकांपैकी ७९% शेतकर्‍यांनी समाधानकारक वाढ नोंदवली',
        approxCost: '₹३२० / ५० किलो बॅग',
        nutrientRatio: 'N-P-K (२०-१०-०) + १६% गंधक (Sulfur)',
        recommendedDose: '४५ किलो / एकर (२ हप्त्यांमध्ये द्या)',
        positiveFeedback: 'कमी खर्चात नत्राचा हळूहळू पुरवठा होतो, मुळे करपत नाहीत.',
        commonConcern: 'फवारणीनंतर ४८ तासांत मुसळधार पाऊस आल्यास नत्र वाहून जाण्याचा धोका.',
        badgeTag: 'किंमत व फायद्याचा तोल',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300'
      },
      {
        id: 'f-3',
        name: 'गांडूळ खत + ॲझोटोबॅक्टर जिवाणू खत',
        manufacturer: 'ऑरगॅनिक इंडिया कृषी',
        suitabilityMatch: 82,
        scientificMatch: 85,
        farmerRating: 4.8,
        reviewCount: 110,
        farmersLikeYouStat: '११० सेंद्रिय शेतकर्‍यांपैकी ९२% शेतकर्‍यांनी मातीच्या आरोग्यात सुधारणा नोंदवली',
        approxCost: '₹२८० / ५० किलो बॅग',
        nutrientRatio: 'सेंद्रिय नत्र (३%) + उपयुक्त सूक्ष्मजीव',
        recommendedDose: '२०० किलो / एकर (झाडाच्या बुंध्याजवळ द्या)',
        positiveFeedback: 'मातीतील ओलावा धरून ठेवण्याची क्षमता व गांडुळांची संख्या वाढते.',
        commonConcern: 'परिणाम दिसण्यास १५-२० दिवस लागतात.',
        badgeTag: 'माती आरोग्यासाठी उत्तम',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300'
      }
    ]
  },
  hi: {
    headerTitle: 'स्मार्ट मृदा एवं उर्वरक सिफारिश इंजन',
    headerSub: 'वैज्ञानिक मृदा परीक्षण उपयुक्तता 🧪 + सत्यापित किसान अनुभव ("आप जैसे किसान") 👨‍🌾',
    soilContextTitle: 'आपके खेत का मृदा परीक्षण विवरण',
    filterButtonText: 'आप जैसे किसान (समान फसल + समान मिट्टी + स्थानीय जिला)',
    options: [
      {
        id: 'f-1',
        name: 'बायो-NPK एवं बायो-जिंक दानेदार (इको-न्यूट्रिएंट बूस्टर)',
        manufacturer: 'इफको एग्रो-टेक',
        suitabilityMatch: 94,
        scientificMatch: 96,
        farmerRating: 4.6,
        reviewCount: 142,
        farmersLikeYouStat: 'पुणे जिले के 142 समान किसानों में से 88% ने 15%+ पैदावार वृद्धि की पुष्टि की',
        approxCost: '₹450 / 50 किग्रा बैग',
        nutrientRatio: 'N-P-K (12-18-10) + 0.5% माइक्रो-जिंक',
        recommendedDose: '50 किग्रा / एकड़ (कल्ले निकलते समय)',
        positiveFeedback: 'उपयोग के 10 दिनों के भीतर जड़ों का तेजी से विकास और गहरा हरा रंग।',
        commonConcern: 'जीवाणुओं के जीवित रहने के लिए सुबह के समय नम मिट्टी में डालें।',
        badgeTag: 'आपकी मिट्टी के लिए सर्वश्रेष्ठ',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      },
      {
        id: 'f-2',
        name: 'नीम लेपित यूरिया + सिंगल सुपर फास्फेट (SSP) मिश्रण',
        manufacturer: 'महाधन फर्टिलाइजर्स',
        suitabilityMatch: 87,
        scientificMatch: 91,
        farmerRating: 4.2,
        reviewCount: 98,
        farmersLikeYouStat: '98 स्थानीय टमाटर/धान किसानों में से 79% ने संतोषजनक वृद्धि दर्ज की',
        approxCost: '₹320 / 50 किग्रा बैग',
        nutrientRatio: 'N-P-K (20-10-0) + 16% सल्फर',
        recommendedDose: '45 किग्रा / एकड़ (2 किस्तों में लें)',
        positiveFeedback: 'कम लागत में धीरे-धीरे नाइट्रोजन रिलीज, जड़ों को नुकसान नहीं।',
        commonConcern: 'प्रयोग के 48 घंटे के भीतर भारी बारिश होने पर लीचिंग का खतरा।',
        badgeTag: 'लागत प्रभावी विकल्प',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300'
      },
      {
        id: 'f-3',
        name: 'वर्मीकम्पोस्ट + एजोटोबैक्टर जैव उर्वरक',
        manufacturer: 'ऑर्गेनिक इंडिया कृषि',
        suitabilityMatch: 82,
        scientificMatch: 85,
        farmerRating: 4.8,
        reviewCount: 110,
        farmersLikeYouStat: '110 जैविक किसानों में से 92% ने मृदा स्वास्थ्य में सुधार की सूचना दी',
        approxCost: '₹280 / 50 किग्रा बैग',
        nutrientRatio: 'जैविक नाइट्रोजन (3%) + उपयोगी जीवाणु',
        recommendedDose: '200 किग्रा / एकड़ (जड़ों के पास दें)',
        positiveFeedback: 'मिट्टी की जलधारण क्षमता और केंचुओं की गतिविधि बढ़ाता है।',
        commonConcern: 'परिणाम दिखने में 15-20 दिन का समय लगता है।',
        badgeTag: 'मृदा स्वास्थ्य के लिए सर्वश्रेष्ठ',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300'
      }
    ]
  }
};

export default function SmartFertilizerPlannerCard() {
  const { language } = useAuth();
  const data = FERTILIZER_DEMO_DATA[language] || FERTILIZER_DEMO_DATA['hi'] || FERTILIZER_DEMO_DATA['en'];

  const [onlyFarmersLikeYou, setOnlyFarmersLikeYou] = useState<boolean>(true);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl text-xl font-bold">🧪</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {data.headerTitle}
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-600 text-white rounded-full uppercase tracking-wider">
                  ICAR Multi-Signal
                </span>
              </h2>
              <p className="text-xs text-gray-500">{data.headerSub}</p>
            </div>
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setOnlyFarmersLikeYou(!onlyFarmersLikeYou)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            onlyFarmersLikeYou
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>Farmers Like You Filter</span>
          <span className={`w-2 h-2 rounded-full ${onlyFarmersLikeYou ? 'bg-emerald-500' : 'bg-gray-300'}`} />
        </button>
      </div>

      {/* Soil Context Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-2xl p-4 space-y-2 border border-emerald-800">
        <div className="flex items-center justify-between text-xs border-b border-emerald-800/80 pb-2">
          <span className="font-bold text-emerald-300 flex items-center gap-1">
            <TestTube className="w-4 h-4 text-emerald-400" />
            {data.soilContextTitle} (Soil Health Card ID: SHC-2026-PN)
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-500/40">
            Target Crop: Rice (Paddy)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/10 p-2 rounded-xl">
            <p className="text-stone-300 text-[10px]">Nitrogen (N)</p>
            <p className="font-bold text-red-300">LOW (85 kg/ha)</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <p className="text-stone-300 text-[10px]">Phosphorus (P)</p>
            <p className="font-bold text-amber-300">MEDIUM (22 kg/ha)</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <p className="text-stone-300 text-[10px]">Potassium (K)</p>
            <p className="font-bold text-emerald-300">HIGH (280 kg/ha)</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <p className="text-stone-300 text-[10px]">Soil pH & Organic Carbon</p>
            <p className="font-bold text-white">pH 6.8 · OC 0.52%</p>
          </div>
        </div>
      </div>

      {/* Filter Active Badge */}
      {onlyFarmersLikeYou && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium">{data.filterButtonText}</span>
        </div>
      )}

      {/* Recommended Fertilizer Cards */}
      <div className="space-y-4">
        {data.options.map((opt, idx) => (
          <div key={opt.id} className="rounded-2xl border border-stone-200 p-4 space-y-3 hover:border-emerald-300 transition-all bg-stone-50/50">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${opt.badgeBg}`}>
                    {opt.badgeTag}
                  </span>
                  <span className="text-xs text-stone-500 font-semibold">{opt.manufacturer}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mt-1 flex items-center gap-1.5">
                  <span>{idx + 1}. {opt.name}</span>
                </h3>
              </div>

              {/* Multi-Signal Badges */}
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-center shadow-2xs">
                  <p className="text-[9px] uppercase font-bold text-emerald-200">Suitability</p>
                  <p className="font-black text-sm">{opt.suitabilityMatch}%</p>
                </div>
                <div className="bg-stone-800 text-white px-3 py-1 rounded-xl text-center">
                  <p className="text-[9px] uppercase font-bold text-amber-300">Farmer Exp</p>
                  <p className="font-black text-sm text-amber-400">⭐ {opt.farmerRating}</p>
                </div>
              </div>
            </div>

            {/* "Farmers Like You" Verified Stat */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
              <Users className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">👨‍🌾 "Farmers Like You" Local Field Data:</p>
                <p className="text-emerald-800 mt-0.5">{opt.farmersLikeYouStat}</p>
              </div>
            </div>

            {/* Specs & Cost */}
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-gray-400 font-semibold block">🧪 Nutrient Composition</span>
                <span className="font-bold text-gray-800">{opt.nutrientRatio}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-gray-400 font-semibold block">🌱 ICAR Recommended Dose</span>
                <span className="font-bold text-gray-800">{opt.recommendedDose}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-gray-400 font-semibold block">💰 Approx Market Price</span>
                <span className="font-bold text-emerald-700">{opt.approxCost}</span>
              </div>
            </div>

            {/* Common Feedback & Concerns */}
            <div className="grid sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900 block text-[11px]">Common Positive Feedback:</span>
                  <span className="text-emerald-800">{opt.positiveFeedback}</span>
                </div>
              </div>
              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block text-[11px]">Common Field Concern:</span>
                  <span className="text-amber-800">{opt.commonConcern}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
