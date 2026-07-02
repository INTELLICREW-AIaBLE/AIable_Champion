'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Wand2, Copy, Check, AlertTriangle, ChevronDown,
  Sparkles, ArrowRight, RotateCcw, Info, X,
  Zap, BookOpen, Target, TrendingUp, FolderPlus
} from 'lucide-react';
import Image from 'next/image';
import SaveToProjectModal from '@/components/shared/SaveToProjectModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type AIModel = 'Groq' | 'OpenRouter' | 'Gemini';
type ToneType = 'academic' | 'technical' | 'creative' | 'concise';

interface OptimizeResult {
  optimized: string;
  improvements: { label: string; before: number; after: number; unit: string }[];
  suggestions: string[];
  ethicsFlag: boolean;
  ethicsReason?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const AI_MODELS: { id: AIModel; label: string; badge: string; color: string; logo: string }[] = [
  { id: 'Groq', label: 'Groq', badge: 'Best for writing', color: 'from-orange-400 to-amber-500', logo: '/groq.svg' },
  { id: 'OpenRouter', label: 'OpenRouter', badge: 'Best for coding', color: 'from-emerald-400 to-teal-500', logo: '/openrouter.svg' },
  { id: 'Gemini', label: 'Gemini', badge: 'Best for analysis', color: 'from-blue-400 to-cyan-500', logo: '/gemini.png' },
];

const TONES: { id: ToneType; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'academic', label: 'Academic', icon: BookOpen, desc: 'Formal, citation-ready' },
  { id: 'technical', label: 'Technical', icon: Target, desc: 'Precise, structured' },
  { id: 'creative', label: 'Creative', icon: Sparkles, desc: 'Vivid, engaging' },
  { id: 'concise', label: 'Concise', icon: Zap, desc: 'Brief, to the point' },
];

const t = {
  vi: {
    title: 'Prompt Optimizer',
    desc: 'Biến raw prompt thô thành prompt chuyên nghiệp với AI. Xem ngay sự khác biệt Before / After.',
    reset: 'Reset',
    aiModel: 'AI Model',
    outputTone: 'Output Tone',
    rawPrompt: 'Raw Prompt',
    chars: 'ký tự',
    words: 'từ',
    example: 'Ví dụ',
    placeholder: "Nhập prompt thô của bạn vào đây...\n\nVí dụ: 'Giải thích thuật toán quicksort cho tôi'",
    hint: 'Nhập tối thiểu 10 ký tự để bắt đầu tối ưu',
    optimizing: 'Đang tối ưu...',
    optimizeBtn: 'Optimize Prompt',
    view: 'Xem:',
    ethicsWarning: 'Cảnh báo đạo đức',
    before: 'Before',
    after: 'After',
    optimizedBy: 'Optimized',
    significantImprovement: 'Cải thiện đáng kể',
    suggestions: 'Gợi ý cải thiện thêm',
    reoptimize: 'Tối ưu lại với gợi ý này',
    errConn: 'Không thể kết nối đến server backend.',
    errGen: 'Có lỗi xảy ra khi tối ưu prompt.',
    copied: 'Copied!',
    copy: 'Copy',
    tones: {
      academic: { label: 'Academic', desc: 'Formal, citation-ready' },
      technical: { label: 'Technical', desc: 'Precise, structured' },
      creative: { label: 'Creative', desc: 'Vivid, engaging' },
      concise: { label: 'Concise', desc: 'Brief, to the point' }
    },
    examples: [
      'Giải thích thuật toán quicksort cho tôi',
      'Viết báo cáo về biến đổi khí hậu',
      'Tóm tắt chương 3 sách giáo trình',
      'Giải bài toán tích phân này cho tôi',
    ],
    ethicsTitle: '⚠️ Cảnh báo Đạo đức Học thuật',
    ethicsMsg1: 'AIaBLE khuyến khích sử dụng AI để:',
    ethicsL1: 'Hiểu sâu hơn về chủ đề',
    ethicsL2: 'Lấy ý tưởng và gợi ý cấu trúc',
    ethicsL3: 'Review và cải thiện bài viết của mình',
    ethicsL4: 'Làm bài thay hoặc gian lận thi cử',
    close: 'Đóng',
    iUnderstand: 'Tôi hiểu rồi'
  },
  en: {
    title: 'Prompt Optimizer',
    desc: 'Turn raw prompts into professional prompts with AI. See the Before / After difference instantly.',
    reset: 'Reset',
    aiModel: 'AI Model',
    outputTone: 'Output Tone',
    rawPrompt: 'Raw Prompt',
    chars: 'chars',
    words: 'words',
    example: 'Examples',
    placeholder: "Enter your raw prompt here...\n\nExample: 'Explain the quicksort algorithm to me'",
    hint: 'Enter at least 10 characters to start optimizing',
    optimizing: 'Optimizing...',
    optimizeBtn: 'Optimize Prompt',
    view: 'View:',
    ethicsWarning: 'Ethics Warning',
    before: 'Before',
    after: 'After',
    optimizedBy: 'Optimized',
    significantImprovement: 'Significant Improvements',
    suggestions: 'Suggestions for Improvement',
    reoptimize: 'Re-optimize with this suggestion',
    errConn: 'Cannot connect to backend server.',
    errGen: 'An error occurred while optimizing prompt.',
    copied: 'Copied!',
    copy: 'Copy',
    tones: {
      academic: { label: 'Academic', desc: 'Formal, citation-ready' },
      technical: { label: 'Technical', desc: 'Precise, structured' },
      creative: { label: 'Creative', desc: 'Vivid, engaging' },
      concise: { label: 'Concise', desc: 'Brief, to the point' }
    },
    examples: [
      'Explain the quicksort algorithm to me',
      'Write a report on climate change',
      'Summarize chapter 3 of the textbook',
      'Solve this integral problem for me',
    ],
    ethicsTitle: '⚠️ Academic Ethics Warning',
    ethicsMsg1: 'AIaBLE encourages using AI to:',
    ethicsL1: 'Understand the topic deeply',
    ethicsL2: 'Get ideas and structural suggestions',
    ethicsL3: 'Review and improve your writing',
    ethicsL4: 'Do homework for you or cheat on exams',
    close: 'Close',
    iUnderstand: 'I Understand'
  }
};


// ─── Mock optimize function ────────────────────────────────────────────────────
function mockOptimize(raw: string, model: AIModel, tone: ToneType): OptimizeResult {
  const isEthics = /làm hộ|làm giùm|viết thay|làm bài|thi hộ|gian lận/i.test(raw);

  const optimized = `[Vai trò: Chuyên gia ${tone === 'academic' ? 'học thuật' : tone === 'technical' ? 'kỹ thuật' : 'sáng tạo'}]

${raw.trim()}

Yêu cầu output:
• Trình bày rõ ràng, có cấu trúc
• Giải thích từng bước logic
• Đưa ra ví dụ cụ thể nếu có thể
• Tối ưu cho ${model}`;

  return {
    optimized,
    improvements: [
      { label: 'Clarity Score', before: 42, after: 91, unit: '%' },
      { label: 'Word Count', before: raw.split(' ').length, after: optimized.split(' ').length, unit: 'w' },
      { label: 'Structure', before: 20, after: 88, unit: '%' },
    ],
    suggestions: [
      'Thêm ngữ cảnh cụ thể về mức độ hiểu biết của bạn',
      'Chỉ định định dạng output mong muốn (bullet, bảng, v.v.)',
      'Cho biết mục đích sử dụng để AI cá nhân hoá tốt hơn',
    ],
    ethicsFlag: isEthics,
    ethicsReason: isEthics ? 'Prompt có dấu hiệu yêu cầu làm bài thay — vi phạm quy định học thuật.' : undefined,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${copied
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50'
        }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function ImprovementBar({ label, before, after, unit }: { label: string; before: number; after: number; unit: string }) {
  const max = unit === '%' ? 100 : Math.max(before, after) * 1.2;
  const pctBefore = Math.min((before / max) * 100, 100);
  const pctAfter = Math.min((after / max) * 100, 100);
  const gain = after - before;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className={`font-bold ${gain > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
          {gain > 0 ? `+${gain}${unit}` : `${gain}${unit}`}
        </span>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-slate-300 rounded-full transition-all duration-700" style={{ width: `${pctBefore}%` }} />
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700 delay-200" style={{ width: `${pctAfter}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>Before: {before}{unit}</span>
        <span>After: {after}{unit}</span>
      </div>
    </div>
  );
}

// ─── Ethics Dialog ─────────────────────────────────────────────────────────────
function EthicsDialog({ reason, onDismiss, text }: { reason: string; onDismiss: () => void, text: any }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-amber-200">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center mb-2">
          {text.ethicsTitle}
        </h3>
        <p className="text-sm text-slate-600 text-center mb-4 leading-relaxed">
          {reason}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800 space-y-2">
          <p className="font-semibold">{text.ethicsMsg1}</p>
          <ul className="space-y-1 text-amber-700">
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" /> {text.ethicsL1}</li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" /> {text.ethicsL2}</li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" /> {text.ethicsL3}</li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 mt-0.5 text-red-500 shrink-0" /> <span className="line-through opacity-60">{text.ethicsL4}</span></li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {text.close}
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700 transition shadow-md shadow-violet-200"
          >
            {text.iUnderstand}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function OptimizerPage() {
  const [raw, setRaw] = useState('');
  const [model, setModel] = useState<AIModel>('Groq');
  const [tone, setTone] = useState<ToneType>('academic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [showEthics, setShowEthics] = useState(false);
  const [activeView, setActiveView] = useState<'split' | 'before' | 'after'>('split');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    const prefill = sessionStorage.getItem('optimizer_prefill');
    const prefillAI = sessionStorage.getItem('optimizer_prefill_AI') as AIModel | null;

    if (prefill) {
      setRaw(prefill);
      sessionStorage.removeItem('optimizer_prefill');
    }

    if (prefillAI && ['Groq', 'OpenRouter', 'Gemini'].includes(prefillAI)) {
      setModel(prefillAI);
      sessionStorage.removeItem('optimizer_prefill_AI');
    }
  }, []);
  
  const charCount = raw.length;
  const wordCount = raw.trim() ? raw.trim().split(/\s+/).length : 0;
  const canOptimize = raw.trim().length >= 10 && !loading;

  const handleOptimize = async () => {
    if (!canOptimize) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/optimizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: raw,
          model,
          tone,
          geminiKey: localStorage.getItem('geminiKey')
        })
      });
      const json = await res.json();
      if (res.ok) {
        setResult(json);
        if (json.ethicsFlag) setShowEthics(true);
        
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
              action: 'Optimize Prompt',
              tool: 'Prompt Optimizer',
              detail: `Raw: ${raw.substring(0, 60)}${raw.length > 60 ? '...' : ''}`,
              model: model,
              prompt: raw,
              result: json.optimized || ''
            })
          }).catch(err => console.error('Lỗi khi lưu lịch sử:', err));
        }
      } else {
        console.error('Failed to optimize prompt:', json.message);
        alert(json.message || text.errGen);
      }
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      alert(text.errConn);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRaw('');
    setResult(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">{text.title}</h1>
          </div>
          <p className="text-sm text-slate-500">
            {text.desc}
          </p>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {text.reset}
          </button>
        )}
      </div>

      {/* ── Config Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* AI Model */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{text.aiModel}</p>
          <div className="flex gap-2">
            {AI_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${model === m.id
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <div className="w-6 h-6 rounded-lg overflow-hidden border border-slate-200 shrink-0 ignore-dark-mode bg-white">
                  <Image src={m.logo} alt={m.label} width={24} height={24} className="object-cover" />
                </div>
                {m.id}
                <span className="text-[9px] font-medium text-slate-400 leading-none">{m.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{text.outputTone}</p>
          <div className="grid grid-cols-2 gap-2">
            {TONES.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => setTone(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-left transition-all ${tone === id
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${tone === id ? 'text-violet-600' : 'text-slate-400'}`} />
                <div>
                  <p className={`text-xs font-semibold ${tone === id ? 'text-violet-700' : 'text-slate-700'}`}>{(text.tones as any)[id]?.label || label}</p>
                  <p className="text-[10px] text-slate-400 leading-none">{(text.tones as any)[id]?.desc || desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Input Area ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
            {text.rawPrompt}
          </span>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${charCount > 1000 ? 'text-amber-500' : 'text-slate-400'}`}>
              {charCount}/2000 {text.chars} · {wordCount} {text.words}
            </span>
            {/* Example prompts */}
            <div className="relative">
              <button 
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold transition"
              >
                {text.example} <ChevronDown className="w-3 h-3" />
              </button>
              
              {showExamples && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExamples(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                    {text.examples.map((ex) => (
                      <button
                        type="button"
                        key={ex}
                        onClick={() => {
                          setRaw(ex);
                          setShowExamples(false);
                          textareaRef.current?.focus();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={text.placeholder}
          maxLength={2000}
          rows={6}
          className="w-full px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5" />
            {text.hint}
          </div>
          <button
            onClick={handleOptimize}
            disabled={!canOptimize}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white hover:from-violet-700 hover:to-purple-800 transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {text.optimizing}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                {text.optimizeBtn}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Loading skeleton ────────────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 animate-pulse">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="space-y-2">
                {[80, 100, 60, 90, 70].map((w, j) => (
                  <div key={j} className="h-3 bg-slate-100 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Result ──────────────────────────────────────────────────────────── */}
      {result && !loading && (
        <div className="space-y-4">

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">{text.view}</span>
            {(['split', 'before', 'after'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeView === v
                    ? 'bg-violet-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {v === 'split' ? '⊟ Split' : v === 'before' ? `← ${text.before}` : `→ ${text.after}`}
              </button>
            ))}

            {/* Ethics warning inline badge */}
            {result.ethicsFlag && (
              <button
                onClick={() => setShowEthics(true)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {text.ethicsWarning}
              </button>
            )}
          </div>

          {/* Before / After panels */}
          <div className={`grid gap-4 ${activeView === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>

            {/* BEFORE */}
            {(activeView === 'split' || activeView === 'before') && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="text-sm font-bold text-slate-700">{text.before}</span>
                    <span className="text-xs text-slate-400">Raw prompt</span>
                  </div>
                  <CopyButton text={raw} />
                </div>
                <pre className="px-5 py-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-mono bg-slate-50/30 min-h-[180px]">
                  {raw}
                </pre>
              </div>
            )}

            {/* AFTER */}
            {(activeView === 'split' || activeView === 'after') && (
              <div className="bg-white rounded-2xl border border-violet-200 shadow-sm shadow-violet-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-violet-50 border-b border-violet-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <span className="text-sm font-bold text-violet-800">{text.after}</span>
                    <span className="text-xs text-violet-400">{text.optimizedBy} · {model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="p-1.5 text-violet-600 hover:bg-violet-100 rounded-lg transition"
                      title="Lưu vào Dự án"
                    >
                      <FolderPlus className="w-4 h-4" />
                    </button>
                    <CopyButton text={result.optimized} />
                  </div>
                </div>
                <pre className="px-5 py-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-mono min-h-[180px]">
                  {result.optimized}
                </pre>
              </div>
            )}
          </div>

          {/* ── Improvement Stats + Suggestions ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-500" />
                {text.significantImprovement}
              </h3>
              <div className="space-y-4">
                {result.improvements.map((imp) => (
                  <ImprovementBar key={imp.label} {...imp} />
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                {text.suggestions}
              </h3>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={handleOptimize}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white hover:opacity-90 transition shadow-md shadow-violet-200"
                >
                  <ArrowRight className="w-4 h-4" />
                  {text.reoptimize}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Ethics Dialog ────────────────────────────────────────────────────── */}
      {showEthics && result?.ethicsReason && (
        <EthicsDialog reason={result.ethicsReason} text={text} onDismiss={() => setShowEthics(false)} />
      )}

      {/* ── Save Modal ───────────────────────────────────────────────────────── */}
      {result && (
        <SaveToProjectModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          data={{
            prompt: raw,
            result: result.optimized,
            aiModel: model
          }}
        />
      )}
    </div>
  );
}
