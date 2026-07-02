"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Wand2, Bookmark, BookOpen, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type RecipeCategory =
  | 'CODING' | 'REPORT' | 'SLIDE' | 'RESEARCH' | 'WRITING' | 'PLANNING'
  | 'MATH' | 'ENGLISH' | 'BUSINESS' | 'DESIGN' | 'DATA' | 'LAW'
  | 'ECONOMICS' | 'CREATIVE' | 'MARKETING' | 'HR' | 'PSYCHOLOGY'
  | 'SCIENCE' | 'HISTORY' | 'CAREER' | 'AI_PROMPTING';

type AIProvider = 'OpenRouter' | 'Groq' | 'Gemini';

type Recipe = {
  id: string;
  title: string;
  category: RecipeCategory;
  description: string;
  prompt: string;
  bestAI: AIProvider;
  variables: { name: string; label: string; type: string; required: boolean }[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const RECIPES_PER_PAGE = 9;

const CATEGORY_GROUPS = [
  {
    label: 'Academic',
    items: ['All', 'Coding', 'Report', 'Research', 'Math', 'English', 'Science', 'History', 'Economics', 'Law'],
  },
  {
    label: 'Professional',
    items: ['Writing', 'Slide', 'Business', 'Marketing', 'HR', 'Career', 'Planning'],
  },
  {
    label: 'Creative & Tech',
    items: ['Creative', 'Design', 'Data', 'Psychology', 'AI Prompting'],
  },
];

const ALL_CATEGORIES = ['All', ...CATEGORY_GROUPS.flatMap(g => g.items.filter(i => i !== 'All'))];

const CATEGORY_COLORS: Record<string, string> = {
  coding: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/30 dark:text-violet-300',
  report: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  slide: 'bg-amber-50 text-amber-700 border-amber-100',
  research: 'bg-sky-50 text-sky-700 border-sky-100',
  writing: 'bg-pink-50 text-pink-700 border-pink-100',
  planning: 'bg-teal-50 text-teal-700 border-teal-100',
  math: 'bg-orange-50 text-orange-700 border-orange-100',
  english: 'bg-blue-50 text-blue-700 border-blue-100',
  business: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  design: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  data: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  law: 'bg-slate-100 text-slate-700 border-slate-200',
  economics: 'bg-lime-50 text-lime-700 border-lime-100',
  creative: 'bg-rose-50 text-rose-700 border-rose-100',
  marketing: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  hr: 'bg-green-50 text-green-700 border-green-100',
  psychology: 'bg-purple-50 text-purple-700 border-purple-100',
  science: 'bg-blue-50 text-blue-700 border-blue-100',
  history: 'bg-stone-50 text-stone-700 border-stone-200',
  career: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  ai_prompting: 'bg-violet-50 text-violet-700 border-violet-100',
};

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: 'bg-green-50 text-green-600 border-green-100',
  intermediate: 'bg-amber-50 text-amber-600 border-amber-100',
  advanced: 'bg-red-50 text-red-600 border-red-100',
};

// ─── Recipe Card ──────────────────────────────────────────────────────────────
function RecipeCard({ recipe, onApply }: { recipe: Recipe; onApply: (r: Recipe) => void }) {
  const [saved, setSaved] = useState(false);
  const catKey = recipe.category.toLowerCase().replace('_', ' ');

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/recipes/saved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ recipe: { ...recipe, desc: recipe.description, model: recipe.bestAI } }),
      });
      const data = await res.json();
      if (data.success) setSaved(s => !s);
    } catch { /* silent */ }
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md hover:shadow-violet-100/50 overflow-hidden">
      {/* Top accent bar by category */}
      <div className={cn('h-1 w-full', `bg-gradient-to-r`,
        recipe.category === 'CODING' ? 'from-violet-400 to-purple-500' :
          recipe.category === 'REPORT' ? 'from-emerald-400 to-teal-500' :
            recipe.category === 'SLIDE' ? 'from-amber-400 to-orange-500' :
              recipe.category === 'RESEARCH' ? 'from-sky-400 to-blue-500' :
                recipe.category === 'MATH' ? 'from-orange-400 to-red-400' :
                  recipe.category === 'DATA' ? 'from-cyan-400 to-blue-500' :
                    recipe.category === 'AI_PROMPTING' ? 'from-fuchsia-400 to-violet-500' :
                      'from-slate-300 to-slate-400'
      )} />

      <div className="flex flex-col flex-1 p-4">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', CATEGORY_COLORS[recipe.category.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-100')}>
            {catKey}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="mb-1.5 text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-violet-700 transition-colors">
          {recipe.title}
        </h3>
        <p className="mb-3 text-xs leading-relaxed text-slate-500 line-clamp-2 flex-1">
          {recipe.description}
        </p>

        {/* Best AI */}
        <div className="mb-4 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span>🧠</span>
          <span>Best with</span>
          <span className="font-semibold text-slate-700">{recipe.bestAI}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition focus:outline-none',
              saved ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100' : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
            )}
          >
            <Bookmark className={cn('w-3.5 h-3.5', saved && 'fill-rose-500 text-rose-500')} />
            {saved ? 'Saved' : 'Save'}
          </button>

          <button
            type="button"
            onClick={() => onApply(recipe)}
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-violet-700 active:scale-95"
          >
            <Wand2 className="h-3 w-3" />
            Apply
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  currentPage, totalPages, onChange,
}: { currentPage: number; totalPages: number; onChange: (p: number) => void }) {
  const pages = useMemo(() => {
    const arr: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      arr.push(1);
      if (currentPage > 3) arr.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) arr.push(i);
      if (currentPage < totalPages - 2) arr.push('...');
      arr.push(totalPages);
    }
    return arr;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-slate-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={cn(
              'w-9 h-9 rounded-xl text-sm font-semibold transition',
              currentPage === p
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RecipeLibraryPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiFilter, setAiFilter] = useState<'All' | AIProvider>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/recipes`);
        const json = await res.json();
        setRecipes(json.data || []);
      } catch { /* silent */ } finally { setLoading(false); }
    }
    fetchRecipes();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery, aiFilter]);

  const filteredRecipes = useMemo(() => recipes.filter(r => {
    const matchCat = activeCategory === 'All'
      || r.category.toLowerCase() === activeCategory.toLowerCase().replace(' ', '_');
    const matchSearch = !searchQuery
      || r.title.toLowerCase().includes(searchQuery.toLowerCase())
      || r.description.toLowerCase().includes(searchQuery.toLowerCase())
      || r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchAI = aiFilter === 'All' || r.bestAI === aiFilter;
    return matchCat && matchSearch && matchAI;
  }), [recipes, activeCategory, searchQuery, aiFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE));
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );

  const logHistory = async (recipe: Recipe) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ action: 'Apply Recipe', tool: 'Recipe Library', detail: `Applied: ${recipe.title}`, model: recipe.bestAI }),
      });
    } catch { /* silent */ }
  };

  const handleApply = (recipe: Recipe) => {
    sessionStorage.setItem('optimizer_prefill', recipe.prompt);
    sessionStorage.setItem('optimizer_prefill_AI', recipe.bestAI);
    logHistory(recipe);
    router.push('/optimizer');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Recipe Library</h1>
          </div>
          <p className="text-sm text-slate-500">
            {filteredRecipes.length} recipes · trang {currentPage}/{totalPages}
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2 relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-700 w-56 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-200 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm recipe..."
              className="bg-transparent border-none outline-none w-full placeholder:text-slate-400 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(s => !s)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition',
              showFilters || aiFilter !== 'All'
                ? 'bg-violet-50 border-violet-200 text-violet-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            )}
          >
            <Filter className="w-4 h-4" />
            AI
            {aiFilter !== 'All' && <span className="bg-violet-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">1</span>}
          </button>

          {showFilters && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 z-20">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Filter by AI model</p>
              {(['All', 'OpenRouter', 'Groq', 'Gemini'] as const).map(ai => (
                <button
                  key={ai}
                  onClick={() => { setAiFilter(ai); setShowFilters(false); }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-sm rounded-lg transition',
                    aiFilter === ai ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {ai === 'All' ? 'Tất cả AI' : ai}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Categories — grouped & scrollable ─────────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-3">
        {CATEGORY_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                        : 'bg-slate-50 border border-slate-100 text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

        {/* ── Results info ────────────────────────────────────────────────────── */}
        {!loading && (
          <p className="text-xs text-slate-400 font-medium">
            Hiển thị {(currentPage - 1) * RECIPES_PER_PAGE + 1}–{Math.min(currentPage * RECIPES_PER_PAGE, filteredRecipes.length)} trong tổng số <span className="text-violet-600 font-bold">{filteredRecipes.length}</span> recipes
          </p>
        )}

        {/* ── Grid ────────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 animate-pulse">
                <div className="h-1 w-full bg-slate-200 rounded mb-4" />
                <div className="h-3 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                <div className="h-3 bg-slate-100 rounded w-5/6 mb-4" />
                <div className="flex gap-2 mt-6">
                  <div className="h-7 w-16 bg-slate-100 rounded-lg" />
                  <div className="h-7 w-20 bg-violet-100 rounded-lg ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">Không tìm thấy recipe nào</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); setAiFilter('All'); }} className="mt-3 text-xs text-violet-600 hover:underline">
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRecipes.map(r => (
              <RecipeCard key={r.id} recipe={r} onApply={handleApply} />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}
      </div>
      );
}
