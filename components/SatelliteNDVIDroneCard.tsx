'use client';

import React, { useState } from 'react';
import { 
  Satellite, 
  Plane, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  Droplets, 
  X,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';

interface NDVIZone {
  id: string;
  name: string;
  ndviScore: number;
  status: 'Healthy' | 'Moderate Stress' | 'High Risk';
  areaAcres: number;
  recommendation: string;
  colorClass: string;
}

const NDVI_I18N: Record<string, {
  title: string;
  subTitle: string;
  badge: string;
  bookBtn: string;
  mapTitle: string;
  updatedTag: string;
  zoneDetailsTitle: string;
  scoreLabel: string;
  aiRecLabel: string;
  deployBtn: string;
  packagesTitle: string;
  highRiskTag: string;
  modTag: string;
  healthyTag: string;
  zones: Record<string, { name: string; status: string; rec: string }>;
  services: Record<string, { name: string; category: string }>;
}> = {
  en: {
    title: 'Satellite NDVI & Agri-Drone Precision Spraying',
    subTitle: 'Multispectral canopy chlorophyll telemetry combined with GPS precision drone service.',
    badge: 'Sentinel-2 10m',
    bookBtn: 'Book Agri-Drone Spraying',
    mapTitle: 'Plot Canopy NDVI Map — Patil Rice Farm (2.5 Acres)',
    updatedTag: 'Updated: Today, 09:30 AM',
    zoneDetailsTitle: 'Selected Zone Details',
    scoreLabel: 'NDVI Chlorophyll Index Score:',
    aiRecLabel: '🤖 AI Satellite Recommendation:',
    deployBtn: 'Deploy Drone Spray on',
    packagesTitle: 'Certified Precision Drone Spraying Packages',
    highRiskTag: '<0.35 High Risk',
    modTag: '0.36 - 0.65 Moderate',
    healthyTag: '>0.66 Healthy',
    zones: {
      z1: { name: 'North-East Zone A', status: 'Healthy', rec: 'Optimal chlorophyll density. No immediate intervention required.' },
      z2: { name: 'Central Zone B', status: 'Moderate Stress', rec: 'Nitrogen depletion detected. Foliar Nano-Urea spray advised.' },
      z3: { name: 'South-West Zone C', status: 'High Risk', rec: 'Fungal leaf blast spot outbreak. Immediate Bio-Fungicide drone spray recommended.' }
    },
    services: {
      s1: { name: 'Nano-Urea & Nitrogen Booster', category: 'Nutrient Foliar Spray' },
      s2: { name: 'Bio-Fungicide Blast Shield', category: 'Pest & Fungal Control' },
      s3: { name: 'Micronutrient Zinc & Boron Charge', category: 'Soil Deficit Corrector' }
    }
  },
  hi: {
    title: 'सैटेलाइट NDVI एवं कृषि-ड्रोन सटीक छिड़काव',
    subTitle: 'मल्टीस्पेक्ट्रल कैनोपी क्लोरोफिल टेलीमेट्री और जीपीएस सटीक ड्रोन सेवा।',
    badge: 'सेंटिनेल-2 10m',
    bookBtn: 'कृषि-ड्रोन छिड़काव बुक करें',
    mapTitle: 'प्लॉट कैनोपी एनडीवीआई मानचित्र — पाटिल धान खेत (2.5 एकड़)',
    updatedTag: 'अपडेटेड: आज, सुबह 09:30 बजे',
    zoneDetailsTitle: 'चयनित क्षेत्र का विवरण',
    scoreLabel: 'NDVI क्लोरोफिल सूचकांक स्कोर:',
    aiRecLabel: '🤖 एआई उपग्रह सिफारिश:',
    deployBtn: 'ड्रोन स्प्रे तैनात करें -',
    packagesTitle: 'प्रमाणित सटीक ड्रोन छिड़काव पैकेज',
    highRiskTag: '<0.35 उच्च जोखिम',
    modTag: '0.36 - 0.65 मध्यम',
    healthyTag: '>0.66 स्वस्थ',
    zones: {
      z1: { name: 'उत्तर-पूर्व ज़ोन A', status: 'स्वस्थ', rec: 'अनुकूल क्लोरोफिल घनत्व। किसी तत्काल हस्तक्षेप की आवश्यकता नहीं है।' },
      z2: { name: 'सेंट्रल ज़ोन B', status: 'मध्यम तनाव', rec: 'नाइट्रोजन की कमी पाई गई। नैनो-यूरिया छिड़काव की सलाह।' },
      z3: { name: 'दक्षिण-पश्चिम ज़ोन C', status: 'उच्च जोखिम', rec: 'कवक पत्ती ब्लास्ट का प्रकोप। तत्काल बायो-फंगीसाइड ड्रोन स्प्रे अनुशंसित।' }
    },
    services: {
      s1: { name: 'नैनो-यूरिया और नाइट्रोजन बूस्टर', category: 'पोषक तत्व फोलियर स्प्रे' },
      s2: { name: 'बायो-फंगीसाइड ब्लास्ट शील्ड', category: 'कीट और कवक नियंत्रण' },
      s3: { name: 'माइक्रोन्यूट्रिएंट जिंक और बोरॉन चार्ज', category: 'मृदा कमी सुधारक' }
    }
  },
  mr: {
    title: 'सॅटेलाइट NDVI आणि कृषी-ड्रोन फवारणी सेवा',
    subTitle: 'उपग्रह पीक आरोग्य निरीक्षण आणि जीपीएस अचूक ड्रोन फवारणी.',
    badge: 'सेंटिनेल-२ १०मी',
    bookBtn: 'ड्रोन फवारणी बुक करा',
    mapTitle: 'पीक आरोग्य नकाशा — पाटील भात शेती (२.५ एकर)',
    updatedTag: 'अपडेट: आज, सकाळी ०९:३०',
    zoneDetailsTitle: 'निवडलेल्या भागाचा तपशील',
    scoreLabel: 'NDVI क्लोरोफिल निर्देशांक स्कोअर:',
    aiRecLabel: '🤖 एआई उपग्रह शिफारस:',
    deployBtn: 'वर ड्रोन फवारणी सुरू करा -',
    packagesTitle: 'प्रमाणित ड्रोन फवारणी पॅकेजेस',
    highRiskTag: '<०.३५ जास्त धोका',
    modTag: '०.३६ - ०.६५ मध्यम',
    healthyTag: '>०.६६ उत्तम आरोग्य',
    zones: {
      z1: { name: 'उत्तर-पूर्व क्षेत्र A', status: 'उत्तम आरोग्य', rec: 'पिकाचे आरोग्य उत्तम आहे. कोणत्याही त्वरित उपायाची गरज नाही.' },
      z2: { name: 'मध्यवर्ती क्षेत्र B', status: 'मध्यम ताण', rec: 'नत्र (नायट्रोजन) कमतरता आढळली. नॅनो-युरिया फवारणीचा सल्ला.' },
      z3: { name: 'दक्षिण-पश्चिम क्षेत्र C', status: 'जास्त धोका', rec: 'तांबेरा/ब्लास्ट रोगाचा प्रादुर्भाव. त्वरित बायोकंट्रोल ड्रोन फवारणी आवश्यक.' }
    },
    services: {
      s1: { name: 'नॅनो-युरिया आणि नायट्रोजन बूस्टर', category: 'पोषक घटक फवारणी' },
      s2: { name: 'बायो-फंगीसाइड ब्लास्ट शील्ड', category: 'कीड व बुरशी नियंत्रण' },
      s3: { name: 'झिंक आणि बोरोन मायक्रोन्यूट्रिएंट', category: 'माती सूक्ष्मअन्नद्रव्य' }
    }
  },
  te: {
    title: 'శాటిలైట్ NDVI & అగ్రి-డ్రోన్ పిచికారీ సేవలు',
    subTitle: 'ఉపగ్రహ పంట ఆరోగ్య పరిశీలన మరియు GPS ఆధారిత డ్రోన్ పిచికారీ.',
    badge: 'సెంటినెల్-2 10మీ',
    bookBtn: 'డ్రోన్ పిచికారీ బుక్ చేయండి',
    mapTitle: 'పంట ఆరోగ్య పటం — పాటిల్ వరి పొలం (2.5 ఎకరాలు)',
    updatedTag: 'తాజా సమాచారం: నేడు, ఉదయం 09:30',
    zoneDetailsTitle: 'ఎంచుకున్న ప్రాంత వివరాలు',
    scoreLabel: 'NDVI క్లోరోఫిల్ స్కోరు:',
    aiRecLabel: '🤖 AI శాటిలైట్ సిఫార్సు:',
    deployBtn: 'డ్రోన్ పిచికారీ ప్రారంభించండి -',
    packagesTitle: 'ప్రమాణీకరించబడిన డ్రోన్ పిచికారీ ప్యాకేజీలు',
    highRiskTag: '<0.35 అధిక ప్రమాదం',
    modTag: '0.36 - 0.65 మధ్యస్థం',
    healthyTag: '>0.66 ఆరోగ్యకరం',
    zones: {
      z1: { name: 'ఉత్తర-తూర్పు జోన్ A', status: 'ఆరోగ్యకరం', rec: 'పంట ఆరోగ్యం బాగుంది. తక్షణ చర్య అవసరం లేదు.' },
      z2: { name: 'సెంట్రల్ జోన్ B', status: 'మధ్యస్థ సమస్య', rec: 'నత్రజని లోపం కనుగొనబడింది. నానో-యూరియా పిచికారీ చేయండి.' },
      z3: { name: 'నైరుతి జోన్ C', status: 'అధిక ప్రమాదం', rec: 'వరి బ్లాస్ట్ వ్యాధి వ్యాప్తి. వెంటనే బయో-ఫంగిసైడ్ డ్రోన్ పిచికారీ అవసరం.' }
    },
    services: {
      s1: { name: 'నానో-యూరియా & నైట్రోజన్ బూస్టర్', category: 'పోషకాల పిచికారీ' },
      s2: { name: 'బయో-ఫంగిసైడ్ బ్లాస్ట్ షీల్డ్', category: 'పురుగు నివారణ' },
      s3: { name: 'జింక్ & బోరాన్ మైక్రోన్యూట్రియెంట్', category: 'నేల లోపాల నివారణ' }
    }
  },
  ta: {
    title: 'செயற்கைக்கோள் NDVI & ட்ரோன் தெளிப்பு சேவை',
    subTitle: 'செயற்கைக்கோள் பயிர் சுகாதார கண்காணிப்பு மற்றும் ஜிபிஎஸ் ட்ரோன் தெளிப்பு.',
    badge: 'சென்டினல்-2 10m',
    bookBtn: 'ட்ரோன் தெளிப்பு முன்பதிவு',
    mapTitle: 'பயிர் சுகாதார வரைபடம் — பாட்டீல் நெல் வயல் (2.5 ஏக்கர்)',
    updatedTag: 'புதுப்பிக்கப்பட்டது: இன்று, காலை 09:30',
    zoneDetailsTitle: 'தேர்ந்தெடுக்கப்பட்ட பகுதி వివరங்கள்',
    scoreLabel: 'NDVI குளோரோபில் குறியீட்டு மதிப்பெண்:',
    aiRecLabel: '🤖 AI செயற்கைக்கோள் பரிந்துரை:',
    deployBtn: 'ட்ரோன் தெளிப்பைத் தொடங்குங்கள் -',
    packagesTitle: 'சான்றளிக்கப்பட்ட ட்ரோன் தெளிப்பு தொகுப்புகள்',
    highRiskTag: '<0.35 அதிக ஆபத்து',
    modTag: '0.36 - 0.65 நடுத்தர',
    healthyTag: '>0.66 ஆரோக்கியமானது',
    zones: {
      z1: { name: 'வடகிழக்கு மண்டலம் A', status: 'ஆரோக்கியமானது', rec: 'பயிர் ஆரோக்கியம் நன்றாக உள்ளது. உடனடி நடவடிக்கை தேவையில்லை.' },
      z2: { name: 'மத்திய மண்டலம் B', status: 'நடுத்தர மன அழுத்தம்', rec: 'நைட்ரஜன் குறைபாடு கண்டறியப்பட்டது. நானோ-யூரியா தெளிப்பு பரிந்துரைக்கப்படுகிறது.' },
      z3: { name: 'தென்மேற்கு மண்டலம் C', status: 'அதிக ஆபத்து', rec: 'இலை கருகல் நோய் தாக்கம். உடனடியாக ட்ரோன் தெளிப்பு தேவை.' }
    },
    services: {
      s1: { name: 'நானோ-யூரியா மற்றும் நைட்ரஜன் பூஸ்டர்', category: 'ஊட்டச்சத்து தெளிப்பு' },
      s2: { name: 'பயோ-பூஞ்சைக் கொல்லி பிளாஸ்ட் ஷீல்ட்', category: 'பூச்சி மற்றும் பூஞ்சை கட்டுப்பாடு' },
      s3: { name: 'துத்தநாகம் & போரான் சத்துக்கள்', category: 'மண் குறைபாடு நீக்கி' }
    }
  },
  or: {
    title: 'ସାଟେଲାଇଟ୍ NDVI ଓ କୃଷି-ଡ୍ରୋନ୍ ସ୍ପ୍ରେ ସେବା',
    subTitle: 'ଉପଗ୍ରହ ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ନିରୀକ୍ଷଣ ଓ GPS ଆଧାରିତ ଡ୍ରୋନ୍ ସ୍ପ୍ରେ।',
    badge: 'ସେଣ୍ଟିନେଲ୍-୨ ୧୦ମି',
    bookBtn: 'ଡ୍ରୋନ୍ ସ୍ପ୍ରେ ବୁକ୍ କରନ୍ତୁ',
    mapTitle: 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ମାନଚିତ୍ର — ପାଟିଲ୍ ଧାନ ଜମି (୨.୫ ଏକର)',
    updatedTag: 'ଅପଡେଟ୍: ଆଜି, ସକାଳ ୦୯:୩୦',
    zoneDetailsTitle: 'ମନୋନୀତ ଅଞ୍ଚଳ ବିବରଣୀ',
    scoreLabel: 'NDVI କ୍ଲୋରୋଫିଲ୍ ସ୍କୋର:',
    aiRecLabel: '🤖 AI ଉପଗ୍ରହ ପରାମର୍ଶ:',
    deployBtn: 'ଡ୍ରୋନ୍ ସ୍ପ୍ରେ ଆରମ୍ଭ କରନ୍ତୁ -',
    packagesTitle: 'ମାନ୍ୟତାପ୍ରାପ୍ତ ଡ୍ରୋନ୍ ସ୍ପ୍ରେ ପ୍ୟାକେଜ୍',
    highRiskTag: '<୦.୩୫ ଉଚ୍ଚ ବିପଦ',
    modTag: '୦.୩୬ - ୦.୬୫ ମଧ୍ୟମ',
    healthyTag: '>୦.୬୬ ସୁସ୍ଥ',
    zones: {
      z1: { name: 'ଉତ୍ତର-ପୂର୍ବ ଜୋନ୍ A', status: 'ସୁସ୍ଥ', rec: 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ଭଲ ଅଛି। କୌଣସି ଜରୁରୀ ପଦକ୍ଷେପ ଆବଶ୍ୟକ ନାହିଁ।' },
      z2: { name: 'ସେଣ୍ଟ୍ରାଲ୍ ଜୋନ୍ B', status: 'ମଧ୍ୟମ ବିପଦ', rec: 'ନାଇଟ୍ରୋଜେନ୍ ଅଭାବ ଦେଖାଦେଇଛି। ନାନୋ-ୟୁରିଆ ସ୍ପ୍ରେ କରନ୍ତୁ।' },
      z3: { name: 'ଦକ୍ଷିଣ-ପଶ୍ଚିମ ଜୋନ୍ C', status: 'ଉଚ୍ଚ ବିପଦ', rec: 'ଧାନ ବ୍ଲାଷ୍ଟ ରୋଗ ଆକ୍ରମଣ। ତୁରନ୍ତ ଡ୍ରୋନ୍ ସ୍ପ୍ରେ ଆବଶ୍ୟକ।' }
    },
    services: {
      s1: { name: 'ନାନୋ-ୟୁରିଆ ଓ ନାଇଟ୍ରୋଜେନ୍ ବୁଷ୍ଟର୍', category: 'ପୋଷକ ସ୍ପ୍ରେ' },
      s2: { name: 'ବାୟୋ-ଫଙ୍ଗିସାଇଡ୍ ବ୍ଲାଷ୍ଟ ଶୀଲ୍ଡ', category: 'ରୋଗ ନିୟନ୍ତ୍ରଣ' },
      s3: { name: 'ଜିଙ୍କ୍ ଓ ବୋରନ୍ ମାଇକ୍ରୋନ୍ୟୁଟ୍ରିଏଣ୍ଟ୍', category: 'ମୃତ୍ତିକା ପୋଷକ' }
    }
  }
};

const PARCEL_ZONES: NDVIZone[] = [
  {
    id: 'z1',
    name: 'North-East Zone A',
    ndviScore: 0.82,
    status: 'Healthy',
    areaAcres: 1.2,
    recommendation: 'Optimal chlorophyll density. No immediate intervention required.',
    colorClass: 'bg-emerald-500 text-white',
  },
  {
    id: 'z2',
    name: 'Central Zone B',
    ndviScore: 0.54,
    status: 'Moderate Stress',
    areaAcres: 0.8,
    recommendation: 'Nitrogen depletion detected. Foliar Nano-Urea spray advised.',
    colorClass: 'bg-amber-400 text-gray-900',
  },
  {
    id: 'z3',
    name: 'South-West Zone C',
    ndviScore: 0.31,
    status: 'High Risk',
    areaAcres: 0.5,
    recommendation: 'Fungal leaf blast spot outbreak. Immediate Bio-Fungicide drone spray recommended.',
    colorClass: 'bg-red-500 text-white animate-pulse',
  }
];

const SPRAY_SERVICES = [
  {
    id: 's1',
    name: 'Nano-Urea & Nitrogen Booster',
    category: 'Nutrient Foliar Spray',
    pricePerAcre: 400,
    waterSaving: '90% Water Saved',
    timePerAcre: '8 Minutes',
    solution: 'IFFCO Nano Urea (500ml/acre)',
    icon: '🌱',
  },
  {
    id: 's2',
    name: 'Bio-Fungicide Blast Shield',
    category: 'Pest & Fungal Control',
    pricePerAcre: 500,
    waterSaving: '85% Water Saved',
    timePerAcre: '10 Minutes',
    solution: 'Trichoderma viride + Pseudomonas (ULV Spray)',
    icon: '🛡️',
  },
  {
    id: 's3',
    name: 'Micronutrient Zinc & Boron Charge',
    category: 'Soil Deficit Corrector',
    pricePerAcre: 450,
    waterSaving: '90% Water Saved',
    timePerAcre: '8 Minutes',
    solution: 'Chelated Zinc EDTA + Boron 20%',
    icon: '⚡',
  }
];

export default function SatelliteNDVIDroneCard() {
  const { language } = useAuth();
  const tNdvi = NDVI_I18N[language] || NDVI_I18N.hi || NDVI_I18N.en;

  const [selectedZoneId, setSelectedZoneId] = useState<string>('z3');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('s2');
  const [acresToSpray, setAcresToSpray] = useState<number>(2.5);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('07:00 AM - 09:00 AM (Early Morning)');

  const selectedZoneObj = PARCEL_ZONES.find(z => z.id === selectedZoneId) || PARCEL_ZONES[2];
  const selectedZoneI18n = tNdvi.zones[selectedZoneObj.id] || {
    name: selectedZoneObj.name,
    status: selectedZoneObj.status,
    rec: selectedZoneObj.recommendation
  };

  const selectedServiceObj = SPRAY_SERVICES.find(s => s.id === selectedServiceId) || SPRAY_SERVICES[1];
  const selectedServiceI18n = tNdvi.services[selectedServiceObj.id] || {
    name: selectedServiceObj.name,
    category: selectedServiceObj.category
  };

  const totalPrice = selectedServiceObj.pricePerAcre * acresToSpray;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Agri-Drone booked successfully for ${acresToSpray} acres on ${bookingDate}! Pilot Ramesh Kulkarni assigned.`
    );
    setShowBookingModal(false);
  };

  return (
    <div className="card p-5 sm:p-6 bg-white border border-indigo-100 shadow-md rounded-3xl space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-indigo-100 text-indigo-800 rounded-2xl">
            <Satellite className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {tNdvi.title}
              <span className="text-[10px] bg-indigo-100 text-indigo-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {tNdvi.badge}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {tNdvi.subTitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plane className="w-4 h-4" /> {tNdvi.bookBtn}
        </button>
      </div>

      {/* Sentinel-2 Plot Heatmap Grid Visualizer */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visual Canopy Heatmap Simulation */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> {tNdvi.mapTitle}
            </h3>
            <span className="text-xs font-semibold text-gray-500">{tNdvi.updatedTag}</span>
          </div>

          {/* Map Grid Box */}
          <div className="relative bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-900 p-4 rounded-2xl border border-emerald-800 overflow-hidden shadow-inner">
            {/* Simulated Satellite Grid Overlay */}
            <div className="grid grid-cols-6 gap-2 p-2">
              {/* Row 1 (Healthy) */}
              {[0.84, 0.82, 0.85, 0.81, 0.79, 0.83].map((val, idx) => (
                <button
                  key={`r1-${idx}`}
                  onClick={() => setSelectedZoneId('z1')}
                  className="aspect-square bg-emerald-500/80 hover:bg-emerald-400 rounded-lg flex flex-col items-center justify-center p-1 text-white border border-emerald-400/40 transition-all hover:scale-105"
                >
                  <span className="text-[10px] font-mono font-bold">{val}</span>
                </button>
              ))}
              {/* Row 2 (Mixed Stress) */}
              {[0.78, 0.58, 0.54, 0.52, 0.76, 0.80].map((val, idx) => {
                const isModerate = val < 0.7;
                return (
                  <button
                    key={`r2-${idx}`}
                    onClick={() => setSelectedZoneId(isModerate ? 'z2' : 'z1')}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 border transition-all hover:scale-105 ${
                      isModerate 
                        ? 'bg-amber-400/90 text-gray-900 border-amber-300 font-bold' 
                        : 'bg-emerald-500/80 text-white border-emerald-400/40'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold">{val}</span>
                  </button>
                );
              })}
              {/* Row 3 (High Risk Spot Infection) */}
              {[0.72, 0.49, 0.32, 0.29, 0.31, 0.51].map((val, idx) => {
                const isHighRisk = val < 0.4;
                const isMod = val >= 0.4 && val < 0.7;
                return (
                  <button
                    key={`r3-${idx}`}
                    onClick={() => setSelectedZoneId(isHighRisk ? 'z3' : isMod ? 'z2' : 'z1')}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 border transition-all hover:scale-105 ${
                      isHighRisk 
                        ? 'bg-red-500/90 text-white border-red-300 font-bold animate-pulse' 
                        : isMod 
                        ? 'bg-amber-400/90 text-gray-900 border-amber-300 font-bold' 
                        : 'bg-emerald-500/80 text-white border-emerald-400/40'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold">{val}</span>
                  </button>
                );
              })}
            </div>

            {/* NDVI Scale Legend */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-200 border-t border-emerald-800/80 pt-2 px-1">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-sm" /> {tNdvi.highRiskTag}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-amber-400 rounded-sm" /> {tNdvi.modTag}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm" /> {tNdvi.healthyTag}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Zone Telemetry & AI Diagnosis */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" /> {tNdvi.zoneDetailsTitle}
          </h3>

          <div className="card p-4 border border-indigo-100 bg-indigo-50/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm">{selectedZoneI18n.name}</h4>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${selectedZoneObj.colorClass}`}>
                {selectedZoneI18n.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500">{tNdvi.scoreLabel}</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${selectedZoneObj.ndviScore > 0.7 ? 'bg-emerald-500' : selectedZoneObj.ndviScore > 0.4 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${selectedZoneObj.ndviScore * 100}%` }}
                  />
                </div>
                <span className="text-sm font-black text-gray-800">{selectedZoneObj.ndviScore}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-gray-700 space-y-1">
              <p className="font-bold text-indigo-950 flex items-center gap-1">
                {tNdvi.aiRecLabel}
              </p>
              <p className="text-gray-600 leading-relaxed">{selectedZoneI18n.rec}</p>
            </div>

            {selectedZoneObj.status !== 'Healthy' && (
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Plane className="w-3.5 h-3.5" /> {tNdvi.deployBtn} {selectedZoneI18n.name}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Available Agri-Drone Services Cards */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Plane className="w-4 h-4 text-indigo-600" /> {tNdvi.packagesTitle}
        </h3>

        <div className="grid sm:grid-cols-3 gap-3">
          {SPRAY_SERVICES.map(service => {
            const svcI18n = tNdvi.services[service.id] || { name: service.name, category: service.category };
            const isSel = selectedServiceId === service.id;
            return (
              <div 
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSel
                    ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
                    ₹{service.pricePerAcre}/Acre
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">{svcI18n.name}</h4>
                  <p className="text-xs text-indigo-700 font-semibold">{svcI18n.category}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                  <p><strong>Solution:</strong> {service.solution}</p>
                  <p className="text-emerald-700 font-medium">💧 {service.waterSaving} · ⚡ {service.timePerAcre}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-slideUp">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Plane className="w-5 h-5 text-indigo-600" /> {tNdvi.bookBtn}
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div>
                <label className="field-label">Selected Spray Package</label>
                <select
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  className="input-field"
                >
                  {SPRAY_SERVICES.map(s => {
                    const sI18n = tNdvi.services[s.id] || { name: s.name };
                    return (
                      <option key={s.id} value={s.id}>{sI18n.name} — ₹{s.pricePerAcre}/Acre</option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Area Size (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="100"
                    value={acresToSpray}
                    onChange={e => setAcresToSpray(Math.max(0.5, Number(e.target.value) || 0.5))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="field-label">Spray Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Time Slot</label>
                <select
                  value={bookingTimeSlot}
                  onChange={e => setBookingTimeSlot(e.target.value)}
                  className="input-field"
                >
                  <option>07:00 AM - 09:00 AM (Early Morning - Recommended)</option>
                  <option>09:00 AM - 11:00 AM (Mid Morning)</option>
                  <option>04:00 PM - 06:00 PM (Late Afternoon)</option>
                </select>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1.5 text-gray-700">
                <div className="flex justify-between">
                  <span>Package Rate:</span>
                  <span className="font-semibold">₹{selectedServiceObj.pricePerAcre} / acre</span>
                </div>
                <div className="flex justify-between">
                  <span>Area Coverage:</span>
                  <span className="font-semibold">{acresToSpray} acres</span>
                </div>
                <div className="flex justify-between border-t border-indigo-200 pt-1 font-bold text-sm text-indigo-950">
                  <span>Total Estimated Fee:</span>
                  <span className="text-indigo-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Includes certified operator, ultra-low volume nozzles, GPS auto-navigation, and post-flight health report.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  Confirm & Dispatch Drone Pilot
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
