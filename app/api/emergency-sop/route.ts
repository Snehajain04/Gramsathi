import { NextRequest, NextResponse } from 'next/server';
import { DEMO_EMERGENCY_SOP } from '@/lib/mockData';
import type { EmergencySOP } from '@/types';

// In-memory store for demo (replace with Supabase in production)
let activeSOP: EmergencySOP | null = DEMO_EMERGENCY_SOP;
const sopHistory: EmergencySOP[] = [DEMO_EMERGENCY_SOP];

// GET /api/emergency-sop — Get active SOP
export async function GET() {
  return NextResponse.json({
    success: true,
    active: activeSOP,
    history: sopHistory,
  });
}

// POST /api/emergency-sop — Create new SOP broadcast
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newSOP: EmergencySOP = {
      id: `sop_${Date.now()}`,
      adminId: body.adminId || 'u4',
      adminName: body.adminName || 'Government Admin',
      title: body.title,
      message: body.message,
      severity: body.severity || 'warning',
      targetRegions: body.targetRegions || [],
      targetCrops: body.targetCrops || [],
      translations: body.translations || {},
      sentAt: new Date().toISOString(),
      expiresAt: body.expiresAt,
      isActive: true,
    };

    activeSOP = newSOP;
    sopHistory.unshift(newSOP);

    // In production: trigger push notifications, SMS, etc.
    console.log(`🚨 Emergency SOP broadcast to ${body.targetRegions?.join(', ')} — ${body.title}`);

    return NextResponse.json({
      success: true,
      sop: newSOP,
      estimatedReach: Math.floor(Math.random() * 3000) + 1000,
      message: `Advisory sent to all farmers in ${body.targetRegions?.join(', ')}`,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to send SOP' }, { status: 500 });
  }
}

// DELETE /api/emergency-sop — Deactivate current SOP
export async function DELETE() {
  if (activeSOP) {
    activeSOP = { ...activeSOP, isActive: false };
  }
  return NextResponse.json({ success: true, message: 'SOP deactivated' });
}

// ── API Contract ──────────────────────────────────────────────
// GET /api/emergency-sop → { active: EmergencySOP | null, history: EmergencySOP[] }
// POST /api/emergency-sop → { success, sop, estimatedReach, message }
// DELETE /api/emergency-sop → { success, message }
