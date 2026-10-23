'use client';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Globe, X, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { LANGUAGE_NAMES } from '@/lib/mockData';
import { getTranslation } from '@/lib/i18n';
import { toast } from 'sonner';
import type { Language } from '@/types';

const LANG_CODES: Record<Language, string> = {
  en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', te: 'te-IN',
  ta: 'ta-IN', kn: 'kn-IN', bn: 'bn-IN', pa: 'pa-Guru-IN', or: 'or-IN',
};

const RESPONSES = (lang: Language) => ({
  disease: getTranslation(lang, 'risk_high_msg'),
  pest: `Pest risk is MEDIUM. Fall Armyworm trap count: 23. ETL threshold: 15. Recommend field inspection.`,
  weather: `Current weather: Temperature 27°C, Humidity 82%, Rainfall 45mm this week. High humidity increases disease risk.`,
  default: `I am your GramSathi AI assistant. You can ask about disease risks, weather forecast, pest trap counts, or recommendations.`,
});

type VoiceStatus = 'idle' | 'listening' | 'processing' | 'speaking';

export default function ExpertHelpPage() {
  const { language, t } = useAuth();
  const [voiceLang, setVoiceLang] = useState<Language>(language as Language);
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [browserOk, setBrowserOk] = useState(true);
  const [question, setQuestion] = useState('');
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setBrowserOk(false);
  }, []);

  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LANG_CODES[voiceLang];
    utter.rate = 0.9;
    setStatus('speaking');
    utter.onend = () => setStatus('idle');
    window.speechSynthesis.speak(utter);
  };

  const handleMic = () => {
    if (!browserOk) { toast.error('Voice requires Chrome or Edge browser.'); return; }
    if (status === 'listening') { recRef.current?.stop(); setStatus('idle'); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    recRef.current = rec;
    rec.lang = LANG_CODES[voiceLang];
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const heard = e.results[0][0].transcript.toLowerCase();
      setTranscript(heard);
      setStatus('processing');
      setTimeout(() => {
        const resp = RESPONSES(voiceLang);
        const answer = heard.includes('pest') || heard.includes('keed') ? resp.pest
          : heard.includes('disease') || heard.includes('bimari') || heard.includes('rog') ? resp.disease
          : heard.includes('weather') || heard.includes('mausam') ? resp.weather
          : resp.default;
        setResponse(answer);
        speak(answer);
      }, 600);
    };
    rec.onerror = () => { setStatus('idle'); toast.error('Could not hear audio. Check microphone.'); };
    rec.onend = () => { setStatus(prev => prev === 'listening' ? 'idle' : prev); };
    rec.start();
    setStatus('listening');
  };

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 space-y-5 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800">Get Expert Help</h1>

        {/* Ask a Question */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-3">Ask a Question</h2>
          <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={3} placeholder="Describe your crop problem or question..." className="input-field mb-3" />
          <div className="flex gap-2">
            <select className="input-field flex-1 max-w-[180px] text-sm">
              <option>Rice</option><option>Wheat</option><option>Maize</option><option>Cotton</option><option>Tomato</option>
            </select>
            <button onClick={() => { if (question.trim()) { toast.success('Question submitted! Expert will respond in 2–4 hours.'); setQuestion(''); } else { toast.error('Please enter a question.'); }}} className="btn-primary flex-1">Submit Question</button>
          </div>
        </div>

        {/* Assigned Expert */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Your Assigned Expert</h2>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">PS</div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-gray-800">Dr. Priya Sharma</h3>
                  <p className="text-gray-500 text-xs">PhD Plant Pathology · 12 years exp.</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">🟢 Available</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Rice Diseases','Wheat','Pulse Crops','IPM'].map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-2">
                {'★★★★★'.split('').map((s, i) => <span key={i} className="text-yellow-400 text-sm">{s}</span>)}
                <span className="text-gray-400 text-xs ml-1">4.8 (127 reviews)</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => toast.success('Message sent to Dr. Sharma!')} className="btn-primary text-sm py-2 flex-1">Send Message</button>
                <button onClick={() => toast.info('Scheduling a call...')} className="btn-outline text-sm py-2 flex-1">Schedule Call</button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Validation */}
        <div className="card p-5 border border-yellow-200 bg-yellow-50">
          <h2 className="font-bold text-gray-800 mb-3">⏳ Pending Validation</h2>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-gray-700 font-medium text-sm">Diagnosis #DX-2024-001 · Aug 4, 2024</p>
              <p className="text-gray-600 text-sm mt-0.5">AI result: <strong>Rice Leaf Blast</strong> · 92% confidence</p>
              <span className="text-xs bg-yellow-200 text-yellow-800 font-semibold px-2 py-0.5 rounded-full mt-2 inline-block animate-blinkDot">Waiting for Expert Review</span>
              <p className="text-gray-400 text-xs mt-1">Estimated response: 2–4 hours</p>
            </div>
          </div>
          <button onClick={() => toast.success('Reminder sent to Dr. Sharma!')} className="mt-3 text-xs px-3 py-1.5 bg-yellow-200 text-yellow-800 font-semibold rounded-xl hover:bg-yellow-300">Send Reminder</button>
        </div>

        {/* KVK Resources */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4">Nearby KVK & Resources</h2>
          {[
            { name: 'KVK Pune', dist: '15 km', phone: '020-26956000', addr: 'Manjri, Pune, Maharashtra' },
            { name: 'KVK Nashik', dist: '45 km', phone: '0253-2570585', addr: 'Igatpuri, Nashik, Maharashtra' },
            { name: 'State Agri. Dept. Helpline', dist: '—', phone: '1800-233-4000', addr: 'Toll Free · Mon–Sat 9am–6pm' },
          ].map(k => (
            <div key={k.name} className="flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{k.name}</p>
                <p className="text-gray-400 text-xs">{k.addr}</p>
                <p className="text-green-700 text-xs font-medium mt-0.5">📞 {k.phone}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-gray-400 text-xs mb-2">{k.dist}</p>
                <button onClick={() => toast.info('Opening maps...')} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100">Directions</button>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Assistant */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-1 flex items-center gap-2"><Bot className="w-5 h-5 text-green-600" /> Voice Assistant</h2>
          <p className="text-gray-500 text-sm mb-4">Ask crop questions in your language</p>

          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-4 h-4 text-gray-400" />
            <select value={voiceLang} onChange={e => setVoiceLang(e.target.value as Language)} className="input-field flex-1 max-w-[200px] text-sm">
              {Object.entries(LANGUAGE_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {!browserOk && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
              <p className="text-yellow-800 text-xs">⚠️ Voice assistant requires Chrome or Edge browser with microphone access.</p>
            </div>
          )}

          {/* Mic Button */}
          <div className="flex flex-col items-center gap-4">
            <button onClick={handleMic} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${status === 'listening' ? 'bg-red-500 hover:bg-red-600 risk-pulse' : status === 'speaking' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-600 hover:bg-green-700'}`}>
              {status === 'listening' ? <MicOff className="w-8 h-8 text-white" /> : status === 'processing' ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : status === 'speaking' ? <Volume2 className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
            </button>
            <p className="text-gray-600 text-sm font-medium text-center">
              {status === 'idle' ? 'Tap mic to ask a question' : status === 'listening' ? '🔴 Listening... Speak now' : status === 'processing' ? '⏳ Processing...' : '🔊 Speaking...'}
            </p>

            {transcript && <div className="w-full bg-gray-50 rounded-xl p-3"><p className="text-gray-500 text-xs mb-0.5">You said:</p><p className="text-gray-800 text-sm italic">"{transcript}"</p></div>}

            {response && (
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-700 text-xs mb-1 font-semibold">Assistant ({LANGUAGE_NAMES[voiceLang]}):</p>
                <p className="text-green-800 text-sm leading-relaxed">{response}</p>
                <button onClick={() => speak(response)} className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-semibold hover:underline"><Volume2 className="w-3.5 h-3.5" /> Play Again</button>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-xs mt-4 text-center">Try: "disease risk", "pest count", "weather today"</p>
        </div>
      </div>
    </FarmerLayout>
  );
}
