'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CloudRain,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  Volume2,
  VolumeX,
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle2,
  Building2,
  Wheat,
  DollarSign,
  Tag,
  ShieldAlert,
  Info
} from 'lucide-react';

interface MandiPrice {
  id: string;
  crop: string;
  mandi: string;
  district: string;
  state: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  updatedAt: string;
  nearbyMarkets: { mandi: string; price: number; distance: string }[];
}

interface AINewsArticle {
  id: string;
  title: string;
  source: string;
  publishedDate: string;
  district: string;
  category: 'Government Scheme' | 'Subsidy' | 'Policy' | 'Procurement';
  aiWhatItMeans: string;
  aiWhoBenefits: string;
  aiWhatYouShouldDo: string;
  officialLink: string;
  audioText: string;
}

interface MSPUpdate {
  id: string;
  crop: string;
  mspPrice: number;
  procurementStatus: string;
  centersCount: number;
  registrationDeadline: string;
  documents: string[];
  approvedStates: string[];
}

const ADVISORIES_I18N: Record<string, {
  headerTag: string;
  headerTitle: string;
  headerSub: string;
  customizeBtn: string;
  goodMorning: string;
  liveDailyFeed: string;
  weatherAlertTitle: string;
  weatherAlertDesc: string;
  marketUpdateTitle: string;
  marketUpdateDesc: string;
  cropAdvisoryTitle: string;
  cropAdvisoryDesc: string;
  govtUpdateTitle: string;
  govtUpdateDesc: string;
  tabForYou: string;
  tabMandi: string;
  tabAiNews: string;
  tabWeather: string;
  tabMsp: string;
  tabAgrisnet: string;
  mandiHeader: string;
  updatedDaily: string;
  minPrice: string;
  maxPrice: string;
  nearbyComparison: string;
  priceIncreasing: string;
  priceDecreasing: string;
  priceStable: string;
  aiNewsHeader: string;
  verifiedBadge: string;
  whatItMeans: string;
  whoBenefits: string;
  whatYouShouldDo: string;
  listen: string;
  stop: string;
  portal: string;
  mspHeader: string;
  approvedRates: string;
  deadline: string;
  procurementCenters: string;
  approvedStates: string;
  requiredDocs: string;
}> = {
  en: {
    headerTag: '🌾 GramSathi Agro-Intelligence Portal',
    headerTitle: 'Latest Farmer News & Market Advisories',
    headerSub: 'Personalized, location-aware market rates, IMD weather advisories & AI news summaries',
    customizeBtn: '⭐ Customize "My Farm Alerts"',
    goodMorning: 'GOOD MORNING, FARMER',
    liveDailyFeed: 'Live Daily Feed',
    weatherAlertTitle: 'Thunderstorm & Heavy Rainfall Forecast',
    weatherAlertDesc: 'Avoid pesticide spraying during rain. Ensure field drainage.',
    marketUpdateTitle: 'Paddy Mandi Prices Updated',
    marketUpdateDesc: 'Rayagada Main Mandi rates increased by ₹50 today.',
    cropAdvisoryTitle: 'Rice Leaf Blast Alert',
    cropAdvisoryDesc: 'Inspect field borders for brown spot lesions during morning hours.',
    govtUpdateTitle: '50% Farm Machinery Subsidy',
    govtUpdateDesc: 'Apply online via Mo Seba Kendra before Sept 30.',
    tabForYou: '🌾 For You Feed',
    tabMandi: '📈 Mandi & Market Prices',
    tabAiNews: '📰 AI News Summaries',
    tabWeather: '🌦️ Weather Advisories',
    tabMsp: '💰 MSP & Procurement',
    tabAgrisnet: '🚜 Odisha AGRISNET Notices',
    mandiHeader: '📈 Mandi & Live Market Rates (Rayagada, Odisha & Maharashtra)',
    updatedDaily: 'Updated Daily from Mandi Portals',
    minPrice: 'Min Price Today',
    maxPrice: 'Max Price Today',
    nearbyComparison: 'Nearby Mandi Comparison:',
    priceIncreasing: '↑ Price Increasing',
    priceDecreasing: '↓ Price Decreasing',
    priceStable: '→ Stable',
    aiNewsHeader: '📰 AI News Summaries (RAW NEWS → AI → FARMER ACTION)',
    verifiedBadge: 'AGRISNET & PIB Verified',
    whatItMeans: '💡 What it means:',
    whoBenefits: '👥 Who may benefit:',
    whatYouShouldDo: 'What you should do:',
    listen: 'Listen',
    stop: 'Stop',
    portal: 'Portal',
    mspHeader: '💰 Government Procurement & MSP Updates (2026 Season)',
    approvedRates: 'Cabinet Approved Rates',
    deadline: 'Registration Deadline:',
    procurementCenters: 'Procurement Centers:',
    approvedStates: 'Approved States:',
    requiredDocs: 'Required Documents:',
  },
  hi: {
    headerTag: '🌾 ग्रामसाथी कृषि सूचना पोर्टल',
    headerTitle: 'नवीनतम किसान समाचार और मंडी बाजार भाव',
    headerSub: 'स्थान-आधारित बाजार मूल्य, मौसम सलाह और AI समाचार सारांश',
    customizeBtn: '⭐ "मेरे खेत अलर्ट" अनुकूलित करें',
    goodMorning: 'सुप्रभात, किसान भाई',
    liveDailyFeed: 'लाइव दैनिक समाचार',
    weatherAlertTitle: 'गर्जन के साथ भारी बारिश का पूर्वानुमान',
    weatherAlertDesc: 'बारिश के दौरान कीटनाशक छिड़काव से बचें। जल निकासी सुनिश्चित करें।',
    marketUpdateTitle: 'धान मंडी भाव अपडेट',
    marketUpdateDesc: 'रायगड़ा मुख्य मंडी में धान का भाव आज ₹50 बढ़ा।',
    cropAdvisoryTitle: 'धान पत्ती ब्लास्ट अलर्ट',
    cropAdvisoryDesc: 'सुबह के समय खेत की सीमाओं पर भूरे धब्बों की जांच करें।',
    govtUpdateTitle: '50% कृषि यंत्र सब्सिडी',
    govtUpdateDesc: '30 सितंबर से पहले मो सेवा केंद्र के माध्यम से ऑनलाइन आवेदन करें।',
    tabForYou: '🌾 आपके लिए विशेष',
    tabMandi: '📈 मंडी और बाजार भाव',
    tabAiNews: '📰 AI समाचार सारांश',
    tabWeather: '🌦️ मौसम सलाह',
    tabMsp: '💰 एमएसपी और सरकारी खरीद',
    tabAgrisnet: '🚜 एग्रिसनेट नोटिस',
    mandiHeader: '📈 लाइव मंडी और बाजार दरें (ओडिशा और महाराष्ट्र)',
    updatedDaily: 'मंडी पोर्टल से प्रतिदिन अपडेटेड',
    minPrice: 'आज की न्यूनतम कीमत',
    maxPrice: 'आज की अधिकतम कीमत',
    nearbyComparison: 'निकटतम मंडी दर तुलना:',
    priceIncreasing: '↑ मूल्य बढ़ रहा है',
    priceDecreasing: '↓ मूल्य घट रहा है',
    priceStable: '→ स्थिर',
    aiNewsHeader: '📰 AI समाचार सारांश (समाचार → AI → किसान कार्रवाई)',
    verifiedBadge: 'AGRISNET और PIB सत्यापित',
    whatItMeans: '💡 इसका क्या अर्थ है:',
    whoBenefits: '👥 किसे लाभ मिलेगा:',
    whatYouShouldDo: 'आपको क्या करना चाहिए:',
    listen: 'सुनें',
    stop: 'रोकें',
    portal: 'पोर्टल',
    mspHeader: '💰 सरकारी खरीद और एमएसपी अपडेट (2026 सीजन)',
    approvedRates: 'कैबिनेट स्वीकृत दरें',
    deadline: 'पंजीकरण अंतिम तिथि:',
    procurementCenters: 'खरीद केंद्र:',
    approvedStates: 'स्वीकृत राज्य:',
    requiredDocs: 'आवश्यक दस्तावेज:',
  },
  mr: {
    headerTag: '🌾 ग्रामसाथी कृषी माहिती पोर्टल',
    headerTitle: 'ताज्या शेतकरी बातम्या व बाजारभाव सल्ला',
    headerSub: 'स्थानिक हवामान अंदाज, कृषी बातम्या व थेट मंडी भाव',
    customizeBtn: '⭐ "माझे शेती अलर्ट" सानुकूल करा',
    goodMorning: 'शुभ सकाळ, शेतकरी मित्र',
    liveDailyFeed: 'थेट दैनिक अपडेट',
    weatherAlertTitle: 'वादळी वाऱ्यासह मुसळधार पावसाचा अंदाज',
    weatherAlertDesc: 'पावसात कीटकनाशक फवारणी टाळा. पाण्याचा निचरा करा.',
    marketUpdateTitle: 'तांदूळ/धान मंडी भाव अपडेट',
    marketUpdateDesc: 'रायगडा मुख्य मंडीत आज धान दर ₹५० ने वाढले.',
    cropAdvisoryTitle: 'भात तांबेरा रोग इशारा',
    cropAdvisoryDesc: 'सकाळच्या वेळी शेताच्या बांधावर रोगाची लक्षणे तपासा.',
    govtUpdateTitle: '५०% कृषी यंत्र अनुदान',
    govtUpdateDesc: '३० सप्टेंबरपूर्वी ऑनलाइन अर्ज करा.',
    tabForYou: '🌾 खास तुमच्यासाठी',
    tabMandi: '📈 मंडी व बाजारभाव',
    tabAiNews: '📰 AI बातम्या सारांश',
    tabWeather: '🌦️ हवामान सल्ला',
    tabMsp: '💰 हमीभाव (MSP) व खरेदी',
    tabAgrisnet: '🚜 ॲग्रिसनेट सूचना',
    mandiHeader: '📈 थेट मंडी बाजारभाव (महाराष्ट्र व ओडिशा)',
    updatedDaily: 'दररोज अपडेट केलेले बाजारभाव',
    minPrice: 'आजचा किमान भाव',
    maxPrice: 'आजचा कमाल भाव',
    nearbyComparison: 'जवळच्या मंडी भावाची तुलना:',
    priceIncreasing: '↑ भाव वाढत आहे',
    priceDecreasing: '↓ भाव कमी होत आहे',
    priceStable: '→ स्थिर',
    aiNewsHeader: '📰 AI बातम्या सारांश (बातमी → AI → शेतकरी कृती)',
    verifiedBadge: 'शासकीय मान्यताप्राप्त',
    whatItMeans: '💡 याचा काय अर्थ आहे:',
    whoBenefits: '👥 कोणाला फायदा होईल:',
    whatYouShouldDo: 'तुम्ही काय करावे:',
    listen: 'ऐका',
    stop: 'थांबवा',
    portal: 'पोर्टल',
    mspHeader: '💰 शासकीय खरेदी व हमीभाव (MSP) २०२६',
    approvedRates: 'मंत्रिमंडळ मंजूर दर',
    deadline: 'नोंदणी अंतिम तारीख:',
    procurementCenters: 'खरेदी केंद्र संख्या:',
    approvedStates: 'मंजूर राज्ये:',
    requiredDocs: 'आवश्यक कागदपत्रे:',
  },
  or: {
    headerTag: '🌾 ଗ୍ରାମସାଥୀ କୃଷି ସୂଚନା ପୋର୍ଟାଲ୍',
    headerTitle: 'ତାଜା ଚାଷୀ ଖବର ଓ ମଣ୍ଡି ବଜାର ଦର',
    headerSub: 'ସ୍ଥାନୀୟ ପାଣିପାଗ ପରାମର୍ଶ, କୃଷି ଖବର ଓ ସିଧାସଳଖ ମଣ୍ଡି ଦର',
    customizeBtn: '⭐ "ମୋ ଚାଷ ଆଲର୍ଟ" ବଦଳାନ୍ତୁ',
    goodMorning: 'ଶୁଭ ସକାଳ, ଚାଷୀ ଭାଇ',
    liveDailyFeed: 'ଲାଇଭ୍ ଦୈନିକ ଖବର',
    weatherAlertTitle: 'ଘଡ଼ଘଡ଼ି ସହ ପ୍ରବଳ ବର୍ଷା ପୂର୍ବାନୁମାନ',
    weatherAlertDesc: 'ବର୍ଷା ସମୟରେ କୀଟନାଶକ ସ୍ପ୍ରେ କରନ୍ତୁ ନାହିଁ। ଜଳ ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା କରନ୍ତୁ।',
    marketUpdateTitle: 'ଧାନ ମଣ୍ଡି ଦର ଅପଡେଟ୍',
    marketUpdateDesc: 'ରାୟଗଡ଼ା ମୁଖ୍ୟ ମଣ୍ଡିରେ ଆଜି ଧାନ ଦର ₹୫୦ ବୃଦ୍ଧି ପାଇଛି।',
    cropAdvisoryTitle: 'ଧାନ ପତ୍ର ବ୍ଲାଷ୍ଟ ଚେତାବନୀ',
    cropAdvisoryDesc: 'ସକାଳେ ଜମି ହୁଡାରେ ରୋଗ ଲକ୍ଷଣ ଯାଞ୍ଚ କରନ୍ତୁ।',
    govtUpdateTitle: '୫୦% କୃଷି ଯନ୍ତ୍ରପାତି ସବସିଡି',
    govtUpdateDesc: 'ସେପ୍ଟେମ୍ବର ୩୦ ପୂର୍ବରୁ ମୋ ସେବା କେନ୍ଦ୍ର ମାଧ୍ୟମରେ ଅନଲାଇନ୍ ଆବେଦନ କରନ୍ତୁ।',
    tabForYou: '🌾 ଆପଣଙ୍କ ପାଇଁ ଖବର',
    tabMandi: '📈 ମଣ୍ଡି ଓ ବଜାର ଦର',
    tabAiNews: '📰 AI ଖବର ସାରାଂଶ',
    tabWeather: '🌦️ ପାଣିପାଗ ପରାମର୍ଶ',
    tabMsp: '💰 MSP ଓ ସରକାରୀ ସଂଗ୍ରହ',
    tabAgrisnet: '🚜 ଓଡ଼ିଶା AGRISNET ବିଜ୍ଞପ୍ତି',
    mandiHeader: '📈 ଲାଇଭ୍ ମଣ୍ଡି ବଜାର ଦର (ଓଡ଼ିଶା ଓ ମହାରାଷ୍ଟ୍ର)',
    updatedDaily: 'ପ୍ରତିଦିନ ଅପଡେଟ୍ ହେଉଥିବା ଦର',
    minPrice: 'ଆଜିର ସର୍ବନିମ୍ନ ଦର',
    maxPrice: 'ଆଜିର ସର୍ବାଧିକ ଦର',
    nearbyComparison: 'ନିକଟସ୍ଥ ମଣ୍ଡି ଦର ତୁଳନା:',
    priceIncreasing: '↑ ଦର ବୃଦ୍ଧି ପାଉଛି',
    priceDecreasing: '↓ ଦର କମୁଛି',
    priceStable: '→ ସ୍ଥିର ଅଛି',
    aiNewsHeader: '📰 AI ଖବର ସାରାଂଶ (ଖବର → AI → ଚାଷୀ କାର୍ଯ୍ୟ)',
    verifiedBadge: 'AGRISNET ଓ PIB ଯାଞ୍ଚ ହୋଇଛି',
    whatItMeans: '💡 ଏହାର ଅର୍ଥ କଣ:',
    whoBenefits: '👥 କିଏ ଲାଭବାନ ହେବେ:',
    whatYouShouldDo: 'ଆପଣ କଣ କରିବେ:',
    listen: 'ଶୁଣନ୍ତୁ',
    stop: 'ବନ୍ଦ କରନ୍ତୁ',
    portal: 'ପୋର୍ଟାଲ୍',
    mspHeader: '💰 ସରକାରୀ ଧାନ କ୍ରୟ ଓ MSP ଅପଡେଟ୍ (୨୦୨୬)',
    approvedRates: 'କ୍ୟାବିନେଟ୍ ଅନୁମୋଦିତ ଦର',
    deadline: 'ପଞ୍ଜୀକରଣ ଶେଷ ତାରିଖ:',
    procurementCenters: 'କ୍ରୟ କେନ୍ଦ୍ର:',
    approvedStates: 'ଅନୁମୋଦିତ ରାଜ୍ୟ:',
    requiredDocs: 'ଆବଶ୍ୟକ କାଗଜପତ୍ର:',
  }
};

function getMandiPrices(lang: string): MandiPrice[] {
  if (lang === 'hi') {
    return [
      {
        id: 'mandi-1',
        crop: 'धान (पैडी)',
        mandi: 'रायगड़ा मुख्य मंडी',
        district: 'रायगड़ा',
        state: 'ओडिशा',
        currentPrice: 2300,
        minPrice: 2180,
        maxPrice: 2350,
        unit: '₹/क्विंटल',
        trend: 'up',
        updatedAt: 'आज, सुबह 09:30 बजे',
        nearbyMarkets: [
          { mandi: 'कोरापुट केंद्रीय बाजार', price: 2320, distance: '45 किमी' },
          { mandi: 'गुनुपुर यार्ड', price: 2280, distance: '58 किमी' },
        ],
      },
      {
        id: 'mandi-2',
        crop: 'कपास (रूई)',
        mandi: 'गुनुपुर कपास मंडी',
        district: 'रायगड़ा',
        state: 'ओडिशा',
        currentPrice: 7120,
        minPrice: 6950,
        maxPrice: 7250,
        unit: '₹/क्विंटल',
        trend: 'up',
        updatedAt: 'आज, सुबह 10:15 बजे',
        nearbyMarkets: [
          { mandi: 'केसिंगा मंडी', price: 7180, distance: '82 किमी' },
          { mandi: 'भवानीपटना यार्ड', price: 7080, distance: '95 किमी' },
        ],
      },
      {
        id: 'mandi-3',
        crop: 'सोयाबीन',
        mandi: 'एपीएमसी नासिक',
        district: 'नासिक',
        state: 'महाराष्ट्र',
        currentPrice: 4890,
        minPrice: 4700,
        maxPrice: 4950,
        unit: '₹/क्विंटल',
        trend: 'down',
        updatedAt: 'आज, सुबह 08:45 बजे',
        nearbyMarkets: [
          { mandi: 'लातूर एपीएमसी', price: 4940, distance: '120 किमी' },
          { mandi: 'धुले मंडी', price: 4850, distance: '65 किमी' },
        ],
      },
      {
        id: 'mandi-4',
        crop: 'चना (ग्राम)',
        mandi: 'संबलपुर नियमित बाजार',
        district: 'संबलपुर',
        state: 'ओडिशा',
        currentPrice: 5440,
        minPrice: 5300,
        maxPrice: 5500,
        unit: '₹/क्विंटल',
        trend: 'stable',
        updatedAt: 'कल',
        nearbyMarkets: [
          { mandi: 'बरगढ़ एपीएमसी', price: 5460, distance: '38 किमी' },
        ],
      },
    ];
  }
  if (lang === 'mr') {
    return [
      {
        id: 'mandi-1',
        crop: 'भात / धान',
        mandi: 'रायगडा मुख्य मंडी',
        district: 'रायगडा',
        state: 'ओडिशा',
        currentPrice: 2300,
        minPrice: 2180,
        maxPrice: 2350,
        unit: '₹/क्विंटल',
        trend: 'up',
        updatedAt: 'आज, सकाळी ०९:३०',
        nearbyMarkets: [
          { mandi: 'कोरापुट मार्केट', price: 2320, distance: '४५ किमी' },
          { mandi: 'गुनुपूर यार्ड', price: 2280, distance: '५८ किमी' },
        ],
      },
      {
        id: 'mandi-2',
        crop: 'कापूस',
        mandi: 'गुनुपूर कापूस मंडी',
        district: 'रायगडा',
        state: 'ओडिशा',
        currentPrice: 7120,
        minPrice: 6950,
        maxPrice: 7250,
        unit: '₹/क्विंटल',
        trend: 'up',
        updatedAt: 'आज, सकाळी १०:१५',
        nearbyMarkets: [
          { mandi: 'केसिंगा मंडी', price: 7180, distance: '८२ किमी' },
          { mandi: 'भवानीपटना यार्ड', price: 7080, distance: '९५ किमी' },
        ],
      },
      {
        id: 'mandi-3',
        crop: 'सोयाबीन',
        mandi: 'कृषी उत्पन्न बाजार समिती नाशिक',
        district: 'नाशिक',
        state: 'महाराष्ट्र',
        currentPrice: 4890,
        minPrice: 4700,
        maxPrice: 4950,
        unit: '₹/क्विंटल',
        trend: 'down',
        updatedAt: 'आज, सकाळी ०८:४५',
        nearbyMarkets: [
          { mandi: 'लातूर एपीएमसी', price: 4940, distance: '१२० किमी' },
          { mandi: 'धुळे मंडी', price: 4850, distance: '६५ किमी' },
        ],
      },
      {
        id: 'mandi-4',
        crop: 'हरभरा (चना)',
        mandi: 'संबलपूर मार्केट',
        district: 'संबलपूर',
        state: 'ओडिशा',
        currentPrice: 5440,
        minPrice: 5300,
        maxPrice: 5500,
        unit: '₹/क्विंटल',
        trend: 'stable',
        updatedAt: 'काल',
        nearbyMarkets: [
          { mandi: 'बारगढ एपीएमसी', price: 5460, distance: '३८ किमी' },
        ],
      },
    ];
  }
  if (lang === 'or') {
    return [
      {
        id: 'mandi-1',
        crop: 'ଧାନ (Paddy)',
        mandi: 'ରାୟଗଡ଼ା ମୁଖ୍ୟ ମଣ୍ଡି',
        district: 'ରାୟଗଡ଼ା',
        state: 'ଓଡ଼ିଶା',
        currentPrice: 2300,
        minPrice: 2180,
        maxPrice: 2350,
        unit: '₹/କ୍ୱିଣ୍ଟାଲ',
        trend: 'up',
        updatedAt: 'ଆଜି, ସକାଳ ୦୯:୩୦',
        nearbyMarkets: [
          { mandi: 'କୋରାପୁଟ କେନ୍ଦ୍ରୀୟ ବଜାର', price: 2320, distance: '୪୫ କିମି' },
          { mandi: 'ଗୁଣୁପୁର ୟାର୍ଡ', price: 2280, distance: '୫୮ କିମି' },
        ],
      },
      {
        id: 'mandi-2',
        crop: 'କପା (Cotton)',
        mandi: 'ଗୁଣୁପୁର କପା ମଣ୍ଡି',
        district: 'ରାୟଗଡ଼ା',
        state: 'ଓଡ଼ିଶା',
        currentPrice: 7120,
        minPrice: 6950,
        maxPrice: 7250,
        unit: '₹/କ୍ୱିଣ୍ଟାଲ',
        trend: 'up',
        updatedAt: 'ଆଜି, ସକାଳ ୧୦:୧୫',
        nearbyMarkets: [
          { mandi: 'କେସିଙ୍ଗା ମଣ୍ଡି', price: 7180, distance: '୮୨ କିମି' },
          { mandi: 'ଭବାନୀପାଟଣା ୟାର୍ଡ', price: 7080, distance: '୯୫ କିମି' },
        ],
      },
      {
        id: 'mandi-3',
        crop: 'ସୋୟାବିନ୍',
        mandi: 'ନାସିକ APMC',
        district: 'ନାସିକ',
        state: 'ମହାରାଷ୍ଟ୍ର',
        currentPrice: 4890,
        minPrice: 4700,
        maxPrice: 4950,
        unit: '₹/କ୍ୱିଣ୍ଟାଲ',
        trend: 'down',
        updatedAt: 'ଆଜି, ସକାଳ ୦୮:୪୫',
        nearbyMarkets: [
          { mandi: 'ଲାତୁର APMC', price: 4940, distance: '୧୨୦ କିମି' },
          { mandi: 'ଧୁଲେ ମଣ୍ଡି', price: 4850, distance: '୬୫ କିମି' },
        ],
      },
      {
        id: 'mandi-4',
        crop: 'ଚଣା (Gram)',
        mandi: 'ସମ୍ବଲପୁର ବଜାର',
        district: 'ସମ୍ବଲପୁର',
        state: 'ଓଡ଼ିଶା',
        currentPrice: 5440,
        minPrice: 5300,
        maxPrice: 5500,
        unit: '₹/କ୍ୱିଣ୍ଟାଲ',
        trend: 'stable',
        updatedAt: 'ଗତକାଲି',
        nearbyMarkets: [
          { mandi: 'ବରଗଡ଼ APMC', price: 5460, distance: '୩୮ କିମି' },
        ],
      },
    ];
  }

  return [
    {
      id: 'mandi-1',
      crop: 'Paddy (Dhan)',
      mandi: 'Rayagada Main Mandi',
      district: 'Rayagada',
      state: 'Odisha',
      currentPrice: 2300,
      minPrice: 2180,
      maxPrice: 2350,
      unit: '₹/quintal',
      trend: 'up',
      updatedAt: 'Today, 09:30 AM',
      nearbyMarkets: [
        { mandi: 'Koraput Central Market', price: 2320, distance: '45 km' },
        { mandi: 'Gunupur Yard', price: 2280, distance: '58 km' },
      ],
    },
    {
      id: 'mandi-2',
      crop: 'Cotton (Kapas)',
      mandi: 'Gunupur Cotton Mandi',
      district: 'Rayagada',
      state: 'Odisha',
      currentPrice: 7120,
      minPrice: 6950,
      maxPrice: 7250,
      unit: '₹/quintal',
      trend: 'up',
      updatedAt: 'Today, 10:15 AM',
      nearbyMarkets: [
        { mandi: 'Kesinga Mandi', price: 7180, distance: '82 km' },
        { mandi: 'Bhawanipatna Yard', price: 7080, distance: '95 km' },
      ],
    },
    {
      id: 'mandi-3',
      crop: 'Soybean',
      mandi: 'APMC Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      currentPrice: 4890,
      minPrice: 4700,
      maxPrice: 4950,
      unit: '₹/quintal',
      trend: 'down',
      updatedAt: 'Today, 08:45 AM',
      nearbyMarkets: [
        { mandi: 'Latur APMC', price: 4940, distance: '120 km' },
        { mandi: 'Dhule Mandi', price: 4850, distance: '65 km' },
      ],
    },
    {
      id: 'mandi-4',
      crop: 'Gram (Chana)',
      mandi: 'Sambalpur Regulated Market',
      district: 'Sambalpur',
      state: 'Odisha',
      currentPrice: 5440,
      minPrice: 5300,
      maxPrice: 5500,
      unit: '₹/quintal',
      trend: 'stable',
      updatedAt: 'Yesterday',
      nearbyMarkets: [
        { mandi: 'Bargarh APMC', price: 5460, distance: '38 km' },
      ],
    },
  ];
}

function getAINewsArticles(lang: string): AINewsArticle[] {
  if (lang === 'hi') {
    return [
      {
        id: 'news-ai-1',
        title: 'ओडिशा कृषि विभाग द्वारा पावर टिलर और पैडी रीपर पर 50% सब्सिडी की शुरुआत (2026)',
        source: 'AGRISNET ओडिशा अधिसूचना',
        publishedDate: '20 सितंबर, 2026',
        district: 'रायगड़ा / ओडिशा राज्य',
        category: 'Subsidy',
        aiWhatItMeans: 'ओडिशा के पात्र छोटे और सीमांत किसान बैंक सब्सिडी के माध्यम से आधी कीमत पर अनुमोदित कृषि मशीनरी खरीद सकते हैं।',
        aiWhoBenefits: 'वैध ओडिशा किसान आईडी और आधार-लिंक्ड बैंक खाते वाले पंजीकृत किसान।',
        aiWhatYouShouldDo: 'agrisnetodisha.ori.nic.in पर अपनी किसान आईडी जांचें और 30 सितंबर से पहले मो सेवा केंद्र में ऑनलाइन आवेदन जमा करें।',
        officialLink: 'https://agrisnetodisha.ori.nic.in',
        audioText: 'ओडिशा में कृषि उपकरणों पर 50 प्रतिशत सब्सिडी की घोषणा। 30 सितंबर से पहले मो सेवा केंद्र में आवेदन करें।',
      },
      {
        id: 'news-ai-2',
        title: 'सरकार ने सूरजमुखी और चने की एमएसपी खरीद परिचालन को मंजूरी दी (2026)',
        source: 'कृषि मंत्रालय प्रेस विज्ञप्ति',
        publishedDate: '19 सितंबर, 2026',
        district: 'सभी जिले',
        category: 'Procurement',
        aiWhatItMeans: 'सरकारी खरीद केंद्र किसानों से सीधे चना ₹5,440/क्विंटल और सूरजमुखी ₹6,760/क्विंटल पर खरीदेंगे।',
        aiWhoBenefits: 'ओडिशा, महाराष्ट्र और कर्नाटक के दलहन और तिलहन किसान।',
        aiWhatYouShouldDo: 'कटाई से पहले स्थानीय पैक्स या मंडी पोर्टल पर अपने भूमि सर्वेक्षण विवरण का पंजीकरण करें।',
        officialLink: 'https://agricoop.nic.in',
        audioText: 'चने और सूरजमुखी के लिए एमएसपी खरीद की मंजूरी। अपने नजदीकी केंद्र पर पंजीकरण कराएं।',
      },
    ];
  }
  if (lang === 'mr') {
    return [
      {
        id: 'news-ai-1',
        title: 'ओडिशा कृषी विभागाकडून पॉवर टिलर व भात कापणी यंत्रावर ५०% अनुदान जाहीर (२०२६)',
        source: 'ॲग्रिसनेट सूचना',
        publishedDate: '२० सप्टेंबर, २०२६',
        district: 'रायगडा / ओडिशा राज्य',
        category: 'Subsidy',
        aiWhatItMeans: 'ओडिशातील पात्र लहान व अल्पभूधारक शेतकरी थेट बँकेद्वारे ५०% सवलतीत कृषी यंत्रे खरेदी करू शकतात.',
        aiWhoBenefits: 'वैध शेतकरी आयडी व आधार जोडलेले बँक खाते असलेले नोंदणीकृत शेतकरी.',
        aiWhatYouShouldDo: '३० सप्टेंबरपूर्वी मो सेवा केंद्रात ऑनलाइन अर्ज सादर करा.',
        officialLink: 'https://agrisnetodisha.ori.nic.in',
        audioText: 'कृषी यंत्रांवर ५० टक्के अनुदान. ३० सप्टेंबरपूर्वी अर्ज करा.',
      },
      {
        id: 'news-ai-2',
        title: 'शासनाकडून हरभरा व सूर्यफूल पिकांच्या हमीभाव खरेदीला मंजुरी (२०२६)',
        source: 'कृषी मंत्रालय',
        publishedDate: '१९ सप्टेंबर, २०२६',
        district: 'सर्व जिल्हे',
        category: 'Procurement',
        aiWhatItMeans: 'शासकीय खरेदी केंद्रांवर हरभरा ₹५,४४०/क्विंटल आणि सूर्यफूल ₹६,७६०/क्विंटल दराने थेट खरेदी केले जाईल.',
        aiWhoBenefits: 'महाराष्ट्र, ओडिशा व कर्नाटकातील डाळ व तेलबिया उत्पादक शेतकरी.',
        aiWhatYouShouldDo: 'काढणीपूर्वी आपल्या स्थानिक सोसायटी किंवा मंडी पोर्टलवर जमीन नोंदणी पूर्ण करा.',
        officialLink: 'https://agricoop.nic.in',
        audioText: 'हमीभावाने हरभरा व सूर्यफूल खरेदीस मंजुरी.',
      },
    ];
  }
  if (lang === 'or') {
    return [
      {
        id: 'news-ai-1',
        title: 'ଓଡ଼ିଶା କୃଷି ବିଭାଗ ଦ୍ୱାରା ପାୱାର ଟିଲର ଓ ଧାନ କଟା ମେସିନ୍ ଉପରେ ୫୦% ସବସିଡି (୨୦୨୬)',
        source: 'AGRISNET ଓଡ଼ିଶା ବିଜ୍ଞପ୍ତି',
        publishedDate: '୨୦ ସେପ୍ଟେମ୍ବର, ୨୦୨୬',
        district: 'ରାୟଗଡ଼ା / ଓଡ଼ିଶା ରାଜ୍ୟ',
        category: 'Subsidy',
        aiWhatItMeans: 'ଓଡ଼ିଶାର କ୍ଷୁଦ୍ର ଓ ନାମମାତ୍ର ଚାଷୀ ଅଧା ଦାମ୍‌ରେ କୃଷି ଯନ୍ତ୍ରପାତି କିଣିପାରିବେ।',
        aiWhoBenefits: 'ବୈଧ ଓଡ଼ିଶା ଫାର୍ମର ID ଏବଂ ଆଧାର ସଂଯୋଗ ବ୍ୟାଙ୍କ ଖାତା ଥିବା ଚାଷୀ।',
        aiWhatYouShouldDo: 'ସେପ୍ଟେମ୍ବର ୩୦ ପୂର୍ବରୁ ମୋ ସେବା କେନ୍ଦ୍ରରେ ଅନଲାଇନ୍ ଆବେଦନ କରନ୍ତୁ।',
        officialLink: 'https://agrisnetodisha.ori.nic.in',
        audioText: 'କୃଷି ଯନ୍ତ୍ରପାତି ଉପରେ ୫୦ ପ୍ରତିଶତ ସବସିଡି। ମୋ ସେବା କେନ୍ଦ୍ରରେ ଆବେଦନ କରନ୍ତୁ।',
      },
      {
        id: 'news-ai-2',
        title: 'ସରକାରଙ୍କ ଦ୍ୱାରା ରାଶି ଓ ଚଣା MSP କ୍ରୟ ଅପରେସନ ଅନୁମୋଦିତ (୨୦୨୬)',
        source: 'କୃଷି ମନ୍ତ୍ରଣାଳୟ ପ୍ରେସ ବିଜ୍ଞପ୍ତି',
        publishedDate: '୧୯ ସେପ୍ଟେମ୍ବର, ୨୦୨୬',
        district: 'ସମସ୍ତ ଜିଲ୍ଲା',
        category: 'Procurement',
        aiWhatItMeans: 'ସରକାରୀ କ୍ରୟ କେନ୍ଦ୍ରଗୁଡ଼ିକ ଚଣା ₹୫,୪୪୦/କ୍ୱିଣ୍ଟାଲ ଦରରେ ସିଧାସଳଖ କିଣିବେ।',
        aiWhoBenefits: 'ଓଡ଼ିଶା, ମହାରାଷ୍ଟ୍ର ଓ କର୍ଣ୍ଣାଟକର ଡାଲି ଏବଂ ତୈଳବୀଜ ଚାଷୀ।',
        aiWhatYouShouldDo: 'ଫସଲ ଅମଳ ପୂର୍ବରୁ ଆପଣଙ୍କ ସ୍ଥାନୀୟ PACS କିମ୍ବା ମଣ୍ଡି ପୋର୍ଟାଲରେ ଜମି ପଞ୍ଜୀକରଣ କରନ୍ତୁ।',
        officialLink: 'https://agricoop.nic.in',
        audioText: 'ଚଣା ଓ ରାଶି ଫସଲ ପାଇଁ MSP କ୍ରୟ ଅନୁମୋଦିତ।',
      },
    ];
  }

  return [
    {
      id: 'news-ai-1',
      title: 'Odisha Agriculture Dept Launches 50% Subsidy on Power Tillers & Paddy Reapers (2026)',
      source: 'AGRISNET Odisha Notification',
      publishedDate: 'Sept 20, 2026',
      district: 'Rayagada / Odisha State',
      category: 'Subsidy',
      aiWhatItMeans: 'Eligible small & marginal farmers in Odisha can purchase approved farm machinery at half price via direct bank subsidy.',
      aiWhoBenefits: 'Registered farmers holding valid Odisha Farmer ID & Aadhaar-linked bank account.',
      aiWhatYouShouldDo: 'Check your Farmer ID on agrisnetodisha.ori.nic.in and submit online application at Mo Seba Kendra before Sept 30.',
      officialLink: 'https://agrisnetodisha.ori.nic.in',
      audioText: '50 percent subsidy on farm machinery announced in Odisha. Apply at Mo Seba Kendra before September 30.',
    },
    {
      id: 'news-ai-2',
      title: 'Government Approves MSP Procurement Operations for Sunflower & Gram (2026)',
      source: 'Ministry of Agriculture Press Release',
      publishedDate: 'Sept 19, 2026',
      district: 'All Districts',
      category: 'Procurement',
      aiWhatItMeans: 'Government procurement centers will purchase Gram at ₹5,440/qtl and Sunflower at ₹6,760/qtl directly from farmers.',
      aiWhoBenefits: 'Pulse and Oilseed farmers in Odisha, Maharashtra, and Karnataka.',
      aiWhatYouShouldDo: 'Register your land survey details at local PACS or Mandi portal prior to harvesting.',
      officialLink: 'https://agricoop.nic.in',
      audioText: 'Government approves MSP procurement for Gram and Sunflower. Register land details at your local Mandi.',
    },
  ];
}

function getMSPUpdates(lang: string): MSPUpdate[] {
  if (lang === 'hi') {
    return [
      {
        id: 'msp-1',
        crop: 'धान (सामान्य ग्रेड)',
        mspPrice: 2300,
        procurementStatus: 'सक्रिय पंजीकरण जारी',
        centersCount: 42,
        registrationDeadline: '15 अक्टूबर, 2026',
        documents: ['आधार कार्ड', 'जमीन खतियान', 'बैंक पासबुक', 'किसान आईडी'],
        approvedStates: ['ओडिशा', 'महाराष्ट्र', 'आंध्र प्रदेश', 'पंजाब'],
      },
      {
        id: 'msp-2',
        crop: 'चना (ग्राम)',
        mspPrice: 5440,
        procurementStatus: '2026 एमएसपी स्वीकृत (₹4,886 करोड़ का समर्थन)',
        centersCount: 28,
        registrationDeadline: '01 नवंबर, 2026',
        documents: ['आधार कार्ड', 'भूमि प्रमाणपत्र', 'बैंक पासबुक'],
        approvedStates: ['महाराष्ट्र', 'कर्नाटक', 'ओडिशा'],
      },
      {
        id: 'msp-3',
        crop: 'सूरजमुखी (सनफ्लावर)',
        mspPrice: 6760,
        procurementStatus: '2026 एमएसपी स्वीकृत',
        centersCount: 18,
        registrationDeadline: '30 अक्टूबर, 2026',
        documents: ['आधार कार्ड', 'फसल निरीक्षण पर्ची'],
        approvedStates: ['कर्नाटक', 'ओडिशा', 'महाराष्ट्र'],
      },
    ];
  }
  if (lang === 'mr') {
    return [
      {
        id: 'msp-1',
        crop: 'भात / धान (साधारण)',
        mspPrice: 2300,
        procurementStatus: 'नोंदणी सुरू आहे',
        centersCount: 42,
        registrationDeadline: '१५ ऑक्टोबर, २०२६',
        documents: ['आधार कार्ड', '७/१२ उतारा', 'बँक पासबुक', 'शेतकरी आयडी'],
        approvedStates: ['ओडिशा', 'महाराष्ट्र', 'आंध्र प्रदेश', 'पंजाब'],
      },
      {
        id: 'msp-2',
        crop: 'हरभरा (चना)',
        mspPrice: 5440,
        procurementStatus: '२०२६ हमीभाव मंजूर',
        centersCount: 28,
        registrationDeadline: '०१ नोव्हेंबर, २०२६',
        documents: ['आधार कार्ड', 'जमीन दाखला', 'बँक पासबुक'],
        approvedStates: ['महाराष्ट्र', 'कर्नाटक', 'ओडिशा'],
      },
      {
        id: 'msp-3',
        crop: 'सूर्यफूल',
        mspPrice: 6760,
        procurementStatus: '२०२६ हमीभाव मंजूर',
        centersCount: 18,
        registrationDeadline: '३० ऑक्टोबर, २०२६',
        documents: ['आधार कार्ड', 'पीक पाहणी नोंद'],
        approvedStates: ['कर्नाटक', 'ओडिशा', 'महाराष्ट्र'],
      },
    ];
  }
  if (lang === 'or') {
    return [
      {
        id: 'msp-1',
        crop: 'ଧାନ (Paddy)',
        mspPrice: 2300,
        procurementStatus: 'ସକ୍ରିୟ ପଞ୍ଜୀକରଣ ଚାଲୁଅଛି',
        centersCount: 42,
        registrationDeadline: '୧୫ ଅକ୍ଟୋବର, ୨୦୨୬',
        documents: ['ଆଧାର କାର୍ଡ', 'ଜମି ପଟ୍ଟା / ଖତିୟାନ', 'ବ୍ୟାଙ୍କ ପାସବୁକ', 'ଫାର୍ମର ID'],
        approvedStates: ['ଓଡ଼ିଶା', 'ମହାରାଷ୍ଟ୍ର', 'ଆନ୍ଧ୍ର ପ୍ରଦେଶ', 'ପଞ୍ଜାବ'],
      },
      {
        id: 'msp-2',
        crop: 'ଚଣା (Gram)',
        mspPrice: 5440,
        procurementStatus: '୨୦୨୬ MSP ଅନୁମୋଦିତ (₹୪,୮୮୬ କୋଟି ସହାୟତା)',
        centersCount: 28,
        registrationDeadline: '୦୧ ନଭେମ୍ବର, ୨୦୨୬',
        documents: ['ଆଧାର କାର୍ଡ', 'ଜମି ପ୍ରମାଣପତ୍ର', 'ବ୍ୟାଙ୍କ ପାସବୁକ'],
        approvedStates: ['ମହାରାଷ୍ଟ୍ର', 'କର୍ଣ୍ଣାଟକ', 'ଓଡ଼ିଶା'],
      },
      {
        id: 'msp-3',
        crop: 'ସୂର୍ଯ୍ୟମୁଖୀ',
        mspPrice: 6760,
        procurementStatus: '୨୦୨୬ MSP ଅନୁମୋଦିତ',
        centersCount: 18,
        registrationDeadline: '୩୦ ଅକ୍ଟୋବର, ୨୦୨୬',
        documents: ['ଆଧାର କାର୍ଡ', 'ଫସଲ ଯାଞ୍ଚ ରସିଦ'],
        approvedStates: ['କର୍ଣ୍ଣାଟକ', 'ଓଡ଼ିଶା', 'ମହାରାଷ୍ଟ୍ର'],
      },
    ];
  }

  return [
    {
      id: 'msp-1',
      crop: 'Paddy (Common Grade)',
      mspPrice: 2300,
      procurementStatus: 'Active Registration Open',
      centersCount: 42,
      registrationDeadline: 'Oct 15, 2026',
      documents: ['Aadhaar Card', 'Land RoR / Khatian', 'Bank Passbook', 'Farmer ID'],
      approvedStates: ['Odisha', 'Maharashtra', 'Andhra Pradesh', 'Punjab'],
    },
    {
      id: 'msp-2',
      crop: 'Gram (Chana)',
      mspPrice: 5440,
      procurementStatus: '2026 MSP Approved (Support worth ₹4,886 Cr)',
      centersCount: 28,
      registrationDeadline: 'Nov 01, 2026',
      documents: ['Aadhaar Card', 'Land Certificate', 'Bank Passbook'],
      approvedStates: ['Maharashtra', 'Karnataka', 'Odisha'],
    },
    {
      id: 'msp-3',
      crop: 'Sunflower',
      mspPrice: 6760,
      procurementStatus: '2026 MSP Approved',
      centersCount: 18,
      registrationDeadline: 'Oct 30, 2026',
      documents: ['Aadhaar Card', 'Crop Inspection Slip'],
      approvedStates: ['Karnataka', 'Odisha', 'Maharashtra'],
    },
  ];
}

export default function GramSathiFarmerAdvisories() {
  const { language } = useAuth();
  const i18n = ADVISORIES_I18N[language] || ADVISORIES_I18N['hi'] || ADVISORIES_I18N['en'];

  const [activeTab, setActiveTab] = useState<'for_you' | 'mandi' | 'ai_news' | 'weather' | 'msp' | 'agrisnet'>('for_you');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isFarmAlertModalOpen, setIsFarmAlertModalOpen] = useState<boolean>(false);

  const [filterState, setFilterState] = useState({
    district: 'Rayagada',
    crop: 'Paddy',
    growthStage: 'Tillering',
    landSize: '3.5 Acres',
  });

  const mandiPrices = getMandiPrices(language);
  const aiNewsArticles = getAINewsArticles(language);
  const mspUpdates = getMSPUpdates(language);

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-md p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
            {i18n.headerTag}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {i18n.headerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {i18n.headerSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsFarmAlertModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Filter className="w-4 h-4" />
            {i18n.customizeBtn}
          </button>
        </div>
      </div>

      {/* Hero "For You" Daily Digest (GOOD MORNING, FARMER) */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-green-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-emerald-700/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/50 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌅</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-emerald-300">
                {i18n.goodMorning}
              </h3>
              <p className="text-xs text-emerald-200">
                📍 Location: <strong>{filterState.district}, Odisha</strong> • Crop: <strong>{filterState.crop}</strong> ({filterState.growthStage})
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30">
            {i18n.liveDailyFeed}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Weather Alert */}
          <div className="bg-emerald-950/70 p-3.5 rounded-xl border border-amber-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5" /> WEATHER ALERT
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.5 rounded">High Rain</span>
            </div>
            <p className="text-xs text-white font-semibold">{i18n.weatherAlertTitle}</p>
            <p className="text-[11px] text-emerald-200 line-clamp-2">{i18n.weatherAlertDesc}</p>
          </div>

          {/* Market Update */}
          <div className="bg-emerald-950/70 p-3.5 rounded-xl border border-emerald-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> MARKET UPDATE
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded">↑ ₹2,300/qtl</span>
            </div>
            <p className="text-xs text-white font-semibold">{i18n.marketUpdateTitle}</p>
            <p className="text-[11px] text-emerald-200">{i18n.marketUpdateDesc}</p>
          </div>

          {/* Crop Advisory */}
          <div className="bg-emerald-950/70 p-3.5 rounded-xl border border-blue-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                <Wheat className="w-3.5 h-3.5" /> CROP ADVISORY
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-200 px-1.5 py-0.5 rounded">Tillering Stage</span>
            </div>
            <p className="text-xs text-white font-semibold">{i18n.cropAdvisoryTitle}</p>
            <p className="text-[11px] text-emerald-200">{i18n.cropAdvisoryDesc}</p>
          </div>

          {/* Government Notice */}
          <div className="bg-emerald-950/70 p-3.5 rounded-xl border border-purple-500/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> GOVT UPDATE
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded">AGRISNET</span>
            </div>
            <p className="text-xs text-white font-semibold">{i18n.govtUpdateTitle}</p>
            <p className="text-[11px] text-emerald-200">{i18n.govtUpdateDesc}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-2 scrollbar-none">
        {[
          { id: 'for_you', label: i18n.tabForYou, icon: Sparkles },
          { id: 'mandi', label: i18n.tabMandi, icon: TrendingUp },
          { id: 'ai_news', label: i18n.tabAiNews, icon: Sparkles },
          { id: 'weather', label: i18n.tabWeather, icon: CloudRain },
          { id: 'msp', label: i18n.tabMsp, icon: DollarSign },
          { id: 'agrisnet', label: i18n.tabAgrisnet, icon: Building2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Mandi & Market Prices */}
      {(activeTab === 'for_you' || activeTab === 'mandi') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              {i18n.mandiHeader}
            </h3>
            <span className="text-xs text-gray-400">{i18n.updatedDaily}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mandiPrices.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-emerald-50/20 via-white to-gray-50/60 hover:border-emerald-300 transition-all hover:shadow-md space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.state} • {item.district}
                    </span>
                    <h4 className="font-extrabold text-gray-900 text-base mt-1">{item.crop}</h4>
                    <p className="text-xs text-gray-500 font-medium">{item.mandi}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-700">₹{item.currentPrice.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400">{item.unit}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-0.5">
                      {item.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <Minus className="w-3 h-3 text-gray-500" />}
                      {item.trend === 'up' ? i18n.priceIncreasing : item.trend === 'down' ? i18n.priceDecreasing : i18n.priceStable}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">{i18n.minPrice}</span>
                    <span className="font-bold text-gray-700">₹{item.minPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">{i18n.maxPrice}</span>
                    <span className="font-bold text-gray-700">₹{item.maxPrice}</span>
                  </div>
                </div>

                {/* Nearby Markets Comparison */}
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{i18n.nearbyComparison}</p>
                  {item.nearbyMarkets.map((nb, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600 bg-white p-1.5 rounded-lg border border-gray-100">
                      <span>{nb.mandi} ({nb.distance})</span>
                      <strong className="text-emerald-800">₹{nb.price}/qtl</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI News Summarizer (RAW NEWS -> AI -> FARMER ACTION) */}
      {(activeTab === 'for_you' || activeTab === 'ai_news' || activeTab === 'agrisnet') && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              {i18n.aiNewsHeader}
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">{i18n.verifiedBadge}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiNewsArticles.map(article => (
              <div
                key={article.id}
                className="p-5 rounded-2xl border border-emerald-100 bg-white hover:border-emerald-300 transition-all hover:shadow-md space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {article.category}
                  </span>
                  <span className="text-gray-400">{article.publishedDate}</span>
                </div>

                <h4 className="font-bold text-gray-900 text-sm leading-snug">{article.title}</h4>

                {/* AI Summary 3-Box Format */}
                <div className="space-y-2 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-3 rounded-xl border border-emerald-100/80 text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block mb-0.5">{i18n.whatItMeans}</span>
                    <p className="text-emerald-950 leading-relaxed">{article.aiWhatItMeans}</p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 block mb-0.5">{i18n.whoBenefits}</span>
                    <p className="text-emerald-950">{article.aiWhoBenefits}</p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 block mb-0.5">{i18n.whatYouShouldDo}</span>
                    <p className="text-emerald-950 font-medium">{article.aiWhatYouShouldDo}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">{article.source}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(article.audioText, article.id)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      {speakingId === article.id ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
                      {speakingId === article.id ? i18n.stop : i18n.listen}
                    </button>
                    <a
                      href={article.officialLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      {i18n.portal} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MSP Updates */}
      {(activeTab === 'for_you' || activeTab === 'msp') && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              {i18n.mspHeader}
            </h3>
            <span className="text-xs text-gray-400">{i18n.approvedRates}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mspUpdates.map(msp => (
              <div
                key={msp.id}
                className="p-4 rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30 space-y-3"
              >
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{msp.crop}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {msp.procurementStatus}
                  </span>
                </div>

                <div className="bg-emerald-600 text-white p-3 rounded-xl text-center">
                  <span className="text-2xl font-black">₹{msp.mspPrice.toLocaleString('en-IN')}</span>
                  <span className="text-xs block text-emerald-100">/quintal MSP 2026</span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <p><strong>{i18n.deadline}</strong> {msp.registrationDeadline}</p>
                  <p><strong>{i18n.procurementCenters}</strong> {msp.centersCount} Mandis open</p>
                  <p><strong>{i18n.approvedStates}</strong> {msp.approvedStates.join(', ')}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 text-xs">
                  <p className="font-bold text-gray-700 mb-1">{i18n.requiredDocs}</p>
                  <div className="flex flex-wrap gap-1">
                    {msp.documents.map((doc, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded font-medium">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
