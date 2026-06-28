'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Sparkles, Send, Copy, Check, RotateCcw, 
  Zap, Settings2, Info, ChevronDown 
} from 'lucide-react';

type AIModel = 'Claude' | 'GPT-4' | 'Gemini';

interface ModelResult {
  model: AIModel;
  content: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  timeMs?: number;
  color: string;
  logo: string;
}

const INITIAL_MODELS: ModelResult[] = [
  { model: 'Claude', content: '', status: 'idle', color: 'from-orange-400 to-amber-500', logo: '/claude.png' },
  { model: 'GPT-4',  content: '', status: 'idle', color: 'from-emerald-400 to-teal-500', logo: '/chatgpt.png' },
  { model: 'Gemini', content: '', status: 'idle', color: 'from-blue-400 to-cyan-500',    logo: '/gemini.png' },
];

const EXAMPLE_PROMPTS = [
  'Viết một email chuyên nghiệp từ chối lời mời phỏng vấn.',
  'Giải thích nguyên lý hoạt động của Quantum Computing cho học sinh cấp 2.',
  'Tạo một kế hoạch marketing 30 ngày cho quán cà phê mới mở.',
];

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
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<ModelResult[]>(INITIAL_MODELS);
  const [isRunning, setIsRunning] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setIsRunning(true);
    
    // Set all to loading
    setResults(prev => prev.map(m => ({ ...m, status: 'loading', content: '', timeMs: undefined })));
    
    // Mock independent API calls with different response times
    const runModel = async (index: number, delayMs: number, mockResponse: string) => {
      const startTime = Date.now();
      await new Promise(r => setTimeout(r, delayMs));
      const endTime = Date.now();
      
      setResults(prev => {
        const newResults = [...prev];
        newResults[index] = { 
          ...newResults[index], 
          status: 'success', 
          content: mockResponse,
          timeMs: endTime - startTime
        };
        return newResults;
      });
    };

    // Trigger all independently
    Promise.all([
      runModel(0, 1500, `Đây là kết quả phản hồi từ Claude.\n\nClaude thường có xu hướng viết dài, chi tiết và có văn phong tự nhiên hơn.\n\n${prompt}`),
      runModel(1, 2200, `Kết quả từ GPT-4.\n\nGPT-4 thường cấu trúc rõ ràng, logic, tập trung thẳng vào vấn đề và có khả năng suy luận tốt.\n\n${prompt}`),
      runModel(2, 1200, `Gemini phản hồi:\n\nGemini phản hồi rất nhanh, thường đưa ra thông tin ngắn gọn, có gạch đầu dòng rõ ràng.\n\n- Nhanh chóng\n- Trực quan\n- Tích hợp tốt`)
    ]).then(() => {
      setIsRunning(false);
    });
  };

  const handleReset = () => {
    setPrompt('');
    setResults(INITIAL_MODELS);
    setTimeout(() => textareaRef.current?.focus(), 10);
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
            <h1 className="text-2xl font-black text-slate-900">AI Sandbox</h1>
          </div>
          <p className="text-sm text-slate-500">
            Kiểm thử và so sánh kết quả trực tiếp từ nhiều mô hình AI (Claude, GPT-4, Gemini) cùng một lúc.
          </p>
        </div>
        <div className="flex gap-2">
          {results.some(r => r.status === 'success') && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">
            <Settings2 className="w-3.5 h-3.5" /> Cài đặt mô hình
          </button>
        </div>
      </div>

      {/* ── Prompt Input Area ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400 transition-all">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-slate-700">Master Prompt</span>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold transition">
              Prompt Mẫu <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute right-0 top-6 w-72 bg-white border border-slate-100 rounded-xl shadow-lg py-1 hidden group-hover:block z-20">
              {EXAMPLE_PROMPTS.map((ex, i) => (
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
            placeholder="Nhập prompt bạn muốn kiểm thử trên nhiều mô hình AI..."
            rows={4}
            className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleRun();
              }
            }}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4" />
            Nhấn <kbd className="bg-white border border-slate-200 rounded px-1.5 font-sans shadow-sm">Ctrl</kbd> + <kbd className="bg-white border border-slate-200 rounded px-1.5 font-sans shadow-sm">Enter</kbd> để chạy
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
                Đang chạy...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Chạy Sandbox
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
                <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden border border-slate-200">
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
                <CopyButton text={res.content} />
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 p-5 bg-slate-50/30 min-h-[300px]">
              {res.status === 'idle' && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 opacity-50">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center grayscale overflow-hidden">
                    <Image src={res.logo} alt={res.model} width={48} height={48} className="object-cover opacity-60" />
                  </div>
                  <p className="text-xs font-medium">Chờ thực thi</p>
                </div>
              )}

              {res.status === 'loading' && (
                <SkeletonLoader />
              )}

              {res.status === 'success' && (
                <div className="prose prose-sm prose-slate max-w-none text-slate-700 text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {res.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
