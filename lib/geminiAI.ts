// ============================================================
// CROP-SHIELD — Gemini 1.5 Flash AI Integration
// Pluggable: set GEMINI_API_KEY in .env.local to enable real AI
// Falls back to mockAI if key is absent
// ============================================================

import type { DiagnosisResponse } from './mockAI';
import type { DiagnosisRequest } from './mockAI';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// ── Build the structured prompt ───────────────────────────────
function buildDiagnosisPrompt(req: DiagnosisRequest): string {
  return `You are an expert agricultural plant pathologist and pest management specialist for Indian crops.

A farmer has reported the following:
- Crop: ${req.crop}
- Growth Stage: ${req.cropStage}
- Affected Part: ${req.affectedPart}
- Symptoms: ${req.symptoms.join(', ')}
- Location: ${req.location || 'Maharashtra, India'}
- Weather: Temperature ${req.temperature ?? '?'}°C, Humidity ${req.humidity ?? '?'}%, Rainfall ${req.rainfall ?? '?'}mm

Please respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) in exactly this format:
{
  "predictedIssue": "primary disease or pest name",
  "issueType": "disease",
  "confidence": <integer 60-97>,
  "severity": "mild" or "moderate" or "severe" or "critical",
  "affectedPart": "the crop part affected",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "historicalEvidence": "brief historical note about this disease in India",
  "disclaimer": "standard AI disclaimer",
  "riskFactors": [
    { "category": "image_analysis", "label": "Visual Symptoms", "value": <0-100>, "description": "reason", "icon": "🔬" },
    { "category": "weather", "label": "Weather Conditions", "value": <0-100>, "description": "reason", "icon": "🌦" },
    { "category": "crop_context", "label": "Crop Stage", "value": <0-100>, "description": "reason", "icon": "🌾" }
  ],
  "ipmRecommendations": [
    { "type": "monitoring", "priority": "immediate", "action": "specific action", "reason": "reason" },
    { "type": "cultural", "priority": "immediate", "action": "specific action", "reason": "reason" },
    { "type": "biological", "priority": "short_term", "action": "specific action", "reason": "reason" },
    { "type": "chemical_safe", "priority": "short_term", "action": "consult KVK/expert before any chemical use", "reason": "reason", "safetyNote": "safety note" },
    { "type": "referral", "priority": "immediate", "action": "contact your local KVK or extension officer", "reason": "reason" }
  ],
  "weatherEvidence": {
    "temperature": <number>,
    "humidity": <number>,
    "rainfall": <number>,
    "riskNote": "weather risk explanation"
  }
}`;
}

// ── Gemini API call ───────────────────────────────────────────
async function callGeminiFlash(prompt: string): Promise<Record<string, unknown>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Strip any accidental markdown fences
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean) as Record<string, unknown>;
}

// ── Convert Gemini output → DiagnosisResponse ─────────────────
function mapGeminiToResponse(
  raw: Record<string, unknown>,
  startTime: number,
): DiagnosisResponse {
  // Normalise severity to lowercase (project type: 'mild'|'moderate'|'severe'|'critical')
  const rawSev = String(raw.severity ?? 'moderate').toLowerCase();
  const severity = (['mild', 'moderate', 'severe', 'critical'].includes(rawSev)
    ? rawSev
    : 'moderate') as 'mild' | 'moderate' | 'severe' | 'critical';

  const weatherRaw = (raw.weatherEvidence as Record<string, unknown> | undefined) ?? {};

  return {
    success: true,
    result: {
      predictedIssue: String(raw.predictedIssue ?? 'Unknown Disease'),
      issueType: (raw.issueType as 'disease' | 'pest' | 'nutrient_deficiency' | 'abiotic') ?? 'disease',
      confidence: Number(raw.confidence ?? 80),
      severity,
      affectedPart: String(raw.affectedPart ?? 'Leaf'),
      symptoms: Array.isArray(raw.symptoms) ? (raw.symptoms as string[]) : [],
      riskFactors: Array.isArray(raw.riskFactors)
        ? (raw.riskFactors as Array<{
            category: string;
            label: string;
            value: number;
            description: string;
            icon: string;
          }>).map(f => ({
            category: f.category as 'image_analysis' | 'weather' | 'crop_context' | 'historical' | 'soil',
            label: f.label,
            value: f.value,
            description: f.description,
            icon: f.icon,
          }))
        : [],
      ipmRecommendations: Array.isArray(raw.ipmRecommendations)
        ? (raw.ipmRecommendations as Array<{
            type: string;
            priority: string;
            action: string;
            reason: string;
            safetyNote?: string;
          }>).map(r => ({
            type: r.type as 'cultural' | 'biological' | 'mechanical' | 'chemical_safe' | 'monitoring' | 'referral',
            priority: r.priority as 'immediate' | 'short_term' | 'preventive',
            action: r.action,
            reason: r.reason,
            safetyNote: r.safetyNote,
          }))
        : [],
      weatherEvidence: {
        temperature: Number(weatherRaw.temperature ?? 27),
        humidity: Number(weatherRaw.humidity ?? 75),
        rainfall: Number(weatherRaw.rainfall ?? 25),
        riskNote: String(weatherRaw.riskNote ?? 'Weather analysis powered by Gemini Flash.'),
      },
      historicalEvidence: String(raw.historicalEvidence ?? 'Historical data not available.'),
      disclaimer: String(
        raw.disclaimer ??
          'This diagnosis was generated by Google Gemini 1.5 Flash AI. Results are for guidance only and MUST be validated by a qualified agricultural expert.',
      ),
    },
    processingTime: Date.now() - startTime,
    modelVersion: 'GramSathi-GeminiFlash-1.5',
    disclaimer:
      'This diagnosis was generated by Google Gemini 1.5 Flash AI. ' +
      'Results are for guidance only and MUST be validated by a qualified agricultural expert. ' +
      'Do not apply any chemical pesticide based solely on this result.',
  };
}

// ── Main exported function ────────────────────────────────────
export async function runGeminiDiagnosis(
  request: DiagnosisRequest,
): Promise<DiagnosisResponse> {
  const startTime = Date.now();
  const prompt = buildDiagnosisPrompt(request);
  const raw = await callGeminiFlash(prompt);
  return mapGeminiToResponse(raw, startTime);
}

export const isGeminiEnabled = (): boolean =>
  typeof process.env.GEMINI_API_KEY === 'string' &&
  process.env.GEMINI_API_KEY.length > 10;
