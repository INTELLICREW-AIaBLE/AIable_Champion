'use client';

import { useState } from 'react';
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
  { id: 'all', label: 'Tất cả', icon: LayoutGrid },
  { id: 'coding', label: 'Coding', icon: Code2 },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'slide', label: 'Slide', icon: Presentation },
];

export function FeaturedRecipes() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? recipes : recipes.filter((r) => r.tab === activeTab);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800">Featured AI Recipe Templates</h2>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-4 border-b border-slate-100 pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
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
            {label}
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
          View All Recipes
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
