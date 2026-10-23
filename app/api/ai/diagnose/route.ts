import { NextRequest, NextResponse } from 'next/server';
import { runDiagnosis } from '@/lib/mockAI';
import type { DiagnosisRequest } from '@/lib/mockAI';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as DiagnosisRequest;

    if (!body.crop || !body.cropStage) {
      return NextResponse.json(
        { success: false, error: 'crop and cropStage are required' },
        { status: 400 }
      );
    }

    // ── Try Gemini 1.5 Flash first (if API key configured) ─────
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.length > 10) {
      try {
        const { runGeminiDiagnosis } = await import('@/lib/geminiAI');
        const result = await runGeminiDiagnosis(body);
        return NextResponse.json(result, { status: 200 });
      } catch (geminiErr) {
        console.warn('Gemini AI failed, falling back to mock:', geminiErr);
        // Fall through to mock
      }
    }

    // ── Fallback: Mock AI ──────────────────────────────────────
    const result = await runDiagnosis(body);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('Diagnosis API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ── API Contract ──────────────────────────────────────────────
// POST /api/ai/diagnose
// Request:
// {
//   crop: string,           // e.g., "Rice"
//   cropStage: string,      // e.g., "Tillering"
//   affectedPart: string,   // e.g., "Leaf"
//   symptoms: string[],     // e.g., ["Lesions", "Yellowing"]
//   location?: string,      // e.g., "Pune, Maharashtra"
//   imageBase64?: string,   // base64 encoded image
//   humidity?: number,      // weather context
//   temperature?: number,
//   rainfall?: number
// }
// Response: DiagnosisResponse (see /lib/mockAI.ts)
// If GEMINI_API_KEY env var is set, uses Gemini 1.5 Flash.
// Otherwise uses mockAI fallback.
