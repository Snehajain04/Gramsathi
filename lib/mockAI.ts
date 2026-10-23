// ============================================================
// CROP-SHIELD AI — Mock AI Diagnosis Service
// Pluggable interface — replace with real PyTorch/YOLO model
// ============================================================

import type { AIResult } from '@/types';
import { MOCK_AI_RESULTS, CROP_DISEASE_MAP } from './mockData';

// ── Request / Response Interfaces ────────────────────────────
export interface DiagnosisRequest {
  crop: string;
  cropStage: string;
  affectedPart: string;
  symptoms: string[];
  location?: string;
  imageBase64?: string;  // would be sent to real model
  humidity?: number;
  temperature?: number;
  rainfall?: number;
}

export interface DiagnosisResponse {
  success: boolean;
  result?: AIResult;
  error?: string;
  processingTime: number;
  modelVersion: string;
  disclaimer: string;
}

// ── Disease Symptom Mapping ───────────────────────────────────
const SYMPTOM_DISEASE_MAP: Record<string, string[]> = {
  'lesions': ['Rice Leaf Blast', 'Leaf Spot', 'Early Blight'],
  'yellowing': ['Bacterial Leaf Blight', 'Nutrient Deficiency', 'Sheath Blight'],
  'wilting': ['Root Rot', 'Wilt Disease', 'Bacterial Blight'],
  'holes': ['Fall Armyworm', 'Stem Borer', 'Leaf Miner'],
  'powder': ['Powdery Mildew'],
  'rust': ['Wheat Rust', 'Soybean Rust'],
  'rotting': ['Late Blight', 'Fruit Rot', 'Stem Rot'],
  'discoloration': ['Leaf Blast', 'Nutrient Deficiency', 'Virus Disease'],
  'frass': ['Fall Armyworm', 'Fruit Borer', 'Stem Borer'],
  'webbing': ['Spider Mites', 'Mite Infestation'],
};

// ── Confidence Modifier by Evidence ──────────────────────────
function calculateConfidence(
  crop: string,
  stage: string,
  symptoms: string[],
  humidity?: number,
  temperature?: number,
): number {
  let baseConfidence = 75;

  // More symptoms = higher confidence
  baseConfidence += Math.min(symptoms.length * 3, 12);

  // Weather correlation
  if (humidity && humidity >= 80) baseConfidence += 5;
  if (temperature && temperature >= 22 && temperature <= 28) baseConfidence += 3;

  // Crop + stage specificity
  if (crop && stage) baseConfidence += 4;

  // Cap at 97%
  return Math.min(baseConfidence, 97);
}

// ── Disease Selector ──────────────────────────────────────────
function selectLikelyDisease(
  crop: string,
  symptoms: string[],
  affectedPart: string,
  humidity?: number,
): { key: string; disease: string } {
  const cropDiseases = CROP_DISEASE_MAP[crop] || [];

  // Match by symptoms
  const symptomKeywords = symptoms.join(' ').toLowerCase();

  if (crop === 'Rice') {
    if (symptomKeywords.includes('lesion') || symptomKeywords.includes('blast') || affectedPart === 'Leaf') {
      return { key: 'rice_blast', disease: 'Rice Leaf Blast' };
    }
    if (symptomKeywords.includes('yellow') || symptomKeywords.includes('blight')) {
      return { key: 'rice_blast', disease: 'Bacterial Leaf Blight' };
    }
    if (symptomKeywords.includes('hole') || symptomKeywords.includes('frass') || symptomKeywords.includes('caterpillar')) {
      return { key: 'fall_armyworm', disease: 'Fall Armyworm' };
    }
  }

  if (crop === 'Maize' || crop === 'Soybean') {
    if (symptomKeywords.includes('hole') || symptomKeywords.includes('frass') || symptomKeywords.includes('worm')) {
      return { key: 'fall_armyworm', disease: 'Fall Armyworm' };
    }
  }

  if (symptomKeywords.includes('powder') || symptomKeywords.includes('white coat')) {
    return { key: 'powdery_mildew', disease: 'Powdery Mildew' };
  }

  // Weather-driven default: if high humidity, likely fungal
  if (humidity && humidity >= 80 && crop === 'Rice') {
    return { key: 'rice_blast', disease: 'Rice Leaf Blast' };
  }

  // Default: first common disease for the crop
  if (cropDiseases.length > 0) {
    const firstDisease = cropDiseases[0];
    if (firstDisease.includes('Blast')) return { key: 'rice_blast', disease: firstDisease };
    if (firstDisease.includes('Armyworm')) return { key: 'fall_armyworm', disease: firstDisease };
    if (firstDisease.includes('Mildew')) return { key: 'powdery_mildew', disease: firstDisease };
  }

  return { key: 'rice_blast', disease: 'Leaf Disease (unspecified)' };
}

// ── Main Diagnosis Function ───────────────────────────────────
// This is the abstraction layer. Replace the body with a real
// API call to your PyTorch/TensorFlow serving endpoint:
// POST https://your-model-server/predict
// Body: { image_base64, crop, stage, symptoms }
// Response: { disease, confidence, bbox, severity }

export async function runDiagnosis(request: DiagnosisRequest): Promise<DiagnosisResponse> {
  const startTime = Date.now();

  try {
    // ── SIMULATE PROCESSING DELAY ─────────────────────────────
    // Remove this when connecting to real model
    await new Promise(resolve => setTimeout(resolve, 2500));

    const { key } = selectLikelyDisease(
      request.crop,
      request.symptoms,
      request.affectedPart,
      request.humidity,
    );

    const baseResult = MOCK_AI_RESULTS[key] || MOCK_AI_RESULTS['rice_blast'];

    const confidence = calculateConfidence(
      request.crop,
      request.cropStage,
      request.symptoms,
      request.humidity,
      request.temperature,
    );

    // Customize result based on context
    const result: AIResult = {
      ...baseResult,
      confidence,
      weatherEvidence: {
        temperature: request.temperature ?? 27,
        humidity: request.humidity ?? 75,
        rainfall: request.rainfall ?? 25,
        riskNote:
          (request.humidity ?? 75) >= 80
            ? 'Current high humidity conditions strongly favor disease development.'
            : 'Weather conditions pose moderate risk for disease.',
      },
    };

    return {
      success: true,
      result,
      processingTime: Date.now() - startTime,
      modelVersion: 'GramSathi-AI-v2.1',
      disclaimer:
        'This is an AI-assisted preliminary assessment generated by a prototype model. ' +
        'Results are for guidance only and MUST be validated by a qualified agricultural expert ' +
        'before taking any management action. Do not apply any chemical pesticide based on this result alone.',
    };
  } catch (err) {
    return {
      success: false,
      error: 'Diagnosis service temporarily unavailable. Please try again.',
      processingTime: Date.now() - startTime,
      modelVersion: 'GramSathi-AI-v2.1',
      disclaimer: '',
    };
  }
}

// ── Processing Steps for UI Animation ────────────────────────
export const DIAGNOSIS_STEPS = [
  { id: 1, label: 'Analyzing leaf/stem patterns...', duration: 600 },
  { id: 2, label: 'Comparing visual symptoms with database...', duration: 600 },
  { id: 3, label: 'Checking crop growth context...', duration: 500 },
  { id: 4, label: 'Analyzing weather risk correlation...', duration: 400 },
  { id: 5, label: 'Reviewing local disease history...', duration: 300 },
  { id: 6, label: 'Generating preliminary assessment...', duration: 100 },
];

// ── Weather Fetch Abstraction ─────────────────────────────────
// Replace with real OpenWeatherMap API call
export async function fetchWeatherData(location: string): Promise<{
  temperature: number;
  humidity: number;
  rainfall: number;
  soilMoisture: number;
  windSpeed: number;
  condition: string;
}> {
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return mock weather — replace with:
  // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`)
  return {
    temperature: 27,
    humidity: 82,
    rainfall: 45,
    soilMoisture: 68,
    windSpeed: 12,
    condition: 'Partly Cloudy with high humidity',
  };
}
