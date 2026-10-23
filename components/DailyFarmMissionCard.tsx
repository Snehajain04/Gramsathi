'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import {
  Sparkles,
  Droplets,
  CloudRain,
  Eye,
  TestTube,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Zap,
  Info
} from 'lucide-react';

interface MissionTask {
  id: string;
  categoryIcon: string;
  categoryLabel: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  reason: string;
  action: string;
  deadline: string;
}

interface FarmerProfile {
  id: string;
  name: string;
  district: string;
  state: string;
  crop: string;
  stage: string;
  soilMoisture: number;
  humidity: number;
  rainForecast: string;
  historyNote: string;
  avatarBg: string;
  missions: MissionTask[];
}

const FARMER_DEMO_DATA: Record<string, FarmerProfile[]> = {
  en: [
    {
      id: 'farmer-a',
      name: 'Ramesh Patil',
      district: 'Pune',
      state: 'Maharashtra',
      crop: 'Rice (Paddy)',
      stage: 'Tillering Stage',
      soilMoisture: 28,
      humidity: 88,
      rainForecast: '14mm expected in 12 hrs',
      historyNote: 'Previous Blast Outbreak flagged',
      avatarBg: 'bg-emerald-700',
      missions: [
        {
          id: 'm1',
          categoryIcon: '🔍',
          categoryLabel: 'Crop Inspection',
          priority: 'high',
          title: 'Inspect lower leaves for fungal lesions (Rice Blast)',
          reason: 'High relative humidity (88%) + past infection history on lower tillers.',
          action: 'Inspect 10 random tillers across field border. Look for spindle-shaped brown spots.',
          deadline: 'Do before: 09:00 AM',
        },
        {
          id: 'm2',
          categoryIcon: '💧',
          categoryLabel: 'Irrigation',
          priority: 'medium',
          title: 'Light irrigation (~20 minutes)',
          reason: 'Soil moisture is 28% (below optimal 35% threshold).',
          action: 'Irrigate for 20 mins max to maintain root zone moisture without waterlogging.',
          deadline: 'Do before: 11:00 AM',
        },
        {
          id: 'm3',
          categoryIcon: '🌧️',
          categoryLabel: 'Weather Precaution',
          priority: 'medium',
          title: 'Pause irrigation after current 20-min cycle',
          reason: 'IMD satellite imagery forecasts 14mm rainfall starting evening.',
          action: 'Do not run secondary pumping cycles today to save power and prevent fungal multiplication.',
          deadline: 'Do before: 12:00 PM',
        },
        {
          id: 'm4',
          categoryIcon: '🧪',
          categoryLabel: 'Fertilizer Advisory',
          priority: 'low',
          title: 'Hold chemical Nitrogen (Urea) application today',
          reason: 'High disease risk index. Excess nitrogen promotes rapid fungal blast cell multiplication.',
          action: 'Postpone scheduled Urea dose until humidity drops below 75%.',
          deadline: 'All day',
        },
        {
          id: 'm5',
          categoryIcon: '📸',
          categoryLabel: 'AI Health Check',
          priority: 'low',
          title: 'Upload photo of 3–5 plant leaves',
          reason: 'Daily AI scanner checks for early micro-lesions before symptoms turn severe.',
          action: 'Use GramSathi AI Diagnose camera to snap leaf close-up.',
          deadline: 'Do before: 06:00 PM',
        }
      ]
    },
    {
      id: 'farmer-b',
      name: 'Dnyaneshwar Pawar',
      district: 'Nashik',
      state: 'Maharashtra',
      crop: 'Rice (Paddy)',
      stage: 'Booting Stage',
      soilMoisture: 62,
      humidity: 65,
      rainForecast: '35mm heavy rain in 6 hrs',
      historyNote: 'Soil drainage issue reported',
      avatarBg: 'bg-blue-700',
      missions: [
        {
          id: 'm1-b',
          categoryIcon: '🚜',
          categoryLabel: 'Field Drainage',
          priority: 'high',
          title: 'Clear field drainage channels immediately',
          reason: 'Unseasonal heavy rainfall (35mm) forecast + soil moisture already high (62%).',
          action: 'Open perimeter trenches to prevent water stagnation around root zone.',
          deadline: 'Do before: 10:00 AM',
        },
        {
          id: 'm2-b',
          categoryIcon: '🔍',
          categoryLabel: 'Disease Radar',
          priority: 'high',
          title: 'Inspect for Bacterial Leaf Blight & lodging',
          reason: 'Strong wind gusts (24 km/h) + high moisture increase leaf friction damage.',
          action: 'Check leaf tips for water-soaked yellow stripes along margin.',
          deadline: 'Do before: 01:00 PM',
        },
        {
          id: 'm3-b',
          categoryIcon: '💧',
          categoryLabel: 'Irrigation',
          priority: 'medium',
          title: 'DO NOT Irrigate field today',
          reason: 'Soil moisture (62%) is saturated. Pumping today will cause root rot.',
          action: 'Keep main motor switch locked OFF today.',
          deadline: 'All day',
        },
        {
          id: 'm4-b',
          categoryIcon: '🧪',
          categoryLabel: 'Nutrition Support',
          priority: 'medium',
          title: 'Apply Bio-Potash Foliar Spray (1.5g/L)',
          reason: 'Potassium strengthens cell walls against lodging during incoming wind gusts.',
          action: 'Spray during clear morning hours before rain begins.',
          deadline: 'Do before: 11:30 AM',
        },
        {
          id: 'm5-b',
          categoryIcon: '📸',
          categoryLabel: 'AI Health Check',
          priority: 'low',
          title: 'Upload photo of field drainage canal & leaf tips',
          reason: 'AI cross-references ground drainage status with satellite flood risk.',
          action: 'Snap 1 photo of drainage channel and 1 photo of crop row.',
          deadline: 'Do before: 05:00 PM',
        }
      ]
    }
  ],
  mr: [
    {
      id: 'farmer-a',
      name: 'रमेश पाटील',
      district: 'पुणे',
      state: 'महाराष्ट्र',
      crop: 'भात (धान)',
      stage: 'फुटवे अवस्था',
      soilMoisture: 28,
      humidity: 88,
      rainForecast: '१२ तासांत १४ मिमी पाऊस शक्यता',
      historyNote: 'मागील करपा रोगाची नोंद',
      avatarBg: 'bg-emerald-700',
      missions: [
        {
          id: 'm1',
          categoryIcon: '🔍',
          categoryLabel: 'पीक पाहणी',
          priority: 'high',
          title: 'खालच्या पानांवर करपा/ब्लास्ट रोगाचे ठिपके तपासा',
          reason: 'हवेतील उच्च आर्द्रता (८८%) + मागील करपा रोगाची नोंद.',
          action: 'शेतातील १० रोपांची पाहणी करा. पानांवर सुईच्या आकाराचे करडे ठिपके तपासा.',
          deadline: 'सकाळी ०९:०० वाजेपूर्वी करा',
        },
        {
          id: 'm2',
          categoryIcon: '💧',
          categoryLabel: 'सिंचन',
          priority: 'medium',
          title: 'हलके सिंचन द्या (~२० मिनिटे)',
          reason: 'मातीतील ओलावा २८% आहे (योग्य ३५% पेक्षा कमी).',
          action: 'ओलावा टिकवण्यासाठी फक्त २० मिनिटे पाणी द्या.',
          deadline: 'सकाळी ११:०० वाजेपूर्वी करा',
        },
        {
          id: 'm3',
          categoryIcon: '🌧️',
          categoryLabel: 'हवामान सावधानता',
          priority: 'medium',
          title: '२० मिनिटांच्या सिंचनानंतर मोटर बंद ठेवा',
          reason: 'संध्याकाळपासून १४ मिमी पावसाचा अंदाज आहे.',
          action: 'आज पुन्हा पाणी देऊ नका, यामुळे बुरशीजन्य रोग वाढू शकतो.',
          deadline: 'दुपारी १२:०० वाजेपूर्वी',
        },
        {
          id: 'm4',
          categoryIcon: '🧪',
          categoryLabel: 'खत सल्ला',
          priority: 'low',
          title: 'आज रासायनिक युरिया खत देऊ नका',
          reason: 'उच्च रोग धोका. जास्त नत्र बुरशीचा प्रसार वेगाने करतो.',
          action: 'आर्द्रता ७५% च्या खाली येईपर्यंत युरिया देणे पुढे ढकला.',
          deadline: 'दिवसभर',
        },
        {
          id: 'm5',
          categoryIcon: '📸',
          categoryLabel: 'AI आरोग्य तपासणी',
          priority: 'low',
          title: '३-५ पानांचे फोटो अपलोड करा',
          reason: 'AI स्कॅनर रोगाची सुरुवातीची लक्षणे ओळखतो.',
          action: 'ग्रामसाथी AI कॅमेऱ्याने पानांचा फोटो घ्या.',
          deadline: 'संध्याकाळी ०६:०० वाजेपूर्वी',
        }
      ]
    },
    {
      id: 'farmer-b',
      name: 'ज्ञानेश्वर पवार',
      district: 'नाशिक',
      state: 'महाराष्ट्र',
      crop: 'भात (धान)',
      stage: 'पोटरी अवस्था',
      soilMoisture: 62,
      humidity: 65,
      rainForecast: '६ तासांत ३५ मिमी मुसळधार पाऊस',
      historyNote: 'पाण्याचा निचरा न होण्याची समस्या',
      avatarBg: 'bg-blue-700',
      missions: [
        {
          id: 'm1-b',
          categoryIcon: '🚜',
          categoryLabel: 'पाणी निचरा',
          priority: 'high',
          title: 'शेतातील पाण्याचा निचरा करणारी चारी तात्काळ साफ करा',
          reason: '३५ मिमी मुसळधार पावसाचा इशारा + मातीत आधीच ६२% ओलावा.',
          action: 'मुळे सडण्यापासून वाचवण्यासाठी शेताभोवतीच्या चार्‍या उघडा.',
          deadline: 'सकाळी १०:०० वाजेपूर्वी करा',
        },
        {
          id: 'm2-b',
          categoryIcon: '🔍',
          categoryLabel: 'रोग इशारे',
          priority: 'high',
          title: 'जीवाणूजन्य करपा व पीक कोलमडणे तपासा',
          reason: 'वेगवान वारा (२४ किमी/तास) + पाणी साचल्याने पानांना इजा.',
          action: 'पानांच्या कडा पिवळ्या पडल्या आहेत का ते तपासा.',
          deadline: 'दुपारी ०१:०० वाजेपूर्वी',
        },
        {
          id: 'm3-b',
          categoryIcon: '💧',
          categoryLabel: 'सिंचन',
          priority: 'medium',
          title: 'आज शेताला अजिबात पाणी देऊ नका',
          reason: 'मातीत ६२% पुरेसा ओलावा आहे. आज पाणी दिल्यास मुळे सडतील.',
          action: 'पाण्याचा पंप आज बंद ठेवा.',
          deadline: 'दिवसभर',
        },
        {
          id: 'm4-b',
          categoryIcon: '🧪',
          categoryLabel: 'पोषण मदत',
          priority: 'medium',
          title: 'बायो-पोटॅश फवारणी करा (१.५ ग्रॅम/लिटर)',
          reason: 'पोटॅश पिकाच्या खोडाला वाऱ्याविरुद्ध मजबुती देते.',
          action: 'पाऊस सुरू होण्यापूर्वी सकाळी फवारणी पूर्ण करा.',
          deadline: 'सकाळी ११:३० वाजेपूर्वी',
        },
        {
          id: 'm5-b',
          categoryIcon: '📸',
          categoryLabel: 'AI आरोग्य तपासणी',
          priority: 'low',
          title: 'निचरा चारी व पिकाचा फोटो अपलोड करा',
          reason: 'सॅटेलाइट डेटासह शेतातील परिस्थितीची खात्री करण्यासाठी.',
          action: 'ग्रामसाथी ॲपवरून फोटो पाठवा.',
          deadline: 'संध्याकाळी ०५:०० वाजेपूर्वी',
        }
      ]
    }
  ],
  hi: [
    {
      id: 'farmer-a',
      name: 'रमेश पाटिल',
      district: 'पुणे',
      state: 'महाराष्ट्र',
      crop: 'धान (चावल)',
      stage: 'कल्ले निकलने का चरण',
      soilMoisture: 28,
      humidity: 88,
      rainForecast: '12 घंटे में 14 मिमी बारिश का अनुमान',
      historyNote: 'पिछला धान ब्लास्ट प्रकोप दर्ज',
      avatarBg: 'bg-emerald-700',
      missions: [
        {
          id: 'm1',
          categoryIcon: '🔍',
          categoryLabel: 'फसल निरीक्षण',
          priority: 'high',
          title: 'निचली पत्तियों पर फफूंद धब्बों (धान ब्लास्ट) की जांच करें',
          reason: 'उच्च सापेक्ष आर्द्रता (88%) + पिछला संक्रमण इतिहास।',
          action: 'खेत के 10 पौधों का निरीक्षण करें। नाव के आकार के भूरे धब्बे देखें।',
          deadline: 'सुबह 09:00 बजे से पहले करें',
        },
        {
          id: 'm2',
          categoryIcon: '💧',
          categoryLabel: 'सिंचाई',
          priority: 'medium',
          title: 'हल्की सिंचाई करें (~20 मिनट)',
          reason: 'मिट्टी की नमी 28% है (इष्टतम 35% से कम)।',
          action: 'नमी बनाए रखने के लिए अधिकतम 20 मिनट सिंचाई करें।',
          deadline: 'सुबह 11:00 बजे से पहले करें',
        },
        {
          id: 'm3',
          categoryIcon: '🌧️',
          categoryLabel: 'मौसम चेतावनी',
          priority: 'medium',
          title: '20 मिनट चक्र के बाद सिंचाई रोक दें',
          reason: 'शाम से 14 मिमी बारिश का अनुमान है।',
          action: 'आज दोबारा पानी न दें ताकि फफूंद न फैले।',
          deadline: 'दोपहर 12:00 बजे तक',
        },
        {
          id: 'm4',
          categoryIcon: '🧪',
          categoryLabel: 'उर्वरक सलाह',
          priority: 'low',
          title: 'आज रासायनिक यूरिया का प्रयोग न करें',
          reason: 'उच्च रोग जोखिम। अत्यधिक नाइट्रोजन फफूंद को बढ़ाता है।',
          action: 'आर्द्रता 75% से नीचे आने तक यूरिया टालें।',
          deadline: 'पूरे दिन',
        },
        {
          id: 'm5',
          categoryIcon: '📸',
          categoryLabel: 'AI स्वास्थ्य जांच',
          priority: 'low',
          title: '3-5 पत्तियों की फोटो अपलोड करें',
          reason: 'AI स्कैनर शुरुआती सूक्ष्म लक्षणों को पहचानता है।',
          action: 'ग्रामसाथी AI कैमरे से फोटो खींचें।',
          deadline: 'शाम 06:00 बजे से पहले',
        }
      ]
    },
    {
      id: 'farmer-b',
      name: 'ज्ञानेश्वर पवार',
      district: 'नासिक',
      state: 'महाराष्ट्र',
      crop: 'धान (चावल)',
      stage: 'गर्भावस्था / बूटिंग चरण',
      soilMoisture: 62,
      humidity: 65,
      rainForecast: '6 घंटे में 35 मिमी भारी बारिश',
      historyNote: 'जल निकासी की समस्या',
      avatarBg: 'bg-blue-700',
      missions: [
        {
          id: 'm1-b',
          categoryIcon: '🚜',
          categoryLabel: 'जल निकासी',
          priority: 'high',
          title: 'खेत की जल निकासी नालियों को तुरंत साफ करें',
          reason: '35 मिमी भारी बारिश का अनुमान + मिट्टी में पहले से 62% नमी।',
          action: 'जड़ों के पास जलभराव रोकने के लिए बाहरी नालियां खोलें।',
          deadline: 'सुबह 10:00 बजे से पहले करें',
        },
        {
          id: 'm2-b',
          categoryIcon: '🔍',
          categoryLabel: 'रोग रडार',
          priority: 'high',
          title: 'बैक्टीरियल लीफ ब्लाइट और फसल गिरने की जांच करें',
          reason: 'तेज हवा (24 किमी/घंटा) + उच्च नमी से पत्तियों को नुकसान।',
          action: 'पत्तियों के किनारों पर पीले रंग की धारियां देखें।',
          deadline: 'दोपहर 01:00 बजे तक',
        },
        {
          id: 'm3-b',
          categoryIcon: '💧',
          categoryLabel: 'सिंचाई',
          priority: 'medium',
          title: 'आज खेत की सिंचाई बिल्कुल न करें',
          reason: 'मिट्टी में 62% नमी पर्याप्त है। आज सिंचाई से जड़ें सड़ेंगी।',
          action: 'पंप मोटर आज बंद रखें।',
          deadline: 'पूरे दिन',
        },
        {
          id: 'm4-b',
          categoryIcon: '🧪',
          categoryLabel: 'पोषण सहायता',
          priority: 'medium',
          title: 'बायो-पोटाश का छिड़काव करें (1.5 ग्राम/लीटर)',
          reason: 'पोटाश तेज हवा के खिलाफ तने को मजबूती देता है।',
          action: 'बारिश शुरू होने से पहले सुबह छिड़काव पूरा करें।',
          deadline: 'सुबह 11:30 बजे से पहले',
        },
        {
          id: 'm5-b',
          categoryIcon: '📸',
          categoryLabel: 'AI स्वास्थ्य जांच',
          priority: 'low',
          title: 'नाली और पत्तियों की फोटो अपलोड करें',
          reason: 'सैटेलाइट डेटा के साथ धरातलीय स्थिति का सत्यापन।',
          action: 'ग्रामसाथी ऐप से फोटो भेजें।',
          deadline: 'शाम 05:00 बजे से पहले',
        }
      ]
    }
  ]
};

export default function DailyFarmMissionCard() {
  const { language } = useAuth();
  const farmersList = FARMER_DEMO_DATA[language] || FARMER_DEMO_DATA['hi'] || FARMER_DEMO_DATA['en'];
  
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('farmer-a');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const currentFarmer = farmersList.find(f => f.id === selectedFarmerId) || farmersList[0];

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getPriorityBadge = (p: 'high' | 'medium' | 'low') => {
    if (p === 'high') {
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-red-200">
          <Flame className="w-3 h-3 text-red-600 animate-pulse" />
          HIGH PRIORITY
        </span>
      );
    }
    if (p === 'medium') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          MEDIUM PRIORITY
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        OPTIMAL / ROUTINE
      </span>
    );
  };

  const todayDateStr = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-5 shadow-xl border border-stone-700 relative overflow-hidden space-y-4">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-700 pb-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xl font-bold border border-emerald-500/30">🎯</span>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                TODAY'S FARM MISSION
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                  {todayDateStr}
                </span>
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                Multi-sensor & AI decision engine priorities tailored to your specific field conditions
              </p>
            </div>
          </div>
        </div>

        {/* Field Personalization Demo Toggle */}
        <div className="bg-stone-800/90 p-1.5 rounded-2xl border border-stone-700 flex flex-col gap-1 sm:w-auto">
          <div className="flex items-center justify-between px-2 text-[10px] font-bold text-amber-400 tracking-wider uppercase">
            <span>🏆 Field Personalization Demo</span>
            <span className="text-stone-400">Compare Farmers</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
            {farmersList.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFarmerId(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  selectedFarmerId === f.id
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : 'bg-stone-700/60 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span>{f.name}</span>
                <span className="text-[10px] opacity-75">({f.district})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Decision Pipeline Micro-Graph */}
      <div className="bg-stone-800/60 rounded-2xl p-3 border border-stone-700/80 text-xs space-y-2 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            AI Decision Pipeline Data Inputs for {currentFarmer.name}:
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">Live Field Match 100%</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-700 flex items-center gap-1.5">
            <span>💧</span>
            <div>
              <p className="text-stone-400 text-[10px]">Soil Moisture</p>
              <p className="font-bold text-white">{currentFarmer.soilMoisture}%</p>
            </div>
          </div>
          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-700 flex items-center gap-1.5">
            <span>💦</span>
            <div>
              <p className="text-stone-400 text-[10px]">Humidity</p>
              <p className="font-bold text-white">{currentFarmer.humidity}%</p>
            </div>
          </div>
          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-700 flex items-center gap-1.5">
            <span>🌧️</span>
            <div>
              <p className="text-stone-400 text-[10px]">Rain Forecast</p>
              <p className="font-bold text-amber-300 truncate text-[10px]">{currentFarmer.rainForecast}</p>
            </div>
          </div>
          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-700 flex items-center gap-1.5">
            <span>🌱</span>
            <div>
              <p className="text-stone-400 text-[10px]">Crop Stage</p>
              <p className="font-bold text-white truncate text-[10px]">{currentFarmer.stage}</p>
            </div>
          </div>
          <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-700 flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <span>📜</span>
            <div>
              <p className="text-stone-400 text-[10px]">Farm Risk History</p>
              <p className="font-bold text-red-300 truncate text-[10px]">{currentFarmer.historyNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Missions Tasks List */}
      <div className="space-y-3 relative z-10">
        {currentFarmer.missions.map((m, idx) => {
          const isDone = !!completedTasks[`${currentFarmer.id}-${m.id}`];

          return (
            <div
              key={m.id}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                isDone
                  ? 'bg-stone-900/40 border-stone-800 opacity-60'
                  : m.priority === 'high'
                  ? 'bg-stone-800/90 border-red-500/40 hover:border-red-500/80 shadow-lg'
                  : m.priority === 'medium'
                  ? 'bg-stone-800/90 border-amber-500/40 hover:border-amber-500/80'
                  : 'bg-stone-800/90 border-emerald-500/30 hover:border-emerald-500/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(`${currentFarmer.id}-${m.id}`)}
                    className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-stone-950'
                        : 'border-stone-500 hover:border-emerald-400 bg-stone-900'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPriorityBadge(m.priority)}
                      <span className="text-xs font-semibold px-2 py-0.5 bg-stone-700 text-stone-200 rounded-md">
                        {m.categoryIcon} {m.categoryLabel}
                      </span>
                      <span className="text-xs text-amber-300 font-mono font-medium flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {m.deadline}
                      </span>
                    </div>

                    <h3 className={`font-bold text-base ${isDone ? 'line-through text-stone-400' : 'text-white'}`}>
                      {idx + 1}. {m.title}
                    </h3>

                    {/* Reasoning + Action */}
                    <div className="grid sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-stone-700/60 text-xs">
                      <div className="bg-stone-900/70 p-2.5 rounded-xl border border-stone-700/50">
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">🧠 AI Sensor Reason:</p>
                        <p className="text-stone-300 mt-0.5 leading-relaxed">{m.reason}</p>
                      </div>
                      <div className="bg-stone-900/70 p-2.5 rounded-xl border border-stone-700/50">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">✅ Action Steps:</p>
                        <p className="text-stone-200 mt-0.5 leading-relaxed font-medium">{m.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="pt-2 border-t border-stone-700/60 flex items-center justify-between text-xs text-stone-400 relative z-10">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Missions auto-refresh daily at 06:00 AM based on live IoT telemetry
        </span>
        <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">
          View Decision Graph →
        </span>
      </div>
    </div>
  );
}
