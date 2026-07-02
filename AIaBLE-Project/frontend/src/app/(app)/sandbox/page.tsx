'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Sparkles, Send, Copy, Check, RotateCcw, 
  Zap, Settings2, Info, ChevronDown, FolderPlus 
} from 'lucide-react';
import SaveToProjectModal from '@/components/shared/SaveToProjectModal';

type AIModel = 'Groq' | 'OpenRouter' | 'Gemini';

interface ModelResult {
  model: AIModel;
  content: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  timeMs?: number;
  color: string;
  logo: string;
}

const INITIAL_MODELS: ModelResult[] = [
  { model: 'Groq',       content: '', status: 'idle', color: 'from-orange-400 to-amber-500', logo: '/groq.svg' },
  { model: 'OpenRouter', content: '', status: 'idle', color: 'from-emerald-400 to-teal-500', logo: '/openrouter.svg' },
  { model: 'Gemini',     content: '', status: 'idle', color: 'from-blue-400 to-cyan-500',    logo: '/gemini.png' },
];

const t = {
  vi: {
    title: 'AI Sandbox',
    desc: 'Kiểm thử và so sánh kết quả trực tiếp từ nhiều mô hình AI (Groq, OpenRouter, Gemini) cùng một lúc.',
    reset: 'Reset',
    settings: 'Cài đặt mô hình',
    masterPrompt: 'Master Prompt',
    samplePrompt: 'Prompt Mẫu',
    placeholder: 'Nhập prompt bạn muốn kiểm thử trên nhiều mô hình AI...',
    hint: 'Nhấn Ctrl + Enter để chạy',
    running: 'Đang chạy...',
    runBtn: 'Chạy Sandbox',
    errConn: 'Không thể kết nối đến server.',
    waiting: 'Chờ thực thi',
    errApi: 'Lỗi kết nối API',
    examples: [
      'Viết một email chuyên nghiệp từ chối lời mời phỏng vấn.',
      'Giải thích nguyên lý hoạt động của Quantum Computing cho học sinh cấp 2.',
      'Tạo một kế hoạch marketing 30 ngày cho quán cà phê mới mở.'
    ]
  },
  en: {
    title: 'AI Sandbox',
    desc: 'Test and compare results directly from multiple AI models (Groq, OpenRouter, Gemini) simultaneously.',
    reset: 'Reset',
    settings: 'Model Settings',
    masterPrompt: 'Master Prompt',
    samplePrompt: 'Sample Prompt',
    placeholder: 'Enter the prompt you want to test across multiple AI models...',
    hint: 'Press Ctrl + Enter to run',
    running: 'Running...',
    runBtn: 'Run Sandbox',
    errConn: 'Cannot connect to server.',
    waiting: 'Waiting to execute',
    errApi: 'API Connection Error',
    examples: [
      'Write a professional email declining an interview invitation.',
      'Explain the principles of Quantum Computing to a middle schooler.',
      'Create a 30-day marketing plan for a newly opened coffee shop.'
    ]
  }
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      disabled={!text}
      className={`p-1.5 rounded-md transition-all ${
        copied 
          ? 'bg-emerald-100 text-emerald-700' 
          : 'text-slate-400 hover:text-violet-600 hover:bg-violet-50 disabled:opacity-50'
      }`}
      title="Copy content"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse p-1">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function SandboxPage() {
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    setLang(localStorage.getItem('app_lang') || 'vi');
    const handleLangChange = () => setLang(localStorage.getItem('app_lang') || 'vi');
    window.addEventListener('storage', handleLangChange);
    window.addEventListener('app_lang_changed', handleLangChange);
    return () => {
      window.removeEventListener('storage', handleLangChange);
      window.removeEventListener('app_lang_changed', handleLangChange);
    };
  }, []);

  const text = t[lang as 'en' | 'vi'] || t.vi;

  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<ModelResult[]>(INITIAL_MODELS);
  const [isRunning, setIsRunning] = useState(false);
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveData, setSaveData] = useState<{prompt?: string, result?: string, aiModel?: string}>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setIsRunning(true);
    
    // Set all to loading
    setResults(prev => prev.map(m => ({ ...m, status: 'loading', content: '', timeMs: undefined })));
    
    // Real API calls
    const runModel = async (index: number, modelName: string, delayMs: number) => {
      // Đợi một khoảng thời gian trước khi gọi API để tránh lỗi 429 Too Many Requests của Gemini Free Tier
      if (delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
      
      const startTime = Date.now();
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sandbox`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model: modelName })
        });
        const data = await res.json();
        
        const endTime = Date.now();
        setResults(prev => {
          const newResults = [...prev];
          newResults[index] = { 
            ...newResults[index], 
            status: data.success ? 'success' : 'error', 
            content: data.success ? data.data : data.message,
            timeMs: endTime - startTime
          };
          return newResults;
        });
        return { model: modelName, content: data.success ? data.data : data.message };
      } catch (error: any) {
        setResults(prev => {
          const newResults = [...prev];
          newResults[index] = { 
            ...newResults[index], 
            status: 'error', 
            content: text.errConn,
          };
          return newResults;
        });
        return { model: modelName, content: text.errConn };
      }
    };

    // Chạy tuần tự cách nhau 1.5s để Google không chặn do gọi quá nhiều request cùng 1 lúc (Rate Limit)
    Promise.all([
      runModel(0, 'Groq', 0),
      runModel(1, 'OpenRouter', 1500),
      runModel(2, 'Gemini', 3000)
    ]).then((runResults) => {
      setIsRunning(false);
      
      // Log lịch sử hoạt động
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'Test prompt in Sandbox',
            tool: 'Sandbox',
            detail: `Prompt: ${prompt.substring(0, 60)}${prompt.length > 60 ? '...' : ''}`,
            model: 'All Models',
            prompt: prompt,
            result: runResults.map(r => `[${r.model}]: ${r.content}`).join('\n\n')
          })
        }).catch(err => console.error('Lỗi khi lưu lịch sử:', err));
      }
    });
  };

  const handleReset = () => {
    setPrompt('');
    setResults(INITIAL_MODELS);
    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const handleContentChange = (modelName: string, newContent: string) => {
    setResults(prev => prev.map(r => r.model === modelName ? { ...r, content: newContent } : r));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-md shadow-fuchsia-200">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">{text.title}</h1>
          </div>
          <p className="text-sm text-slate-500">
            {text.desc}
          </p>
        </div>
        <div className="flex gap-2">
          {results.some(r => r.status === 'success') && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {text.reset}
            </button>
          )}
        </div>
      </div>

      {/* ── Prompt Input Area ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400 transition-all">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-slate-700">{text.masterPrompt}</span>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold transition">
              {text.samplePrompt} <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute right-0 top-6 w-72 bg-white border border-slate-100 rounded-xl shadow-lg py-1 hidden group-hover:block z-20">
              {text.examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition border-b border-slate-50 last:border-0 leading-relaxed"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={text.placeholder}
            rows={4}
            className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleRun();
              }
            }}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4" />
            {text.hint}
          </div>
          <button
            onClick={handleRun}
            disabled={!prompt.trim() || isRunning}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700 transition shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {text.running}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {text.runBtn}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Results Grid (3 Columns) ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {results.map((res, idx) => (
          <div 
            key={res.model} 
            className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Header Column */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden border border-slate-200 ignore-dark-mode bg-white">
                  <Image src={res.logo} alt={res.model} width={24} height={24} className="object-cover" />
                </div>
                <span className="text-sm font-bold text-slate-800">{res.model}</span>
              </div>
              
              {/* Status / Timing badge */}
              <div className="flex items-center gap-2">
                {res.status === 'success' && res.timeMs && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {res.timeMs}ms
                  </span>
                )}
                {res.status === 'success' && (
                  <button
                    onClick={() => {
                      setSaveData({ prompt, result: res.content, aiModel: res.model });
                      setIsSaveModalOpen(true);
                    }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                    title="Save to Project"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                )}
                <CopyButton text={res.content} />
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 p-5 bg-slate-50/30 min-h-[300px]">
              {res.status === 'idle' && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 opacity-50">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center grayscale overflow-hidden ignore-dark-mode bg-white border border-slate-200">
                    <Image src={res.logo} alt={res.model} width={48} height={48} className="object-cover opacity-60" />
                  </div>
                  <p className="text-xs font-medium">{text.waiting}</p>
                </div>
              )}

              {res.status === 'loading' && (
                <SkeletonLoader />
              )}

              {res.status === 'success' && (
                <textarea
                  value={res.content}
                  onChange={(e) => handleContentChange(res.model, e.target.value)}
                  className="w-full min-h-[250px] p-0 bg-transparent border-0 prose prose-sm prose-slate max-w-none text-slate-700 text-sm leading-relaxed focus:ring-0 focus:outline-none resize-y animate-in fade-in slide-in-from-bottom-2 duration-500"
                />
              )}

              {res.status === 'error' && (
                <div className="flex flex-col items-center justify-center text-center h-full text-red-500 gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{text.errApi}</p>
                    <p className="text-xs mt-1 max-w-[200px] text-red-400 leading-relaxed">{res.content}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Save to Project Modal ──────────────────────────────────────────── */}
      <SaveToProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        data={saveData}
      />
    </div>
  );
}
