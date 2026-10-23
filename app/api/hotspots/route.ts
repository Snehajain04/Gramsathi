import { NextRequest, NextResponse } from 'next/server';
import { HOTSPOT_DATA } from '@/lib/mockData';
import type { HotspotData, RiskLevel } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state');
  const crop = searchParams.get('crop');
  const riskLevel = searchParams.get('riskLevel') as RiskLevel | null;
  const issueType = searchParams.get('issueType') as 'disease' | 'pest' | null;

  let data: HotspotData[] = HOTSPOT_DATA;

  if (state) data = data.filter(h => h.state.toLowerCase().includes(state.toLowerCase()));
  if (crop) data = data.filter(h => h.crop.toLowerCase().includes(crop.toLowerCase()));
  if (riskLevel) data = data.filter(h => h.riskLevel === riskLevel);
  if (issueType) data = data.filter(h => h.issueType === issueType);

  const summary = {
    totalHotspots: data.length,
    highRisk: data.filter(h => h.riskLevel === 'high' || h.riskLevel === 'critical').length,
    mediumRisk: data.filter(h => h.riskLevel === 'medium').length,
    lowRisk: data.filter(h => h.riskLevel === 'low').length,
    totalReports: data.reduce((s, h) => s + h.reportCount, 0),
    mostAffectedState: (() => {
      const stateCounts: Record<string, number> = {};
      data.forEach(h => { stateCounts[h.state] = (stateCounts[h.state] || 0) + h.reportCount; });
      return Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    })(),
  };

  return NextResponse.json({ success: true, data, summary, filteredBy: { state, crop, riskLevel, issueType } });
}

// ── API Contract ──────────────────────────────────────────────
// GET /api/hotspots?state=Maharashtra&crop=Rice&riskLevel=high&issueType=disease
// Response: { success, data: HotspotData[], summary: { totalHotspots, highRisk, ... } }
