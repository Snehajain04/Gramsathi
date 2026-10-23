'use client';
import { useState } from 'react';
import { Users, ThumbsUp, Shield, Clock, MapPin, ChevronRight, AlertTriangle, MessageSquare } from 'lucide-react';

// ── Mock community alert data ─────────────────────────────────
const COMMUNITY_ALERTS = [
  {
    id: 1,
    farmerName: 'Ramesh P.',
    location: 'Nashik, MH',
    distance: '2.3 km',
    crop: 'Rice',
    disease: 'Rice Blast',
    severity: 'High' as const,
    time: '12 min ago',
    upvotes: 14,
    verified: true,
    symptoms: 'Lesions on leaves, brown spots spreading fast',
    avatar: 'RP',
  },
  {
    id: 2,
    farmerName: 'Sunita D.',
    location: 'Pune, MH',
    distance: '5.1 km',
    crop: 'Cotton',
    disease: 'Cotton Bollworm',
    severity: 'Medium' as const,
    time: '38 min ago',
    upvotes: 7,
    verified: false,
    symptoms: 'Small holes in bolls, frass visible at night',
    avatar: 'SD',
  },
  {
    id: 3,
    farmerName: 'Venkat R.',
    location: 'Aurangabad, MH',
    distance: '7.8 km',
    crop: 'Maize',
    disease: 'Fall Armyworm',
    severity: 'Critical' as const,
    time: '1 hr ago',
    upvotes: 23,
    verified: true,
    symptoms: 'Heart of maize eaten, characteristic frass in whorl',
    avatar: 'VR',
  },
  {
    id: 4,
    farmerName: 'Priya K.',
    location: 'Kolhapur, MH',
    distance: '12 km',
    crop: 'Wheat',
    disease: 'Powdery Mildew',
    severity: 'Low' as const,
    time: '3 hr ago',
    upvotes: 4,
    verified: false,
    symptoms: 'White powdery coating on upper leaf surface',
    avatar: 'PK',
  },
];

const SEVERITY_CONFIG = {
  Critical: { color: 'text-purple-700', bg: 'bg-purple-100 border-purple-200', dot: 'bg-purple-600' },
  High: { color: 'text-red-700', bg: 'bg-red-100 border-red-200', dot: 'bg-red-500' },
  Medium: { color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', dot: 'bg-amber-500' },
  Low: { color: 'text-green-700', bg: 'bg-green-100 border-green-200', dot: 'bg-green-500' },
};

export default function CommunityFeed({ maxItems = 4 }: { maxItems?: number }) {
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleUpvote = (id: number) => {
    setUpvotedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const displayed = showAll ? COMMUNITY_ALERTS : COMMUNITY_ALERTS.slice(0, maxItems);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Community Alert Feed</h3>
              <p className="text-green-200 text-xs">Nearby farmers reporting · Real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
            <span className="text-green-200 text-xs font-medium">LIVE</span>
          </div>
        </div>
        {/* Summary bar */}
        <div className="flex gap-3 mt-3">
          {[
            { label: '4 Reports', icon: '📍', color: 'bg-white/15' },
            { label: '3 High+', icon: '🚨', color: 'bg-white/15' },
            { label: '2 Verified', icon: '✅', color: 'bg-white/15' },
          ].map(b => (
            <div key={b.label} className={`flex items-center gap-1.5 ${b.color} rounded-lg px-2.5 py-1`}>
              <span className="text-xs">{b.icon}</span>
              <span className="text-white text-xs font-semibold">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="divide-y divide-gray-50">
        {displayed.map(alert => {
          const sev = SEVERITY_CONFIG[alert.severity];
          const hasUpvoted = upvotedIds.has(alert.id);
          return (
            <div key={alert.id} className="px-4 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                  {alert.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{alert.farmerName}</span>
                      {alert.verified && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs text-blue-600 font-medium">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.color}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location} · {alert.distance}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{alert.crop}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-bold text-red-600">{alert.disease}</span>
                  </div>

                  <p className="text-gray-500 text-xs leading-relaxed mb-3 italic">"{alert.symptoms}"</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleUpvote(alert.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        hasUpvoted
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      {alert.upvotes + (hasUpvoted ? 1 : 0)} Confirm
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all">
                      <MessageSquare className="w-3 h-3" /> Report Similar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Crowdsourced data — verify with an expert
          </p>
          <button
            onClick={() => setShowAll(o => !o)}
            className="text-green-600 text-xs font-semibold hover:text-green-700 transition-colors"
          >
            {showAll ? 'Show less' : 'View all →'}
          </button>
        </div>
      </div>
    </div>
  );
}
