'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Send, 
  MessageSquare, 
  FlaskConical, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Mic, 
  MicOff, 
  RefreshCw, 
  FileText, 
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/authContext';

interface CaseMessage {
  id: string;
  sender: 'farmer' | 'ai' | 'expert';
  senderName: string;
  text: string;
  time: string;
  imageUrl?: string;
}

export default function AICropDiagnosisSuite() {
  const { language, t } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState<{
    valid: boolean;
    blurScore: number;
    lightingScore: number;
    leafVisible: boolean;
    message: string;
  } | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(92);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'recovery' | 'lab' | 'chat'>('diagnosis');
  
  // Lab Request State
  const [labRequestSubmitted, setLabRequestSubmitted] = useState<boolean>(false);
  
  // Chat State
  const [messages, setMessages] = useState<CaseMessage[]>([
    {
      id: 'm1',
      sender: 'farmer',
      senderName: 'Ramesh Patil (Farmer)',
      text: 'Leaves are showing brown spindle spots near field border.',
      time: '10:15 AM'
    },
    {
      id: 'm2',
      sender: 'ai',
      senderName: 'GramSathi AI Engine',
      text: 'Preliminary assessment indicates Rice Blast (92% Confidence). High humidity detected.',
      time: '10:15 AM'
    },
    {
      id: 'm3',
      sender: 'expert',
      senderName: 'Dr. Priya Sharma (KVK Scientist)',
      text: 'Please upload a photo of the underside of the leaf to verify spore lesions.',
      time: '10:42 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Sample image upload handler with Quality Check Audit
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    setAnalyzing(true);

    // Simulate AI Image Quality & Blur Audit
    setTimeout(() => {
      setAnalyzing(false);
      // Random quality audit outcome for demo realism
      const isGood = Math.random() > 0.3;
      if (isGood) {
        setImageQuality({
          valid: true,
          blurScore: 94,
          lightingScore: 90,
          leafVisible: true,
          message: 'Image quality optimal. Leaf symptoms clearly visible.'
        });
        setConfidenceScore(92);
      } else {
        setImageQuality({
          valid: false,
          blurScore: 42,
          lightingScore: 55,
          leafVisible: true,
          message: '⚠️ Image quality insufficient — Image is slightly blurry. Please capture the underside of the leaf in better lighting.'
        });
        setConfidenceScore(68);
      }
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: CaseMessage = {
      id: `msg_${Date.now()}`,
      sender: 'farmer',
      senderName: 'Ramesh Patil (Farmer)',
      text: chatInput.trim(),
      time: 'Just now'
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
    toast.success('Message sent to assigned KVK Expert!');
  };

  const handleRequestLab = () => {
    setLabRequestSubmitted(true);
    toast.success('Laboratory verification request submitted! Extension worker assigned for sample pickup.');
  };

  return (
    <div className="card p-5 sm:p-6 bg-white border border-green-100 shadow-md rounded-3xl space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-green-100 text-green-800 rounded-xl">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                AI Crop Diagnosis & Verification Suite
                <span className="text-[10px] bg-green-100 text-green-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  CASE #GS-10482
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Confidence-based decision system, photo quality audit, recovery progress tracking & lab referrals.
              </p>
            </div>
          </div>
        </div>

        {/* Suite Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'diagnosis' ? 'bg-white text-green-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📸 AI Diagnosis
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'recovery' ? 'bg-white text-green-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📈 Progress Tracker
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'lab' ? 'bg-white text-green-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🧪 Lab Referral
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'chat' ? 'bg-white text-green-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💬 Expert Chat
          </button>
        </div>
      </div>

      {/* TAB 1: AI DIAGNOSIS & QUALITY AUDIT */}
      {activeTab === 'diagnosis' && (
        <div className="space-y-5">
          {/* Upload & Audit Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Box */}
            <div className="border-2 border-dashed border-green-200 bg-green-50/40 rounded-3xl p-6 text-center space-y-3 relative flex flex-col items-center justify-center min-h-[220px]">
              {selectedImage ? (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner">
                  <img src={selectedImage} alt="Crop Sample" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setSelectedImage(null); setImageQuality(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-xs hover:bg-black"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-700 mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Upload Plant Leaf Photo</p>
                    <p className="text-xs text-gray-500 mt-1">Take a clear close-up of affected leaf or stem</p>
                  </div>
                  <label className="btn-primary text-xs px-4 py-2 cursor-pointer shadow-sm">
                    Select Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </>
              )}

              {analyzing && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 text-green-700 animate-spin" />
                  <span className="text-xs font-bold text-green-900">Auditing Image Quality & Running AI...</span>
                </div>
              )}
            </div>

            {/* AI Quality Audit & Evidence Panel */}
            <div className="space-y-4">
              {/* Feature 3: Image Quality Auditor Result */}
              {imageQuality && (
                <div className={`p-4 rounded-2xl border ${
                  imageQuality.valid 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {imageQuality.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>Image Quality Audit Result</span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed font-medium">{imageQuality.message}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-black/10 text-[10px]">
                    <div>
                      <span className="text-gray-500 block">Blur Score</span>
                      <span className="font-bold">{imageQuality.blurScore}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Lighting</span>
                      <span className="font-bold">{imageQuality.lightingScore}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Leaf Region</span>
                      <span className="font-bold text-emerald-700">{imageQuality.leafVisible ? 'Detected' : 'Missing'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature 2: Confidence-Based Decision Tier Banner */}
              <div className="card p-4 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">AI Confidence Score</span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    confidenceScore >= 85 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : confidenceScore >= 60 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {confidenceScore >= 85 ? '🟢 HIGH CONFIDENCE (>85%)' : confidenceScore >= 60 ? '🟡 MODERATE (60-85%)' : '🔴 LOW CONFIDENCE (<60%)'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${confidenceScore >= 85 ? 'bg-emerald-500' : confidenceScore >= 60 ? 'bg-amber-400' : 'bg-red-500'}`}
                      style={{ width: `${confidenceScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {confidenceScore >= 85 
                      ? 'Preliminary Diagnosis Auto-Generated. Expert Confirmation Initiated.' 
                      : 'Additional image or symptom checklist requested before final diagnosis.'}
                  </p>
                </div>

                {/* Evidence Checklist */}
                <div className="pt-2 space-y-1.5 text-xs text-gray-700 border-t border-gray-100">
                  <p className="font-bold text-gray-900 text-[11px] uppercase tracking-wide">XAI Factor Evidence Match:</p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Leaf Lesions: <strong className="text-emerald-700">High Match</strong></span>
                    <span>Humidity Index: <strong className="text-emerald-700">88% (High)</strong></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Recent Rainfall: <strong className="text-emerald-700">14.5mm</strong></span>
                    <span>Local Outbreak History: <strong className="text-emerald-700">Flagged Nearby</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEATURE 9 - DISEASE RECOVERY & PROGRESS TRACKER */}
      {activeTab === 'recovery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Disease Recovery & Field Re-scan Trajectory
            </h3>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              🟢 Crop Condition Improving (+25%)
            </span>
          </div>

          {/* Recovery Curve Visualizer */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <span className="text-[10px] text-red-600 font-bold block uppercase">Initial Diagnosis</span>
              <span className="text-xl font-black text-red-900">62%</span>
              <span className="text-[10px] text-red-700 block mt-0.5">High Infection</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[10px] text-amber-600 font-bold block uppercase">Day 3 Re-scan</span>
              <span className="text-xl font-black text-amber-900">68%</span>
              <span className="text-[10px] text-amber-700 block mt-0.5">Spray Applied</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] text-emerald-600 font-bold block uppercase">Day 7 Re-scan</span>
              <span className="text-xl font-black text-emerald-900">81%</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Spore Drying</span>
            </div>
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl shadow-sm">
              <span className="text-[10px] text-emerald-800 font-bold block uppercase">Current Health</span>
              <span className="text-xl font-black text-emerald-950">87%</span>
              <span className="text-[10px] text-emerald-800 block mt-0.5">★ Recovering</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bio-Fungicide Treatment Verification:
            </p>
            <p className="leading-relaxed">
              Comparison between Initial Day 1 photo and Day 7 follow-up photo confirms leaf blast lesions are drying up without spreading to top canopy leaves. Next follow-up scan due in 3 days.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE 11 - LABORATORY REFERRAL SYSTEM */}
      {activeTab === 'lab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-600" /> Physical Sample Laboratory Referral System
            </h3>
            <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              KVK Pune Lab Network
            </span>
          </div>

          <div className="card p-4 border border-purple-100 bg-purple-50/30 rounded-2xl space-y-4">
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Suspected Pathogen:</span>
                <span className="font-bold text-gray-900">Rice Blast (Pyricularia oryzae)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Sample Type Required:</span>
                <span className="font-bold text-gray-900">Fresh Infected Leaf Tissue (3-4 Leaves)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Assigned Referral Lab:</span>
                <span className="font-bold text-gray-900">District Agri Testing Lab, Pune</span>
              </div>
              <div>
                <span className="text-gray-500 block">Pickup Method:</span>
                <span className="font-bold text-purple-700">Extension Worker Geo-tagged Courier</span>
              </div>
            </div>

            {labRequestSubmitted ? (
              <div className="p-3 bg-emerald-100 text-emerald-950 rounded-xl border border-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Lab Sample Request #LAB-9920 Submitted! Extension Officer Ganesh Shinde will collect samples tomorrow morning.</span>
              </div>
            ) : (
              <button
                onClick={handleRequestLab}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FlaskConical className="w-4 h-4" /> Request Official Laboratory Physical Sample Verification
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE 20 - FARMER-EXPERT CASE CHAT THREAD */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Case Conversation Thread — #GS-10482
            </h3>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Dr. Priya Sharma (KVK Online)
            </span>
          </div>

          {/* Messages List */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 max-h-60 overflow-y-auto">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'farmer' ? 'items-end' : 'items-start'
                }`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                  msg.sender === 'farmer'
                    ? 'bg-green-700 text-white rounded-br-none'
                    : msg.sender === 'expert'
                    ? 'bg-purple-700 text-white rounded-bl-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}>
                  <p className="font-bold text-[10px] opacity-80">{msg.senderName}</p>
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className="text-[9px] opacity-60 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask Dr. Priya Sharma a question about your crop..."
              className="flex-1 input-field text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
