import { Copy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface RecipeCardProps {
  type: 'CODING' | 'REPORT' | 'SLIDE';
  bestModel: 'Groq' | 'OpenRouter' | 'Gemini';
  title: string;
  description: string;
}

const typeStyles: Record<RecipeCardProps['type'], string> = {
  CODING: 'border-emerald-500 text-emerald-600 bg-transparent',
  REPORT: 'border-orange-500 text-orange-600 bg-transparent',
  SLIDE: 'border-blue-500 text-blue-600 bg-transparent',
};

const modelStyles: Record<RecipeCardProps['bestModel'], string> = {
  Groq: 'text-violet-600',
  OpenRouter: 'text-blue-600',
  Gemini: 'text-emerald-600',
};

export function RecipeCard({
  type,
  bestModel,
  title,
  description,
  onApply,
}: RecipeCardProps & { onApply: () => void }) {
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

const [copied, setCopied] = useState(false);
const handleCopy = async () => {
  await navigator.clipboard.writeText(description);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

  return (
    <div className="group flex flex-col gap-2.5 rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', typeStyles[type])}>
          {type}
        </span>
        <span className={cn('text-[11px] font-medium', modelStyles[bestModel])}>
          {lang === 'vi' ? 'Tốt nhất: ' : 'Best: '}{bestModel}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-violet-700 transition-colors">
        {title}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2 flex-1">
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
        onClick={handleCopy}>
          <Copy className="w-3 h-3" />
          {copied ? (lang === 'vi' ? "Đã sao chép!" : "Copied!") : (lang === 'vi' ? "Sao chép" : "Copy")}
        </button>
        <button className="flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition ml-auto"
        type="button"
        onClick={onApply}>
          {lang === 'vi' ? 'Dùng thử' : 'Apply'}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
