'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  PhoneCall,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface FieldVisitStop {
  id: string;
  order: number;
  villageName: string;
  highRiskFarms: number;
  suspectedCases: number;
  expertReferrals: number;
  distanceKm: number;
  estTravelTime: string;
  contactPerson: string;
  status: 'Pending' | 'Completed' | 'In Progress';
}

export default function ExtensionRoutePlanner() {
  const [stops, setStops] = useState<FieldVisitStop[]>([
    {
      id: 'st-1',
      order: 1,
      villageName: 'Koregaon Bhima',
      highRiskFarms: 8,
      suspectedCases: 5,
      expertReferrals: 2,
      distanceKm: 4.2,
      estTravelTime: '12 mins',
      contactPerson: 'Sarpanch Maruti Shinde',
      status: 'In Progress'
    },
    {
      id: 'st-2',
      order: 2,
      villageName: 'Shirur East Hub',
      highRiskFarms: 5,
      suspectedCases: 3,
      expertReferrals: 1,
      distanceKm: 9.8,
      estTravelTime: '20 mins',
      contactPerson: 'Lead Farmer Tukaram Pawar',
      status: 'Pending'
    },
    {
      id: 'st-3',
      order: 3,
      villageName: 'Daund APMC Perimeter',
      highRiskFarms: 6,
      suspectedCases: 4,
      expertReferrals: 2,
      distanceKm: 14.5,
      estTravelTime: '28 mins',
      contactPerson: 'Gram Sevak Sanjay Patil',
      status: 'Pending'
    },
    {
      id: 'st-4',
      order: 4,
      villageName: 'Yavat Outbreak Cluster',
      highRiskFarms: 2,
      suspectedCases: 2,
      expertReferrals: 1,
      distanceKm: 18.2,
      estTravelTime: '35 mins',
      contactPerson: 'Extension Representative Asha',
      status: 'Pending'
    }
  ]);

  const handleCompleteStop = (id: string) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, status: 'Completed' } : s));
    toast.success('Field visit inspection report geo-tagged & logged!');
  };

  const totalFarms = stops.reduce((acc, s) => acc + s.highRiskFarms, 0);
  const totalKm = stops.reduce((acc, s) => acc + s.distanceKm, 0).toFixed(1);

  return (
    <div className="card p-5 sm:p-6 bg-white border border-teal-100 shadow-md rounded-3xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-teal-100 text-teal-800 rounded-2xl">
            <Navigation className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Extension Worker Field Visit Route Optimizer
              <span className="text-[10px] bg-teal-100 text-teal-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> GPS TSP Route
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Intelligent traveling-salesman route planner prioritizing high-risk outbreak clusters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-teal-50 text-teal-900 px-3 py-1.5 rounded-xl border border-teal-200">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span>Total: {totalFarms} Farms · {totalKm} km Circuit</span>
        </div>
      </div>

      {/* Stop Sequence List */}
      <div className="space-y-3">
        {stops.map((stop) => (
          <div 
            key={stop.id}
            className={`p-4 rounded-2xl border transition-all ${
              stop.status === 'Completed'
                ? 'bg-gray-50 border-gray-200 opacity-75'
                : stop.status === 'In Progress'
                ? 'bg-teal-50/60 border-teal-300 ring-2 ring-teal-500/20 shadow-sm'
                : 'bg-white border-gray-200 hover:border-teal-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                  stop.status === 'Completed'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-teal-700 text-white shadow-sm'
                }`}>
                  #{stop.order}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-base">{stop.villageName}</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      stop.status === 'Completed'
                        ? 'bg-gray-200 text-gray-700'
                        : stop.status === 'In Progress'
                        ? 'bg-teal-600 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {stop.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-3">
                    <span>📍 {stop.distanceKm} km ({stop.estTravelTime})</span>
                    <span>👤 Contact: {stop.contactPerson}</span>
                  </p>
                </div>
              </div>

              {/* Stop Stats & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 text-xs">
                <div className="text-right">
                  <span className="font-bold text-red-600 block">{stop.highRiskFarms} High-Risk Farms</span>
                  <span className="text-gray-400 text-[10px]">{stop.suspectedCases} Suspected · {stop.expertReferrals} Lab Referrals</span>
                </div>

                {stop.status !== 'Completed' && (
                  <button
                    onClick={() => handleCompleteStop(stop.id)}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Log Inspection
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
