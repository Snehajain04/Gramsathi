/**
 * GramSathi API Client
 * ─────────────────────────────────────────────────────────────────────────────
 * All server calls go through this module.
 *
 * In development (browser / Next.js dev server): calls hit /api/* directly.
 * In Capacitor mobile / static export: calls hit NEXT_PUBLIC_API_URL (deployed Vercel/backend).
 *
 * Set NEXT_PUBLIC_API_URL in .env.local to your deployed Vercel URL:
 *   NEXT_PUBLIC_API_URL=https://gramsathi.vercel.app
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Base URL: env var for production/mobile, relative for local dev
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

// ── Gemini AI Diagnose ────────────────────────────────────────────────────────
export interface DiagnosePayload {
  crop: string;
  cropStage: string;
  affectedPart?: string;
  symptoms?: string[];
  location?: string;
  imageBase64?: string;
  humidity?: number;
  temperature?: number;
  rainfall?: number;
}

export async function apiDiagnose(payload: DiagnosePayload) {
  const res = await fetch(`${BASE_URL}/api/ai/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Diagnosis API error ${res.status}`);
  return res.json();
}

// ── Weather ───────────────────────────────────────────────────────────────────
export async function apiWeather(location: string) {
  const res = await fetch(
    `${BASE_URL}/api/weather?location=${encodeURIComponent(location)}`
  );
  if (!res.ok) throw new Error(`Weather API error ${res.status}`);
  return res.json();
}

// ── Risk Calculate ────────────────────────────────────────────────────────────
export interface RiskPayload {
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    soilMoisture: number;
    windSpeed: number;
  };
  cropContext: {
    cropName: string;
    growthStage: string;
    previousDiseaseHistory: boolean;
    soilType: string;
  };
  traps?: Array<{ pestType: string; count: number; etlThreshold: number }>;
}

export async function apiRiskCalculate(payload: RiskPayload) {
  const res = await fetch(`${BASE_URL}/api/risk/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Risk API error ${res.status}`);
  return res.json();
}

// ── Emergency SOP ─────────────────────────────────────────────────────────────
export async function apiGetSOP() {
  const res = await fetch(`${BASE_URL}/api/emergency-sop`);
  if (!res.ok) throw new Error(`SOP GET error ${res.status}`);
  return res.json();
}

export async function apiPostSOP(payload: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/api/emergency-sop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`SOP POST error ${res.status}`);
  return res.json();
}

export async function apiDeleteSOP() {
  const res = await fetch(`${BASE_URL}/api/emergency-sop`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`SOP DELETE error ${res.status}`);
  return res.json();
}

// ── Hotspots ──────────────────────────────────────────────────────────────────
export interface HotspotsFilter {
  state?: string;
  crop?: string;
  riskLevel?: string;
  issueType?: string;
}

export async function apiHotspots(filter: HotspotsFilter = {}) {
  const params = new URLSearchParams();
  if (filter.state) params.set('state', filter.state);
  if (filter.crop) params.set('crop', filter.crop);
  if (filter.riskLevel) params.set('riskLevel', filter.riskLevel);
  if (filter.issueType) params.set('issueType', filter.issueType);

  const res = await fetch(
    `${BASE_URL}/api/hotspots${params.toString() ? `?${params}` : ''}`
  );
  if (!res.ok) throw new Error(`Hotspots API error ${res.status}`);
  return res.json();
}
