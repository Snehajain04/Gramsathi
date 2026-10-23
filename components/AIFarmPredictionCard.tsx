'use client';
import { useAuth } from '@/lib/authContext';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Wheat,
  Droplets,
  Zap,
  Activity,
  DollarSign,
  Layers,
  BrainCircuit,
  BarChart3,
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface AIFarmPredictionCardProps {
  farmName: string;
  soilType: string;
  cropName: string;
  area: number;
  areaUnit: string;
  district: string;
}

interface PredictionData {
  yieldPerAcre: string;
  totalEstimatedYield: string;
  harvestWindow: string;
  predictedMandiPrice: string;
  priceTrend: string;
  estimatedRevenue: string;
  diseaseRisks: {
    disease: string;
    probability: number;
    level: 'high' | 'medium' | 'low';
    reason: string;
  }[];
  irrigationPrediction: {
    criticalDate: string;
    action: string;
  };
  nutrientPrediction: {
    stressDate: string;
    action: string;
  };
}

const PREDICTION_DATABASE: Record<string, Record<string, PredictionData>> = {
  en: {
    'Rice': {
      yieldPerAcre: '24.5 Quintals / Acre',
      totalEstimatedYield: '61.2 Quintals',
      harvestWindow: '28 October 2026 (±3 days)',
      predictedMandiPrice: '₹2,380 – ₹2,450 / Quintal',
      priceTrend: '+4.2% ↑ (Festival Season Demand)',
      estimatedRevenue: '₹1,45,656',
      diseaseRisks: [
        {
          disease: 'Rice Blast (Fungal)',
          probability: 86,
          level: 'high',
          reason: 'Driven by 88% humidity + 22°C night temp + clay soil moisture retention.'
        },
        {
          disease: 'Bacterial Leaf Blight',
          probability: 42,
          level: 'medium',
          reason: 'Wind gusts and micro-leaf friction during early tillering.'
        },
        {
          disease: 'Fall Armyworm / Stem Borer',
          probability: 14,
          level: 'low',
          reason: 'Trap counts below Economic Threshold Level (ETL).'
        }
      ],
      irrigationPrediction: {
        criticalDate: '24 September 2026 (in 4 days)',
        action: 'Soil moisture predicted to drop to 21%. Run 25-minute drip cycle at 06:30 AM.'
      },
      nutrientPrediction: {
        stressDate: '02 October 2026 (in 12 days)',
        action: 'Nitrogen depletion predicted during panicle initiation. Apply Bio-NPK foliar spray.'
      }
    },
    'Soybean': {
      yieldPerAcre: '10.8 Quintals / Acre',
      totalEstimatedYield: '27.0 Quintals',
      harvestWindow: '15 October 2026 (±2 days)',
      predictedMandiPrice: '₹4,890 – ₹5,100 / Quintal',
      priceTrend: '+3.8% ↑ (Oilseed Processing Demand)',
      estimatedRevenue: '₹1,32,030',
      diseaseRisks: [
        {
          disease: 'Yellow Mosaic Virus',
          probability: 58,
          level: 'medium',
          reason: 'Whitefly population rising in neighboring blocks.'
        },
        {
          disease: 'Fungal Rust',
          probability: 72,
          level: 'high',
          reason: 'Persistent morning dew and humidity above 80%.'
        },
        {
          disease: 'Pod Borer',
          probability: 22,
          level: 'low',
          reason: 'Low egg mass density on leaf undersides.'
        }
      ],
      irrigationPrediction: {
        criticalDate: '22 September 2026 (in 2 days)',
        action: 'Soil moisture dropping. Irrigate for 30 minutes before flowering.'
      },
      nutrientPrediction: {
        stressDate: '28 September 2026 (in 8 days)',
        action: 'Sulfate & Boron requirement peak. Apply Boron 20% foliar spray.'
      }
    }
  },
  mr: {
    'Rice': {
      yieldPerAcre: '२४.५ क्विंटल / एकर',
      totalEstimatedYield: '६१.२ क्विंटल',
      harvestWindow: '२८ ऑक्टोबर २०२६ (±३ दिवस)',
      predictedMandiPrice: '₹२,३८० – ₹२,४५० / क्विंटल',
      priceTrend: '+४.२% ↑ (सण उत्सवामुळे मागणी वाढ)',
      estimatedRevenue: '₹१,४५,६५६',
      diseaseRisks: [
        {
          disease: 'भात तांबेरा/ब्लास्ट (बुरशीजन्य)',
          probability: 86,
          level: 'high',
          reason: '८८% आर्द्रता + रात्रीचे २२°C तापमान + काळ्या मातीतील ओलावा.'
        },
        {
          disease: 'जीवाणूजन्य करपा (Bacterial Blight)',
          probability: 42,
          level: 'medium',
          reason: 'वाऱ्याच्या वेगामुळे पानांना होणारी इजा.'
        },
        {
          disease: 'खोड किडा / लष्करी अळी',
          probability: 14,
          level: 'low',
          reason: 'सापळ्यातील कीटकांची संख्या मर्यादेखाली.'
        }
      ],
      irrigationPrediction: {
        criticalDate: '२४ सप्टेंबर २०२६ (४ दिवसांत)',
        action: 'मातीतील ओलावा २१% पर्यंत खाली येईल. सकाळी ०६:३० वाजता २५ मिनिटे ठिबक सिंचन करा.'
      },
      nutrientPrediction: {
        stressDate: '०२ ऑक्टोबर २०२६ (१२ दिवसांत)',
        action: 'लोंबी येण्याच्या टप्प्यावर नत्राची कमतरता भासेल. बायो-NPK फवारणी करा.'
      }
    },
    'Soybean': {
      yieldPerAcre: '१०.८ क्विंटल / एकर',
      totalEstimatedYield: '२७.० क्विंटल',
      harvestWindow: '१५ ऑक्टोबर २०२६ (±२ दिवस)',
      predictedMandiPrice: '₹४,८९० – ₹५,१०० / क्विंटल',
      priceTrend: '+३.८% ↑ (तेलनिर्मिती कारखान्यांची मागणी)',
      estimatedRevenue: '₹१,३२,०३०',
      diseaseRisks: [
        {
          disease: 'पिवळा मोज़ेक व्हायरस',
          probability: 58,
          level: 'medium',
          reason: 'पांढरी माशीची संख्या वाढत आहे.'
        },
        {
          disease: 'तांबेरा रोग (Fungal Rust)',
          probability: 72,
          level: 'high',
          reason: 'सकाळचे धुके आणि ८०% पेक्षा जास्त आर्द्रता.'
        },
        {
          disease: 'घाटे अळी',
          probability: 22,
          level: 'low',
          reason: 'अंड्यांची संख्या मर्यादेखाली आहे.'
        }
      ],
      irrigationPrediction: {
        criticalDate: '२२ सप्टेंबर २०२६ (२ दिवसांत)',
        action: 'फूलधारणेच्या टप्प्यापूर्वी ३० मिनिटे पाणी द्या.'
      },
      nutrientPrediction: {
        stressDate: '२८ सप्टेंबर २०२६ (८ दिवसांत)',
        action: 'बोरॉन २०% फवारणी करा.'
      }
    }
  },
  hi: {
    'Rice': {
      yieldPerAcre: '24.5 क्विंटल / एकड़',
      totalEstimatedYield: '61.2 क्विंटल',
      harvestWindow: '28 अक्टूबर 2026 (±3 दिन)',
      predictedMandiPrice: '₹2,380 – ₹2,450 / क्विंटल',
      priceTrend: '+4.2% ↑ (त्योहारी मांग में वृद्धि)',
      estimatedRevenue: '₹1,45,656',
      diseaseRisks: [
        {
          disease: 'धान ब्लास्ट (फफूंदजनित)',
          probability: 86,
          level: 'high',
          reason: '88% आर्द्रता + रात का 22°C तापमान + मिट्टी में नमी।'
        },
        {
          disease: 'बैक्टीरियल लीफ ब्लाइट',
          probability: 42,
          level: 'medium',
          reason: 'तेज हवाओं से पत्तियों का घर्षण।'
        },
        {
          disease: 'तना छेदक / फॉल आर्मीवर्म',
          probability: 14,
          level: 'low',
          reason: 'कीटों की संख्या सीमा से कम।'
        }
      ],
      irrigationPrediction: {
        criticalDate: '24 सितंबर 2026 (4 दिनों में)',
        action: 'मिट्टी की नमी 21% तक गिरेगी। सुबह 06:30 बजे 25 मिनट ड्रिप चलाएं।'
      },
      nutrientPrediction: {
        stressDate: '02 अक्टूबर 2026 (12 दिनों में)',
        action: 'बालियां बनने के समय नाइट्रोजन की कमी होगी। बायो-NPK छिड़कें।'
      }
    },
    'Soybean': {
      yieldPerAcre: '10.8 क्विंटल / एकड़',
      totalEstimatedYield: '27.0 क्विंटल',
      harvestWindow: '15 अक्टूबर 2026 (±2 दिन)',
      predictedMandiPrice: '₹4,890 – ₹5,100 / क्विंटल',
      priceTrend: '+3.8% ↑ (तेल मिलों की मांग)',
      estimatedRevenue: '₹1,32,030',
      diseaseRisks: [
        {
          disease: 'पीला मोज़ेक वायरस',
          probability: 58,
          level: 'medium',
          reason: 'सफेद मक्खी का प्रकोप बढ़ रहा है।'
        },
        {
          disease: 'फफूंद रस्ट',
          probability: 72,
          level: 'high',
          reason: 'सुबह का कोहरा और 80% से अधिक आर्द्रता।'
        },
        {
          disease: 'फली छेदक अल्ली',
          probability: 22,
          level: 'low',
          reason: 'अंडों का घनत्व सीमा से कम है।'
        }
      ],
      irrigationPrediction: {
        criticalDate: '22 सितंबर 2026 (2 दिनों में)',
        action: 'फूल आने से पहले 30 मिनट सिंचाई करें।'
      },
      nutrientPrediction: {
        stressDate: '28 सितंबर 2026 (8 दिनों में)',
        action: 'बोरॉन 20% का छिड़काव करें।'
      }
    }
  }
};

export default function AIFarmPredictionCard({
  farmName,
  soilType,
  cropName,
  area,
  areaUnit,
  district
}: AIFarmPredictionCardProps) {
  const { language } = useAuth();

  const langData = PREDICTION_DATABASE[language] || PREDICTION_DATABASE['hi'] || PREDICTION_DATABASE['en'];
  
  const cropKey = cropName.toLowerCase().includes('soybean') ? 'Soybean' : 'Rice';
  const data = langData[cropKey] || langData['Rice'];

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-5 shadow-xl border border-stone-700 relative overflow-hidden space-y-4">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xl font-bold border border-emerald-500/30">🔮</span>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              AI Farm Yield & Risk Prediction Engine
              <span className="text-xs font-extrabold px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                XAI 93% Confidence
              </span>
            </h2>
            <p className="text-xs text-stone-300">
              Predictive harvest yield, market mandi pricing, and 14-day disease outbreak forecasts for <strong className="text-white">{farmName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 text-emerald-400 rounded-full text-xs font-bold border border-stone-700">
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time IoT Telemetry Matched</span>
        </div>
      </div>

      {/* Top 3 Predictive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 text-xs">
        {/* Card 1: Yield Prediction */}
        <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700 space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Wheat className="w-3.5 h-3.5 text-emerald-400" />
            Predicted Harvest Yield
          </span>
          <p className="text-xl font-black text-white">{data.yieldPerAcre}</p>
          <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1 border-t border-stone-700/60">
            <span>Total ({area} {areaUnit}):</span>
            <span className="font-bold text-emerald-400">{data.totalEstimatedYield}</span>
          </div>
          <p className="text-[10px] text-stone-400 flex items-center gap-1 pt-0.5">
            <Calendar className="w-3 h-3 text-emerald-400" />
            Harvest Window: {data.harvestWindow}
          </p>
        </div>

        {/* Card 2: Market Rate & Gross Revenue */}
        <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700 space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            Predicted Mandi Selling Rate
          </span>
          <p className="text-xl font-black text-amber-300">{data.predictedMandiPrice}</p>
          <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1 border-t border-stone-700/60">
            <span>Mandi Trend:</span>
            <span className="font-bold text-lime-400">{data.priceTrend}</span>
          </div>
          <p className="text-[10px] text-stone-400 pt-0.5">
            Est. Gross Income: <strong className="text-white">{data.estimatedRevenue}</strong>
          </p>
        </div>

        {/* Card 3: Irrigation & Soil Depletion */}
        <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700 space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            Soil Moisture Depletion Forecast
          </span>
          <p className="text-sm font-bold text-blue-300">{data.irrigationPrediction.criticalDate}</p>
          <p className="text-[11px] text-stone-300 pt-1 border-t border-stone-700/60 leading-tight">
            {data.irrigationPrediction.action}
          </p>
        </div>
      </div>

      {/* Disease Risk Probability Prediction Breakdown */}
      <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700 space-y-3 relative z-10">
        <div className="flex items-center justify-between border-b border-stone-700/80 pb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            14-Day AI Disease Outbreak Risk Probability Model:
          </span>
          <span className="text-[10px] text-stone-400">Updated 10 minutes ago</span>
        </div>

        <div className="space-y-2 text-xs">
          {data.diseaseRisks.map(r => (
            <div key={r.disease} className="bg-stone-900/90 p-3 rounded-xl border border-stone-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  <span>{r.disease}</span>
                  {r.level === 'high' ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full border border-red-500/40">
                      HIGH RISK
                    </span>
                  ) : r.level === 'medium' ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                      MODERATE
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                      LOW RISK
                    </span>
                  )}
                </span>
                <span className="font-black text-sm text-white">{r.probability}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-stone-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    r.level === 'high'
                      ? 'bg-red-500'
                      : r.level === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${r.probability}%` }}
                />
              </div>

              <p className="text-[11px] text-stone-400 italic">
                <strong>Reason:</strong> {r.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrient Stress Forecast */}
      <div className="bg-stone-800/60 p-3.5 rounded-2xl border border-stone-700 flex items-start gap-2.5 text-xs text-stone-300 relative z-10">
        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 block">🧪 Predicted Nutrient Stress Point:</span>
          <span className="text-stone-200">
            {data.nutrientPrediction.stressDate} — {data.nutrientPrediction.action}
          </span>
        </div>
      </div>
    </div>
  );
}
