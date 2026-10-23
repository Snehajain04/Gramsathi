'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Store, 
  Truck, 
  Calculator, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  Calendar,
  X,
  PhoneCall
} from 'lucide-react';
import { toast } from 'sonner';

// Define language translations for key UI strings
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: 'Smart Mandi Price Predictor & FPO Marketplace',
    subtitle: 'AI price trend forecasting, net profit calculation (after transport costs), and direct buyer bidding.',
    selectCrop: 'Select Crop',
    harvestQty: 'Harvest Quantity (Quintals)',
    bestProfitMandi: 'Highest Net Profit Mandi',
    mandiComparison: 'Nearby Mandi Price & Net Return Comparison',
    buyerBids: 'Direct FPO & Verified Buyer Live Bids',
    calcTransport: 'Net Profit = Gross Sales - Freight Cost (₹12/km/ton) - Mandi Tax (1%)',
    sellNow: 'Connect & Sell',
    peakForecast: 'Predicted Peak Price Day',
    distance: 'Distance',
    grossRate: 'Mandi Rate',
    freight: 'Transport Cost',
    netReturn: 'Net Cash In-Hand',
    actionSuccess: 'Selling intent registered! The buyer will contact you within 2 hours for farmgate pickup.',
    close: 'Close',
    buyerTag: 'Verified Institutional Buyer'
  },
  hi: {
    title: 'स्मार्ट मंडी भाव पूर्वानुमान और एफपीओ मार्केटप्लेस',
    subtitle: 'एआई मूल्य प्रवृत्ति पूर्वानुमान, शुद्ध लाभ गणना (परिवहन लागत के बाद), और प्रत्यक्ष खरीदार बोली।',
    selectCrop: 'फसल चुनें',
    harvestQty: 'उपज मात्रा (क्विंटल)',
    bestProfitMandi: 'सर्वोत्तम शुद्ध लाभ देने वाली मंडी',
    mandiComparison: 'निकटतम मंडी मूल्य और शुद्ध आय तुलना',
    buyerBids: 'प्रत्यक्ष एफपीओ और सत्यापित खरीदार बोलियां',
    calcTransport: 'शुद्ध लाभ = कुल बिक्री - भाड़ा (₹12/किमी/टन) - मंडी शुल्क (1%)',
    sellNow: 'संपर्क करें और बेचें',
    peakForecast: 'अनुमानित उच्चतम मूल्य दिन',
    distance: 'दूरी',
    grossRate: 'मंडी दर',
    freight: 'परिवहन लागत',
    netReturn: 'हाथ में शुद्ध नकद',
    actionSuccess: 'बिक्री का अनुरोध दर्ज किया गया! खरीदार 2 घंटे में आपसे संपर्क करेगा।',
    close: 'बंद करें',
    buyerTag: 'सत्यापित संस्थागत खरीदार'
  },
  mr: {
    title: 'स्मार्ट बाजारभाव अंदाज आणि एफपीओ मार्केटप्लेस',
    subtitle: 'एआय बाजारभाव अंदाज, वाहतूक खर्चासह निव्वळ नफा गणित, आणि थेट खरेदीदार बोली.',
    selectCrop: 'पीक निवडा',
    harvestQty: 'उत्पादन प्रमाण (क्विंटल)',
    bestProfitMandi: 'सर्वोत्तम निव्वळ नफा देणारी बाजार समिती',
    mandiComparison: 'जवळपासच्या बाजार समित्यांची भाव व नफा तुलना',
    buyerBids: 'थेट एफपीओ आणि खरेदीदार बोली',
    calcTransport: 'निव्वळ नफा = एकूण विक्री - वाहतूक खर्च (₹१२/किमी/टन) - बाजार समिती कर (१%)',
    sellNow: 'संपर्क करा व विचा',
    peakForecast: 'अंदाजित सर्वोच्च भावाचा दिवस',
    distance: 'अंतर',
    grossRate: 'बाजार भाव',
    freight: 'वाहतूक खर्च',
    netReturn: 'हातात मिळणारी रक्कम',
    actionSuccess: 'बिक्रीची नोंद झाली! खरेदीदार २ तासांत तुमच्याशी संपर्क साधेल.',
    close: 'बंद करा',
    buyerTag: 'प्रमाणित संस्थागत खरेदीदार'
  },
  or: {
    title: 'ସ୍ମାର୍ଟ ମଣ୍ଡି ଦର ପୂର୍ବାନୁମାନ ଓ FPO ମାର୍କେଟପ୍ଲେସ',
    subtitle: 'AI ଦର ପୂର୍ବାନୁମାନ, ପରିବହନ ଖର୍ଚ୍ଚ ପରେ ନିଟ୍ ଲାଭ ଗଣନା, ଓ ସିଧାସଳଖ କ୍ରେତା ବୋଲି।',
    selectCrop: 'ଫସଲ ବାଛନ୍ତୁ',
    harvestQty: 'ଅମଳ ପରିମାଣ (କ୍ୱିଣ୍ଟାଲ)',
    bestProfitMandi: 'ସର୍ବୋତ୍ତମ ନିଟ୍ ଲାଭ ଦେଉଥିବା ମଣ୍ଡି',
    mandiComparison: 'ନିକଟସ୍ଥ ମଣ୍ଡି ଦର ଓ ନିଟ୍ ଆୟ ତୁଳନା',
    buyerBids: 'ସିଧାସଳଖ FPO ଓ ମାନ୍ୟତାପ୍ରାପ୍ତ କ୍ରେତା ବୋଲି',
    calcTransport: 'ନିଟ୍ ଲାଭ = ମୋଟ ବିକ୍ରି - ପରିବହନ ଖର୍ଚ୍ଚ (₹12/km/ton) - ମଣ୍ଡି କର (1%)',
    sellNow: 'ଯୋଗାଯୋଗ କରନ୍ତୁ ଓ ବିକ୍ରି କରନ୍ତୁ',
    peakForecast: 'ସର୍ବୋଚ୍ଚ ଦର ଦିନ',
    distance: 'ଦୂରତା',
    grossRate: 'ମଣ୍ଡି ଦର',
    freight: 'ପରିବହନ ଖର୍ଚ୍ଚ',
    netReturn: 'ନିଟ୍ ହାତ ଟଙ୍କା',
    actionSuccess: 'ବିକ୍ରି ଅନୁରୋଧ ଦାଖଲ ହେଲା! କ୍ରେତା 2 ଘଣ୍ଟା ମଧ୍ୟରେ ଯୋଗାଯୋଗ କରିବେ।',
    close: 'ବନ୍ଦ କରନ୍ତୁ',
    buyerTag: 'ମାନ୍ୟତାପ୍ରାପ୍ତ ସଂସ୍ଥାଗତ କ୍ରେତା'
  }
};

interface MandiData {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  currentRate: number; // ₹ per quintal
  prevRate: number;
  minRate: number;
  maxRate: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  predictedPeakDate: string;
  predictedPeakRate: number;
}

interface BuyerBid {
  id: string;
  buyerName: string;
  type: string;
  crop: string;
  offeredPrice: number; // ₹/qtl
  minQty: number; // quintals
  location: string;
  farmgatePickup: boolean;
  paymentTerm: string;
  rating: number;
}

const CROPS_DATA: Record<string, { mandis: MandiData[]; buyers: BuyerBid[] }> = {
  Paddy: {
    mandis: [
      {
        id: 'm1',
        name: 'Rayagada Main Mandi',
        district: 'Rayagada',
        state: 'Odisha',
        distanceKm: 12,
        currentRate: 2300,
        prevRate: 2240,
        minRate: 2180,
        maxRate: 2350,
        trend: 'up',
        trendPercent: 2.6,
        predictedPeakDate: '26 Sep 2026',
        predictedPeakRate: 2420,
      },
      {
        id: 'm2',
        name: 'Koraput Central Market',
        district: 'Koraput',
        state: 'Odisha',
        distanceKm: 45,
        currentRate: 2320,
        prevRate: 2300,
        minRate: 2200,
        maxRate: 2380,
        trend: 'up',
        trendPercent: 0.8,
        predictedPeakDate: '28 Sep 2026',
        predictedPeakRate: 2390,
      },
      {
        id: 'm3',
        name: 'Gunupur Yard',
        district: 'Rayagada',
        state: 'Odisha',
        distanceKm: 58,
        currentRate: 2280,
        prevRate: 2280,
        minRate: 2150,
        maxRate: 2310,
        trend: 'stable',
        trendPercent: 0.0,
        predictedPeakDate: '25 Sep 2026',
        predictedPeakRate: 2300,
      },
      {
        id: 'm4',
        name: 'APMC Shirur',
        district: 'Pune',
        state: 'Maharashtra',
        distanceKm: 28,
        currentRate: 2340,
        prevRate: 2310,
        minRate: 2250,
        maxRate: 2400,
        trend: 'up',
        trendPercent: 1.3,
        predictedPeakDate: '27 Sep 2026',
        predictedPeakRate: 2440,
      }
    ],
    buyers: [
      {
        id: 'b1',
        buyerName: 'Utkal Agri Farmer Producer Co. (FPO)',
        type: 'Farmer Producer Organization',
        crop: 'Paddy',
        offeredPrice: 2360,
        minQty: 10,
        location: 'Rayagada Block',
        farmgatePickup: true,
        paymentTerm: 'Direct Bank Transfer within 24 Hrs',
        rating: 4.9,
      },
      {
        id: 'b2',
        buyerName: 'BioGrain Mills India Ltd.',
        type: 'Institutional Rice Mill',
        crop: 'Paddy',
        offeredPrice: 2380,
        minQty: 25,
        location: 'Jeypore Industrial Area',
        farmgatePickup: true,
        paymentTerm: 'Instant DBT on Weighment',
        rating: 4.8,
      }
    ]
  },
  Cotton: {
    mandis: [
      {
        id: 'm10',
        name: 'Gunupur Cotton Mandi',
        district: 'Rayagada',
        state: 'Odisha',
        distanceKm: 58,
        currentRate: 7120,
        prevRate: 6980,
        minRate: 6950,
        maxRate: 7250,
        trend: 'up',
        trendPercent: 2.0,
        predictedPeakDate: '29 Sep 2026',
        predictedPeakRate: 7350,
      },
      {
        id: 'm11',
        name: 'Kesinga Mandi',
        district: 'Kalahandi',
        state: 'Odisha',
        distanceKm: 82,
        currentRate: 7180,
        prevRate: 7150,
        minRate: 7000,
        maxRate: 7300,
        trend: 'up',
        trendPercent: 0.4,
        predictedPeakDate: '30 Sep 2026',
        predictedPeakRate: 7320,
      },
      {
        id: 'm12',
        name: 'Bhawanipatna Yard',
        district: 'Kalahandi',
        state: 'Odisha',
        distanceKm: 95,
        currentRate: 7080,
        prevRate: 7100,
        minRate: 6900,
        maxRate: 7200,
        trend: 'down',
        trendPercent: -0.3,
        predictedPeakDate: '24 Sep 2026',
        predictedPeakRate: 7100,
      }
    ],
    buyers: [
      {
        id: 'b10',
        buyerName: 'Kalahandi Cotton Producers Co-op',
        type: 'Govt Assisted FPO',
        crop: 'Cotton',
        offeredPrice: 7250,
        minQty: 15,
        location: 'Kesinga Hub',
        farmgatePickup: true,
        paymentTerm: '100% DBT in 12 Hours',
        rating: 4.9,
      }
    ]
  },
  Soybean: {
    mandis: [
      {
        id: 'm20',
        name: 'APMC Nashik',
        district: 'Nashik',
        state: 'Maharashtra',
        distanceKm: 35,
        currentRate: 4890,
        prevRate: 4890,
        minRate: 4700,
        maxRate: 4950,
        trend: 'stable',
        trendPercent: 0.0,
        predictedPeakDate: '27 Sep 2026',
        predictedPeakRate: 5020,
      },
      {
        id: 'm21',
        name: 'APMC Latur',
        district: 'Latur',
        state: 'Maharashtra',
        distanceKm: 140,
        currentRate: 5120,
        prevRate: 5050,
        minRate: 4900,
        maxRate: 5250,
        trend: 'up',
        trendPercent: 1.3,
        predictedPeakDate: '01 Oct 2026',
        predictedPeakRate: 5300,
      },
      {
        id: 'm22',
        name: 'Daund APMC Yard',
        district: 'Pune',
        state: 'Maharashtra',
        distanceKm: 42,
        currentRate: 4920,
        prevRate: 4880,
        minRate: 4750,
        maxRate: 5000,
        trend: 'up',
        trendPercent: 0.8,
        predictedPeakDate: '28 Sep 2026',
        predictedPeakRate: 5080,
      }
    ],
    buyers: [
      {
        id: 'b20',
        buyerName: 'Sahyadri Farmers Producer Co. Ltd.',
        type: 'State Apex FPO',
        crop: 'Soybean',
        offeredPrice: 5050,
        minQty: 20,
        location: 'Nashik Agro-Park',
        farmgatePickup: true,
        paymentTerm: 'Instant UPI / Bank Credit',
        rating: 5.0,
      }
    ]
  },
  Onion: {
    mandis: [
      {
        id: 'm30',
        name: 'Lasalgaon APMC',
        district: 'Nashik',
        state: 'Maharashtra',
        distanceKm: 65,
        currentRate: 2850,
        prevRate: 2600,
        minRate: 2400,
        maxRate: 3100,
        trend: 'up',
        trendPercent: 9.6,
        predictedPeakDate: '28 Sep 2026',
        predictedPeakRate: 3200,
      },
      {
        id: 'm31',
        name: 'Pimpalgaon Baswant APMC',
        district: 'Nashik',
        state: 'Maharashtra',
        distanceKm: 48,
        currentRate: 2790,
        prevRate: 2650,
        minRate: 2350,
        maxRate: 3000,
        trend: 'up',
        trendPercent: 5.2,
        predictedPeakDate: '27 Sep 2026',
        predictedPeakRate: 3100,
      }
    ],
    buyers: [
      {
        id: 'b30',
        buyerName: 'MahaOnion Export Consortium',
        type: 'Export Consortium',
        crop: 'Onion',
        offeredPrice: 2950,
        minQty: 30,
        location: 'Lasalgaon Cold Chain',
        farmgatePickup: true,
        paymentTerm: 'Spot Payment on Loading',
        rating: 4.9,
      }
    ]
  }
};

export default function SmartMandiMarketplaceCard() {
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy');
  const [quantityQtl, setQuantityQtl] = useState<number>(30); // default 30 quintals
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerBid | null>(null);
  const [language] = useState<string>('en'); // fallback language handler

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const cropData = CROPS_DATA[selectedCrop] || CROPS_DATA.Paddy;

  // Calculate net profit for a mandi
  const calculateNetProfit = (mandi: MandiData) => {
    const grossRevenue = mandi.currentRate * quantityQtl;
    // Freight model: ₹12 per km per ton (10 quintals = 1 ton)
    const weightTons = quantityQtl / 10;
    const freightCost = Math.round(mandi.distanceKm * 12 * weightTons);
    // Mandi cess & loading tax ~ 1% of gross revenue
    const mandiCess = Math.round(grossRevenue * 0.01);
    const netReturn = grossRevenue - freightCost - mandiCess;
    return {
      grossRevenue,
      freightCost,
      mandiCess,
      netReturn,
      netPerQtl: Math.round(netReturn / quantityQtl)
    };
  };

  // Find mandi with highest net profit
  const evaluatedMandis = cropData.mandis.map(m => ({
    mandi: m,
    calc: calculateNetProfit(m)
  }));

  evaluatedMandis.sort((a, b) => b.calc.netReturn - a.calc.netReturn);
  const bestMandi = evaluatedMandis[0];

  const handleConnectBuyer = (buyer: BuyerBid) => {
    setSelectedBuyer(buyer);
  };

  const handleConfirmSale = () => {
    if (!selectedBuyer) return;
    toast.success(`Request sent to ${selectedBuyer.buyerName}! A representative will call you for farmgate pickup.`);
    setSelectedBuyer(null);
  };

  return (
    <div className="card p-5 sm:p-6 bg-white border border-emerald-100 shadow-md rounded-3xl space-y-6">
      {/* Top Header Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Store className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {t.title}
                <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live Telemetry
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Crop Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(CROPS_DATA).map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {crop === 'Paddy' && '🌾 '}
              {crop === 'Cotton' && '☁️ '}
              {crop === 'Soybean' && '🌱 '}
              {crop === 'Onion' && '🧅 '}
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Harvest Calculator Toolbar */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-2xl border border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-700 font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <label className="text-xs font-bold text-emerald-950 block">{t.harvestQty}</label>
            <span className="text-[11px] text-emerald-700">{t.calcTransport}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            min="1"
            max="1000"
            value={quantityQtl}
            onChange={(e) => setQuantityQtl(Math.max(1, Number(e.target.value) || 1))}
            className="w-28 px-3 py-2 text-center font-extrabold text-gray-900 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <span className="text-xs font-bold text-emerald-900">Quintals</span>
        </div>
      </div>

      {/* Best Profit Highlight Banner */}
      {bestMandi && (
        <div className="card p-4 bg-emerald-900 text-white rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {t.bestProfitMandi}
              </span>
              <h3 className="text-xl font-black text-white">{bestMandi.mandi.name}</h3>
              <p className="text-xs text-emerald-200 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {bestMandi.mandi.district}, {bestMandi.mandi.state} ({bestMandi.mandi.distanceKm} km away)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-emerald-800 pt-3 md:pt-0 md:pl-6 text-right">
              <div>
                <span className="text-[10px] text-emerald-300 block uppercase font-medium">{t.grossRate}</span>
                <span className="text-lg font-black text-white">₹{bestMandi.mandi.currentRate.toLocaleString('en-IN')}<span className="text-xs text-emerald-300 font-normal">/qtl</span></span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 block uppercase font-medium">{t.freight}</span>
                <span className="text-lg font-bold text-red-300">-₹{bestMandi.calc.freightCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-amber-300 block uppercase font-bold">{t.netReturn}</span>
                <span className="text-xl font-black text-amber-300">₹{bestMandi.calc.netReturn.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mandi Comparison Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" /> {t.mandiComparison}
          </span>
          <span className="text-xs font-normal text-gray-500">Distance & freight adjusted</span>
        </h3>

        <div className="grid gap-3">
          {evaluatedMandis.map(({ mandi, calc }, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={mandi.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isTop 
                    ? 'border-emerald-300 bg-emerald-50/40 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-base">{mandi.name}</h4>
                      {isTop && (
                        <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          ★ TOP NET PROFIT
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {mandi.district} ({mandi.distanceKm} km)
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {t.peakForecast}: <span className="text-emerald-700">{mandi.predictedPeakDate} (₹{mandi.predictedPeakRate}/qtl)</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">{t.grossRate}</span>
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-bold text-gray-900">₹{mandi.currentRate.toLocaleString('en-IN')}</span>
                        {mandi.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                        {mandi.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                        {mandi.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-gray-400" />}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">{t.freight}</span>
                      <span className="text-xs font-semibold text-red-600">-₹{calc.freightCost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="bg-emerald-100/60 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 font-bold block uppercase">{t.netReturn}</span>
                      <span className="text-base font-extrabold text-emerald-900">₹{calc.netReturn.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct FPO & Buyer Bidding Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" /> {t.buyerBids}
          </h3>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t.buyerTag}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {cropData.buyers.map((buyer) => (
            <div key={buyer.id} className="p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 to-orange-50/20 hover:border-amber-300 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{buyer.buyerName}</h4>
                  <p className="text-xs text-amber-800 font-semibold mt-0.5">{buyer.type}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                    ₹{buyer.offeredPrice}/qtl
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1 bg-white/70 p-2.5 rounded-xl border border-amber-100">
                <p className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600" /> Payment: <span className="font-semibold text-gray-800">{buyer.paymentTerm}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Pickup: <span className="font-semibold text-emerald-700">{buyer.farmgatePickup ? 'Free Farmgate Pickup Available' : 'Deliver at Hub'}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> Hub: {buyer.location} · Min Qty: {buyer.minQty} Qtl
                </p>
              </div>

              <button
                onClick={() => handleConnectBuyer(buyer)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                {t.sellNow} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Direct Buyer Sale Registration */}
      {selectedBuyer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-slideUp">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Connect with Buyer
              </h3>
              <button onClick={() => setSelectedBuyer(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="font-bold text-emerald-950 text-sm">{selectedBuyer.buyerName}</p>
                <p className="text-emerald-800">{selectedBuyer.type} · {selectedBuyer.location}</p>
              </div>

              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Selected Crop:</span>
                  <span className="font-bold">{selectedCrop}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Quantity:</span>
                  <span className="font-bold">{quantityQtl} Quintals</span>
                </div>
                <div className="flex justify-between">
                  <span>Offered Price:</span>
                  <span className="font-bold text-emerald-700">₹{selectedBuyer.offeredPrice} / Quintal</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-sm text-gray-900">
                  <span>Estimated Total Payout:</span>
                  <span className="text-emerald-800">₹{(selectedBuyer.offeredPrice * quantityQtl).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                ℹ️ <strong>Farmgate Pickup:</strong> The buyer will verify crop quality at your field and credit money directly to your linked bank account via DBT.
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmSale}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Confirm & Send Request
              </button>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-200"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
