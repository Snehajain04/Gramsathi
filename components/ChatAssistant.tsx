'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Leaf } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'What are symptoms of Rice Blast?',
  'How to control Fall Armyworm?',
  'Best practices for Cotton Bollworm?',
  'When to apply fungicide?',
  'How does GramSathi AI work?',
];

const KNOWLEDGE_BASE: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['rice blast', 'blast'],
    answer: '🌾 **Rice Blast** is caused by *Magnaporthe oryzae* fungus.\n\n**Symptoms:** Diamond-shaped lesions with grey centers and brown borders on leaves, neck rot.\n\n**IPM Steps:**\n1. Use resistant varieties\n2. Avoid excess nitrogen\n3. Tricyclazole 75% WP @ 0.6g/L water\n4. Consult KVK for field confirmation',
  },
  {
    keywords: ['armyworm', 'fall armyworm', 'maize pest'],
    answer: '🌽 **Fall Armyworm** (*Spodoptera frugiperda*) devastates maize crops.\n\n**Symptoms:** Ragged leaf edges, frass in plant whorls, window-pane feeding.\n\n**IPM Steps:**\n1. Set pheromone traps (5/acre)\n2. Release *Trichogramma* parasitoids\n3. Apply Chlorpyriphos 20EC as last resort\n4. Report sighting to extension officer',
  },
  {
    keywords: ['bollworm', 'cotton'],
    answer: '🪴 **Cotton Bollworm** (*Helicoverpa armigera*) attacks cotton bolls.\n\n**Symptoms:** Circular holes in bolls, premature boll dropping, frass.\n\n**IPM Steps:**\n1. Use Bt cotton varieties\n2. Install pheromone traps\n3. Apply neem-based pesticides first\n4. Chemical: Emamectin Benzoate 5SG',
  },
  {
    keywords: ['fungicide', 'when', 'apply'],
    answer: '⏰ **When to Apply Fungicide:**\n\n• Apply **preventively** before disease onset\n• Best timing: Early morning or evening\n• Avoid application before rain\n• Repeat after 10-14 days if needed\n• Always follow label instructions\n• Consult KVK or extension officer for local guidance',
  },
  {
    keywords: ['gramsathi', 'how', 'ai', 'work'],
    answer: '🤖 **How GramSathi AI Works:**\n\n1. **Image Analysis**: Upload crop photo → Computer vision detects disease patterns\n2. **Weather Integration**: Local temperature & humidity data fed into risk model\n3. **XAI Engine**: Every prediction explained with factor bars & evidence\n4. **Expert Validation**: Results reviewed by certified agricultural scientists\n5. **IPM Advisory**: Safe, step-by-step treatment guidance generated\n\nConfidence: 85-97% accuracy on trained diseases',
  },
  {
    keywords: ['blight', 'leaf blight', 'bacterial'],
    answer: '🍂 **Bacterial Leaf Blight** (*Xanthomonas oryzae*) affects rice.\n\n**Symptoms:** Water-soaked leaf margins turning yellow-white, wilting.\n\n**IPM Steps:**\n1. Use certified disease-free seeds\n2. Balanced nitrogen fertilization\n3. Copper-based bactericide spray\n4. Report clusters to district agriculture office',
  },
];

function findAnswer(query: string): string {
  const lower = query.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.answer;
    }
  }
  return `I can help with crop diseases, pest management, and GramSathi features. Try asking about:\n• Rice Blast, Fall Armyworm, Cotton Bollworm\n• When to apply fungicide\n• How GramSathi AI works\n\nFor urgent crop issues, please contact your local KVK or extension officer.`;
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: '👋 Hello! I am **GramSathi AI Assistant**.\n\nI can help you with:\n• Crop disease symptoms & treatment\n• Pest management guidance\n• IPM best practices\n• Using GramSathi features\n\nWhat would you like to know?',
  timestamp: new Date(),
};

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate processing delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const answer = findAnswer(text);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="GramSathi Chat Assistant"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {messages.length > 1 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {messages.filter(m => m.role === 'assistant').length - 1}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">GramSathi Assistant</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-green-200 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${ msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-green-600' : 'bg-gray-100'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-green-600" />}
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  <p
                    className="leading-relaxed text-xs"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                  <p className={`text-[10px] mt-1 ${ msg.role === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-3 pb-2 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="flex-shrink-0 text-[11px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1.5 rounded-xl hover:bg-green-100 transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask about crop diseases..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-green-600 hover:bg-green-700 disabled:opacity-40 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
