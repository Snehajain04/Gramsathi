'use client';

import React, { useState } from 'react';
import { 
  Bug, 
  TrendingUp, 
  Droplets, 
  CloudRain, 
  ShieldAlert, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function PestTrapSensorCard() {
  const { language } = useAuth();
  const [trapData, setTrapData] = useState({
    todayCount: 17,
    yesterdayCount: 9,
    sevenDayAvg: 8,
    trendPercent: 112,
    pestName: 'Fall Armyworm & Helicoverpa Moth',
    crop: 'Maize & Sugarcane (Field A)',
    etlThreshold: 10,
    status: 'HIGH'
  });

  return (
    <div className="card p-5 sm:p-6 bg-white border border-orange-100 shadow-md rounded-3xl space-y-5">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-orange-100 text-orange-800 rounded-2xl">
            <Bug className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Pest Trap Monitor & Sensor Fusion Engine
              <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> IoT Live Trap
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated pheromone pest trap counts combined with soil moisture & microclimate sensors.
            </p>
          </div>
        </div>

        <span className="text-xs font-black bg-red-600 text-white px-3 py-1 rounded-full shadow-sm">
          🚨 ETL EXCEEDED (+112%)
        </span>
      </div>

      {/* Feature 4: Pest Trap Statistics & Trend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-200">
          <span className="text-[10px] text-orange-700 font-bold block uppercase">Today's Trap Count</span>
          <p className="text-2xl font-black text-orange-950 mt-1 flex items-center gap-1">
            🪰 {trapData.todayCount} <span className="text-xs text-red-600 font-bold">Moths</span>
          </p>
          <span className="text-[10px] text-red-600 font-bold block mt-0.5">↑ +8 vs yesterday</span>
        </div>

        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
          <span className="text-[10px] text-gray-500 font-bold block uppercase">Yesterday's Count</span>
          <p className="text-2xl font-black text-gray-800 mt-1">🪰 {trapData.yesterdayCount}</p>
          <span className="text-[10px] text-gray-400 block mt-0.5">Normal baseline</span>
        </div>

        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
          <span className="text-[10px] text-gray-500 font-bold block uppercase">7-Day Average</span>
          <p className="text-2xl font-black text-gray-800 mt-1">{trapData.sevenDayAvg}</p>
          <span className="text-[10px] text-gray-400 block mt-0.5">ETL Limit: {trapData.etlThreshold}/night</span>
        </div>

        <div className="p-3.5 bg-red-50/60 rounded-2xl border border-red-200">
          <span className="text-[10px] text-red-700 font-bold block uppercase">7-Day Pest Trend</span>
          <p className="text-2xl font-black text-red-950 mt-1 flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-red-600" /> +{trapData.trendPercent}%
          </p>
          <span className="text-[10px] text-red-700 font-bold block mt-0.5">Critical Outbreak Risk</span>
        </div>
      </div>

      {/* Feature 18: Integrated Sensor Fusion Advisory */}
      <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-2xl border border-orange-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-orange-950 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-600" /> Integrated Sensor Fusion Logic:
          </h3>
          <span className="text-[11px] font-bold text-orange-800 bg-white/80 px-2 py-0.5 rounded-md border border-orange-200">
            Pest Count ↑ + Soil Moisture (34%) + Humidity (88%) + Stage: Flowering = HIGH PEST RISK
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-orange-200 text-xs text-gray-700 space-y-1.5">
          <p className="font-bold text-gray-900">💡 Non-Chemical Integrated Pest Management (IPM) Action Plan:</p>
          <div className="flex items-start gap-2 text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Install 4-5 additional pheromone traps per acre immediately to initiate mass trapping.</span>
          </div>
          <div className="flex items-start gap-2 text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Apply 5% Neem Seed Kernel Extract (NSKE) in central crop whorls during early morning.</span>
          </div>
          <div className="flex items-start gap-2 text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Soil moisture is high; avoid extra irrigation today to prevent encouraging larval pupation.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
