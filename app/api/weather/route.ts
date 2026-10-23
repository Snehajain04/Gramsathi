import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/mockAI';
import { DEMO_WEATHER } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location') || 'Pune, Maharashtra';

  try {
    const weather = await fetchWeatherData(location);
    return NextResponse.json({
      success: true,
      location,
      weather: { ...DEMO_WEATHER, ...weather, location },
      source: 'mock-IMD',
      note: 'Connect OpenWeatherMap API key in env OPENWEATHER_API_KEY to use real data',
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Weather service unavailable' }, { status: 500 });
  }
}

// ── API Contract ──────────────────────────────────────────────
// GET /api/weather?location=Pune%2C%20Maharashtra
// Response: { success, location, weather: WeatherData, source, note }
