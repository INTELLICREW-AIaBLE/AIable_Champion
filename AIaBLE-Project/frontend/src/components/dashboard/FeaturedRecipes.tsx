'use client';

import { useState, useEffect } from 'react';
import { Code2, FileText, Presentation, LayoutGrid, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecipeCard } from './RecipeCard';

const recipes = [
  {
    id: 1,
    type: 'CODING' as const,
    bestModel: 'Claude' as const,
    title: 'Debug code Python step-by-step',
    description: '"Bạn là senior Python engineer. Hãy review code sau, chỉ ra bug và đề xuất fix từng dòng..."',
    tab: 'coding',
  },
  {
    id: 2,
    type: 'CODING' as const,
    bestModel: 'GPT-4' as const,
    title: 'Giải thuật toàn tử đề thi',
    description: '"Đóng vai trò mentor cho sinh viên CNTT. Hãy giải bài toán thuật toán và đưa ra giải pháp tối ưu..."',
    tab: 'coding',
  },
  {
    id: 3,
    type: 'REPORT' as const,
    bestModel: 'Claude' as const,
    title: 'Báo cáo môn học theo chuẩn APA',
    description: '"Soạn báo cáo theo cấu trúc IMRAD với citation chuẩn học thuật. Đảm bảo format APA đúng..."',
    tab: 'report',
  },
  {
    id: 4,
    type: 'REPORT' as const,
    bestModel: 'GPT-4' as const,
    title: 'Tổng kết dự án phần mềm',
    description: '"Viết báo cáo tổng kết dự án theo template chuẩn với các mục: giới thiệu, kết quả, bài học..."',
    tab: 'report',
  },
  {
    id: 5,
    type: 'SLIDE' as const,
    bestModel: 'Claude' as const,
    title: 'Thiết kế slide thuyết trình',
    description: '"Tạo outline slide thuyết trình chuyên nghiệp với cấu trúc rõ ràng, nội dung súc tích..."',
    tab: 'slide',
  },
  {
    id: 6,
    type: 'CODING' as const,
    bestModel: 'Gemini' as const,
    title: 'Viết unit test cho function',
    description: '"Tạo bộ test cases đầy đủ cho function Python/JavaScript, bao gồm edge cases và error handling..."',
    tab: 'coding',
  },
];

const tabs = [
  { id: 'all', icon: LayoutGrid },
  { id: 'coding', icon: Code2 },
  { id: 'report', icon: FileText },
  { id: 'slide', icon: Presentation },
];

const t = {
  vi: {
    title: 'Featured AI Recipe Templates',
    all: 'Tất cả',
    coding: 'Coding',
    report: 'Report',
    slide: 'Slide',
    viewAll: 'Xem tất cả Recipes'
  },
  en: {
    title: 'Featured AI Recipe Templates',
    all: 'All',
    coding: 'Coding',
    report: 'Report',
    slide: 'Slide',
    viewAll: 'View All Recipes'
  }
};

export function FeaturedRecipes() {
  const [activeTab, setActiveTab] = useState('all');
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

  const filtered = activeTab === 'all' ? recipes : recipes.filter((r) => r.tab === activeTab);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800">{text.title}</h2>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-4 border-b border-slate-100 pb-2">
        {tabs.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              activeTab === id
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            )}
          >
            <Icon className="w-3 h-3" />
            {(text as any)[id] || id}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            type={recipe.type}
            bestModel={recipe.bestModel}
            title={recipe.title}
            description={recipe.description}
          />
        ))}
      </div>

      {/* View all link */}
      <div className="mt-4">
        <button className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition">
          {text.viewAll}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
