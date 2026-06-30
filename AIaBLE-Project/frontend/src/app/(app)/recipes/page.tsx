"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  BookOpen,
  Code2,
  FileText,
  Presentation,
  FlaskConical,
  Target,
  Languages,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';

export type RecipeCategory = 'REPORT' | 'REPORT' | 'SLIDE' | 'RESEARCH';
export type AIProvider = 'ChatGPT' | 'Claude' | 'Gemini';

type Recipe = {
  id: string;
  title: string;
  category: RecipeCategory;
  description: string;
  prompt: string;
  bestAI: AIProvider;
  variables: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number';
    required: boolean;
  }[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: 'vi' | 'en';
};

const RECIPES: Recipe[] = [];
const CATEGORIES = ['All', 'Coding', 'Report', 'Slide', 'Research'];

function RecipeCard({
  recipe,
  onApply,
}: {
  recipe: Recipe;
  onApply: (recipe: Recipe) => void;
}) {
  const categoryStyles: Record<string, string> = {
    coding: 'bg-violet-50 text-violet-700 border-violet-100',
    report: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    slide: 'bg-amber-50 text-amber-700 border-amber-100',
    research: 'bg-sky-50 text-sky-700 border-sky-100',
  };

  const categoryIcons: Record<string, React.ElementType> = {
    coding: Code2,
    report: FileText,
    slide: Presentation,
    research: FlaskConical,
  };

  const Icon = categoryIcons[recipe.category] ?? BookOpen;

  return (
    <article className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-100 hover:shadow-md hover:shadow-violet-100/60">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold capitalize',
            categoryStyles[recipe.category] ??
              'bg-slate-50 text-slate-600 border-slate-100'
          )}
        >
          <Icon className="h-3 w-3" />
          {recipe.category}
        </span>
      </div>

      <h3 className="mb-1.5 line-clamp-1 text-sm font-semibold text-slate-800 transition-colors group-hover:text-violet-700">
        {recipe.title}
      </h3>

      <p className="mb-3 line-clamp-2 min-h-[40px] text-xs leading-relaxed text-slate-500">
        {recipe.description}
      </p>

      <div className="mb-4 flex items-center gap-1.5 text-[11px] text-slate-500">
        <span>🧠</span>
        <span>Tốt nhất với</span>
        <span className="font-semibold text-slate-700">{recipe.bestAI}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
        >
          <Copy className="h-3 w-3" />
          Copy
        </button>

        <button
          type="button"
          onClick={() => onApply(recipe)}
          className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2.5 py-1.5 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-100 hover:text-violet-800"
        >
          <Wand2 className="h-3 w-3" />
          Apply Recipe
        </button>
      </div>
    </article>
  );
}

export default function RecipeLibraryPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/recipes`);
        const json = await res.json();

        setRecipes(json.data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const handleApplyRecipe = (recipe: Recipe) => {
    sessionStorage.setItem('optimizer_prefill', recipe.prompt);
    router.push('/optimizer');
  };

  const filteredRecipes = activeCategory === 'All' 
    ? recipes 
    : recipes.filter(r => r.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Recipe Library</h1>
          </div>

          <p className="text-sm text-slate-500">
            Thư viện prompt chất lượng cao - được tuyển chọn, thử nghiệm và phân loại theo chuyên ngành.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-400">
            <Search className="w-4 h-4" />
            Tìm recipe...
          </div>

          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
          Categories
        </p>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeCategory === category
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-slate-50 border border-slate-100 text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading recipes...</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onApply={handleApplyRecipe} />
          )))}
      </section>
    </div>
  );
}
