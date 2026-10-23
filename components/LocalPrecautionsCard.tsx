'use client';
import { useAuth } from '@/lib/authContext';
import { AlertCircle, CloudRain, ShieldAlert, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

interface PrecautionItem {
  id: string;
  title: string;
  category: string;
  severity: string;
  targetCrop: string;
  suggestion: string;
  actionSteps: string[];
  icon: string;
  updatedAt: string;
}

const LOCAL_PRECAUTIONS_I18N: Record<string, {
  headerTitle: string;
  headerSub: string;
  headerTag: string;
  targetCropLabel: string;
  actionStepsLabel: string;
  items: PrecautionItem[];
}> = {
  en: {
    headerTitle: 'Local Farmer Precautions & Weather Suggestions',
    headerSub: 'Actionable advice customized for current weather forecast & pest vulnerability',
    headerTag: 'Live Agro Advisory',
    targetCropLabel: 'Target Crop',
    actionStepsLabel: 'Recommended Action Steps:',
    items: [
      {
        id: 'prec-1',
        title: 'High Relative Humidity (88%) — Fungal Outbreak Warning',
        category: 'Disease Control',
        severity: 'High Priority',
        targetCrop: 'Rice & Soybean',
        suggestion: 'Elevated humidity over the next 48 hours creates ideal conditions for Rice Blast and Fungal Rust.',
        actionSteps: [
          'Avoid flood irrigation for the next 2 days to lower micro-climate moisture.',
          'Spray recommended bio-fungicide (Trichoderma viride @ 5g/L) during clear morning hours.',
          'Inspect field borders for early brown spot lesions.'
        ],
        icon: '🌧️',
        updatedAt: '2 hours ago',
      },
      {
        id: 'prec-2',
        title: 'Pheromone Trap Threshold Exceeded (Fall Armyworm)',
        category: 'Pest Alert',
        severity: 'High Priority',
        targetCrop: 'Maize & Sugarcane',
        suggestion: 'Pest traps in Nashik & Pune logged 18+ moths/trap/night, crossing the Economic Threshold Level (ETL).',
        actionSteps: [
          'Install 4-5 pheromone traps per acre immediately for mass trapping.',
          'Apply neem seed kernel extract (NSKE 5%) or recommended bio-pesticide in whorls.',
          'Notify local Extension Worker via GramSathi app if damage exceeds 10%.'
        ],
        icon: '🐛',
        updatedAt: '4 hours ago',
      },
      {
        id: 'prec-3',
        title: 'Unseasonal Rainfall Expected in 3 Days (25-35mm)',
        category: 'Soil & Irrigation',
        severity: 'Moderate',
        targetCrop: 'Cotton & Pulses',
        suggestion: 'IMD satellite imagery forecasts moderate rainfall with strong wind gusts across central Maharashtra.',
        actionSteps: [
          'Clear field drainage channels to prevent waterlogging around root zones.',
          'Delay scheduled chemical application until after the rain subsides.',
          'Provide mechanical support or earthing-up for young cotton stalks.'
        ],
        icon: '⛈️',
        updatedAt: 'Today, 08:30 AM',
      },
      {
        id: 'prec-4',
        title: 'Optimal Planting & Soil Moisture Window',
        category: 'Crop Protection',
        severity: 'Good Practice',
        targetCrop: 'Wheat & Gram (Rabi)',
        suggestion: 'Soil moisture levels (34%) are currently optimal for seed germination and root establishment.',
        actionSteps: [
          'Treat seeds with Azotobacter & PSB bio-fertilizers before sowing.',
          'Maintain spacing of 20-22 cm between crop rows.',
          'Apply basal fertilizer dose based on your Soil Health Card recommendations.'
        ],
        icon: '🌱',
        updatedAt: 'Yesterday',
      }
    ]
  },
  hi: {
    headerTitle: 'स्थानीय किसान सावधानियां और मौसम सलाह',
    headerSub: 'वर्तमान मौसम पूर्वानुमान और कीट जोखिम के आधार पर कार्रवाई योग्य सलाह',
    headerTag: 'लाइव कृषि सलाह',
    targetCropLabel: 'लक्षित फसल',
    actionStepsLabel: 'अनुशंसित कार्रवाई कदम:',
    items: [
      {
        id: 'prec-1',
        title: 'उच्च सापेक्ष आर्द्रता (88%) — कवक प्रकोप चेतावनी',
        category: 'रोग नियंत्रण',
        severity: 'उच्च प्राथमिकता',
        targetCrop: 'धान और सोयाबीन',
        suggestion: 'अगले 48 घंटों में उच्च नमी धान ब्लास्ट और फंगल रस्ट के लिए आदर्श स्थिति बनाती है।',
        actionSteps: [
          'नमी कम करने के लिए अगले 2 दिनों तक अधिक सिंचाई से बचें।',
          'सुबह के समय अनुशंसित जैव-कवकनाशी (ट्राइकोडर्मा विरिडे @ 5g/L) का छिड़काव करें।',
          'शुरुआती भूरे धब्बों के लिए खेत की सीमाओं की जांच करें।'
        ],
        icon: '🌧️',
        updatedAt: '2 घंटे पहले',
      },
      {
        id: 'prec-2',
        title: 'फेरोमोन ट्रैप सीमा पार (फॉल आर्मीवर्म)',
        category: 'कीट अलर्ट',
        severity: 'उच्च प्राथमिकता',
        targetCrop: 'मक्का और गन्ना',
        suggestion: 'नासिक और पुणे में कीट जाल में 18+ पतंगे/ट्रैप दर्ज किए गए, जो आर्थिक देहरी स्तर (ETL) को पार कर गए।',
        actionSteps: [
          'कीटों को पकड़ने के लिए तुरंत प्रति एकड़ 4-5 फेरोमोन ट्रैप लगाएं।',
          'नीम की गिरी का अर्क (NSKE 5%) या अनुशंसित जैव-कीटनाशक का छिड़काव करें।',
          'यदि नुकसान 10% से अधिक हो तो ग्रामसाथी ऐप से स्थानीय विस्तार कार्यकर्ता को सूचित करें।'
        ],
        icon: '🐛',
        updatedAt: '4 घंटे पहले',
      },
      {
        id: 'prec-3',
        title: '3 दिनों में बेमौसम बारिश की संभावना (25-35 मिमी)',
        category: 'मिट्टी और सिंचाई',
        severity: 'मध्यम',
        targetCrop: 'कपास और दलहन',
        suggestion: 'IMD उपग्रह छवियों ने मध्य महाराष्ट्र में तेज हवाओं के साथ मध्यम वर्षा का अनुमान लगाया है।',
        actionSteps: [
          'जड़ों के पास जलभराव को रोकने के लिए खेत की जल निकासी नालियों को साफ करें।',
          'बारिश रुकने तक रासायनिक छिड़काव स्थगित करें।',
          'कपास के छोटे पौधों को मिट्टी चढ़ाकर सहारा दें।'
        ],
        icon: '⛈️',
        updatedAt: 'आज, सुबह 08:30 बजे',
      },
      {
        id: 'prec-4',
        title: 'अनुकूल बुवाई और मिट्टी की नमी का समय',
        category: 'फसल सुरक्षा',
        severity: 'अच्छी प्रथा',
        targetCrop: 'गेहूं और चना (रबी)',
        suggestion: 'मिट्टी की नमी का स्तर (34%) वर्तमान में बीज अंकुरण और जड़ों के विकास के लिए अनुकूल है।',
        actionSteps: [
          'बुवाई से पहले बीजों को एज़ोटोबैक्टर और PSB जैव-उर्वरक से उपचारित करें।',
          'फसल की पंक्तियों के बीच 20-22 सेमी की दूरी बनाए रखें।',
          'मृदा स्वास्थ्य कार्ड की सिफारिशों के आधार पर उर्वरक की सही खुराक दें।'
        ],
        icon: '🌱',
        updatedAt: 'कल',
      }
    ]
  },
  mr: {
    headerTitle: 'स्थानिक शेतकरी खबरदारी व हवामान सूचना',
    headerSub: 'सध्याच्या हवामान अंदाज आणि कीड धोक्यानुसार कृतीयोग्य सल्ला',
    headerTag: 'थेट कृषी सल्ला',
    targetCropLabel: 'लक्ष्य पीक',
    actionStepsLabel: 'अनुशंसित कृती टप्पे:',
    items: [
      {
        id: 'prec-1',
        title: 'जास्त आर्द्रता (८८%) — बुरशीजन्य रोग इशारा',
        category: 'रोग नियंत्रण',
        severity: 'उच्च प्राधान्य',
        targetCrop: 'भात आणि सोयाबीन',
        suggestion: 'पुढील ४८ तासांतील जास्त आर्द्रतेमुळे भात तांबेरा व बुरशीचा धोका वाढला आहे.',
        actionSteps: [
          'सूक्ष्म हवामानातील आर्द्रता कमी करण्यासाठी पुढील २ दिवस जास्त पाणी देणे टाळा.',
          'सकाळच्या वेळी जैविक बुरशीनाशकाची (ट्रायकोडर्मा विरिडे ५ ग्रॅम/लीटर) फवारणी करा.',
          'शेताच्या बांधावर करपा रोगाच्या लक्षणांची पाहणी करा.'
        ],
        icon: '🌧️',
        updatedAt: '२ तासांपूर्वी',
      },
      {
        id: 'prec-2',
        title: 'कामगंध सापळा मर्यादा ओलांडली (लष्करी अळी)',
        category: 'कीड इशारा',
        severity: 'उच्च प्राधान्य',
        targetCrop: 'मका आणि ऊस',
        suggestion: 'नाशिक व पुणे येथे एका रात्रीत १८ हून अधिक पतंग नोंदवले गेले, जे आर्थिक नुकसान मर्यादेपलीकडे आहे.',
        actionSteps: [
          'अळी नियंत्रणासाठी त्वरित एका एकरात ४-५ कामगंध सापळे लावा.',
          'पांगऱ्यात ५% निंबोळी अर्क किंवा शिफारस केलेले जैविक कीटकनाशक वापरा.',
          '१०% पेक्षा जास्त नुकसान असल्यास ॲपद्वारे कृषी विस्तार कार्यकर्त्यांना कळवा.'
        ],
        icon: '🐛',
        updatedAt: '४ तासांपूर्वी',
      },
      {
        id: 'prec-3',
        title: '३ दिवसांत अवेळी पावसाची शक्यता (२५-३५ मिमी)',
        category: 'माती व सिंचन',
        severity: 'मध्यम',
        targetCrop: 'कापूस आणि डाळी',
        suggestion: 'मध्य महाराष्ट्रात वादळी वाऱ्यासह मध्यम पावसाची शक्यता वर्तवण्यात आली आहे.',
        actionSteps: [
          'मुळांजवळ पाणी साचू नये म्हणून पाण्याचे चर मोकळे करा.',
          'पाऊस थांबेपर्यंत रासायनिक फवारणी पुढे ढकला.',
          'कापसाच्या लहान रोपांना मातीची भर देऊन आधार द्या.'
        ],
        icon: '⛈️',
        updatedAt: 'आज, सकाळी ०८:३०',
      },
      {
        id: 'prec-4',
        title: 'योग्य पेरणी व मातीतील ओलावा कालावधी',
        category: 'पीक संरक्षण',
        severity: 'उत्तम पद्धत',
        targetCrop: 'गहू आणि हरभरा (रब्बी)',
        suggestion: 'मातीतील ओलावा (३४%) सध्या बियाणे रुजण्यासाठी उत्तम आहे.',
        actionSteps: [
          'पेरणीपूर्वी बियाण्याला ॲझोटोबॅक्टर व पीएसबी जैविक खतांची प्रक्रिया करा.',
          'दोन ओळींमध्ये २०-२२ सेमी अंतर ठेवा.',
          'मृदा आरोग्य पत्रिकेनुसार खताचा पायाभूत डोस द्या.'
        ],
        icon: '🌱',
        updatedAt: 'काल',
      }
    ]
  },
  or: {
    headerTitle: 'ସ୍ଥାନୀୟ ଚାଷୀ ସଚେତନତା ଓ ପାଣିପାଗ ସୂଚନା',
    headerSub: 'ସାମ୍ପ୍ରତିକ ପାଣିପାଗ ଏବଂ କୀଟ ବିପଦ ଅନୁସାରେ ଆବଶ୍ୟକ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ପରାମର୍ଶ',
    headerTag: 'ଲାଇଭ କୃଷି ପରାମର୍ଶ',
    targetCropLabel: 'ଲକ୍ଷ୍ୟ ଫସଲ',
    actionStepsLabel: 'ଅନୁମୋଦିତ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:',
    items: [
      {
        id: 'prec-1',
        title: 'ଅଧିକ ଆର୍ଦ୍ରତା (୮୮%) — କବକ ରୋଗ ବିପଦ ସୂଚନା',
        category: 'ରୋଗ ନିୟନ୍ତ୍ରଣ',
        severity: 'ଉଚ୍ଚ ପ୍ରାଥମିକତା',
        targetCrop: 'ଧାନ ଏବଂ ସୋୟାବିନ୍',
        suggestion: 'ଆଗାମୀ ୪୮ ଘଣ୍ଟାରେ ଅଧିକ ଆର୍ଦ୍ରତା ଯୋଗୁଁ ଧାନ ବ୍ଲାଷ୍ଟ ରୋଗ ହେବାର ସମ୍ଭାବନା ଅଛି।',
        actionSteps: [
          'ଆର୍ଦ୍ରତା କମାଇବା ପାଇଁ ଆଗାମୀ ୨ ଦିନ ଅଧିକ ଜଳସେଚନରୁ ବିରତ ରୁହନ୍ତୁ।',
          'ସକାଳ ସମୟରେ ଜୈବିକ ଫଙ୍ଗିସାଇଡ୍ (ଟ୍ରାଇକୋଡର୍ମା ଭିରିଡି ୫ ଗ୍ରାମ/ଲିଟର) ସ୍ପ୍ରେ କରନ୍ତୁ।',
          'ଜମି ହୁଡାରେ ରୋଗ ଲକ୍ଷଣ ଯାଞ୍ଚ କରନ୍ତୁ।'
        ],
        icon: '🌧️',
        updatedAt: '୨ ଘଣ୍ଟା ପୂର୍ବେ',
      },
      {
        id: 'prec-2',
        title: 'ଫେରୋମୋନ୍ ଟ୍ରାପ୍ ସୀମା ପାର (ଫଲ୍ ଆର୍ମିୱାର୍ମ)',
        category: 'କୀଟ ଚେତାବନୀ',
        severity: 'ଉଚ୍ଚ ପ୍ରାଥମିକତା',
        targetCrop: 'ମକା ଏବଂ ଆଖୁ',
        suggestion: 'ନାସିକ ଓ ପୁଣେରେ କୀଟ ଫାନ୍ଦରେ ୧୮ ରୁ ଅଧିକ ପୋକ ମିଳିଛନ୍ତି, ଯାହା ଆର୍ଥିକ ବିପଦ ସୀମା ଟପିଛି।',
        actionSteps: [
          'ଏକର ପ୍ରତି ୪-୫ ଟି ଫେରୋମୋନ୍ ଟ୍ରାପ୍ ତୁରନ୍ତ ଲଗାନ୍ତୁ।',
          'ନିମ୍ବ ପିଡ଼ିଆ ରସ (NSKE 5%) କିମ୍ବା ଅନୁମୋଦିତ ଜୈବିକ କୀଟନାଶକ ସ୍ପ୍ରେ କରନ୍ତୁ।'
        ],
        icon: '🐛',
        updatedAt: '୪ ଘଣ୍ଟା ପୂର୍ବେ',
      }
    ]
  },
  te: {
    headerTitle: 'స్థానిక రైతు జాగ్రత్తలు & వాతావరణ సలహాలు',
    headerSub: 'ప్రస్తుత వాతావరణ అంచనా మరియు పురుగుల ప్రమాదానికి అనుగుణంగా చర్యలు',
    headerTag: 'లైవ్ వ్యవసాయ సలహా',
    targetCropLabel: 'లక్ష్య పంట',
    actionStepsLabel: 'సిఫార్సు చేసిన చర్యలు:',
    items: [
      {
        id: 'prec-1',
        title: 'అధిక గాలి తేమ (88%) — శిలీంధ్ర రోగం హెచ్చరిక',
        category: 'వ్యాధి నివారణ',
        severity: 'అధిక ప్రాధాన్యత',
        targetCrop: 'వరి & సోయాబీన్',
        suggestion: 'రాబోయే 48 గంటల్లో అధిక తేమ వరి బ్లాస్ట్ వ్యాధికి దారితీస్తుంది.',
        actionSteps: [
          'తేమను తగ్గించడానికి రాబోయే 2 రోజులు ఎక్కువ నీరు పెట్టవద్దు.',
          'ఉదయం పూట సిఫార్సు చేసిన బయో-ఫంగిసైడ్ (ట్రైకోడెర్మా విరిడే @ 5g/L) పిచికారీ చేయండి.'
        ],
        icon: '🌧️',
        updatedAt: '2 గంటల క్రితం',
      }
    ]
  }
};

export default function LocalPrecautionsCard() {
  const { language } = useAuth();
  const data = LOCAL_PRECAUTIONS_I18N[language] || LOCAL_PRECAUTIONS_I18N['hi'] || LOCAL_PRECAUTIONS_I18N['en'];

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-100 text-amber-800 rounded-xl text-lg font-bold">💡</span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{data.headerTitle}</h2>
            <p className="text-xs text-gray-500">{data.headerSub}</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
          {data.headerTag}
        </span>
      </div>

      <div className="space-y-3">
        {data.items.map((item) => {
          const isHigh = item.severity.includes('High') || item.severity.includes('उच्च') || item.severity.includes('ଉଚ୍ଚ') || item.severity.includes('అధిక');
          const isMod = item.severity.includes('Moderate') || item.severity.includes('मध्यम') || item.severity.includes('ମଧ୍ୟମ');

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isHigh
                  ? 'bg-red-50/50 border-red-200 hover:border-red-300'
                  : isMod
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isHigh
                            ? 'bg-red-600 text-white'
                            : isMod
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-xs font-semibold text-gray-700 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                        {data.targetCropLabel}: {item.targetCrop}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.updatedAt}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.suggestion}</p>

                    {/* Action Steps */}
                    <div className="mt-3 space-y-1.5 bg-white/90 p-3 rounded-lg border border-gray-100 shadow-2xs">
                      <p className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">{data.actionStepsLabel}</p>
                      {item.actionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
