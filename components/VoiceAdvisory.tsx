'use client';
import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Square, Play, ChevronDown } from 'lucide-react';

// ── Supported languages ───────────────────────────────────────
const VOICE_LANGUAGES: Record<string, { label: string; bcp47: string; greeting: string }> = {
  en: { label: 'English', bcp47: 'en-IN', greeting: 'Voice advisory ready in English.' },
  hi: { label: 'हिन्दी', bcp47: 'hi-IN', greeting: 'हिंदी में आवाज़ सलाह तैयार है।' },
  mr: { label: 'मराठी', bcp47: 'mr-IN', greeting: 'मराठीत आवाज सल्ला तयार आहे.' },
  te: { label: 'తెలుగు', bcp47: 'te-IN', greeting: 'తెలుగులో వాయిస్ సలహా సిద్ధంగా ఉంది.' },
  ta: { label: 'தமிழ்', bcp47: 'ta-IN', greeting: 'தமிழில் குரல் ஆலோசனை தயாராக உள்ளது.' },
  kn: { label: 'ಕನ್ನಡ', bcp47: 'kn-IN', greeting: 'ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿ ಸಲಹೆ ಸಿದ್ಧವಾಗಿದೆ.' },
  gu: { label: 'ગુજરાતી', bcp47: 'gu-IN', greeting: 'ગુજરાતીમાં વૉઇસ સલાહ તૈયાર છે.' },
  pa: { label: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', greeting: 'ਪੰਜਾਬੀ ਵਿੱਚ ਆਵਾਜ਼ ਸਲਾਹ ਤਿਆਰ ਹੈ।' },
  bn: { label: 'বাংলা', bcp47: 'bn-IN', greeting: 'বাংলায় ভয়েস পরামর্শ প্রস্তুত।' },
};

interface VoiceAdvisoryProps {
  /** The text to read aloud. Pass the diagnosis text / IPM steps. */
  text: string;
  /** Optional: pre-select language key */
  defaultLang?: string;
  /** Compact mode for embedding inside cards */
  compact?: boolean;
}

export default function VoiceAdvisory({ text, defaultLang = 'mr', compact = false }: VoiceAdvisoryProps) {
  const [lang, setLang] = useState(defaultLang);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Lazy-check for browser support
  const checkSupport = useCallback(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSupported(ok);
    return ok;
  }, []);

  const speak = useCallback(() => {
    if (!checkSupport()) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = VOICE_LANGUAGES[lang]?.bcp47 ?? 'hi-IN';
    utt.rate = 0.9;
    utt.pitch = 1.0;
    utt.volume = 1;
    utt.onstart = () => { setSpeaking(true); setPaused(false); };
    utt.onend = () => { setSpeaking(false); setPaused(false); };
    utt.onerror = () => { setSpeaking(false); setPaused(false); };
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [text, lang, checkSupport]);

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };
  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  };
  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  const currentLang = VOICE_LANGUAGES[lang];

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
        <Mic className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span className="text-emerald-800 text-xs font-medium flex-1">
          Voice advisory · {currentLang.label}
        </span>
        {!speaking ? (
          <button
            onClick={speak}
            className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Play className="w-3 h-3" /> Play
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            <Square className="w-3 h-3" /> Stop
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${speaking ? 'bg-emerald-600 animate-pulse' : 'bg-emerald-600'}`}>
            {speaking ? <Volume2 className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 text-sm">🔊 Voice Advisory</h3>
            <p className="text-emerald-600 text-xs">Web Speech API · {currentLang.label}</p>
          </div>
        </div>
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition-colors"
          >
            {currentLang.label} <ChevronDown className="w-3 h-3" />
          </button>
          {showLangMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-1 w-36">
              {Object.entries(VOICE_LANGUAGES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => { setLang(k); setShowLangMenu(false); stop(); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 transition-colors ${k === lang ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-700'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Text Preview */}
      <div className="bg-white/80 rounded-xl p-3 mb-4 max-h-24 overflow-y-auto border border-emerald-100">
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">{text}</p>
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <div className="flex items-center gap-2 mb-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-emerald-500 rounded-full animate-pulse"
              style={{
                height: `${12 + Math.sin(i * 1.2) * 8}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
          <span className="text-emerald-700 text-xs font-medium ml-1">
            {paused ? 'Paused' : 'Speaking...'}
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {!speaking ? (
          <button
            onClick={speak}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-200"
          >
            <Play className="w-4 h-4" />
            Play in {currentLang.label}
          </button>
        ) : (
          <>
            {!paused ? (
              <button
                onClick={pause}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-semibold text-sm rounded-xl hover:bg-amber-600 transition-all"
              >
                <MicOff className="w-4 h-4" /> Pause
              </button>
            ) : (
              <button
                onClick={resume}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white font-semibold text-sm rounded-xl hover:bg-blue-600 transition-all"
              >
                <Play className="w-4 h-4" /> Resume
              </button>
            )}
            <button
              onClick={stop}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600 transition-all"
            >
              <VolumeX className="w-4 h-4" /> Stop
            </button>
          </>
        )}
      </div>

      {supported === false && (
        <p className="text-red-500 text-xs mt-2 text-center">
          ⚠️ Voice not supported in this browser. Try Chrome or Edge.
        </p>
      )}
      <p className="text-emerald-500 text-xs mt-2 text-center">
        ✅ Works on low-bandwidth devices · 9 Indian languages
      </p>
    </div>
  );
}
