// ============================================================
// CROP-SHIELD AI — Complete TypeScript Type Definitions
// ============================================================

export type UserRole = 'farmer' | 'extension_worker' | 'expert' | 'admin';

export type Language =
  | 'en'
  | 'hi'
  | 'mr'
  | 'te'
  | 'ta'
  | 'kn'
  | 'bn'
  | 'pa'
  | 'or';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical';

export type DiagnosisStatus =
  | 'pending'
  | 'ai_complete'
  | 'expert_review'
  | 'expert_verified'
  | 'field_confirmed'
  | 'rejected';

export type VisitStatus =
  | 'pending'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

// ── User ─────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: Language;
  phone?: string;
  state?: string;
  district?: string;
  avatar?: string;
  createdAt: string;
}

// ── Farm ─────────────────────────────────────────────────────
export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  area: number; // in acres
  areaUnit: 'acres' | 'hectares';
  soilType: string;
  irrigationType: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  healthStatus: RiskLevel;
  createdAt: string;
}

// ── Crop ─────────────────────────────────────────────────────
export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  growthStage: string;
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'active' | 'harvested' | 'failed';
}

// ── Diagnosis ────────────────────────────────────────────────
export interface Diagnosis {
  id: string;
  farmId: string;
  cropId: string;
  farmerId: string;
  imageUrl: string;
  crop: string;
  cropStage: string;
  affectedPart: string;
  symptoms: string[];
  location: string;
  lat: number;
  lng: number;
  status: DiagnosisStatus;
  aiResult?: AIResult;
  expertReview?: ExpertReview;
  createdAt: string;
  updatedAt: string;
}

// ── AI Result ────────────────────────────────────────────────
export interface AIResult {
  predictedIssue: string;
  issueType: 'disease' | 'pest' | 'nutrient_deficiency' | 'abiotic';
  confidence: number; // 0-100
  severity: SeverityLevel;
  affectedPart: string;
  symptoms: string[];
  riskFactors: XAIFactor[];
  ipmRecommendations: IPMRecommendation[];
  weatherEvidence: WeatherEvidence;
  historicalEvidence: string;
  disclaimer: string;
}

export interface XAIFactor {
  category:
    | 'image_analysis'
    | 'weather'
    | 'crop_context'
    | 'historical'
    | 'soil';
  label: string;
  value: number; // contribution weight 0-100
  description: string;
  icon: string;
}

export interface WeatherEvidence {
  temperature: number;
  humidity: number;
  rainfall: number;
  riskNote: string;
}

// ── IPM Recommendation ───────────────────────────────────────
export interface IPMRecommendation {
  type: 'cultural' | 'biological' | 'mechanical' | 'chemical_safe' | 'monitoring' | 'referral';
  priority: 'immediate' | 'short_term' | 'preventive';
  action: string;
  reason: string;
  safetyNote?: string;
}

// ── Expert Review ────────────────────────────────────────────
export interface ExpertReview {
  id: string;
  diagnosisId: string;
  expertId: string;
  expertName: string;
  verdict: 'confirmed' | 'rejected' | 'inconclusive' | 'needs_more_info';
  confirmedDisease?: string;
  severity?: SeverityLevel;
  comments: string;
  managementAdvice: string;
  reviewedAt: string;
  badge: 'ai_prediction' | 'expert_verified' | 'field_confirmed';
}

// ── Risk Score ───────────────────────────────────────────────
export interface RiskScore {
  diseaseRisk: RiskLevel;
  pestRisk: RiskLevel;
  weatherRisk: RiskLevel;
  overallRisk: RiskLevel;
  diseaseScore: number; // 0-100
  pestScore: number;
  weatherScore: number;
  overallScore: number;
  factors: RiskFactor[];
  forecast: DailyRiskForecast[];
  calculatedAt: string;
}

export interface RiskFactor {
  name: string;
  value: string | number;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

export interface DailyRiskForecast {
  date: string;
  dayLabel: string;
  diseaseRisk: RiskLevel;
  pestRisk: RiskLevel;
  overallScore: number;
  temp: number;
  humidity: number;
  rainfall: number;
  description: string;
}

// ── Weather ──────────────────────────────────────────────────
export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  soilMoisture: number;
  uvIndex: number;
  condition: string;
  icon: string;
  updatedAt: string;
}

// ── Pest Trap ────────────────────────────────────────────────
export interface PestTrap {
  id: string;
  farmId: string;
  trapType: 'pheromone' | 'sticky' | 'light' | 'pitfall';
  location: string;
  lat: number;
  lng: number;
  pestType: string;
  lastCount: number;
  etlThreshold: number;
  status: 'normal' | 'monitoring' | 'above_etl' | 'action_required';
  trend: 'increasing' | 'stable' | 'decreasing';
  readings: TrapReading[];
  lastUpdated: string;
}

export interface TrapReading {
  date: string;
  count: number;
  notes?: string;
}

// ── Alert ────────────────────────────────────────────────────
export interface Alert {
  id: string;
  type:
    | 'disease_outbreak'
    | 'pest_infestation'
    | 'weather_warning'
    | 'early_warning'
    | 'emergency_sop';
  severity: RiskLevel;
  title: string;
  message: string;
  region: string;
  district: string;
  state: string;
  affectedCrop?: string;
  confidence?: number;
  riskFactors: string[];
  recommendedAction: string;
  createdAt: string;
  expiresAt?: string;
  isRead?: boolean;
}

// ── Emergency SOP ────────────────────────────────────────────
export interface EmergencySOP {
  id: string;
  adminId: string;
  adminName: string;
  title: string;
  message: string;
  severity: 'advisory' | 'warning' | 'critical' | 'emergency';
  targetRegions: string[];
  targetCrops?: string[];
  translations: Record<Language, { title: string; message: string }>;
  sentAt: string;
  expiresAt?: string;
  isActive: boolean;
}

// ── Advisory ─────────────────────────────────────────────────
export interface Advisory {
  id: string;
  farmId: string;
  diagnosisId?: string;
  title: string;
  riskLevel: RiskLevel;
  reason: string;
  steps: AdvisoryStep[];
  status: 'active' | 'acknowledged' | 'completed';
  translations: Record<string, { title: string; reason: string }>;
  createdAt: string;
}

export interface AdvisoryStep {
  order: number;
  action: string;
  type: 'immediate' | 'short_term' | 'preventive' | 'monitoring';
  completed: boolean;
}

// ── Field Visit ──────────────────────────────────────────────
export interface FieldVisit {
  id: string;
  extensionWorkerId: string;
  extensionWorkerName: string;
  farmId: string;
  farmName: string;
  farmerName: string;
  diagnosisId?: string;
  status: VisitStatus;
  scheduledDate?: string;
  completedDate?: string;
  observations: string;
  severity?: SeverityLevel;
  images: string[];
  notes: string;
  resolution?: string;
}

// ── GIS Hotspot ──────────────────────────────────────────────
export interface HotspotData {
  id: string;
  lat: number;
  lng: number;
  district: string;
  state: string;
  crop: string;
  issue: string;
  issueType: 'disease' | 'pest';
  riskLevel: RiskLevel;
  reportCount: number;
  lastReport: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

// ── Notification ─────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  type:
    | 'high_risk_alert'
    | 'risk_increase'
    | 'expert_validation'
    | 'diagnosis_complete'
    | 'extension_message'
    | 'weather_warning'
    | 'emergency_sop'
    | 'pest_alert';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ── Sensor ───────────────────────────────────────────────────
export interface SensorData {
  id: string;
  farmId: string;
  sensorType:
    | 'temperature'
    | 'soil_moisture'
    | 'humidity'
    | 'rainfall'
    | 'pest_trap_smart';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  lastUpdated: string;
  trend: number[]; // last 24h readings
}

// ── Extension Worker Case ────────────────────────────────────
export interface Case {
  id: string;
  farmerId: string;
  farmerName: string;
  village: string;
  crop: string;
  problem: string;
  riskLevel: RiskLevel;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  diagnosisId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Dashboard Stats ──────────────────────────────────────────
export interface DashboardStats {
  totalFarmers: number;
  totalFarms: number;
  activeAlerts: number;
  diseaseReports: number;
  pestReports: number;
  highRiskDistricts: number;
  pendingCases: number;
  resolvedCases: number;
  expertValidationRate: number;
  aiAccuracy: number;
}

// ── Form Types ───────────────────────────────────────────────
export interface DiagnosisFormData {
  crop: string;
  cropVariety: string;
  cropStage: string;
  affectedPart: string;
  symptoms: string[];
  location: string;
  notes?: string;
  image?: File;
}

export interface PestReportFormData {
  pestType: string;
  crop: string;
  location: string;
  date: string;
  count: number;
  trapCount?: number;
  notes?: string;
  image?: File;
}

// ── Government Scheme ──────────────────────────────────────────
export type RuralCategory =
  | 'Farmer Schemes'
  | 'Rural Employment'
  | 'Women & SHGs'
  | 'Housing'
  | 'Water & Infrastructure'
  | 'Healthcare'
  | 'Education & Skills'
  | 'Artisans & Small Business';

export interface SchemeEligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  gender?: 'any' | 'female' | 'male';
  occupations?: string[];
  requiresLand?: boolean;
  requiresSHG?: boolean;
  requiresKutchaHouse?: boolean;
  state?: 'All India' | 'Odisha' | 'Maharashtra';
}

export interface GovernmentScheme {
  id: string;
  title: string;
  shortDesc: string;
  category: 'Weather & Forecasting' | 'Crop Protection' | 'Financial & Insurance' | 'Solar & Tech' | 'Soil Health' | 'General Rural';
  ruralCategory: RuralCategory;
  stateScope: 'All India' | 'Odisha' | 'Maharashtra';
  benefits: string[];
  eligibility: string;
  eligibilityCriteria?: SchemeEligibilityCriteria;
  requiredDocuments: string[];
  howToApply: string[];
  officialLink: string;
  assistanceCenter: string;
  helpline?: string;
  icon: string;
  isPopular?: boolean;
}

// ── Local Precaution & Suggestion ─────────────────────────────
export interface LocalPrecaution {
  id: string;
  title: string;
  category: 'Weather Caution' | 'Crop Protection' | 'Soil & Irrigation' | 'Pest Advisory';
  severity: 'High Priority' | 'Moderate' | 'Good Practice';
  targetCrop: string;
  suggestion: string;
  actionSteps: string[];
  icon: string;
  updatedAt: string;
}

// ── Farmer News ───────────────────────────────────────────────
export interface FarmerNews {
  id: string;
  title: string;
  summary: string;
  category: 'Weather Advisory' | 'Govt Scheme' | 'Market & Subsidy' | 'Supply Update';
  publishedDate: string;
  readTime: string;
  source: string;
  imageUrl?: string;
  audioText?: string;
  isImportant?: boolean;
}

