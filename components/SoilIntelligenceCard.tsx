'use client';
import { useAuth } from '@/lib/authContext';
import {
  TestTube,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Wheat,
  ShieldAlert,
  Droplets,
  Zap,
  Info,
  Layers,
  Activity
} from 'lucide-react';

interface SoilIntelligenceCardProps {
  soilType: string;
  irrigationType: string;
  district: string;
  farmName: string;
}

interface SoilData {
  retention: string;
  retentionScore: number;
  phWindow: string;
  organicCarbon: string;
  suitableCrops: string[];
  diseaseRiskTitle: string;
  diseaseRiskDesc: string;
  riskSeverity: 'high' | 'medium' | 'low';
  precautions: string[];
  amendmentRecommendation: string;
}

const SOIL_AI_DATABASE: Record<string, Record<string, SoilData>> = {
  en: {
    'Black Cotton Soil': {
      retention: 'High Moisture Retention (75%)',
      retentionScore: 75,
      phWindow: '7.2 – 8.5 (Slightly Alkaline)',
      organicCarbon: '0.45% (Needs Carbon Boost)',
      suitableCrops: ['Rice (Paddy)', 'Cotton', 'Soybean', 'Sugarcane', 'Gram (Chana)'],
      diseaseRiskTitle: 'High Soil Compaction & Fungal Root Rot Risk',
      diseaseRiskDesc: 'Heavy clay content swells when wet and shrinks when dry, trapping excess surface moisture after heavy rain and increasing Phytophthora & Pythium root rot infection risk.',
      riskSeverity: 'high',
      precautions: [
        'Avoid flood irrigation — use Drip or Broad Bed Furrow (BBF) planting.',
        'Apply Trichoderma viride bio-fungicide @ 2.5 kg/acre mixed with FYM at root zone.',
        'Deep summer ploughing to break hard pan and improve subsoil aeration.'
      ],
      amendmentRecommendation: 'Apply Bio-Gypsum (100 kg/acre) + Neem Cake (50 kg/acre) to improve soil porosity.'
    },
    'Red Laterite Soil': {
      retention: 'Moderate-Low Retention (42%)',
      retentionScore: 42,
      phWindow: '5.5 – 6.5 (Slightly Acidic)',
      organicCarbon: '0.38% (Low)',
      suitableCrops: ['Groundnut', 'Pulses (Tur/Moong)', 'Millets (Ragi/Bajra)', 'Vegetables', 'Cashew'],
      diseaseRiskTitle: 'Phosphorus Fixation & Rapid Nutrient Leaching Risk',
      diseaseRiskDesc: 'High iron and aluminum oxides fix soluble phosphorus into insoluble compounds, while porous texture allows nitrogen and potassium to leach out quickly during heavy rains.',
      riskSeverity: 'medium',
      precautions: [
        'Apply Neem-Coated Urea in 3 split doses rather than single heavy application.',
        'Use PSB (Phosphate Solubilizing Bacteria) @ 2 kg/acre to unlock bound phosphorus.',
        'Incorporate green manure crops (Dhaincha/Sunn hemp) before main crop sowing.'
      ],
      amendmentRecommendation: 'Apply Agricultural Lime / Dolomite (50 kg/acre) to neutralize soil acidity.'
    },
    'Alluvial Loam': {
      retention: 'Optimal Balanced Retention (65%)',
      retentionScore: 65,
      phWindow: '6.5 – 7.5 (Neutral Ideal)',
      organicCarbon: '0.62% (Moderate-Good)',
      suitableCrops: ['Wheat', 'Rice', 'Mustard', 'Sugarcane', 'Potato', 'Vegetables', 'Maize'],
      diseaseRiskTitle: 'Optimal Growth Soil — Watch for Humid Stem Borer & Mildew',
      diseaseRiskDesc: 'Highly fertile soil structure with good cation exchange. Primary risks stem from micro-climate humidity rather than soil toxicity or drainage failure.',
      riskSeverity: 'low',
      precautions: [
        'Maintain crop rotation with leguminous pulses every 2 seasons.',
        'Monitor soil moisture with IoT sensors to prevent over-irrigation.',
        'Foliar spray of micronutrient mixture (Zinc + Boron) during flowering stage.'
      ],
      amendmentRecommendation: 'Maintain soil organic matter using Vermicompost (200 kg/acre) + Azotobacter.'
    },
    'Sandy Loam': {
      retention: 'Low Moisture Retention (35%)',
      retentionScore: 35,
      phWindow: '6.0 – 7.2 (Slightly Acidic to Neutral)',
      organicCarbon: '0.32% (Low)',
      suitableCrops: ['Groundnut', 'Sesame', 'Watermelon', 'Potato', 'Pulses', 'Spices'],
      diseaseRiskTitle: 'Moisture Stress & Root-Knot Nematode Vulnerability',
      diseaseRiskDesc: 'Coarse sand particles cause rapid drainage and root zone dryness. Warm loose soil favors Root-Knot Nematodes (Meloidogyne species) attacking root tips.',
      riskSeverity: 'medium',
      precautions: [
        'Use Drip Fertigation with daily short watering intervals.',
        'Apply Organic Mulching (Paddy straw / sugarcane trash) to reduce evaporation.',
        'Apply Purpureocillium lilacinum bio-nematicide @ 2 kg/acre at sowing.'
      ],
      amendmentRecommendation: 'Apply Pressmud / Well-rotted Cow Dung manure (2 tonnes/acre) to increase water retention.'
    }
  },
  mr: {
    'Black Cotton Soil': {
      retention: 'उच्च माती ओलावा धारण क्षमता (७५%)',
      retentionScore: 75,
      phWindow: '७.२ – ८.५ (किंचित अल्कलीयुक्त)',
      organicCarbon: '०.४५% (सेंद्रिय कर्ब वाढवणे आवश्यक)',
      suitableCrops: ['भात (धान)', 'कापूस', 'सोयाबीन', 'ऊस', 'हरभरा'],
      diseaseRiskTitle: 'माती घट्ट होणे व मूळकुज रोगाचा उच्च धोका',
      diseaseRiskDesc: 'काळी माती पावसात फुगते व वाळल्यावर भेगा पडतात. पाऊस पडल्यानंतर पाणी साचून राहिल्याने मूळकुज (Root Rot) आणि मर रोगाचा धोका वाढतो.',
      riskSeverity: 'high',
      precautions: [
        'पाटपाणी देण्याऐवजी ठिबक किंवा बीबीएफ (BBF) गादीवाफा पद्धत वापरा.',
        'ट्रायकोडर्मा व्हिरिडी जिवाणू २.५ किलो/एकरी शेणखतात मिसळून मुळांजवळ द्या.',
        'उन्हाळ्यात खोल नांगरट करा जेणेकरून मातीची हवा खेळती राहील.'
      ],
      amendmentRecommendation: 'मातीची सच्छिद्रता वाढवण्यासाठी बायो-जिप्सम (१०० किलो/एकरी) + कडुनिंब पेंड वापरा.'
    },
    'Red Laterite Soil': {
      retention: 'मध्यम-कमी ओलावा क्षमता (४२%)',
      retentionScore: 42,
      phWindow: '५.५ – ६.५ (किंचित आम्लयुक्त)',
      organicCarbon: '०.३८% (कमी)',
      suitableCrops: ['भुईमूग', 'कडधान्ये (तूर/मूग)', 'नाचणी/बाजरी', 'भाजीपाला', 'काजू'],
      diseaseRiskTitle: 'स्फुरद (Phosphorus) पकडून ठेवणे व खते वाहून जाण्याचा धोका',
      diseaseRiskDesc: 'या मातीत लोह व ॲल्युमिनियम जास्त असल्याने स्फुरद पिकाला मिळत नाही, तसेच मुसळधार पावसात नत्र व पालाश खाली वाहून जाते.',
      riskSeverity: 'medium',
      precautions: [
        'नत्र (युरिया) एकाच वेळी न देता ३ हप्त्यांमध्ये विभागून द्या.',
        'मातीतील स्फुरद उपलब्ध करण्यासाठी पीएसबी (PSB) जिवाणू २ किलो/एकरी वापरा.',
        'पेरणीपूर्वी ताग/धैंचा गाडून हिरवळीचे खत करा.'
      ],
      amendmentRecommendation: 'मातीचा सामू (pH) सुधारण्यासाठी कृषी चुना / डोलोमाईट (५० किलो/एकरी) टाका.'
    },
    'Alluvial Loam': {
      retention: 'उत्कृष्ट संतुलित ओलावा (६५%)',
      retentionScore: 65,
      phWindow: '६.५ – ७.५ (योग्य न्यूट्रल)',
      organicCarbon: '०.६२% (उत्तम)',
      suitableCrops: ['गहू', 'भात', 'मोहरी', 'ऊस', 'बटाटा', 'भाजीपाला', 'मका'],
      diseaseRiskTitle: 'सुपीक माती — हवेतील आर्द्रतेमुळे करपा रोगाकडे लक्ष द्या',
      diseaseRiskDesc: 'अतिशय सुपीक माती रचना. मातीच्या समस्येपेक्षा हवेतील जास्त आर्द्रतेमुळे येणाऱ्या रोगांचा धोका जास्त असतो.',
      riskSeverity: 'low',
      precautions: [
        'दर २ हंगामांनंतर कडधान्य पिकांची फेरपालट करा.',
        'जास्त पाणी देणे टाळण्यासाठी ओलावा सेन्सर वापरा.',
        'फुलोरा अवस्थेत सूक्ष्म अन्नद्रव्ये (झिंक + बोरॉन) फवारा.'
      ],
      amendmentRecommendation: 'गांडूळ खत (२०० किलो/एकरी) + ॲझोटोबॅक्टर वापरून मातीची सुपीकता राखा.'
    },
    'Sandy Loam': {
      retention: 'कमी ओलावा क्षमता (३५%)',
      retentionScore: 35,
      phWindow: '६.० – ७.२',
      organicCarbon: '०.३२% (कमी)',
      suitableCrops: ['भुईमूग', 'तीळ', 'कलिंगड', 'बटाटा', 'कडधान्ये', 'मसाले पिके'],
      diseaseRiskTitle: 'ओलावा ताण व मूळ गाठ (Nematode) कीड धोका',
      diseaseRiskDesc: 'वाळूमिश्रित मातीमुळे पाणी लगेच झिरपून जाते. गरम व भुसभुशीत मातीत मुळांवर गाठी करणाऱ्या सूत्राकृमींचा धोका जास्त असतो.',
      riskSeverity: 'medium',
      precautions: [
        'ठिबक सिंचनाद्वारे दररोज थोडे थोडे पाणी व खते द्या.',
        'बाष्पीभवन रोखण्यासाठी पराटी/काड्यांचे आच्छादन (Mulching) करा.',
        'पेरणीवेळी जैविक सूत्रकृमीनाशक २ किलो/एकरी वापरा.'
      ],
      amendmentRecommendation: 'मातीची पाणी धरून ठेवण्याची क्षमता वाढवण्यासाठी चांगले कुजलेले शेणखत (२ टन/एकरी) टाका.'
    }
  },
  hi: {
    'Black Cotton Soil': {
      retention: 'उच्च नमी धारण क्षमता (75%)',
      retentionScore: 75,
      phWindow: '7.2 – 8.5 (ईषद क्षारीय)',
      organicCarbon: '0.45% (जैविक कार्बन बढ़ाएं)',
      suitableCrops: ['धान (चावल)', 'कपास', 'सोयाबीन', 'गन्ना', 'चना'],
      diseaseRiskTitle: 'मृदा संपीड़न एवं जड़ सड़न (Root Rot) का उच्च जोखिम',
      diseaseRiskDesc: 'काली मिट्टी गीली होने पर फूलती है और सूखने पर दरारें पड़ती हैं। भारी बारिश के बाद पानी रुकने से फफूंदजनित जड़ सड़न का खतरा बढ़ता है।',
      riskSeverity: 'high',
      precautions: [
        'प्लावन (Flood) सिंचाई से बचें — ड्रिप या बीबीएफ (BBF) विधि अपनाएं।',
        'ट्राइकोडर्मा विरिडे जैव-फफूंदनाशी 2.5 किग्रा/एकड़ गोबर खाद में मिलाकर दें।',
        'गर्मियों में गहरी जुताई करें ताकि मिट्टी में हवा का संचार बढ़े।'
      ],
      amendmentRecommendation: 'मिट्टी की सरंध्रता बढ़ाने के लिए बायो-जिप्सम (100 किग्रा/एकड़) + नीम खली डालें।'
    },
    'Red Laterite Soil': {
      retention: 'मध्यम-कम नमी क्षमता (42%)',
      retentionScore: 42,
      phWindow: '5.5 – 6.5 (ईषद अम्लीय)',
      organicCarbon: '0.38% (कम)',
      suitableCrops: ['मूंगफली', 'दलहन (अरहर/मूंग)', 'मोटा अनाज (रागी/बाजरा)', 'सब्जियां', 'काजू'],
      diseaseRiskTitle: 'फास्फोरस स्थिरीकरण एवं पोषक तत्वों के बहने का जोखिम',
      diseaseRiskDesc: 'आयरन और एल्युमिनियम ऑक्साइड फास्फोरस को अघुलनशील बनाते हैं, जबकि भारी बारिश में नाइट्रोजन और पोटेशियम बह जाते हैं।',
      riskSeverity: 'medium',
      precautions: [
        'नाइट्रोजन (यूरिया) एक बार में न देकर 3 किस्तों में बांटकर दें।',
        'पीएसबी (PSB) जीवाणु 2 किग्रा/एकड़ का उपयोग करके बंधे फास्फोरस को घोलें।',
        'मुख्य फसल की बुआई से पहले ढैंचा/सनई की हरी खाद बनाएं।'
      ],
      amendmentRecommendation: 'मिट्टी की अम्लीयता सुधारने के लिए कृषि चूना / डोलोमाइट (50 किग्रा/एकड़) डालें।'
    },
    'Alluvial Loam': {
      retention: 'उत्कृष्ट संतुलित नमी (65%)',
      retentionScore: 65,
      phWindow: '6.5 – 7.5 (आदर्श उदासीन)',
      organicCarbon: '0.62% (उत्तम)',
      suitableCrops: ['गेहूं', 'धान', 'सरसों', 'गन्ना', 'आलू', 'सब्जियां', 'मक्का'],
      diseaseRiskTitle: 'उर्वर मृदा — हवा की नमी से फफूंद धब्बों का ध्यान रखें',
      diseaseRiskDesc: 'अत्यधिक उपजाऊ मिट्टी। मृदा समस्याओं की तुलना में वायुमंडलीय आर्द्रता से होने वाली बीमारियों का जोखिम अधिक होता है।',
      riskSeverity: 'low',
      precautions: [
        'हर 2 सीजन के बाद दलहनी फसलों का चक्रण करें।',
        'अत्यधिक सिंचाई से बचने के लिए नमी सेंसर का उपयोग करें।',
        'फूल आने की अवस्था में सूक्ष्म पोषक तत्व (जिंक + बोरॉन) छिड़कें।'
      ],
      amendmentRecommendation: 'वर्मीकम्पोस्ट (200 किग्रा/एकड़) + एजोटोबैक्टर का प्रयोग कर मिट्टी की उर्वरता बनाए रखें।'
    },
    'Sandy Loam': {
      retention: 'कम नमी धारण क्षमता (35%)',
      retentionScore: 35,
      phWindow: '6.0 – 7.2',
      organicCarbon: '0.32% (कम)',
      suitableCrops: ['मूंगफली', 'तिल', 'तरबूज', 'आलू', 'दालें', 'मसाले'],
      diseaseRiskTitle: 'नमी तनाव एवं जड़-गांठ (Nematode) कीट जोखिम',
      diseaseRiskDesc: 'बलुई मिट्टी के कारण पानी तेजी से रिस जाता है। हल्की ढीली मिट्टी में जड़ों पर गांठ बनाने वाले सूत्रकृमि का प्रकोप अधिक होता है।',
      riskSeverity: 'medium',
      precautions: [
        'ड्रिप फर्टिगेशन से प्रतिदिन कम मात्रा में पानी और उर्वरक दें।',
        'वाष्पीकरण रोकने के लिए धान के पुआल की मल्चिंग (Mulching) करें।',
        'बुआई के समय जैविक सूत्रकृमिनाशी 2 किग्रा/एकड़ डालें।'
      ],
      amendmentRecommendation: 'जलधारण क्षमता बढ़ाने के लिए अच्छी सड़ी गोबर खाद (2 टन/एकड़) का प्रयोग करें।'
    }
  }
};

export default function SoilIntelligenceCard({
  soilType,
  irrigationType,
  district,
  farmName
}: SoilIntelligenceCardProps) {
  const { language } = useAuth();

  const langData = SOIL_AI_DATABASE[language] || SOIL_AI_DATABASE['hi'] || SOIL_AI_DATABASE['en'];
  
  // Normalized soil key match fallback
  const matchedKey = Object.keys(langData).find(
    k => k.toLowerCase().includes(soilType.toLowerCase()) || soilType.toLowerCase().includes(k.toLowerCase())
  ) || 'Black Cotton Soil';

  const data = langData[matchedKey] || langData['Black Cotton Soil'];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-100 text-amber-800 rounded-xl text-xl font-bold">🧬</span>
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Soil Health Predictions & Agro Advisory
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-600 text-white rounded-full uppercase tracking-wider">
                AI Soil Model
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Customized predictions for <strong className="text-stone-800">{farmName}</strong> ({soilType} · {district})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-xs font-semibold text-stone-700">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>Irrigation: {irrigationType}</span>
        </div>
      </div>

      {/* Soil Health Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-semibold text-gray-400 block uppercase">Moisture Retention</span>
          <span className="font-bold text-gray-800 text-sm block mt-0.5">{data.retention}</span>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${data.retentionScore}%` }}
            />
          </div>
        </div>

        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-semibold text-gray-400 block uppercase">Soil pH Window</span>
          <span className="font-bold text-emerald-700 text-sm block mt-0.5">{data.phWindow}</span>
          <span className="text-[10px] text-gray-500 mt-1 block">Optimal for nutrient uptake</span>
        </div>

        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold text-gray-400 block uppercase">Organic Carbon (SOC)</span>
          <span className="font-bold text-amber-800 text-sm block mt-0.5">{data.organicCarbon}</span>
          <span className="text-[10px] text-amber-600 mt-1 block font-medium">Target: &gt;0.75%</span>
        </div>
      </div>

      {/* Recommended Crops for this Soil */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
        <h3 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 uppercase tracking-wide">
          <Wheat className="w-4 h-4 text-emerald-700" />
          Scientifically Recommended Crops for {soilType}:
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {data.suitableCrops.map(crop => (
            <span
              key={crop}
              className="px-2.5 py-1 bg-white text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 shadow-2xs flex items-center gap-1"
            >
              <span>🌱</span> {crop}
            </span>
          ))}
        </div>
      </div>

      {/* AI Soil-Specific Disease Risk Prediction */}
      <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-red-950 text-xs flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            AI Soil Risk Prediction: {data.diseaseRiskTitle}
          </h3>
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-red-600 text-white rounded-full">
            HIGH VULNERABILITY
          </span>
        </div>
        <p className="text-xs text-red-900 leading-relaxed">{data.diseaseRiskDesc}</p>
      </div>

      {/* Actionable Precautions & Amendment Recommendation */}
      <div className="space-y-2 text-xs">
        <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wide flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Recommended Actionable Soil Precautions:
        </h3>
        <div className="space-y-1.5">
          {data.precautions.map((p, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-gray-700 font-medium leading-relaxed">{p}</span>
            </div>
          ))}
        </div>

        {/* Soil Amendment Box */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-[11px]">🧪 Soil Amendment Recommendation:</span>
            <span className="text-amber-900 font-medium">{data.amendmentRecommendation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
