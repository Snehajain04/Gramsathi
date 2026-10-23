'use client';
import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, X, Loader2 } from 'lucide-react';

const COMMANDS: Record<string, string> = {
  'dashboard': '/farmer/dashboard',
  'diagnose': '/farmer/diagnose',
  'diagnose crop': '/farmer/diagnose',
  'my farms': '/farmer/farms',
  'farms': '/farmer/farms',
  'risk forecast': '/farmer/risk-forecast',
  'pest reports': '/farmer/pest-reports',
  'advisories': '/farmer/advisories',
  'monitoring': '/farmer/monitoring',
  'expert help': '/farmer/expert-help',
  'notifications': '/farmer/notifications',
  'alerts': '/farmer/notifications',
};

const QUICK_TIPS = [
  '"Diagnose my crop"',
  '"Go to dashboard"',
  '"Show my farms"',
  '"Risk forecast"',
  '"My alerts"',
];

const VOICE_LANGS: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', te: 'te-IN', ta: 'ta-IN',
};

const RESPONSES: Record<string, string> = {
  hello: 'Hello! I am GramSathi Voice Assistant. How can I help you today?',
  help: 'You can say: diagnose my crop, go to dashboard, show my farms, risk forecast, or my alerts.',
  weather: 'Current weather conditions show high humidity. Disease risk is elevated for the next 48 hours.',
  blast: 'Rice Blast is a fungal disease. Look for diamond shaped lesions on leaves. Consult your KVK immediately.',
  armyworm: 'Fall Armyworm affects maize crops. Look for ragged leaf edges and frass. Apply pheromone traps.',
};

interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: { [index: number]: SpeechRecognitionResultItem; length: number };
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Custom interface to avoid relying on the global SpeechRecognition type
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

// Helper to get SpeechRecognition constructor from window
function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w['SpeechRecognition'] ?? w['webkitSpeechRecognition']) as ((new () => SpeechRecognitionInstance) | undefined);
  return Ctor ?? null;
}

export default function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [lang] = useState('en');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = VOICE_LANGS[lang] || 'en-IN';
    utt.rate = 0.9;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [lang]);

  const processCommand = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();
    // Check navigation commands
    for (const [cmd, path] of Object.entries(COMMANDS)) {
      if (lower.includes(cmd)) {
        const msg = `Opening ${cmd}...`;
        setResponse(msg);
        speak(msg);
        setTimeout(() => { window.location.href = path; }, 1500);
        return;
      }
    }
    // Check info responses
    for (const [key, val] of Object.entries(RESPONSES)) {
      if (lower.includes(key)) {
        setResponse(val);
        speak(val);
        return;
      }
    }
    // Default
    const fallback = `I heard: "${text}". Try saying: diagnose crop, go to dashboard, or ask about rice blast.`;
    setResponse(fallback);
    speak(fallback);
  }, [speak]);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      setResponse('Voice recognition not supported in this browser. Try Chrome.');
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = VOICE_LANGS[lang] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      processCommand(text);
    };
    recognition.onerror = () => {
      setListening(false);
      setResponse('Could not understand. Please try again.');
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, [lang, processCommand]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          listening ? 'bg-red-500 animate-pulse scale-110' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        title="GramSathi Voice Assistant"
      >
        {listening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        {speaking && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-44 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">GramSathi Voice</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Status */}
            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              listening ? 'bg-red-50 border border-red-200' : 'bg-indigo-50 border border-indigo-200'
            }`}>
              {listening ? (
                <><Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                <p className="text-red-700 text-sm font-semibold">Listening...</p></>
              ) : (
                <><Volume2 className={`w-5 h-5 ${speaking ? 'text-green-500' : 'text-indigo-500'}`} />
                <p className="text-indigo-700 text-sm">{speaking ? 'Speaking...' : 'Tap mic to speak'}</p></>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">You said:</p>
                <p className="text-gray-800 text-sm font-medium">&quot;{transcript}&quot;</p>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-600 text-xs mb-1">GramSathi:</p>
                <p className="text-green-800 text-sm">{response}</p>
              </div>
            )}

            {/* Quick Tips */}
            <div className="space-y-1">
              <p className="text-gray-400 text-xs font-semibold">Try saying:</p>
              <div className="flex flex-wrap gap-1">
                {QUICK_TIPS.map(tip => (
                  <span key={tip} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg border border-indigo-200">
                    {tip}
                  </span>
                ))}
              </div>
            </div>

            {/* Mic Button */}
            <button
              onClick={listening ? stopListening : startListening}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                listening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {listening ? <><MicOff className="w-4 h-4" /> Stop Listening</> : <><Mic className="w-4 h-4" /> Start Listening</>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
