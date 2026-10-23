// ============================================================
// GRAMSATHI AI — Mock Data Library
// Realistic demo data for all Indian states and crops
// ============================================================

import type {
  User, Farm, Crop, Diagnosis, AIResult, RiskScore, PestTrap,
  Alert, Advisory, HotspotData, Notification, SensorData,
  FieldVisit, Case, EmergencySOP, DashboardStats, WeatherData,
  GovernmentScheme, LocalPrecaution, FarmerNews
} from '@/types';

// ── Demo Users ────────────────────────────────────────────────
export const DEMO_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ramesh Patil',
    email: 'farmer@demo.com',
    role: 'farmer',
    language: 'mr',
    phone: '+91-9876543210',
    state: 'Maharashtra',
    district: 'Pune',
    avatar: undefined,
    createdAt: '2024-03-15',
  },
  {
    id: 'u2',
    name: 'Suresh Kumar',
    email: 'worker@demo.com',
    role: 'extension_worker',
    language: 'hi',
    phone: '+91-9876543211',
    state: 'Maharashtra',
    district: 'Nashik',
    avatar: undefined,
    createdAt: '2024-01-10',
  },
  {
    id: 'u3',
    name: 'Dr. Priya Sharma',
    email: 'expert@demo.com',
    role: 'expert',
    language: 'en',
    phone: '+91-9876543212',
    state: 'Maharashtra',
    district: 'Pune',
    avatar: undefined,
    createdAt: '2023-11-20',
  },
  {
    id: 'u4',
    name: 'Collector Rajesh Yadav',
    email: 'admin@demo.com',
    role: 'admin',
    language: 'en',
    phone: '+91-9876543213',
    state: 'Maharashtra',
    district: 'Mumbai',
    avatar: undefined,
    createdAt: '2023-08-01',
  },
];

// ── Demo Farms ────────────────────────────────────────────────
export const DEMO_FARMS: Farm[] = [
  {
    id: 'f1',
    farmerId: 'u1',
    name: 'Patil Rice Farm',
    location: 'Shirur, Pune, Maharashtra',
    lat: 18.8309,
    lng: 74.3677,
    area: 3.5,
    areaUnit: 'acres',
    soilType: 'Black Cotton Soil',
    irrigationType: 'Canal',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Shirur',
    village: 'Koregaon Bhima',
    healthStatus: 'high',
    createdAt: '2024-06-01',
  },
  {
    id: 'f2',
    farmerId: 'u1',
    name: 'Patil Soybean Field',
    location: 'Daund, Pune, Maharashtra',
    lat: 18.4625,
    lng: 74.5831,
    area: 2.0,
    areaUnit: 'acres',
    soilType: 'Red Laterite Soil',
    irrigationType: 'Drip',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Daund',
    village: 'Yavat',
    healthStatus: 'medium',
    createdAt: '2024-06-01',
  }
];

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  mr: 'मराठी (Marathi)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  kn: 'ಕನ್ನಡ (Kannada)',
  bn: 'বাংলা (Bengali)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  or: 'ଓଡ଼ିଆ (Odia)',
};

// ── Demo Government Welfare Schemes (12 Core MVP Schemes) ────
export const DEMO_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  // 🌾 1. FARMER SCHEMES
  {
    id: 'pm-kisan',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    shortDesc: '₹6,000 per year direct income support paid in 3 equal installments of ₹2,000 directly into Aadhaar-linked bank accounts.',
    category: 'General Rural',
    ruralCategory: 'Farmer Schemes',
    stateScope: 'All India',
    benefits: [
      '₹6,000/year direct financial support in 3 equal installments.',
      '100% DBT credit into Aadhaar-seeded bank account without intermediaries.',
      'Approved extension for 2026-27 through 2030-31.'
    ],
    eligibility: 'All landholding farmer families with cultivable land in their name.',
    eligibilityCriteria: {
      requiresLand: true,
      occupations: ['Small Farmer', 'Marginal Farmer'],
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'Land RoR / Khatian Record', 'Bank Passbook Copy', 'Mobile Number'],
    howToApply: [
      'Register online via pmkisan.gov.in portal or PM-KISAN mobile app.',
      'Verification by local Nodal Officer / Revenue Department.',
      'e-KYC authentication via Aadhaar OTP or CSC biometrics.'
    ],
    officialLink: 'https://pmkisan.gov.in',
    assistanceCenter: 'Common Services Center (CSC) / Agriculture Office',
    helpline: '155261 / 011-24300606',
    icon: '🌾',
    isPopular: true,
  },
  {
    id: 'cm-kisan-odisha',
    title: 'CM-KISAN Odisha (Krushak Assistance for Livelihood & Income Augmentation)',
    shortDesc: 'Odisha state financial & livelihood support providing DBT assistance to 41+ lakh farmer families and landless agricultural households.',
    category: 'General Rural',
    ruralCategory: 'Farmer Schemes',
    stateScope: 'Odisha',
    benefits: [
      '₹4,000/year financial assistance for small, marginal farmers and landless agricultural laborers.',
      'Direct Bank Transfer (DBT) credit into bank accounts.',
      'Additional livelihood assistance for landless households.'
    ],
    eligibility: 'Small and marginal farmers and landless agricultural households in Odisha.',
    eligibilityCriteria: {
      occupations: ['Small Farmer', 'Marginal Farmer', 'Landless Agricultural Laborer'],
      state: 'Odisha'
    },
    requiredDocuments: ['Odisha Farmer ID', 'Aadhaar Card', 'Bank Passbook (Aadhaar linked)', 'Ration Card'],
    howToApply: [
      'Check Farmer ID status on cmkisan.odisha.gov.in portal.',
      'Visit Mo Seba Kendra or Block Agriculture Office for e-KYC.',
      'DBT is directly disbursed to Aadhaar-linked accounts.'
    ],
    officialLink: 'https://cmkisan.odisha.gov.in',
    assistanceCenter: 'Mo Seba Kendra / Krushi Vigyan Kendra (KVK) / Block Agriculture Office',
    helpline: '155333',
    icon: '🏛️',
    isPopular: true,
  },
  {
    id: 'pmfby',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) - Crop Insurance',
    shortDesc: 'Comprehensive crop yield & weather-based crop risk protection covering post-harvest and unseasonal weather damage.',
    category: 'General Rural',
    ruralCategory: 'Farmer Schemes',
    stateScope: 'All India',
    benefits: [
      'Max premium: 2% for Kharif, 1.5% for Rabi crops, and 5% for commercial crops.',
      'Full financial cover for crop loss due to droughts, floods, pests & disease outbreaks.',
      'Post-harvest loss coverage up to 14 days for unseasonal rain.'
    ],
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
    eligibilityCriteria: {
      occupations: ['Small Farmer', 'Marginal Farmer', 'Tenant Farmer'],
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'Land Sowing Certificate', 'Bank Passbook', 'Khasra / RoR Copy'],
    howToApply: [
      'Apply online via pmfby.gov.in or through bank/CSC within 10 days of sowing.',
      'Pay low farmer premium online or at bank branch.',
      'Report crop damage within 72 hours via Crop Insurance app or toll-free 14447.'
    ],
    officialLink: 'https://pmfby.gov.in',
    assistanceCenter: 'CSC / District Agriculture Officer / Impaneled Insurance Co.',
    helpline: '14447 / 1800-180-1551',
    icon: '🛡️',
    isPopular: true,
  },

  // 💼 2. RURAL EMPLOYMENT
  {
    id: 'vb-g-ram-g',
    title: 'VB-G RAM G (Viksit Bharat Rural Employment Guarantee Act)',
    shortDesc: 'Statutory guarantee of 125 days of wage employment per year for rural households (upgraded from 100 days).',
    category: 'General Rural',
    ruralCategory: 'Rural Employment',
    stateScope: 'All India',
    benefits: [
      'Statutory 125 days guaranteed wage employment per financial year for rural households.',
      'Unemployment allowance if job is not provided within 15 days of application.',
      'Direct weekly wage credit into Aadhaar-seeded bank accounts.'
    ],
    eligibility: 'Adult members of any rural household willing to do public work-related unskilled manual labor.',
    eligibilityCriteria: {
      occupations: ['Rural Worker', 'Landless Agricultural Laborer', 'Unemployed Youth'],
      state: 'All India'
    },
    requiredDocuments: ['MGNREGA / VB-G RAM G Job Card', 'Aadhaar Card', 'Bank Passbook'],
    howToApply: [
      'Submit written/verbal application for work to Gram Panchayat Secretary.',
      'Receive dated receipt from Gram Panchayat.',
      'Report to designated public work site and receive weekly wages.'
    ],
    officialLink: 'https://nrega.nic.in',
    assistanceCenter: 'Gram Panchayat Office / Rozgar Sewak',
    helpline: '1800-11-1555',
    icon: '💼',
    isPopular: true,
  },

  // 👩‍🌾 3. WOMEN & SHGS
  {
    id: 'day-nrlm-lakhpati',
    title: 'DAY-NRLM & Lakhpati Didi Scheme (National Rural Livelihoods Mission)',
    shortDesc: 'Mobilizing rural women into Self Help Groups (SHGs) providing collateral-free loans up to ₹20 lakh & micro-enterprise training.',
    category: 'General Rural',
    ruralCategory: 'Women & SHGs',
    stateScope: 'All India',
    benefits: [
      'Collateral-free bank credit up to ₹20 lakh for SHGs.',
      'Lakhpati Didi skill training for micro-enterprises and Drone Didi certifications.',
      'Revolving Fund (RF) & Community Investment Fund (CIF) support.'
    ],
    eligibility: 'Rural women belonging to poor or vulnerable households forming SHGs of 10-20 members.',
    eligibilityCriteria: {
      gender: 'female',
      requiresSHG: true,
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card of Woman Member', 'SHG Member Passbook', 'Bank Account Details', 'Photo'],
    howToApply: [
      'Join or form local SHG through Community Resource Person (CRP).',
      'Maintain SHG Panchamrita (regular meeting, savings, internal lending).',
      'Submit loan proposal to Bank via Block Mission Management Unit (BMMU).'
    ],
    officialLink: 'https://nrlm.gov.in',
    assistanceCenter: 'Gram Panchayat Village Organization (VO) / Cluster Federation (CLF)',
    helpline: '1800-11-0001',
    icon: '👩‍🌾',
    isPopular: true,
  },

  // 🛠️ 4. ARTISANS & SMALL BUSINESS
  {
    id: 'pm-vishwakarma',
    title: 'PM Vishwakarma Scheme for Traditional Artisans',
    shortDesc: 'Collateral-free credit up to ₹3 lakh at 5% interest rate, free toolkit incentive of ₹15,000, and advanced skill training.',
    category: 'General Rural',
    ruralCategory: 'Artisans & Small Business',
    stateScope: 'All India',
    benefits: [
      'Collateral-free enterprise credit: ₹1 lakh (1st tranche) + ₹2 lakh (2nd tranche) at 5% interest.',
      '₹15,000 modern toolkit e-voucher incentive.',
      '5-7 days basic skill training with ₹500/day stipend.'
    ],
    eligibility: 'Artisans & craftspeople working in 18 traditional trades (Carpenter, Blacksmith, Potter, Mason, Cobbler, Tailor, Barber, etc.).',
    eligibilityCriteria: {
      minAge: 18,
      occupations: ['Carpenter', 'Blacksmith', 'Potter', 'Mason', 'Cobbler', 'Tailor', 'Barber', 'Goldsmith', 'Sculptor'],
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'Bank Passbook', 'Trade Proof / Panchayat Verification Certificate', 'Mobile Number'],
    howToApply: [
      'Visit nearest Common Services Center (CSC) with Aadhaar and mobile.',
      'Get 3-step verification completed (Gram Panchayat → District Implementation Committee).',
      'Receive PM Vishwakarma Digital ID Card and toolkit voucher.'
    ],
    officialLink: 'https://pmvishwakarma.gov.in',
    assistanceCenter: 'Common Services Center (CSC) / District Industries Center (DIC)',
    helpline: '1800-267-7777',
    icon: '🛠️',
    isPopular: true,
  },

  // 🏠 5. HOUSING
  {
    id: 'pmay-g',
    title: 'Pradhan Mantri Awaas Yojana - Gramin (PMAY-G)',
    shortDesc: 'Financial assistance of ₹1.20 lakh (plains) to ₹1.30 lakh (hilly areas) to construct a permanent pucca house with toilet.',
    category: 'General Rural',
    ruralCategory: 'Housing',
    stateScope: 'All India',
    benefits: [
      '₹1.20 lakh financial assistance in 3 installments linked to construction stages.',
      'Additional 90/95 days of unskilled wage labor under MGNREGA / VB-G RAM G.',
      '₹12,000 extra assistance for Swachh Bharat toilet construction.'
    ],
    eligibility: 'Rural households living in kutcha/dilapidated houses or homeless according to SECC/Awaas+ survey.',
    eligibilityCriteria: {
      requiresKutchaHouse: true,
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'Job Card Number', 'Bank Passbook Copy', 'Land / Homestead Ownership Document'],
    howToApply: [
      'Names are identified via Awaas+ survey at Gram Sabha level.',
      'Contact Gram Panchayat Secretary or Block Development Office (BDO).',
      'Track house construction geotagged milestones on pmayg.nic.in app.'
    ],
    officialLink: 'https://pmayg.nic.in',
    assistanceCenter: 'Gram Panchayat Secretary / Block Development Office (BDO)',
    helpline: '1800-11-6446',
    icon: '🏠',
    isPopular: true,
  },

  // 💧 6. WATER & INFRASTRUCTURE
  {
    id: 'jal-jeevan-mission',
    title: 'Jal Jeevan Mission (Har Ghar Jal)',
    shortDesc: 'Ensures functional household tap water connection (FHTC) delivering 55 liters per person per day of clean drinking water.',
    category: 'General Rural',
    ruralCategory: 'Water & Infrastructure',
    stateScope: 'All India',
    benefits: [
      'Free functional household tap water connection at home.',
      'Regular water quality testing using Field Test Kits (FTKs).',
      'Gram Panchayat Water & Sanitation Committee (VWSC) grievance handling.'
    ],
    eligibility: 'All rural households in Indian villages currently without clean tap connection.',
    eligibilityCriteria: {
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'Household Address Proof', 'Gram Panchayat Water Registration Form'],
    howToApply: [
      'Submit tap connection request to Village Water & Sanitation Committee (VWSC).',
      'Register service complaint or leak report on Jal Jeevan Mission mobile app.',
      'Track village water supply status online.'
    ],
    officialLink: 'https://ejalshakti.gov.in',
    assistanceCenter: 'Village Water & Sanitation Committee (VWSC) / Gram Panchayat',
    helpline: '1800-11-0031',
    icon: '💧',
    isPopular: true,
  },

  // 🏥 7. HEALTHCARE
  {
    id: 'pm-jay',
    title: 'Ayushman Bharat (PM-JAY) Health Insurance',
    shortDesc: '₹5 lakh health cover per family per year for secondary and tertiary cashless hospitalization at impaneled hospitals.',
    category: 'General Rural',
    ruralCategory: 'Healthcare',
    stateScope: 'All India',
    benefits: [
      '₹5,000,000 cashless health insurance cover per family annually.',
      'Covers 1,900+ medical procedures, surgeries & post-hospitalization costs.',
      'No cap on family size or age limit.'
    ],
    eligibility: 'Rural families categorized under low income or SECC criteria.',
    eligibilityCriteria: {
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'Ration Card (NFSA)', 'Ayushman Card / E-Card'],
    howToApply: [
      'Check eligibility on beneficiary.nha.gov.in using your mobile or Aadhaar.',
      'Visit nearest Ayushman Mitra at impaneled hospital or CSC to generate e-card.',
      'Present Ayushman Card during hospital admission for cashless treatment.'
    ],
    officialLink: 'https://beneficiary.nha.gov.in',
    assistanceCenter: 'Ayushman Mitra Desk at Government/Private Impaneled Hospital or CSC',
    helpline: '14555 / 1800-111-565',
    icon: '🏥',
    isPopular: true,
  },
  {
    id: 'mamata-pmmvy-odisha',
    title: 'MAMATA & PMMVY Scheme Odisha (Maternal Welfare)',
    shortDesc: 'Direct benefit transfer of ₹5,000 - ₹6,000 for pregnant and lactating mothers to improve maternal nutrition.',
    category: 'General Rural',
    ruralCategory: 'Healthcare',
    stateScope: 'Odisha',
    benefits: [
      '₹5,000 to ₹6,000 monetary incentive transferred in 2-3 installments.',
      'Covers ANC check-ups, institutional delivery, and child vaccination.',
      'Nutrition & health counseling through local Anganwadi Centers.'
    ],
    eligibility: 'Pregnant women aged 19 and above for first two live births in Odisha.',
    eligibilityCriteria: {
      gender: 'female',
      minAge: 19,
      state: 'Odisha'
    },
    requiredDocuments: ['MCP Card (Mother & Child Protection Card)', 'Aadhaar Card', 'Bank Passbook', 'Anganwadi Registration Copy'],
    howToApply: [
      'Register pregnancy within 4 months at local Anganwadi Center (AWC).',
      'Submit MCP Card checkup records to AWW (Anganwadi Worker).',
      'Installment amount is credited directly to Aadhaar-linked bank account.'
    ],
    officialLink: 'https://mamata-pmmvy.odisha.gov.in',
    assistanceCenter: 'Local Anganwadi Center (AWC) / ASHA Worker',
    helpline: '181 / 104',
    icon: '👶',
  },

  // 🎓 8. EDUCATION & SKILLS
  {
    id: 'pmkvy',
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
    shortDesc: 'Free skill training, industry certification & stipend for rural dropouts and youth in technical and agricultural trades.',
    category: 'General Rural',
    ruralCategory: 'Education & Skills',
    stateScope: 'All India',
    benefits: [
      '100% free skill training in 300+ trades (Drone technician, Organic farming, Solar technician, Electrician).',
      'Government certification recognized nationwide.',
      'Placement support & ₹8,000 skill completion bonus.'
    ],
    eligibility: 'Indian youth aged 15-45 looking for employment or skill upgrading.',
    eligibilityCriteria: {
      minAge: 15,
      maxAge: 45,
      occupations: ['Unemployed Youth', 'Student', 'Rural Worker'],
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'School/College Marksheet', 'Bank Account Details'],
    howToApply: [
      'Register on Skill India Digital portal (skillindiadigital.gov.in).',
      'Select nearest Pradhan Mantri Kaushal Kendra (PMKK) or ITI center.',
      'Complete batch enrollment and training assessment.'
    ],
    officialLink: 'https://www.skillindiadigital.gov.in',
    assistanceCenter: 'Pradhan Mantri Kaushal Kendra (PMKK) / District Skill Development Office',
    helpline: '1800-123-9626',
    icon: '🎓',
  },
  {
    id: 'ddu-gky',
    title: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)',
    shortDesc: 'Placement-linked skill training for rural poor youth with guaranteed minimum 70% job placement rate.',
    category: 'General Rural',
    ruralCategory: 'Education & Skills',
    stateScope: 'All India',
    benefits: [
      'Free residential skill training including lodging, food & uniforms.',
      'Guaranteed job placement with minimum salary standards.',
      'Post-placement financial support up to 6 months.'
    ],
    eligibility: 'Rural poor youth aged 15-35 years (up to 45 years for women, SC/ST, PwD).',
    eligibilityCriteria: {
      minAge: 15,
      maxAge: 35,
      occupations: ['Unemployed Youth', 'Rural Laborer'],
      state: 'All India'
    },
    requiredDocuments: ['Aadhaar Card', 'BPL Ration Card / MGNREGA Job Card', 'Age Proof', 'Bank Passbook'],
    howToApply: [
      'Enroll through Kaushal Panjee app or contact Block Development Office.',
      'Attend counseling session at nearest DDU-GKY Training Center.',
      'Select trade course and complete residential/non-residential module.'
    ],
    officialLink: 'http://ddugky.gov.in',
    assistanceCenter: 'Block Development Office (BDO) / DDU-GKY Training Center',
    helpline: '1800-112-211',
    icon: '🚀',
  }
];

// ── Multi-Language Scheme Getter ──────────────────────────────
export function getLocalizedGovernmentSchemes(lang: string): GovernmentScheme[] {
  if (lang === 'hi') {
    return DEMO_GOVERNMENT_SCHEMES.map(s => {
      if (s.id === 'pm-kisan') {
        return {
          ...s,
          title: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
          shortDesc: 'पात्र भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष की प्रत्यक्ष आय सहायता, डीबीटी के माध्यम से 3 किस्तों में।',
          benefits: [
            '₹6,000/वर्ष प्रत्यक्ष वित्तीय सहायता 3 समान किस्तों में।',
            'बिना किसी मध्यस्थ के सीधे बैंक खाते में क्रेडिट।',
            '2026-27 से 2030-31 तक विस्तार को मंजूरी दी गई।'
          ],
          requiredDocuments: ['आधार कार्ड', 'जमीन का खतियान / खसरा', 'बैंक पासबुक', 'मोबाइल नंबर'],
          howToApply: [
            'pmkisan.gov.in पोर्टल या पीएम-किसान मोबाइल ऐप पर ऑनलाइन पंजीकरण करें।',
            'अपने नजदीकी सीएससी (CSC) या नोडल कृषि अधिकारी के पास सत्यापन करें।',
            'आधार-बैंक खाता लिंक होने पर सहायता राशि सीधे खाते में जमा होगी।'
          ]
        };
      }
      if (s.id === 'cm-kisan-odisha') {
        return {
          ...s,
          title: 'सीएम-किसान ओडिशा (CM-KISAN Odisha)',
          shortDesc: 'ओडिशा राज्य वित्तीय सहायता जो 41+ लाख किसान परिवारों और भूमिहीन परिवारों को डीबीटी सहायता प्रदान करती है।',
          benefits: [
            'छोटे, सीमांत किसानों और भूमिहीन कृषि मजदूरों के लिए ₹4,000/वर्ष की वित्तीय सहायता।',
            'सीधे बैंक खाते में डीबीटी (DBT) क्रेडिट।',
            'भूमिहीन परिवारों के लिए आजीविका गतिविधियों हेतु अतिरिक्त सहायता।'
          ],
          requiredDocuments: ['ओडिशा किसान आईडी', 'आधार कार्ड', 'बैंक पासबुक (आधार लिंक्ड)', 'राशन कार्ड'],
          howToApply: [
            'cmkisan.odisha.gov.in पर किसान आईडी दर्ज करें।',
            'मो सेवा केंद्र (Mo Seba Kendra) या कृषि कार्यालय से सत्यापन करवाएं।',
            'राशि सीधे खाते में जमा की जाएगी।'
          ]
        };
      }
      if (s.id === 'pmfby') {
        return {
          ...s,
          title: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
          shortDesc: 'व्यापक फसल उपज और मौसम आधारित जोखिम सुरक्षा जो फसल कटाई के बाद और बेमौसम नुकसान को कवर करती है।',
          benefits: [
            'अधिकतम प्रीमियम: खरीफ के लिए 2%, रबी फसलों के लिए 1.5% और वाणिज्यिक फसलों के लिए 5%।',
            'प्राकृतिक आपदाओं, कीटों और बीमारियों से फसल नुकसान की भरपाई।',
            'फसल कटाई के बाद 14 दिनों तक बेमौसम बारिश से हुए नुकसान का कवर।'
          ],
          requiredDocuments: ['आधार कार्ड', 'भूमि बुवाई घोषणा पत्र', 'बैंक पासबुक', 'भूमि खतियान'],
          howToApply: [
            'कटाई/बुवाई के 10 दिनों के भीतर pmfby.gov.in पर आवेदन करें।',
            'स्थानीय सीएससी केंद्र या बैंक शाखा से फसल बीमा प्रीमियम भरें।',
            'नुकसान होने पर 72 घंटे के भीतर 14447 पर रिपोर्ट करें।'
          ]
        };
      }
      if (s.id === 'vb-g-ram-g') {
        return {
          ...s,
          title: 'विकसित भारत ग्रामीण रोजगार गारंटी (VB-G RAM G)',
          shortDesc: 'ग्रामीण परिवारों के लिए प्रति वर्ष 125 दिनों की मजदूरी रोजगार की वैधानिक गारंटी (100 दिनों से बढ़ाई गई)।',
          benefits: [
            'प्रति वित्तीय वर्ष 125 दिनों की गारंटीकृत मजदूरी रोजगार।',
            'काम मांगने के 15 दिनों के भीतर काम न मिलने पर बेरोजगारी भत्ता।',
            'सीधे आधार लिंक्ड बैंक खाते में साप्ताहिक मजदूरी भुगतान।'
          ],
          requiredDocuments: ['जॉब कार्ड', 'आधार कार्ड', 'बैंक पासबुक'],
          howToApply: [
            'ग्राम पंचायत सचिव को लिखित या मौखिक रूप से काम के लिए आवेदन प्रस्तुत करें।',
            'ग्राम पंचायत से तारीख लगी हुई काम मांगने की रसीद प्राप्त करें।',
            'आवंटित कार्य स्थल पर उपस्थित हों और मजदूरी प्राप्त करें।'
          ]
        };
      }
      if (s.id === 'day-nrlm-lakhpati') {
        return {
          ...s,
          title: 'डे-एनआरएलएम एवं लखपति दीदी योजना (DAY-NRLM)',
          shortDesc: 'ग्रामीण महिलाओं को स्वयं सहायता समूहों (SHGs) में संगठित करना, ₹20 लाख तक बिना गारंटी ऋण और सूक्ष्म उद्यम प्रशिक्षण देना।',
          benefits: [
            'स्वयं सहायता समूहों (SHG) के लिए ₹20 लाख तक बिना गारंटी बैंक क्रेडिट।',
            'महिला उद्यमियों के लिए लखपति दीदी प्रशिक्षण और ड्रोन दीदी प्रमाणन।',
            'उत्पादों की बिक्री के लिए सरस (SARAS) आजीविका बाजार से जुड़ाव।'
          ],
          requiredDocuments: ['महिला का आधार कार्ड', 'एसएचजी (SHG) सदस्यता पुस्तिका', 'बैंक पासबुक', 'पासपोर्ट आकार फोटो'],
          howToApply: [
            'ग्राम संगठन (VO) या क्लस्टर लेवल फेडरेशन (CLF) से संपर्क करें।',
            'कम से कम 6 महीने के लिए एसएचजी पंचसूत्र का पालन करें।',
            'सामुदायिक निवेश कोष (CIF) और बैंक क्रेडिट लिंकेज के लिए आवेदन जमा करें।'
          ]
        };
      }
      if (s.id === 'pm-vishwakarma') {
        return {
          ...s,
          title: 'पीएम विश्वकर्मा योजना (PM Vishwakarma Scheme)',
          shortDesc: 'पारंपरिक कारीगरों के लिए 5% ब्याज दर पर ₹3 लाख तक का बिना गारंटी ऋण, ₹15,000 का टूलकिट प्रोत्साहन और उन्नत प्रशिक्षण।',
          benefits: [
            '5% ब्याज पर बिना गारंटी ऋण: ₹1 लाख (पहली किस्त) + ₹2 लाख (दूसरी किस्त)।',
            '₹15,000 का आधुनिक टूलकिट ई-वाउचर प्रोत्साहन।',
            '₹500/दिन वजीफे के साथ 5-7 दिनों का बुनियादी कौशल प्रशिक्षण।'
          ],
          requiredDocuments: ['आधार कार्ड', 'बैंक पासबुक', 'पारंपरिक व्यापार प्रमाण पत्र / पंचायत सत्यापन', 'मोबाइल नंबर'],
          howToApply: [
            'आधार और मोबाइल के साथ निकटतम जन सेवा केंद्र (CSC) पर जाएं।',
            '3-स्तरीय सत्यापन पूरा करवाएं।',
            'पीएम विश्वकर्मा डिजिटल आईडी कार्ड और टूलकिट वाउचर प्राप्त करें।'
          ]
        };
      }
      if (s.id === 'pmay-g') {
        return {
          ...s,
          title: 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)',
          shortDesc: 'शौचालय के साथ पक्का मकान बनाने के लिए ₹1.20 लाख (मैदानी) से ₹1.30 लाख (पहाड़ी क्षेत्र) की वित्तीय सहायता।',
          benefits: [
            'निर्माण के 3 चरणों में ₹1.20 लाख की वित्तीय सहायता सीधे बैंक खाते में।',
            'मनरेगा के तहत 90-95 दिनों की अकुशल मजदूरी का अतिरिक्त लाभ।',
            'स्वच्छ भारत मिशन के तहत शौचालय निर्माण के लिए ₹12,000 अतिरिक्त सहायता।'
          ],
          requiredDocuments: ['आधार कार्ड', 'जॉब कार्ड नंबर', 'बैंक पासबुक की प्रति', 'जमीन / आवास स्वामित्व दस्तावेज'],
          howToApply: [
            'ग्राम सभा स्तर पर आवास+ सर्वेक्षण के माध्यम से नाम पहचाने जाते हैं।',
            'ग्राम पंचायत सचिव या खंड विकास अधिकारी (BDO) से संपर्क करें।',
            'pmayg.nic.in ऐप पर मकान निर्माण के जियोटैग किए गए चरणों को ट्रैक करें।'
          ]
        };
      }
      if (s.id === 'jal-jeevan-mission') {
        return {
          ...s,
          title: 'जल जीवन मिशन (हर घर जल)',
          shortDesc: 'प्रति व्यक्ति प्रति दिन 55 लीटर स्वच्छ पेयजल देने वाला कार्यात्मक घरेलू नल कनेक्शन (FHTC) सुनिश्चित करता है।',
          benefits: [
            'घर पर मुफ्त कार्यात्मक घरेलू नल जल कनेक्शन।',
            'फील्ड टेस्ट किट (FTK) का उपयोग करके नियमित जल गुणवत्ता परीक्षण।',
            'ग्राम पंचायत जल एवं स्वच्छता समिति (VWSC) द्वारा शिकायत निवारण।'
          ],
          requiredDocuments: ['आधार कार्ड', 'आवास पता प्रमाण', 'ग्राम पंचायत जल पंजीकरण फॉर्म'],
          howToApply: [
            'ग्राम जल एवं स्वच्छता समिति (VWSC) को नल कनेक्शन का अनुरोध जमा करें।',
            'जल जीवन मिशन मोबाइल ऐप पर शिकायत दर्ज करें।',
            'गांव की जलापूर्ति स्थिति ऑनलाइन ट्रैक करें।'
          ]
        };
      }
      if (s.id === 'pm-jay') {
        return {
          ...s,
          title: 'आयुष्मान भारत (PM-JAY) स्वास्थ्य बीमा',
          shortDesc: 'सूचीबद्ध अस्पतालों में कैशलेस इलाज के लिए प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य कवर।',
          benefits: [
            'प्रति परिवार प्रति वर्ष ₹5,00,000 का कैशलेस स्वास्थ्य बीमा कवर।',
            '1,900+ चिकित्सा प्रक्रियाओं, सर्जरी और अस्पताल में भर्ती के खर्च का कवर।',
            'परिवार के आकार या आयु सीमा पर कोई प्रतिबंध नहीं।'
          ],
          requiredDocuments: ['आधार कार्ड', 'राशन कार्ड (NFSA)', 'आयुष्मान कार्ड / ई-कार्ड'],
          howToApply: [
            'beneficiary.nha.gov.in पर मोबाइल या आधार से अपनी पात्रता जांचें।',
            'ई-कार्ड बनाने के लिए निकटतम आयुष्मान मित्र या सीएससी (CSC) पर जाएं।',
            'कैशलेस इलाज के लिए अस्पताल में भर्ती के समय आयुष्मान कार्ड दिखाएं।'
          ]
        };
      }
      if (s.id === 'mamata-pmmvy-odisha') {
        return {
          ...s,
          title: 'ममता एवं पीएमएमवीवाई योजना ओडिशा (मातृ कल्याण)',
          shortDesc: 'गर्भवती और स्तनपान कराने वाली माताओं के पोषण में सुधार के लिए ₹5,000 - ₹6,000 का सीधा लाभ अंतरण।',
          benefits: [
            '2-3 किस्तों में ₹5,000 से ₹6,000 की प्रोत्साहन राशि।',
            'प्रसव पूर्व जांच (ANC) और बच्चे के टीकाकरण को कवर करता है।',
            'स्थानीय आंगनवाड़ी केंद्रों के माध्यम से पोषण एवं स्वास्थ्य परामर्श।'
          ],
          requiredDocuments: ['एमसीपी कार्ड (माता एवं बाल सुरक्षा कार्ड)', 'आधार कार्ड', 'बैंक पासबुक', 'आंगनवाड़ी पंजीकरण प्रति'],
          howToApply: [
            'स्थानीय आंगनवाड़ी केंद्र (AWC) में 4 महीने के भीतर गर्भावस्था का पंजीकरण कराएं।',
            'आंगनवाड़ी कार्यकर्ता (AWW) को एमसीपी कार्ड जांच रिकॉर्ड जमा करें।',
            'किस्त की राशि सीधे आधार से जुड़े बैंक खाते में जमा की जाती है।'
          ]
        };
      }
      if (s.id === 'pmkvy') {
        return {
          ...s,
          title: 'प्रधानमंत्री कौशल विकास योजना (PMKVY 4.0)',
          shortDesc: 'तकनीकी और कृषि क्षेत्रों में मुफ्त कौशल प्रशिक्षण, उद्योग प्रमाणन और वजीफा।',
          benefits: [
            '300+ ट्रेडों में 100% मुफ्त कौशल प्रशिक्षण।',
            'देशभर में मान्य सरकारी प्रमाणन।',
            'रोजगार सहायता एवं कौशल पूर्णता बोनस।'
          ],
          requiredDocuments: ['आधार कार्ड', 'स्कूल/कॉलेज मार्कशीट', 'बैंक खाता विवरण'],
          howToApply: [
            'स्किल इंडिया डिजिटल पोर्टल पर पंजीकरण करें।',
            'निकटतम कौशल केंद्र चुनें और प्रशिक्षण पूरा करें।'
          ]
        };
      }
      if (s.id === 'ddu-gky') {
        return {
          ...s,
          title: 'दीन दयाल उपाध्याय ग्रामीण कौशल्या योजना (DDU-GKY)',
          shortDesc: 'ग्रामीण गरीब युवाओं के लिए न्यूनतम 70% गारंटीकृत नौकरी नियुक्ति के साथ कौशल प्रशिक्षण।',
          benefits: [
            'रहने, खाने और वर्दी सहित मुफ्त आवासीय कौशल प्रशिक्षण।',
            'न्यूनतम वेतन मानकों के साथ गारंटीकृत नौकरी।'
          ],
          requiredDocuments: ['आधार कार्ड', 'बीपीएल राशन कार्ड', 'आयु प्रमाण', 'बैंक पासबुक'],
          howToApply: [
            'कौशल पंजी ऐप के माध्यम से नामांकन करें या ब्लॉक विकास कार्यालय से संपर्क करें।'
          ]
        };
      }
      return s;
    });
  }

  if (lang === 'mr') {
    return DEMO_GOVERNMENT_SCHEMES.map(s => {
      if (s.id === 'pm-kisan') {
        return {
          ...s,
          title: 'प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)',
          shortDesc: 'पात्र शेतकरी कुटुंबांना वर्षाला ₹६,००० थेट मदत, डीबीटीद्वारे ३ हप्त्यांमध्ये.',
          benefits: [
            '₹६,०००/वर्ष थेट आर्थिक मदत ३ समान हप्त्यांमध्ये.',
            'थेट आधार जोडलेल्या बँक खात्यात रक्कम जमा.'
          ],
          requiredDocuments: ['आधार कार्ड', '७/१२ उतारा', 'बँक पासबुक'],
          howToApply: ['pmkisan.gov.in वर ऑनलाइन नोंदणी करा.']
        };
      }
      if (s.id === 'day-nrlm-lakhpati') {
        return {
          ...s,
          title: 'डे-एनआरएलएम व लखपती दिदी योजना (DAY-NRLM)',
          shortDesc: 'ग्रामीण महिलांना महिला बचत गटात (SHG) संघटित करणे, ₹२० लाखांपर्यंत विनातारण कर्ज.',
          benefits: ['महिला बचत गटांसाठी ₹२० लाखांपर्यंत विनातारण बँक कर्ज.'],
          requiredDocuments: ['आधार कार्ड', 'बचत गट पासबुक', 'बँक पासबुक'],
          howToApply: ['स्थानिक ग्रामसंघाशी संपर्क साधा.']
        };
      }
      if (s.id === 'pm-vishwakarma') {
        return {
          ...s,
          title: 'पीएम विश्वकर्मा योजना (PM Vishwakarma)',
          shortDesc: 'पारंपारिक कारागिरांसाठी ५% व्याजाने ₹३ लाखांपर्यंत विनातारण कर्ज व ₹१५,००० टूलकिट अनुदान.',
          benefits: ['५% व्याजाने विनातारण कर्ज: ₹१ लाख + ₹२ लाख.', '₹१५,००० टूलकिट ई-व्हाउचर प्रोत्साहन.'],
          requiredDocuments: ['आधार कार्ड', 'बँक पासबुक'],
          howToApply: ['सीएससी (CSC) केंद्रात जाऊन अर्ज करा.']
        };
      }
      if (s.id === 'pmay-g') {
        return {
          ...s,
          title: 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)',
          shortDesc: 'पक्के घर बांधण्यासाठी ₹१.२० लाख ते ₹१.३० लाख आर्थिक मदत.',
          benefits: ['३ हप्त्यांमध्ये ₹१.२० लाख थेट बँक खात्यात.'],
          requiredDocuments: ['आधार कार्ड', 'जॉब कार्ड', 'बँक पासबुक'],
          howToApply: ['ग्रामपंचायतीत आवास+ यादीत नाव तपासा.']
        };
      }
      if (s.id === 'jal-jeevan-mission') {
        return {
          ...s,
          title: 'जल जीवन मिशन (हर घर जल)',
          shortDesc: 'प्रत्येक कुटुंबाला दररोज ५५ लिटर स्वच्छ पिण्याचे पाणी देणारे नळ कनेक्शन.',
          benefits: ['घरी मोफत नळ कनेक्शन.'],
          requiredDocuments: ['आधार कार्ड', 'रहिवासी दाखला'],
          howToApply: ['ग्रामपंचायत पाणी समितीकडे अर्ज करा.']
        };
      }
      if (s.id === 'pm-jay') {
        return {
          ...s,
          title: 'आयुष्मान भारत (PM-JAY) आरोग्य विमा',
          shortDesc: 'प्रति कुटुंब दरवर्षी ₹५ लाख मोफत उपचारासाठी आरोग्य विमा.',
          benefits: ['₹५,००,००० मोफत उपचारासाठी कॅशलेस विमा.'],
          requiredDocuments: ['आधार कार्ड', 'रेशन कार्ड', 'आयुष्मान कार्ड'],
          howToApply: ['सीएससी केंद्रात किंवा रुग्णालयातील आयुष्मान मित्राशी संपर्क साधा.']
        };
      }
      if (s.id === 'pmkvy') {
        return {
          ...s,
          title: 'प्रधानमंत्री कौशल विकास योजना (PMKVY 4.0)',
          shortDesc: 'तांत्रिक व शेती क्षेत्रातील तरुणांसाठी मोफत कौशल्य प्रशिक्षण, उद्योग प्रमाणपत्र व विद्यावेतन.',
          benefits: [
            '३००+ व्यवसायांमध्ये १००% मोफत कौशल्य प्रशिक्षण (ड्रोन तंत्रज्ञ, सेंद्रिय शेती, सौर तंत्रज्ञ, इलेक्ट्रिशियन).',
            'देशभर मान्य सरकारी प्रमाणपत्र.',
            'रोजगार मदत व कौशल्य पूर्णता बोनस.'
          ],
          requiredDocuments: ['आधार कार्ड', 'शाळा/कॉलेज गुणपत्रक', 'बँक खाते तपशील'],
          howToApply: ['स्किल इंडिया डिजिटल पोर्टलवर नोंदणी करा.']
        };
      }
      if (s.id === 'ddu-gky') {
        return {
          ...s,
          title: 'दीनदयाळ उपाध्याय ग्रामीण कौशल्या योजना (DDU-GKY)',
          shortDesc: 'ग्रामीण गरीब तरुणांसाठी किमान ७०% नोकरीच्या हमीसह मोफत कौशल्य प्रशिक्षण.',
          benefits: [
            'राहणे, जेवण आणि गणवेशासह मोफत निवासी कौशल्य प्रशिक्षण.',
            'किमान वेतनाच्या मानकांसह हमीची नोकरी.'
          ],
          requiredDocuments: ['आधार कार्ड', 'बीपीएल रेशन कार्ड', 'वयाचा दाखला', 'बँक पासबुक'],
          howToApply: ['कौशल पंजी ॲप किंवा गट विकास अधिकारी (BDO) कार्यालयाशी संपर्क साधा.']
        };
      }
      return s;
    });
  }

  if (lang === 'or') {
    return DEMO_GOVERNMENT_SCHEMES.map(s => {
      if (s.id === 'pm-kisan') {
        return {
          ...s,
          title: 'ପ୍ରଧାନମନ୍ତ୍ରୀ କିଷାନ ସମ୍ମାନ ନିଧି (PM-KISAN)',
          shortDesc: 'ଚାଷୀ ପରିବାରକୁ ବାର୍ଷିକ ₹୬,୦୦୦ ଆର୍ଥିକ ସହାୟତା, ୩ଟି କିସ୍ତିରେ।',
          benefits: ['₹୬,୦୦୦/ବର୍ଷ ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାକୁ DBT ମାଧ୍ୟମରେ ସହାୟତା।'],
          requiredDocuments: ['ଆଧାର କାର୍ଡ', 'ଜମି ପଟ୍ଟା', 'ବ୍ୟାଙ୍କ ପାସବୁକ'],
          howToApply: ['pmkisan.gov.in ରେ ଆବେଦନ କରନ୍ତୁ।']
        };
      }
      if (s.id === 'cm-kisan-odisha') {
        return {
          ...s,
          title: 'ସିଏମ୍-କିଷାନ ଓଡ଼ିଶା (CM-KISAN Odisha)',
          shortDesc: 'ଓଡ଼ିଶାର ୪୧+ ଲକ୍ଷ କୃଷକ ପରିବାର ଓ ଭୂମିହୀନଙ୍କ ପାଇଁ ବାର୍ଷିକ ₹୪,୦୦୦ ଆର୍ଥିକ ସହାୟତା।',
          benefits: ['କ୍ଷୁଦ୍ର, ନାମମାତ୍ର ଓ ଭୂମିହୀନ ଚାଷୀଙ୍କ ପାଇଁ ₹୪,୦୦୦/ବର୍ଷ ସହାୟତା।'],
          requiredDocuments: ['ଓଡ଼ିଶା ଫାର୍ମର ID', 'ଆଧାର କାର୍ଡ', 'ବ୍ୟାଙ୍କ ପାସବୁକ'],
          howToApply: ['cmkisan.odisha.gov.in ରେ ଆବେଦନ କରନ୍ତୁ।']
        };
      }
      if (s.id === 'day-nrlm-lakhpati') {
        return {
          ...s,
          title: 'DAY-NRLM ଓ ଲଖପତି ଦିଦି ଯୋଜନା',
          shortDesc: 'ମହିଳା SHG ମାନଙ୍କୁ ₹୨୦ ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ବିନା ଗ୍ୟାରେଣ୍ଟି ଋଣ ଓ ତାଲିମ।',
          benefits: ['SHG ଗ୍ରୁପ୍ ପାଇଁ ₹୨୦ ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ବିନା ଗ୍ୟାରେଣ୍ଟି ଋଣ।'],
          requiredDocuments: ['ଆଧାର କାର୍ଡ', 'SHG ପାସବୁକ', 'ବ୍ୟାଙ୍କ ଖାତା'],
          howToApply: ['ସଂଘ କାର୍ଯ୍ୟାଳୟ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।']
        };
      }
      if (s.id === 'pm-vishwakarma') {
        return {
          ...s,
          title: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ବିଶ୍ୱକର୍ମା ଯୋଜନା (PM Vishwakarma)',
          shortDesc: 'କାରିଗରଙ୍କ ପାଇଁ ୫% ସୁଧରେ ₹୩ ଲକ୍ଷ ଋଣ ଓ ₹୧୫,୦୦୦ ଟୁଲକିଟ୍ ସହାୟତା।',
          benefits: ['୫% ସୁଧରେ ₹୩ ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ବିନା ଗ୍ୟାରେଣ୍ଟି ଋଣ।', '₹୧୫,୦୦୦ ଟୁଲକିଟ୍ ସହାୟତା।'],
          requiredDocuments: ['ଆଧାର କାର୍ଡ', 'ବ୍ୟାଙ୍କ ପାସବୁକ'],
          howToApply: ['ମୋ ସେବା କେନ୍ଦ୍ର / CSC ରେ ଆବେଦନ କରନ୍ତୁ।']
        };
      }
      if (s.id === 'pmay-g') {
        return {
          ...s,
          title: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଆବାସ ଯୋଜନା - ଗ୍ରାମୀଣ (PMAY-G)',
          shortDesc: 'ପକ୍କା ଘର ନିର୍ମାଣ ପାଇଁ ₹୧.୨୦ ଲକ୍ଷ ସହାୟତା।',
          benefits: ['୩ଟି କିସ୍ତିରେ ₹୧.୨୦ ଲକ୍ଷ ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାକୁ।'],
          requiredDocuments: ['ଆଧାର କାର୍ଡ', 'ଜବ୍ କାର୍ଡ', 'ବ୍ୟାଙ୍କ ପାସବୁକ'],
          howToApply: ['ଗ୍ରାମପଞ୍ଚାୟତରେ Awaas+ ତାଲିକା ଯାଞ୍ଚ କରନ୍ତୁ।']
        };
      }
      if (s.id === 'jal-jeevan-mission') {
        return {
          ...s,
          title: 'ଜଳ ଜୀବନ ମିଶନ (ହର ଘର ଜଲ)',
          shortDesc: 'ପ୍ରତ୍ୟେକ ପରିବାରକୁ ମାଗଣା ପାନୀୟ ଜଳ ନଳ କନେକ୍ସନ।',
          benefits: ['ମାଗଣା ନଳ ଜଳ କନେକ୍ସନ।'],
          requiredDocuments: ['ଆଧାର କାର୍ଡ', 'ଠିକଣା ପ୍ରମାଣ'],
          howToApply: ['ଗ୍ରାମପଞ୍ଚାୟତ ପାନୀୟ ଜଳ କମିଟିରେ ଆବେଦନ କରନ୍ତୁ।']
        };
      }
      if (s.id === 'pm-jay') {
        return {
          ...s,
          title: 'ଆୟୁଷ୍ମାନ ଭାରତ (PM-JAY) ସ୍ୱାସ୍ଥ୍ୟ ବୀମା',
          shortDesc: 'ପରିବାର ପ୍ରତି ବାର୍ଷିକ ₹୫ ଲକ୍ଷ ମାଗଣା ଚିକିତ୍ସା ବୀମା।',
          benefits: ['₹୫,୦୦,୦୦୦ ମାଗଣା କ୍ୟାସଲେସ୍ ଚିକିତ୍ସା।'],
          requiredDocuments: ['ଆଧାର କାର୍ଡ', 'ରାସନ କାର୍ଡ', 'ଆୟୁଷ୍ମାନ କାର୍ଡ'],
          howToApply: ['CSC କିମ୍ବା ଡାକ୍ତରଖାନାରେ ଆୟୁଷ୍ମାନ ମିତ୍ରଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।']
        };
      }
      if (s.id === 'mamata-pmmvy-odisha') {
        return {
          ...s,
          title: 'ମମତା ଓ PMMVY ଯୋଜନା ଓଡ଼ିଶା (ମାତୃ ମଙ୍ଗଳ)',
          shortDesc: 'ଗର୍ଭବତୀ ଓ ପ୍ରସୂତି ମାଆମାନଙ୍କ ପାଇଁ ₹୫,୦୦୦ - ₹୬,୦୦୦ ସିଧାସଳଖ ସହାୟତା।',
          benefits: ['₹୫,୦୦୦ ରୁ ₹୬,୦୦୦ ଟଙ୍କା ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାକୁ।'],
          requiredDocuments: ['MCP କାର୍ଡ', 'ଆଧାର କାର୍ଡ', 'ବ୍ୟାଙ୍କ ପାସବୁକ'],
          howToApply: ['ଆଙ୍ଗନବାଡ଼ି କେନ୍ଦ୍ର (AWC) ରେ ନାମ ପଞ୍ଜୀକରଣ କରନ୍ତୁ।']
        };
      }
      return s;
    });
  }

  return DEMO_GOVERNMENT_SCHEMES;
}

// ── Local Precautions & Suggestions Data ───────────────────────
export const DEMO_LOCAL_PRECAUTIONS: LocalPrecaution[] = [
  {
    id: 'prec-1',
    title: 'High Relative Humidity (88%) — Fungal Outbreak Warning',
    category: 'Weather Caution',
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
  }
];

// ── Additional Demo Exports for Subpages & AI Service ─────────
export const DEMO_CROPS: Crop[] = [
  {
    id: 'c1',
    farmId: 'f1',
    name: 'Rice (Paddy)',
    variety: 'Indrayani / Swarna',
    growthStage: 'Flowering Stage',
    plantingDate: '2024-06-15',
    expectedHarvestDate: '2024-10-20',
    status: 'active',
  },
  {
    id: 'c2',
    farmId: 'f2',
    name: 'Soybean',
    variety: 'JS 335',
    growthStage: 'Pod Formation',
    plantingDate: '2024-06-20',
    expectedHarvestDate: '2024-10-10',
    status: 'active',
  },
];

export const ALL_CROPS: string[] = [
  'Rice (Paddy)',
  'Soybean',
  'Cotton',
  'Wheat',
  'Maize',
  'Sugarcane',
  'Groundnut',
  'Mustard',
  'Tomato',
  'Onion',
  'Chilli',
];

export const CROP_STAGES: Record<string, string[]> = {
  'Rice (Paddy)': ['Germination / Seedling', 'Tillering', 'Panicle Initiation', 'Flowering Stage', 'Grain Filling', 'Harvest Stage'],
  'Rice': ['Germination / Seedling', 'Tillering', 'Panicle Initiation', 'Flowering Stage', 'Grain Filling', 'Harvest Stage'],
  'Soybean': ['Germination', 'Vegetative Stage', 'Flowering Stage', 'Pod Formation', 'Maturity Stage'],
  'Cotton': ['Seedling', 'Square Formation', 'Flowering', 'Boll Formation', 'Boll Bursting'],
  'Wheat': ['Germination', 'Crown Root', 'Tillering', 'Jointing', 'Heading', 'Maturity'],
  'Maize': ['Germination', 'Knee-High Stage', 'Tasseling', 'Silking', 'Dough Stage', 'Harvest'],
  'Sugarcane': ['Germination', 'Formative Stage', 'Grand Growth', 'Maturity'],
  'Groundnut': ['Germination', 'Vegetative', 'Flowering', 'Pegging', 'Pod Formation'],
  'Mustard': ['Seedling', 'Rosette', 'Flowering', 'Pod Formation', 'Maturity'],
  'Tomato': ['Nursery / Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
  'Onion': ['Seedling', 'Vegetative', 'Bulb Development', 'Maturity'],
  'Chilli': ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
};

export const DEMO_DASHBOARD_STATS: DashboardStats = {
  totalFarmers: 10847,
  totalFarms: 18293,
  activeAlerts: 47,
  diseaseReports: 312,
  pestReports: 198,
  highRiskDistricts: 8,
  pendingCases: 64,
  resolvedCases: 420,
  expertValidationRate: 94.2,
  aiAccuracy: 93.0,
};

export const DEMO_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    type: 'disease_outbreak',
    severity: 'high',
    title: 'Rice Blast Outbreak Warning',
    message: 'High atmospheric humidity (88%) has triggered elevated Rice Blast infection risk across Shirur & Daund talukas.',
    region: 'Pune District',
    district: 'Pune',
    state: 'Maharashtra',
    affectedCrop: 'Rice (Paddy)',
    confidence: 94,
    riskFactors: ['High RH > 85%', 'Night temp 22°C', 'Favorable spore germination'],
    recommendedAction: 'Apply Trichoderma viride or Tricyclazole 75 WP @ 0.6g/L immediately.',
    createdAt: '2024-08-05T08:00:00Z',
    isRead: false,
  },
  {
    id: 'alert-2',
    type: 'pest_infestation',
    severity: 'critical',
    title: 'Fall Armyworm Cluster Alert',
    message: 'Trap catches exceeded ETL threshold (18 moths/trap) in Vidarbha maize fields.',
    region: 'Vidarbha Region',
    district: 'Nagpur',
    state: 'Maharashtra',
    affectedCrop: 'Maize',
    confidence: 91,
    riskFactors: ['ETL breach', 'Whorl damage symptoms'],
    recommendedAction: 'Install pheromone traps @ 5/acre and apply Emamectin benzoate 5% SG.',
    createdAt: '2024-08-04T14:30:00Z',
    isRead: false,
  },
];

export const DEMO_RISK_SCORE: RiskScore = {
  diseaseRisk: 'high',
  pestRisk: 'medium',
  weatherRisk: 'high',
  overallRisk: 'high',
  diseaseScore: 82,
  pestScore: 58,
  weatherScore: 78,
  overallScore: 76,
  factors: [
    { name: 'Humidity Index', value: '88%', impact: 'high', description: 'Supports fungal blast spore germination' },
    { name: 'Temperature Window', value: '24°C', impact: 'medium', description: 'Optimal fungal pathogen growth range' },
    { name: 'Pest Density', value: '14 moths/trap', impact: 'medium', description: 'Nearing Economic Threshold Level (ETL)' },
  ],
  forecast: [
    { date: '2024-08-06', dayLabel: 'Today', diseaseRisk: 'high', pestRisk: 'medium', overallScore: 78, temp: 27, humidity: 88, rainfall: 12, description: 'Heavy fungal spore pressure expected' },
    { date: '2024-08-07', dayLabel: 'Wed', diseaseRisk: 'high', pestRisk: 'medium', overallScore: 75, temp: 26, humidity: 85, rainfall: 8, description: 'Moderate rain with cloud cover' },
    { date: '2024-08-08', dayLabel: 'Thu', diseaseRisk: 'medium', pestRisk: 'low', overallScore: 62, temp: 28, humidity: 76, rainfall: 2, description: 'Partly sunny, lower humidity' },
    { date: '2024-08-09', dayLabel: 'Fri', diseaseRisk: 'low', pestRisk: 'low', overallScore: 45, temp: 29, humidity: 70, rainfall: 0, description: 'Clear skies, favorable dry spell' },
    { date: '2024-08-10', dayLabel: 'Sat', diseaseRisk: 'low', pestRisk: 'medium', overallScore: 48, temp: 30, humidity: 68, rainfall: 0, description: 'Warm and dry conditions' },
  ],
  calculatedAt: '2024-08-06T06:00:00Z',
};

export const DEMO_WEATHER: WeatherData = {
  location: 'Shirur, Pune, Maharashtra',
  temperature: 27,
  feelsLike: 29,
  humidity: 88,
  rainfall: 14.5,
  windSpeed: 12,
  windDirection: 'SW',
  soilMoisture: 78,
  uvIndex: 4,
  condition: 'Thunderstorms & Rain',
  icon: '🌧️',
  updatedAt: 'Just now',
};

export const DEMO_SENSORS: SensorData[] = [
  {
    id: 's1',
    farmId: 'f1',
    sensorType: 'temperature',
    value: 27.4,
    unit: '°C',
    status: 'normal',
    lastUpdated: '5 min ago',
    trend: [25, 26, 26.5, 27, 27.4, 27.2, 27.4],
  },
  {
    id: 's2',
    farmId: 'f1',
    sensorType: 'humidity',
    value: 88,
    unit: '%',
    status: 'warning',
    lastUpdated: '5 min ago',
    trend: [75, 80, 82, 85, 88, 88, 88],
  },
  {
    id: 's3',
    farmId: 'f1',
    sensorType: 'soil_moisture',
    value: 78,
    unit: '%',
    status: 'normal',
    lastUpdated: '10 min ago',
    trend: [65, 70, 72, 75, 78, 78, 78],
  },
  {
    id: 's4',
    farmId: 'f1',
    sensorType: 'rainfall',
    value: 14.5,
    unit: 'mm',
    status: 'normal',
    lastUpdated: '15 min ago',
    trend: [0, 2, 5, 8, 12, 14, 14.5],
  },
];

export const CROP_TIMELINE = [
  {
    icon: '🌱',
    event: 'Sowing & Germination completed for Paddy Swarna variety',
    date: '15 June 2024',
    type: 'milestone',
  },
  {
    icon: '🌧️',
    event: 'Heavy Rainfall alert issued - Soil moisture rose to 85%',
    date: '12 July 2024',
    type: 'alert',
  },
  {
    icon: '📷',
    event: 'AI Diagnosis scanned: Early Leaf Spot detected (Confidence 91%)',
    date: '28 July 2024',
    type: 'diagnosis',
  },
  {
    icon: '👨‍🌾',
    event: 'Extension Officer Suresh Kumar validated spray action plan',
    date: '30 July 2024',
    type: 'expert',
  },
  {
    icon: '📋',
    event: 'Bio-fungicide Trichoderma viride applied successfully',
    date: '02 August 2024',
    type: 'advisory',
  },
];

export function getLocalizedCropTimeline(lang: string) {
  if (lang === 'mr') {
    return [
      { icon: '🌱', event: 'सुवर्ण जातीच्या भात पिकाची पेरणी व उगवण पूर्ण', date: '१५ जून २०२४', type: 'milestone' },
      { icon: '🌧️', event: 'मुसळधार पावसाचा इशारा — मातीतील ओलावा ८५% पर्यंत वाढला', date: '१२ जुलै २०२४', type: 'alert' },
      { icon: '📷', event: 'AI निदानाने स्कॅन केले: पानांवरील करपा रोग आढळला (अचूकता ९१%)', date: '२८ जुलै २०२४', type: 'diagnosis' },
      { icon: '👨‍🌾', event: 'कृषी विस्तार अधिकारी सुरेश कुमार यांनी फवारणी कृती आराखडा मंजूर केला', date: '३० जुलै २०२४', type: 'expert' },
      { icon: '📋', event: 'ट्रायकोडर्मा व्हिरिडी या जैव-बुरशीनाशकाची यशस्वी फवारणी पूर्ण', date: '०२ ऑगस्ट २०२४', type: 'advisory' },
    ];
  }
  if (lang === 'hi') {
    return [
      { icon: '🌱', event: 'धान स्वर्णा किस्म की बुआई और अंकुरण पूरा हुआ', date: '15 जून 2024', type: 'milestone' },
      { icon: '🌧️', event: 'भारी बारिश का अलर्ट जारी — मिट्टी की नमी 85% तक बढ़ी', date: '12 जुलाई 2024', type: 'alert' },
      { icon: '📷', event: 'AI निदान द्वारा स्कैन: शुरुआती पत्ती धब्बा रोग पाया गया (विश्वास 91%)', date: '28 जुलाई 2024', type: 'diagnosis' },
      { icon: '👨‍🌾', event: 'विस्तार अधिकारी सुरेश कुमार ने छिड़काव कार्य योजना को सत्यापित किया', date: '30 जुलाई 2024', type: 'expert' },
      { icon: '📋', event: 'जैव-फफूंदनाशी ट्राइकोडर्मा विरिडे का सफल छिड़काव किया गया', date: '02 अगस्त 2024', type: 'advisory' },
    ];
  }
  return CROP_TIMELINE;
}

export function getLocalizedAlerts(lang: string): Alert[] {
  if (lang === 'mr') {
    return DEMO_ALERTS.map(a => {
      if (a.id === 'alert-1') {
        return {
          ...a,
          title: 'भात तांबेरा रोग उद्रेक इशारा',
          message: 'शिरूर आणि दौंड तालुक्यात हवेतील आर्द्रता (८९%) जास्त असल्याने तांबेरा रोगाचा धोका वाढला आहे.',
          recommendedAction: 'तात्काळ ट्रायकोडर्मा व्हिरिडी किंवा ट्रायसायक्लाझोल ७५ WP ०.६ ग्रॅम/लिटर फवारणी करा.',
        };
      }
      if (a.id === 'alert-2') {
        return {
          ...a,
          title: 'लष्करी अळी समूह इशारा',
          message: 'विदर्भातील मका शेतात कामगंध सापळ्यांमध्ये अळ्यांची संख्या मर्यादेपेक्षा जास्त (१८ अळ्या/सापळा) आढळली.',
          recommendedAction: 'प्रति एकर ५ कामगंध सापळे लावा आणि एमामेक्टिन बेन्झोएट ५% SG ची फवारणी करा.',
        };
      }
      return a;
    });
  }
  if (lang === 'hi') {
    return DEMO_ALERTS.map(a => {
      if (a.id === 'alert-1') {
        return {
          ...a,
          title: 'धान ब्लास्ट प्रकोप चेतावनी',
          message: 'शिरूर और दौंड तालुकों में उच्च वायुमंडलीय आर्द्रता (88%) के कारण धान ब्लास्ट संक्रमण का खतरा बढ़ गया है।',
          recommendedAction: 'तुरंत ट्राइकोडर्मा विरिडे या ट्राइसाइक्लाजोल 75 WP @ 0.6g/L का छिड़काव करें।',
        };
      }
      if (a.id === 'alert-2') {
        return {
          ...a,
          title: 'फॉल आर्मीवर्म क्लस्टर अलर्ट',
          message: 'विदर्भ के मक्के के खेतों में ट्रैप कैच ईटीएल सीमा (18 कीड़े/ट्रैप) से अधिक हो गए हैं।',
          recommendedAction: '5/एकड़ की दर से फेरोमोन ट्रैप लगाएं और इमामेक्टिन बेंजोएट 5% SG छिड़कें।',
        };
      }
      return a;
    });
  }
  return DEMO_ALERTS;
}

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'emergency_sop',
    title: '🚨 Rice Blast Emergency SOP Issued',
    message: 'Collector Rajesh Yadav issued high-risk emergency warning for Shirur/Pune districts.',
    isRead: false,
    actionUrl: '/farmer/advisories',
    createdAt: '2 hours ago',
  },
  {
    id: 'n2',
    userId: 'u1',
    type: 'risk_increase',
    title: '📈 Disease Risk Increased to HIGH',
    message: 'Relative Humidity remained > 85% for 48 consecutive hours.',
    isRead: false,
    actionUrl: '/farmer/risk-forecast',
    createdAt: '4 hours ago',
  },
  {
    id: 'n3',
    userId: 'u1',
    type: 'expert_validation',
    title: '✅ Expert Verified Your Diagnosis',
    message: 'Dr. Priya Sharma confirmed Rice Leaf Blast and sent custom IPM advice.',
    isRead: true,
    actionUrl: '/farmer/advisories',
    createdAt: '1 day ago',
  },
];

export const DEMO_PEST_TRAPS: PestTrap[] = [
  {
    id: 'pt-1',
    farmId: 'f1',
    trapType: 'pheromone',
    location: 'Patil Rice Field North Border',
    lat: 18.8309,
    lng: 74.3677,
    pestType: 'Fall Armyworm',
    lastCount: 18,
    etlThreshold: 15,
    status: 'above_etl',
    trend: 'increasing',
    readings: [
      { date: '2024-07-20', count: 6 },
      { date: '2024-07-25', count: 10 },
      { date: '2024-07-30', count: 14 },
      { date: '2024-08-04', count: 18 },
    ],
    lastUpdated: '2024-08-05',
  },
  {
    id: 'pt-2',
    farmId: 'f2',
    trapType: 'sticky',
    location: 'Soybean Field Center Block',
    lat: 18.4625,
    lng: 74.5831,
    pestType: 'Whitefly',
    lastCount: 11,
    etlThreshold: 20,
    status: 'normal',
    trend: 'stable',
    readings: [
      { date: '2024-07-20', count: 8 },
      { date: '2024-07-25', count: 10 },
      { date: '2024-07-30', count: 12 },
      { date: '2024-08-04', count: 11 },
    ],
    lastUpdated: '2024-08-05',
  },
];

export const DEMO_CASES: Case[] = [
  {
    id: 'case-1',
    farmerId: 'u1',
    farmerName: 'Ramesh Patil',
    village: 'Koregaon Bhima',
    crop: 'Rice (Paddy)',
    problem: 'Suspected Rice Blast lesion clusters on lower leaves',
    riskLevel: 'high',
    status: 'open',
    diagnosisId: 'd1',
    assignedTo: 'u2',
    createdAt: '2024-08-05T09:00:00Z',
    updatedAt: '2024-08-05T09:00:00Z',
  },
  {
    id: 'case-2',
    farmerId: 'u5',
    farmerName: 'Ganesh Shinde',
    village: 'Yavat',
    crop: 'Soybean',
    problem: 'Yellow mosaic & leaf curling on early pod stage',
    riskLevel: 'medium',
    status: 'in_progress',
    assignedTo: 'u2',
    createdAt: '2024-08-04T11:20:00Z',
    updatedAt: '2024-08-05T10:00:00Z',
  },
];

export const DEMO_FIELD_VISITS: FieldVisit[] = [
  {
    id: 'fv-1',
    extensionWorkerId: 'u2',
    extensionWorkerName: 'Suresh Kumar',
    farmId: 'f1',
    farmName: 'Patil Rice Farm',
    farmerName: 'Ramesh Patil',
    diagnosisId: 'd1',
    status: 'scheduled',
    scheduledDate: '2024-08-06',
    observations: 'High humidity damage check & bio-fungicide verification',
    severity: 'moderate',
    images: [],
    notes: 'Confirm if Trichoderma spray was completed in early morning hours.',
  },
  {
    id: 'fv-2',
    extensionWorkerId: 'u2',
    extensionWorkerName: 'Suresh Kumar',
    farmId: 'f2',
    farmName: 'Shinde Soybean Field',
    farmerName: 'Ganesh Shinde',
    status: 'completed',
    scheduledDate: '2024-08-03',
    completedDate: '2024-08-03',
    observations: 'Whitefly sticky trap installation completed',
    severity: 'mild',
    images: [],
    notes: 'Advised farmer to avoid excessive nitrogen application.',
  },
];

export function getLocalizedCases(lang: string): Case[] {
  if (lang === 'mr') {
    return DEMO_CASES.map(c => {
      if (c.id === 'case-1') {
        return { ...c, crop: 'भात', problem: 'खालच्या पानांवर भात तांबेरा रोगाचे ठिपके आढळले' };
      }
      if (c.id === 'case-2') {
        return { ...c, crop: 'सोयाबीन', problem: 'शेंगा लागण्याच्या टप्प्यावर पिवळा मोज़ेक व पाने सुकणे' };
      }
      return c;
    });
  }
  if (lang === 'hi') {
    return DEMO_CASES.map(c => {
      if (c.id === 'case-1') {
        return { ...c, crop: 'धान', problem: 'निचली पत्तियों पर धान ब्लास्ट के धब्बे पाए गए' };
      }
      if (c.id === 'case-2') {
        return { ...c, crop: 'सोयाबीन', problem: 'शुरुआती फली चरण में पीला मोज़ेक और पत्तियों का मुड़ना' };
      }
      return c;
    });
  }
  return DEMO_CASES;
}

export function getLocalizedFieldVisits(lang: string): FieldVisit[] {
  if (lang === 'mr') {
    return DEMO_FIELD_VISITS.map(v => {
      if (v.id === 'fv-1') {
        return {
          ...v,
          farmName: 'पाटील भात शेती',
          notes: 'सकाळी लवकर ट्रायकोडर्मा फवारणी पूर्ण झाली आहे का याची खात्री करा.',
          observations: 'जास्त आर्द्रतेमुळे झालेल्या नुकसानीची पाहणी व जैव-बुरशीनाशक पडताळणी',
        };
      }
      if (v.id === 'fv-2') {
        return {
          ...v,
          farmName: 'शिंदे सोयाबीन शेत',
          notes: 'शेतकऱ्याला नत्राचा (नायट्रोजन) जास्त वापर टाळण्याचा सल्ला दिला.',
          observations: 'पांढरी माशी चिकट सापळे बसवण्याचे काम पूर्ण झाले',
        };
      }
      return v;
    });
  }
  if (lang === 'hi') {
    return DEMO_FIELD_VISITS.map(v => {
      if (v.id === 'fv-1') {
        return {
          ...v,
          farmName: 'पाटिल धान का खेत',
          notes: 'पुष्टि करें कि सुबह जल्दी ट्राइकोडर्मा का छिड़काव पूरा हुआ या नहीं।',
          observations: 'उच्च आर्द्रता से नुकसान की जांच और जैव-फफूंदनाशी सत्यापन',
        };
      }
      if (v.id === 'fv-2') {
        return {
          ...v,
          farmName: 'शिंदे सोयाबीन खेत',
          notes: 'किसान को अत्यधिक नाइट्रोजन के उपयोग से बचने की सलाह दी।',
          observations: 'सफेद मक्खी चिपचिपे जाल लगाने का काम पूरा हुआ',
        };
      }
      return v;
    });
  }
  return DEMO_FIELD_VISITS;
}

export const HOTSPOT_DATA: HotspotData[] = [
  {
    id: 'hs-1',
    lat: 18.8309,
    lng: 74.3677,
    district: 'Pune',
    state: 'Maharashtra',
    crop: 'Rice',
    issue: 'Rice Leaf Blast',
    issueType: 'disease',
    riskLevel: 'high',
    reportCount: 14,
    lastReport: '2 hours ago',
    trend: 'increasing',
  },
  {
    id: 'hs-2',
    lat: 19.9975,
    lng: 73.7898,
    district: 'Nashik',
    state: 'Maharashtra',
    crop: 'Onion',
    issue: 'Downy Mildew',
    issueType: 'disease',
    riskLevel: 'high',
    reportCount: 9,
    lastReport: '4 hours ago',
    trend: 'increasing',
  },
  {
    id: 'hs-3',
    lat: 21.1458,
    lng: 79.0882,
    district: 'Nagpur',
    state: 'Maharashtra',
    crop: 'Cotton',
    issue: 'Pink Bollworm',
    issueType: 'pest',
    riskLevel: 'critical',
    reportCount: 22,
    lastReport: '30 mins ago',
    trend: 'increasing',
  },
];

export const DISEASE_TREND_DATA = [
  { month: 'Mar', blast: 12, blight: 8, armyworm: 15, mildew: 5 },
  { month: 'Apr', blast: 18, blight: 14, armyworm: 22, mildew: 8 },
  { month: 'May', blast: 25, blight: 19, armyworm: 35, mildew: 12 },
  { month: 'Jun', blast: 42, blight: 28, armyworm: 48, mildew: 18 },
  { month: 'Jul', blast: 68, blight: 45, armyworm: 62, mildew: 24 },
  { month: 'Aug', blast: 84, blight: 56, armyworm: 75, mildew: 29 },
];

export const STATE_RISK_DATA = [
  { state: 'Maharashtra', diseaseRisk: 82, pestRisk: 74 },
  { state: 'Odisha', diseaseRisk: 78, pestRisk: 65 },
  { state: 'Punjab', diseaseRisk: 62, pestRisk: 58 },
  { state: 'Telangana', diseaseRisk: 70, pestRisk: 68 },
  { state: 'Karnataka', diseaseRisk: 66, pestRisk: 60 },
];

export const DEMO_EMERGENCY_SOP: EmergencySOP = {
  id: 'sop-001',
  adminId: 'u4',
  adminName: 'Collector Rajesh Yadav',
  title: '🚨 Rice Blast Outbreak Emergency SOP — Shirur & Nashik Districts',
  message: 'Emergency Protocol Active: High Relative Humidity (>88%) has triggered extreme risk of Pyricularia oryzae (Rice Blast). All farmers are strictly advised to inspect fields within 48 hours and avoid flood irrigation.',
  severity: 'emergency',
  targetRegions: ['Pune (Shirur, Daund)', 'Nashik (Niphad, Malegaon)', 'Aurangabad'],
  targetCrops: ['Rice (Paddy)', 'Soybean'],
  translations: {
    en: {
      title: '🚨 Rice Blast Outbreak Emergency SOP — Shirur & Nashik Districts',
      message: 'Emergency Protocol Active: High Relative Humidity (>88%) has triggered extreme risk of Pyricularia oryzae (Rice Blast). All farmers are strictly advised to inspect fields within 48 hours and avoid flood irrigation.',
    },
    hi: {
      title: '🚨 धान झुलसा (Rice Blast) प्रकोप आपातकालीन एसओपी (SOP)',
      message: 'आपातकालीन प्रोटोकॉल सक्रिय: उच्च सापेक्ष आर्द्रता (>88%) के कारण धान के झुलसा रोग (राइस ब्लास्ट) का अत्यधिक जोखिम है। सभी किसानों को 48 घंटों के भीतर खेतों का निरीक्षण करने और बाढ़ सिंचाई से बचने की सलाह दी जाती है।',
    },
    mr: {
      title: '🚨 तांदूळ करपा (Rice Blast) आपत्कालीन एसओपी (SOP)',
      message: 'आपत्कालीन प्रोटोकॉल सक्रिय: उच्च आर्द्रतेमुळे (>८८%) तांदूळ करपा रोगाचा तीव्र धोका निर्माण झाला आहे. सर्व शेतकऱ्यांनी पुढील ४৮ तासांत शेताची पाहणी करावी व साचलेले पाणी काढून टाकावे.',
    },
    te: {
      title: '🚨 వరి అగ్గి తెగులు అత్యవసర ఆదేశాలు (SOP)',
      message: 'అత్యవసర ప్రోటోకాల్ సక్రియం: అధిక తేమ (88% కంటే ఎక్కువ) వల్ల వరి అగ్గి తెగులు ప్రమాదం పెరిగింది. రైతులు 48 గంటల్లో చేలను పరిశీలించాలి.',
    },
    ta: {
      title: '🚨 நெல் குலை நோய் அவசர வழிகாட்டுதல் (SOP)',
      message: 'அவசர திட்டம் அமலில் உள்ளது: அதிக ஈரப்பதம் காரணமாக நெல் குலை நோய் ஆபத்து அதிகரித்துள்ளது. 48 மணி நேரத்திற்குள் பயிர்களை ஆய்வு செய்யவும்.',
    },
    kn: {
      title: '🚨 ಭತ್ತದ ಬೆಂಕಿ ರೋಗ ತುರ್ತು ಮಾರ್ಗಸೂಚಿ (SOP)',
      message: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಹೆಚ್ಚಿನ ತೇವಾಂಶದಿಂದ ಭತ್ತದ ಬೆಂಕಿ ರೋಗದ ಭೀತಿ ಹೆಚ್ಚಾಗಿದೆ. 48 ಗಂಟೆಗಳ ಒಳಗೆ ಹೊಲಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    },
    bn: {
      title: '🚨 ধানের ব্লাস্ট রোগ জরুরি নির্দেশিকা (SOP)',
      message: 'জরুরি প্রোটোকল সক্রিয়: অতিরিক্ত আর্দ্রতার কারণে ধানের ব্লাস্ট রোগের তীব্র ঝুঁকি তৈরি হয়েছে। ৪৮ ঘণ্টার মধ্যে ক্ষেত পরিদর্শন করুন।',
    },
    pa: {
      title: '🚨 ਝੋਨੇ ਦੇ ਬਲਾਸਟ ਰੋਗ ਲਈ ਐਮਰਜੈਂਸੀ ਐਸਓਪੀ (SOP)',
      message: 'ਐਮਰਜੈਂਸੀ ਪ੍ਰੋਟੋਕੋਲ ਲਾਗੂ: ਉੱਚ ਨਮੀ ਕਾਰਨ ਝੋਨੇ ਦੇ ਬਲਾਸਟ ਰੋਗ ਦਾ ਖਤਰਾ ਵੱਧ ਗਿਆ ਹੈ। 48 ਘੰਟਿਆਂ ਵਿੱਚ ਖੇਤਾਂ ਦਾ ਮੁਆਇਨਾ ਕਰੋ।',
    },
    or: {
      title: '🚨 ଧାନ ପତ୍ର ପୋଡ଼ା (Rice Blast) ଜରୁରୀକାଳୀନ SOP',
      message: 'ଜରୁରୀକାଳୀନ ପ୍ରୋଟୋକଲ୍ ସକ୍ରିୟ: ଅଧିକ ଆର୍ଦ୍ରତା (୮୮% ରୁ ଅଧିକ) ହେତୁ ଧାନ ପତ୍ର ପୋଡ଼ା ରୋଗର ପ୍ରବଳ ଆଶଙ୍କା ରହିଛି। ସମସ୍ତ ଚାଷୀ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ଜମି ଯାଞ୍ଚ କରନ୍ତୁ।',
    },
  },
  sentAt: '2024-08-05T06:00:00Z',
  isActive: true,
};

export const MOCK_AI_RESULTS: Record<string, AIResult> = {
  rice_blast: {
    predictedIssue: 'Rice Leaf Blast (Pyricularia oryzae)',
    issueType: 'disease',
    confidence: 94,
    severity: 'severe',
    affectedPart: 'Leaf Surface',
    symptoms: ['Spindle-shaped lesions with gray center', 'Brown reddish margins', 'Leaf tip drying'],
    riskFactors: [
      { category: 'weather', label: 'High Relative Humidity (88%)', value: 92, description: 'Optimal spore germination condition', icon: '🌧️' },
      { category: 'crop_context', label: 'Susceptible Growth Stage (Flowering)', value: 85, description: 'High physiological vulnerability', icon: '🌾' },
      { category: 'soil', label: 'High Nitrogen Application', value: 70, description: 'Promotes soft tissue susceptibility', icon: '🧪' },
    ],
    ipmRecommendations: [
      { type: 'cultural', priority: 'immediate', action: 'Avoid excess nitrogenous fertilizer top dressing for 2 weeks.', reason: 'High N increases leaf cell tenderness.' },
      { type: 'biological', priority: 'immediate', action: 'Spray Trichoderma viride @ 5g/L during morning hours.', reason: 'Antagonistic fungus suppresses spore development.' },
      { type: 'chemical_safe', priority: 'short_term', action: 'Spray Tricyclazole 75 WP @ 0.6 g/L if lesions exceed 5% leaf area.', reason: 'Systemic fungicide for blast control.' },
    ],
    weatherEvidence: { temperature: 24, humidity: 88, rainfall: 14.5, riskNote: 'Humidity window matches blast spore peak.' },
    historicalEvidence: 'Shirur taluka reported blast outbreak during August 2023 Kharif season.',
    disclaimer: 'AI prediction verified against ICAR-CRRI epidemiology datasets. Consult local Extension Officer before chemical application.',
  },
  fall_armyworm: {
    predictedIssue: 'Fall Armyworm (Spodoptera frugiperda)',
    issueType: 'pest',
    confidence: 91,
    severity: 'critical',
    affectedPart: 'Whorl & Leaf',
    symptoms: ['Window pane leaf damage', 'Sawdust-like frass in whorl', 'Y-shaped head capsule on larvae'],
    riskFactors: [
      { category: 'image_analysis', label: 'Whorl Frass Damage Pattern', value: 94, description: 'Classic FAW larval feeding sign', icon: '🐛' },
      { category: 'weather', label: 'Warm Night Temperature (23°C)', value: 80, description: 'Accelerates larval development', icon: '🌡️' },
    ],
    ipmRecommendations: [
      { type: 'mechanical', priority: 'immediate', action: 'Hand-pick egg masses and larvae in early morning.', reason: 'Reduces initial population.' },
      { type: 'biological', priority: 'immediate', action: 'Apply Metarhizium anisopliae or NPV spray.', reason: 'Targeted bio-insecticide.' },
      { type: 'chemical_safe', priority: 'short_term', action: 'Apply Emamectin benzoate 5% SG @ 0.4 g/L in whorls.', reason: 'Effective larval control.' },
    ],
    weatherEvidence: { temperature: 28, humidity: 72, rainfall: 4, riskNote: 'Warm conditions favor rapid larval instar progression.' },
    historicalEvidence: 'Vidarbha maize fields experienced FAW infestations in previous kharif.',
    disclaimer: 'AI diagnosis based on whorl feeding pattern. Confirm trap counts before mass chemical intervention.',
  },
  powdery_mildew: {
    predictedIssue: 'Powdery Mildew (Erysiphe spp.)',
    issueType: 'disease',
    confidence: 88,
    severity: 'moderate',
    affectedPart: 'Upper Leaf Surface',
    symptoms: ['White powdery fungal growth', 'Yellowing leaves', 'Stunted plant growth'],
    riskFactors: [
      { category: 'image_analysis', label: 'Powdery White Mycelium Coverage', value: 90, description: 'Clear fungal spore mats', icon: '🍃' },
    ],
    ipmRecommendations: [
      { type: 'cultural', priority: 'immediate', action: 'Ensure proper spacing and pruning for air circulation.', reason: 'Lowers micro-climate moisture.' },
      { type: 'biological', priority: 'immediate', action: 'Spray Neem oil (10,000 ppm) @ 3 ml/L.', reason: 'Prevents fungal spore attachment.' },
    ],
    weatherEvidence: { temperature: 26, humidity: 70, rainfall: 0, riskNote: 'Dry shade with moderate humidity favors powdery mildew.' },
    historicalEvidence: 'Occurs routinely during dry spells following rain.',
    disclaimer: 'Consult Krushi Vigyan Kendra for recommended organic sprays.',
  },
};

export const CROP_DISEASE_MAP: Record<string, string[]> = {
  'Rice (Paddy)': ['Rice Leaf Blast', 'Bacterial Leaf Blight', 'Sheath Blight', 'Brown Spot', 'Stem Borer'],
  'Rice': ['Rice Leaf Blast', 'Bacterial Leaf Blight', 'Sheath Blight', 'Brown Spot', 'Stem Borer'],
  'Soybean': ['Soybean Rust', 'Yellow Mosaic Virus', 'Charcoal Rot', 'Fall Armyworm'],
  'Cotton': ['Pink Bollworm', 'Whitefly', 'Bacterial Blight', 'Fusarium Wilt'],
  'Maize': ['Fall Armyworm', 'Maydis Leaf Blight', 'Turcicum Leaf Blight'],
  'Wheat': ['Yellow Rust', 'Powdery Mildew', 'Loose Smut'],
  'Tomato': ['Early Blight', 'Late Blight', 'Leaf Curl Virus', 'Fruit Borer'],
  'Onion': ['Purple Blotch', 'Downy Mildew', 'Thrips'],
};

export const DEMO_ADVISORIES: Advisory[] = [
  {
    id: 'adv-1',
    farmId: 'f1',
    diagnosisId: 'd1',
    title: 'Rice Blast Containment & Bio-Fungicide Action Plan',
    riskLevel: 'high',
    reason: 'High atmospheric humidity (88%) paired with early spindle lesions detected on Paddy Swarna leaves.',
    steps: [
      { order: 1, action: 'Stop nitrogen fertilizer top dressing immediately for 14 days.', type: 'immediate', completed: true },
      { order: 2, action: 'Spray Trichoderma viride @ 5g/L in clean morning hours.', type: 'immediate', completed: false },
      { order: 3, action: 'Drain excess field water to reduce micro-climate humidity.', type: 'short_term', completed: false },
      { order: 4, action: 'Inspect adjacent farm borders for brown spot spreading.', type: 'monitoring', completed: false },
    ],
    status: 'active',
    translations: {
      en: { title: 'Rice Blast Containment Action Plan', reason: 'High humidity & early leaf blast symptoms.' },
      hi: { title: 'धान झुलसा नियंत्रण कार्य योजना', reason: 'उच्च आर्द्रता और पत्तियों पर शुरुआती झुलसा लक्षण।' },
      mr: { title: 'तांदूळ करपा नियंत्रण कृती योजना', reason: 'उच्च आर्द्रता आणि पानांवर करपा रोगाची सुरुवातीची लक्षणे.' },
    },
    createdAt: '2024-08-05T10:00:00Z',
  }
];

