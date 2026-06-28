'use client';

import { Bookmark, Search, Star, ExternalLink, Code2, BookOpen, Presentation } from 'lucide-react';
import Link from 'next/link';

const SAVED_RECIPES = [
  {
    id: 'r1',
    title: 'Giải thuật & Code Python step-by-step',
    desc: 'Prompt yêu cầu AI đóng vai kỹ sư phần mềm giải thích logic thuật toán kèm code ví dụ.',
    category: 'Coding',
    icon: Code2,
    color: 'text-blue-500 bg-blue-50 border-blue-100',
    model: 'Claude 3.5 Sonnet'
  },
  {
    id: 'r3',
    title: 'Báo cáo môn học theo chuẩn APA',
    desc: 'Mẫu prompt viết báo cáo học thuật chuẩn mực, có trích dẫn nguồn rõ ràng và logic chặt chẽ.',
    category: 'Academic',
    icon: BookOpen,
    color: 'text-amber-500 bg-amber-50 border-amber-100',
    model: 'GPT-4o'
  },
  {
    id: 'r5',
    title: 'Thiết kế slide thuyết trình ấn tượng',
    desc: 'Yêu cầu AI phân bổ nội dung cho 10 slide, kèm gợi ý hình ảnh minh hoạ và ý tưởng diễn thuyết.',
    category: 'Presentation',
    icon: Presentation,
    color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    model: 'Gemini 2.0 Flash'
  }
];

export default function SavedRecipesPage() {
  return (
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
        {SAVED_RECIPES.map((recipe) => {
          const Icon = recipe.icon;
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
