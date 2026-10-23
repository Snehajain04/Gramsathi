import { NextRequest, NextResponse } from 'next/server';
import { calculateRisk, generate7DayForecast } from '@/lib/riskEngine';
import type { WeatherInput, CropContextInput, TrapCountInput } from '@/lib/riskEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      weather: WeatherInput;
      cropContext: CropContextInput;
      traps?: TrapCountInput[];
    };

    if (!body.weather || !body.cropContext) {
      return NextResponse.json(
        { success: false, error: 'weather and cropContext are required' },
        { status: 400 }
      );
    }

    const riskResult = calculateRisk(body.weather, body.cropContext, body.traps || []);
    const forecast = generate7DayForecast(body.weather, body.cropContext);

    return NextResponse.json({
      success: true,
      risk: riskResult,
      forecast,
      calculatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Risk API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ── API Contract ──────────────────────────────────────────────
// POST /api/risk/calculate
// Request:
// {
//   weather: {
//     temperature: number,   // °C
//     humidity: number,      // %
//     rainfall: number,      // mm/week
//     soilMoisture: number,  // %
//     windSpeed: number      // km/h
//   },
//   cropContext: {
//     cropName: string,
//     growthStage: string,
//     previousDiseaseHistory: boolean,
//     soilType: string
//   },
//   traps?: [{ pestType: string, count: number, etlThreshold: number }]
// }
// Response:
// {
//   success: boolean,
//   risk: RiskEngineOutput,
//   forecast: DailyRiskForecast[],
//   calculatedAt: string
// }
