"use client";

import { useEffect, useState } from 'react';

import {
  BookOpen,
  Target,
  Languages,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';

type Recipe = {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  difficulty: string;
  language: string;
  tags: string[];
};

const RECIPES: Recipe[] = [];
const CATEGORIES = ['All', 'Coding', 'Report', 'Presentation', 'Writing', 'Summary', 'Planning'];

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-violet-600" />
            </div>

            <h2 className="text-base font-black text-slate-900 group-hover:text-violet-700 transition truncate">
              {recipe.title}
            </h2>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {recipe.description}
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-100 text-[11px] font-bold text-violet-700 shrink-0">
          {recipe.category}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600">
          <Target className="w-3.5 h-3.5 text-violet-500" />
          {recipe.difficulty}
        </span>

        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600">
          <Languages className="w-3.5 h-3.5 text-violet-500" />
          {recipe.language}
        </span>

        {recipe.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-500"
          >
            #{tag}
          </span>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white hover:from-violet-700 hover:to-purple-800 transition-all shadow-md shadow-violet-200 active:scale-95">
        Use Template
        <ArrowRight className="w-4 h-4" />
      </button>
    </article>
  );
}

export default function RecipeLibraryPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch('http://localhost:5000/api/recipes');
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
            Browse curated recipes by meal type, difficulty, cooking time, and nutrition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-400">
            <Search className="w-4 h-4" />
            Search recipes
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
          {CATEGORIES.map((category, index) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${index === 0
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
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          )))}
      </section>
    </div>
  );
}
