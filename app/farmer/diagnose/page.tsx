'use client';
import { useState, useRef } from 'react';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { runDiagnosis, DIAGNOSIS_STEPS } from '@/lib/mockAI';
import { ALL_CROPS, CROP_STAGES } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';
import { toast } from 'sonner';
import { Upload, Camera, X, CheckCircle2, AlertTriangle, Loader2, ChevronDown, Info, Leaf, Zap, Shield } from 'lucide-react';
import type { AIResult } from '@/types';
import ExplainableAI from '@/components/ExplainableAI';
import VoiceAdvisory from '@/components/VoiceAdvisory';
import AICropDiagnosisSuite from '@/components/AICropDiagnosisSuite';


type Stage = 'input' | 'analyzing' | 'result' | 'validation_sent';

const SYMPTOMS = ['Lesions','Yellowing','Wilting','Holes / Shot-holes','Powdery coating','Rust','Rotting','Discoloration','Frass / Excrement','Webbing'];
const PARTS = ['Leaf','Stem','Root','Fruit','Flower','Whole Plant'];

const TYPE_BADGE: Record<string, string> = {
  cultural: 'bg-green-100 text-green-700',
  biological: 'bg-teal-100 text-teal-700',
  mechanical: 'bg-blue-100 text-blue-700',
  monitoring: 'bg-yellow-100 text-yellow-700',
  chemical_safe: 'bg-orange-100 text-orange-700',
  referral: 'bg-purple-100 text-purple-700',
};

const PRIORITY_COLOR: Record<string, string> = {
  immediate: 'border-red-200 bg-red-50',
  short_term: 'border-yellow-200 bg-yellow-50',
  preventive: 'border-green-200 bg-green-50',
};

export default function DiagnosePage() {
  const { t } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('input');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [crop, setCrop] = useState('Rice');
  const [cropStage, setCropStage] = useState('');
  const [affectedPart, setAffectedPart] = useState('Leaf');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<AIResult | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file (JPG, PNG, WEBP)'); return; }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const toggleSymptom = (s: string) => setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleAnalyze = async () => {
    if (!imageUrl) { toast.error('Please upload a crop image first.'); return; }
    setStage('analyzing');
    setAnalysisStep(0);
    // animate steps
    for (let i = 0; i < DIAGNOSIS_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, DIAGNOSIS_STEPS[i].duration));
      setAnalysisStep(i + 1);
    }
    const res = await runDiagnosis({ crop, cropStage: cropStage || 'Tillering', affectedPart, symptoms, location, humidity: 82, temperature: 27, rainfall: 45 });
    if (res.success && res.result) { setResult(res.result); setStage('result'); }
    else { toast.error(res.error || 'Diagnosis failed'); setStage('input'); }
  };

  const handleRequestValidation = () => {
    toast.success('Expert Dr. Priya Sharma has been notified. Expected response in 2–4 hours.');
    setStage('validation_sent');
  };

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 max-w-4xl space-y-6">
        {/* End-to-End AI Crop Diagnosis Suite (Confidence Tiers, Quality Audit, Recovery & Lab) */}
        <AICropDiagnosisSuite />

        {/* ── INPUT STAGE ─────────────────────────── */}
        {stage === 'input' && (
          <div className="space-y-5">
            {/* Image Upload */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !imageUrl && fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-green-500 bg-green-50' : imageUrl ? 'border-green-400 bg-green-50 cursor-default' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'}`}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {imageUrl ? (
                <div className="relative">
                  <img src={imageUrl} alt="Uploaded crop" className="max-h-64 mx-auto rounded-xl object-contain" />
                  <button onClick={e => { e.stopPropagation(); setImageUrl(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Image ready for analysis
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-semibold text-gray-600">Upload a clear photo of the affected plant</p>
                  <p className="text-gray-400 text-sm mt-1">Drag & drop or click to browse · JPG, PNG, WEBP</p>
                  <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors">
                    <Camera className="w-4 h-4" /> Take / Upload Photo
                  </button>
                </>
              )}
            </div>

            {/* Crop Details */}
            <div className="card p-5 space-y-4">
              <h2 className="font-bold text-gray-800">Crop Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Crop *</label>
                  <select value={crop} onChange={e => { setCrop(e.target.value); setCropStage(''); }} className="input-field">
                    {ALL_CROPS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop Growth Stage</label>
                  <select value={cropStage} onChange={e => setCropStage(e.target.value)} className="input-field">
                    <option value="">Select stage...</option>
                    {(CROP_STAGES[crop] || []).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affected Plant Part</label>
                  <select value={affectedPart} onChange={e => setAffectedPart(e.target.value)} className="input-field">
                    {PARTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="District, State" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observed Symptoms (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(s => (
                    <button key={s} onClick={() => toggleSymptom(s)} className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${symptoms.includes(s) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">AI analysis provides a <strong>preliminary assessment only</strong>. Always confirm with your local agricultural extension officer or KVK before taking any action. Do NOT apply chemicals based solely on AI results.</p>
            </div>

            <button onClick={handleAnalyze} disabled={!imageUrl} className="w-full btn-primary py-3 text-base disabled:bg-gray-300 disabled:cursor-not-allowed">
              <Zap className="w-5 h-5" /> Analyze Crop
            </button>
          </div>
        )}

        {/* ── ANALYZING STAGE ──────────────────────── */}
        {stage === 'analyzing' && (
          <div className="card p-8 text-center space-y-6">
            {imageUrl && <img src={imageUrl} alt="Analyzing" className="w-32 h-32 rounded-2xl object-cover mx-auto border-4 border-green-200" />}
            <div>
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Analyzing Your Crop...</h2>
              <p className="text-gray-500 text-sm mt-1">Please wait while our AI examines the image</p>
            </div>
            <div className="space-y-2 text-left max-w-sm mx-auto">
              {DIAGNOSIS_STEPS.map((step, i) => (
                <div key={step.id} className={`flex items-center gap-3 text-sm transition-all ${i < analysisStep ? 'text-green-700' : i === analysisStep ? 'text-gray-800 font-medium' : 'text-gray-300'}`}>
                  {i < analysisStep ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" /> : i === analysisStep ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />}
                  {step.label}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 max-w-sm mx-auto">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(analysisStep / DIAGNOSIS_STEPS.length) * 100}%` }} />
            </div>
          </div>
        )}

        {/* ── RESULT STAGE ──────────────────────────── */}
        {stage === 'result' && result && (
          <div className="space-y-5 animate-slideUp">
            {/* AI Disclaimer Banner */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-amber-800 text-sm font-semibold">⚠️ AI-ASSISTED PRELIMINARY ASSESSMENT — EXPERT CONFIRMATION RECOMMENDED</p>
            </div>

            {/* Result Card */}
            <div className="card p-5">
              <div className="flex items-start gap-4">
                {imageUrl && <img src={imageUrl} alt="Analyzed" className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs text-gray-500">Crop: {crop}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">Part: {affectedPart}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{result.predictedIssue}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge-risk-high">{result.issueType === 'disease' ? '🦠 Disease' : '🐛 Pest'}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${result.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : result.severity === 'severe' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                      Severity: {result.severity}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">AI Confidence</span>
                      <span className={`font-bold ${result.confidence >= 85 ? 'text-green-700' : result.confidence >= 70 ? 'text-yellow-700' : 'text-red-700'}`}>{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className={`h-3 rounded-full ${result.confidence >= 85 ? 'bg-green-500' : result.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${result.confidence}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.symptoms.map(s => <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{s}</span>)}
              </div>
            </div>

            {/* ── Full XAI Explainable AI Panel ── */}
            <ExplainableAI
              confidence={result.confidence}
              severity={result.severity}
              predictedIssue={result.predictedIssue}
              riskFactors={result.riskFactors}
              historicalEvidence={result.historicalEvidence}
              weatherEvidence={result.weatherEvidence}
            />

            {/* ── Voice Advisory ── */}
            <VoiceAdvisory
              text={`GramSathi AI diagnosis result for your ${crop}. The predicted issue is ${result.predictedIssue} with ${result.confidence} percent confidence. Severity is ${result.severity}. ${result.ipmRecommendations[0]?.action || 'Please consult your local KVK or extension officer.'}`}
              defaultLang="mr"
            />

            {/* IPM Recommendations */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-800 mb-2">🌿 IPM Management Guidance</h3>

              <p className="text-gray-500 text-xs mb-4">Prioritizing cultural, biological, and mechanical approaches — chemical inputs only as a last resort</p>
              <div className="space-y-2">
                {result.ipmRecommendations.map((rec, i) => (
                  <div key={i} className={`border rounded-xl p-3 ${PRIORITY_COLOR[rec.priority]}`}>
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${TYPE_BADGE[rec.type]}`}>{rec.type.replace('_', ' ')}</span>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{rec.action}</p>
                        <p className="text-gray-500 text-xs mt-1">{rec.reason}</p>
                        {rec.safetyNote && <p className="text-orange-700 text-xs mt-1 font-medium">⚠️ {rec.safetyNote}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chemical Safety Box */}
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-orange-800 font-bold text-sm flex items-center gap-2 mb-1"><Shield className="w-4 h-4" /> Chemical Input Safety Notice</p>
                <p className="text-orange-700 text-xs leading-relaxed">
                  Only use officially approved agricultural inputs according to the product label and guidance from local agriculture authorities (KVK / Krishi Vibhag). Do NOT apply any pesticide or fungicide based solely on this AI result. Consult a registered agrochemist or extension officer first.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-gray-500 text-xs leading-relaxed">{result.disclaimer}</p>
              <p className="text-gray-400 text-xs mt-1">Model: GramSathi-AI-v2.1 · Generated: {new Date().toLocaleString('en-IN')}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleRequestValidation} className="btn-primary py-3 col-span-2 text-base">
                <CheckCircle2 className="w-5 h-5" /> Request Expert Validation
              </button>
              <button onClick={() => { toast.success('Diagnosis saved to your farm records.'); }} className="border border-gray-200 text-gray-700 font-semibold rounded-xl py-2.5 hover:bg-gray-50 transition-colors text-sm">
                💾 Save Diagnosis
              </button>
              <button onClick={() => setStage('input')} className="border border-gray-200 text-gray-700 font-semibold rounded-xl py-2.5 hover:bg-gray-50 transition-colors text-sm">
                🔄 New Diagnosis
              </button>
            </div>
          </div>
        )}

        {/* ── VALIDATION SENT ────────────────────── */}
        {stage === 'validation_sent' && (
          <div className="card p-8 text-center space-y-5 animate-slideUp">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Validation Requested!</h2>
              <p className="text-gray-500 text-sm mt-2">Expert Dr. Priya Sharma has been notified</p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-left">
                <p className="text-yellow-800 font-semibold text-sm">⏳ Status: Waiting for Expert Review</p>
                <p className="text-yellow-700 text-xs mt-1">Estimated response time: 2–4 hours</p>
                <p className="text-yellow-600 text-xs mt-1">You will be notified when the expert responds.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStage('input')} className="flex-1 btn-primary">New Diagnosis</button>
              <button onClick={() => window.history.back()} className="flex-1 border border-gray-200 text-gray-700 font-semibold rounded-xl py-2.5 hover:bg-gray-50 text-sm">Back</button>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
