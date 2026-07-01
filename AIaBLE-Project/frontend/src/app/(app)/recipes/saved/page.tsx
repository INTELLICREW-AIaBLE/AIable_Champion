'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Search, Star, ExternalLink, Code2, BookOpen, Presentation, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/profile/recipes/saved`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setRecipes(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Saved Recipes</h1>
            <p className="text-slate-500 text-sm mt-0.5">Những công thức Prompt bạn đã lưu để dùng lại nhanh chóng.</p>
          </div>
        </div>

        <Link href="/recipes" className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition">
          <Search className="w-4 h-4" />
          Khám phá thêm
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500">Đang tải công thức đã lưu...</div>
        ) : recipes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">Bạn chưa lưu công thức nào.</div>
        ) : recipes.map((recipe) => {
          let Icon = FileText;
          if (recipe.category === 'Coding') Icon = Code2;
          else if (recipe.category === 'Academic') Icon = BookOpen;
          else if (recipe.category === 'Presentation') Icon = Presentation;

          return (
            <div key={recipe.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition p-6 group flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 text-rose-500">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>

              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${recipe.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md mb-2 inline-block">
                  {recipe.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {recipe.title}
                </h3>
              </div>
              
              <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                {recipe.desc}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Best with {recipe.model}
                </div>
                <button className="text-violet-600 hover:text-violet-800 p-1.5 rounded-lg hover:bg-violet-50 transition">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
