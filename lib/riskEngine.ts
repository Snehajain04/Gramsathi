// ============================================================
// CROP-SHIELD AI — Risk Engine
// Calculates disease and pest risk from weather + crop context
// ============================================================

import type { RiskLevel, RiskScore, RiskFactor, DailyRiskForecast } from '@/types';

// ── Interfaces ────────────────────────────────────────────────
export interface WeatherInput {
  temperature: number;   // °C
  humidity: number;      // %
  rainfall: number;      // mm/week
  soilMoisture: number;  // %
  windSpeed: number;     // km/h
}

export interface CropContextInput {
  cropName: string;
  growthStage: string;
  previousDiseaseHistory: boolean;
  soilType: string;
}

export interface TrapCountInput {
  pestType: string;
  count: number;
  etlThreshold: number;
}

export interface RiskEngineOutput {
  diseaseScore: number;
  pestScore: number;
  weatherScore: number;
  overallScore: number;
  diseaseRisk: RiskLevel;
  pestRisk: RiskLevel;
  weatherRisk: RiskLevel;
  overallRisk: RiskLevel;
  factors: RiskFactor[];
  recommendation: string;
}

// ── Helper: Score to Risk Level ───────────────────────────────
function scoreToRisk(score: number): RiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 55) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

// ── Humidity Disease Risk ─────────────────────────────────────
function humidityDiseaseScore(humidity: number): number {
  // Fungal diseases thrive in humidity > 70%
  if (humidity >= 90) return 35;
  if (humidity >= 80) return 28;
  if (humidity >= 70) return 18;
  if (humidity >= 60) return 8;
  return 2;
}

// ── Temperature Disease Risk ──────────────────────────────────
function temperatureDiseaseScore(temp: number, cropName: string): number {
  // Most fungal pathogens thrive in 20-30°C
  // Rice Blast optimal: 24-28°C
  const riceOptimal = temp >= 22 && temp <= 29;
  const blightOptimal = temp >= 18 && temp <= 26;

  if (cropName === 'Rice' && riceOptimal) return 25;
  if (cropName === 'Tomato' && blightOptimal) return 20;
  if (temp >= 20 && temp <= 30) return 15;
  if (temp >= 15 && temp <= 35) return 8;
  return 2;
}

// ── Rainfall Disease Risk ─────────────────────────────────────
function rainfallDiseaseScore(rainfall: number): number {
  if (rainfall >= 50) return 25;
  if (rainfall >= 30) return 18;
  if (rainfall >= 15) return 12;
  if (rainfall >= 5) return 6;
  return 0;
}

// ── Crop Stage Risk ───────────────────────────────────────────
function cropStageScore(stage: string, cropName: string): number {
  const highRiskStages: Record<string, string[]> = {
    Rice: ['Tillering', 'Panicle Initiation', 'Heading'],
    Wheat: ['Heading', 'Grain Filling'],
    Maize: ['Seedling (V3)', 'Vegetative (V6)', 'Tasseling'],
    Tomato: ['Flowering', 'Fruit Set'],
    Cotton: ['Boll Development'],
  };
  const mediumRiskStages: Record<string, string[]> = {
    Rice: ['Seedling', 'Grain Filling'],
    Wheat: ['Jointing', 'Tillering'],
    Maize: ['Silking', 'Grain Fill'],
  };

  const highStages = highRiskStages[cropName] || [];
  const mediumStages = mediumRiskStages[cropName] || [];

  if (highStages.some(s => stage.includes(s))) return 20;
  if (mediumStages.some(s => stage.includes(s))) return 12;
  return 5;
}

// ── Pest Score from Trap Count ────────────────────────────────
function trapCountPestScore(traps: TrapCountInput[]): number {
  if (!traps || traps.length === 0) return 10; // baseline

  let totalScore = 0;
  for (const trap of traps) {
    const ratio = trap.count / trap.etlThreshold;
    if (ratio >= 2.0) totalScore += 40;
    else if (ratio >= 1.5) totalScore += 30;
    else if (ratio >= 1.0) totalScore += 22;
    else if (ratio >= 0.7) totalScore += 15;
    else totalScore += 5;
  }
  return Math.min(totalScore / traps.length, 50);
}

// ── Historical Risk Bonus ─────────────────────────────────────
function historicalRiskBonus(hasHistory: boolean): number {
  return hasHistory ? 10 : 0;
}

// ── Main Risk Calculator ──────────────────────────────────────
export function calculateRisk(
  weather: WeatherInput,
  cropContext: CropContextInput,
  traps: TrapCountInput[] = [],
): RiskEngineOutput {
  // Disease score
  const humScore = humidityDiseaseScore(weather.humidity);
  const tempScore = temperatureDiseaseScore(weather.temperature, cropContext.cropName);
  const rainScore = rainfallDiseaseScore(weather.rainfall);
  const stageScore = cropStageScore(cropContext.growthStage, cropContext.cropName);
  const histBonus = historicalRiskBonus(cropContext.previousDiseaseHistory);

  const diseaseScore = Math.min(
    humScore + tempScore + rainScore + stageScore + histBonus,
    100
  );

  // Pest score
  const trapScore = trapCountPestScore(traps);
  const tempPestScore = weather.temperature >= 25 && weather.temperature <= 35 ? 15 : 5;
  const pestScore = Math.min(trapScore + tempPestScore + histBonus, 100);

  // Weather risk score
  const weatherScore = Math.min(
    humScore + rainScore + (weather.soilMoisture > 70 ? 15 : 5),
    100
  );

  // Overall weighted
  const overallScore = Math.round(
    diseaseScore * 0.45 + pestScore * 0.30 + weatherScore * 0.25
  );

  // Build risk factors
  const factors: RiskFactor[] = [
    {
      name: 'Humidity',
      value: `${weather.humidity}%`,
      impact: weather.humidity >= 80 ? 'high' : weather.humidity >= 65 ? 'medium' : 'low',
      description:
        weather.humidity >= 80
          ? 'Very high humidity — strongly favors fungal disease development'
          : weather.humidity >= 65
          ? 'Moderate humidity — monitor for disease progression'
          : 'Humidity within safe range',
    },
    {
      name: 'Rainfall',
      value: `${weather.rainfall} mm/week`,
      impact: weather.rainfall >= 30 ? 'high' : weather.rainfall >= 10 ? 'medium' : 'low',
      description:
        weather.rainfall >= 30
          ? 'Heavy rainfall increases disease spore dispersal and leaf wetness'
          : 'Moderate rainfall — some disease risk',
    },
    {
      name: 'Temperature',
      value: `${weather.temperature}°C`,
      impact: weather.temperature >= 22 && weather.temperature <= 30 ? 'high' : 'medium',
      description:
        weather.temperature >= 22 && weather.temperature <= 30
          ? 'Temperature in optimal range for pathogen growth'
          : 'Temperature outside peak pathogen range',
    },
    {
      name: 'Crop Stage',
      value: cropContext.growthStage,
      impact: stageScore >= 15 ? 'high' : stageScore >= 10 ? 'medium' : 'low',
      description: `${cropContext.growthStage} — ${stageScore >= 15 ? 'highly susceptible' : stageScore >= 10 ? 'moderately susceptible' : 'lower susceptibility'} stage`,
    },
    {
      name: 'Soil Moisture',
      value: `${weather.soilMoisture}%`,
      impact: weather.soilMoisture >= 70 ? 'high' : weather.soilMoisture >= 55 ? 'medium' : 'low',
      description:
        weather.soilMoisture >= 70
          ? 'High soil moisture promotes root-related diseases and favors pest pupation'
          : 'Soil moisture at moderate levels',
    },
  ];

  if (traps.length > 0) {
    const maxTrap = traps.reduce((a, b) => (a.count / a.etlThreshold > b.count / b.etlThreshold ? a : b));
    factors.push({
      name: 'Pest Trap Count',
      value: `${maxTrap.count} (ETL: ${maxTrap.etlThreshold})`,
      impact: maxTrap.count >= maxTrap.etlThreshold ? 'high' : 'medium',
      description:
        maxTrap.count >= maxTrap.etlThreshold
          ? `⚠️ ${maxTrap.pestType} count ABOVE Economic Threshold Level — action may be needed`
          : `${maxTrap.pestType} count below ETL — continue monitoring`,
    });
  }

  if (cropContext.previousDiseaseHistory) {
    factors.push({
      name: 'Historical Risk',
      value: 'Positive history',
      impact: 'medium',
      description: 'Disease/pest reported in this area in previous seasons — higher re-infection risk',
    });
  }

  // Recommendation
  let recommendation = '';
  const overall = scoreToRisk(overallScore);
  if (overall === 'critical' || overall === 'high') {
    recommendation = 'IMMEDIATE ACTION REQUIRED: Conduct thorough field inspection. Contact your extension worker. Follow IPM guidelines. Do NOT apply any chemical inputs without expert guidance.';
  } else if (overall === 'medium') {
    recommendation = 'ENHANCED MONITORING: Increase field visit frequency to every 2 days. Set up or check pest traps. Record and report any symptom changes.';
  } else {
    recommendation = 'ROUTINE MONITORING: Continue regular field checks. Maintain good agronomic practices. Report any unusual symptom to extension worker promptly.';
  }

  return {
    diseaseScore: Math.round(diseaseScore),
    pestScore: Math.round(pestScore),
    weatherScore: Math.round(weatherScore),
    overallScore,
    diseaseRisk: scoreToRisk(diseaseScore),
    pestRisk: scoreToRisk(pestScore),
    weatherRisk: scoreToRisk(weatherScore),
    overallRisk: overall,
    factors,
    recommendation,
  };
}

// ── 7-Day Forecast Generator ──────────────────────────────────
export function generate7DayForecast(
  baseWeather: WeatherInput,
  cropContext: CropContextInput,
): DailyRiskForecast[] {
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  // Simulate weather variation over 7 days
  const humidityPattern = [0, +6, +8, -5, -10, -15, -20];
  const rainfallPattern = [0, +15, +20, +5, 0, 0, 0];
  const tempPattern = [0, -1, -2, +1, +2, +3, +3];

  return days.map((dayLabel, i) => {
    const w: WeatherInput = {
      ...baseWeather,
      humidity: Math.min(100, baseWeather.humidity + humidityPattern[i]),
      rainfall: Math.max(0, baseWeather.rainfall + rainfallPattern[i]),
      temperature: baseWeather.temperature + tempPattern[i],
    };
    const result = calculateRisk(w, cropContext);
    const date = new Date();
    date.setDate(date.getDate() + i);

    let description = '';
    if (result.overallRisk === 'high' || result.overallRisk === 'critical') {
      description = 'High risk period — intensive monitoring and preventive action recommended';
    } else if (result.overallRisk === 'medium') {
      description = 'Moderate risk — enhanced monitoring advised';
    } else {
      description = 'Low risk — maintain routine monitoring practices';
    }

    return {
      date: date.toISOString().split('T')[0],
      dayLabel,
      diseaseRisk: result.diseaseRisk,
      pestRisk: result.pestRisk,
      overallScore: result.overallScore,
      temp: w.temperature,
      humidity: w.humidity,
      rainfall: w.rainfall,
      description,
    };
  });
}

// ── ETL Check ─────────────────────────────────────────────────
export function checkETL(count: number, threshold: number): {
  status: 'normal' | 'monitoring' | 'above_etl' | 'action_required';
  label: string;
  ratio: number;
} {
  const ratio = count / threshold;
  if (ratio >= 2.0) return { status: 'action_required', label: 'Action Required', ratio };
  if (ratio >= 1.0) return { status: 'above_etl', label: 'Above ETL', ratio };
  if (ratio >= 0.7) return { status: 'monitoring', label: 'Monitoring', ratio };
  return { status: 'normal', label: 'Normal', ratio };
}

// ── Export risk level color ───────────────────────────────────
export function getRiskColor(risk: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#7c3aed',
  };
  return map[risk];
}

export function getRiskBgClass(risk: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
    critical: 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return map[risk];
}

export function getRiskDotClass(risk: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
    critical: 'bg-purple-600',
  };
  return map[risk];
}
