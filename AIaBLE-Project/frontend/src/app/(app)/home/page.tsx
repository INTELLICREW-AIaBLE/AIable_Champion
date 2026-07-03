'use client';

import { Wand2, GitBranch, BookOpen, ShieldCheck, Settings, Sparkles, Plus, Zap } from 'lucide-react';
import { QuickAccessCard } from '@/components/dashboard/QuickAccessCard';
import { FeaturedRecipes } from '@/components/dashboard/FeaturedRecipes';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { useAuth } from '@/hooks/useAuth';

const t = {
  vi: {
    welcome: 'Xin chào',
    welcomeSuffix: '!',
    welcomeDefault: 'Chào mừng đến với AIaBLE!',
    desc: 'Nền tảng tối ưu hoá năng suất bằng AI. Tối ưu prompt và lên luồng task tự động.',
    quickAccess: 'Truy cập nhanh',
    items: [
      {
        title: 'Tối ưu Prompt',
        description: 'Cải thiện prompt thô của bạn.',
        icon: <Wand2 className="w-5 h-5" />,
        decorIcon: <Wand2 className="w-10 h-10" />,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        decorColor: 'text-violet-400',
        href: '/optimizer',
      },
      {
        title: 'Ghép Task',
        description: 'Tạo quy trình làm việc từng bước cho bài tập của bạn.',
        icon: <GitBranch className="w-5 h-5" />,
        decorIcon: <GitBranch className="w-10 h-10" />,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        decorColor: 'text-blue-400',
        href: '/task-matcher',
      },
      {
        title: 'Thư viện Recipes',
        description: 'Khám phá thư viện AI Recipe được tuyển chọn.',
        icon: <BookOpen className="w-5 h-5" />,
        decorIcon: <BookOpen className="w-10 h-10" />,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        decorColor: 'text-purple-400',
        href: '/recipes',
      },
      {
        title: 'Kiểm tra Output',
        description: 'Kiểm tra kết quả AI để xác thực nguồn.',
        icon: <ShieldCheck className="w-5 h-5" />,
        decorIcon: <ShieldCheck className="w-10 h-10" />,
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        decorColor: 'text-indigo-400',
        href: '/validator',
      },
      {
        title: 'AI Sandbox',
        description: 'So sánh kết quả từ Groq, OpenRouter và Gemini.',
        icon: <Sparkles className="w-5 h-5" />,
        decorIcon: <Sparkles className="w-10 h-10" />,
        iconBg: 'bg-fuchsia-100',
        iconColor: 'text-fuchsia-600',
        decorColor: 'text-fuchsia-400',
        href: '/sandbox',
      },
    ]
  },
  en: {
    welcome: 'Welcome',
    welcomeSuffix: '!',
    welcomeDefault: 'Welcome to AIaBLE!',
    desc: 'Your AI-powered productivity platform. Optimizing prompts and matching tasks.',
    quickAccess: 'QUICK ACCESS',
    items: [
      {
        title: 'Optimize Prompt',
        description: 'Enhance your raw prompts.',
        icon: <Wand2 className="w-5 h-5" />,
        decorIcon: <Wand2 className="w-10 h-10" />,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        decorColor: 'text-violet-400',
        href: '/optimizer',
      },
      {
        title: 'Match Task',
        description: 'Get a step-by-step workflow for your assignment.',
        icon: <GitBranch className="w-5 h-5" />,
        decorIcon: <GitBranch className="w-10 h-10" />,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        decorColor: 'text-blue-400',
        href: '/task-matcher',
      },
      {
        title: 'Browse Recipes',
        description: 'Explore our curated AI Recipe Library.',
        icon: <BookOpen className="w-5 h-5" />,
        decorIcon: <BookOpen className="w-10 h-10" />,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        decorColor: 'text-purple-400',
        href: '/recipes',
      },
      {
        title: 'Verify Output',
        description: 'Check AI results for source validation.',
        icon: <ShieldCheck className="w-5 h-5" />,
        decorIcon: <ShieldCheck className="w-10 h-10" />,
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        decorColor: 'text-indigo-400',
        href: '/validator',
      },
      {
        title: 'AI Sandbox',
        description: 'Compare outputs from Groq, OpenRouter, and Gemini.',
        icon: <Sparkles className="w-5 h-5" />,
        decorIcon: <Sparkles className="w-10 h-10" />,
        iconBg: 'bg-fuchsia-100',
        iconColor: 'text-fuchsia-600',
        decorColor: 'text-fuchsia-400',
        href: '/sandbox',
      },
    ]
  }
};

// Lấy 2 từ cuối từ full name, ví dụ "Nguyễn Huy Hoàng Anh" → "Hoàng Anh"
function getFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.slice(-2).join(' ') || fullName;
}

import { useState, useEffect } from 'react';

export default function Home() {
  const { userProfile, loading } = useAuth();

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

  const displayName = !loading && userProfile.name !== 'User' ? getFirstName(userProfile.name) : null;

  return (
    <div className="relative min-h-full">
      {/* Decorative floating elements */}
      <div className="absolute top-0 right-0 flex items-start gap-2 pointer-events-none select-none">
        <Plus className="w-4 h-4 text-violet-200 mt-8" />
        <Sparkles className="w-5 h-5 text-violet-300 mt-2" />
        <Settings className="w-9 h-9 text-slate-200 mt-1" />
        <Settings className="w-6 h-6 text-slate-200 mt-10 mr-2" />
      </div>

      {/* Welcome Header */}
      <div className="mb-6 pr-24">
        <h1 className="text-2xl font-bold text-slate-900">
          {displayName ? (
            <>{text.welcome} <span className="text-violet-600">{displayName}</span>{text.welcomeSuffix}</>
          ) : (
            text.welcomeDefault
          )}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {text.desc}
        </p>
      </div>

      {/* Quick Access Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{text.quickAccess}</h2>
          <Zap className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {text.items.map((item) => (
            <QuickAccessCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="my-6 border-slate-200" />

      {/* Bottom Section: Recipes + Projects */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Featured Recipes */}
        <div className="flex-1 min-w-0">
          <FeaturedRecipes />
        </div>

        {/* Recent Projects */}
        <div className="xl:w-72 shrink-0">
          <RecentProjects />
        </div>
      </div>
    </div>
  );
}
