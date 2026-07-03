'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Wand2, GitBranch, BookOpen, ShieldCheck, ShieldAlert,
  FolderOpen, Bookmark, Clock, Sparkles,
} from 'lucide-react';

const t = {
  vi: {
    groups: {
      nav: 'Điều hướng',
      tools: 'Công cụ AI',
      workspace: 'Không gian làm việc'
    },
    items: {
      home: 'Trang chủ',
      opt: 'Tối ưu Prompt',
      match: 'Ghép Task',
      recipes: 'Thư viện Recipes',
      verify: 'Kiểm tra Output',
      sandbox: 'AI Sandbox',
      projects: 'Dự án',
      saved: 'Recipe đã lưu',
      history: 'Lịch sử',
      admin: 'Bảng quản trị'
    }
  },
  en: {
    groups: {
      nav: 'Navigation',
      tools: 'AI Tools',
      workspace: 'Workspace'
    },
    items: {
      home: 'Home',
      opt: 'Optimize Prompt',
      match: 'Match Task',
      recipes: 'Browse Recipes',
      verify: 'Verify Output',
      sandbox: 'AI Sandbox',
      projects: 'Projects',
      saved: 'Saved Recipes',
      history: 'History',
      admin: 'Admin Panel'
    }
  }
};

const getNavGroups = (text: any) => [
  {
    label: text.groups.nav,
    items: [
      { href: '/home', label: text.items.home, icon: Home },
    ],
  },
  {
    label: text.groups.tools,
    items: [
      { href: '/optimizer',    label: text.items.opt, icon: Wand2 },
      { href: '/task-matcher', label: text.items.match,       icon: GitBranch },
      { href: '/recipes',      label: text.items.recipes,   icon: BookOpen },
      { href: '/validator',    label: text.items.verify,    icon: ShieldCheck },
      { href: '/sandbox',      label: text.items.sandbox,       icon: Sparkles },
    ],
  },
  {
    label: text.groups.workspace,
    items: [
      { href: '/projects',      label: text.items.projects,       icon: FolderOpen },
      { href: '/recipes/saved', label: text.items.saved,  icon: Bookmark },
      { href: '/history',       label: text.items.history,         icon: Clock },
    ],
  },
];

const getAdminNavGroup = (text: any) => ({
  label: 'Admin',
  items: [
    { href: '/admin/dashboard', label: text.items.admin, icon: ShieldAlert },
  ],
});

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const [lang, setLang] = useState('vi');
  const { userProfile } = useAuth();

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

  if (pathname === '/') return null;

  const currentLang = (lang === 'en' ? 'en' : 'vi') as 'en' | 'vi';
  const text = t[currentLang];
  let NAV_GROUPS = getNavGroups(text);
  
  if (userProfile?.role === 'admin') {
    NAV_GROUPS = [...NAV_GROUPS, getAdminNavGroup(text)];
  }

  return (
    <div className={cn('pb-12 border-r h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto w-56 hidden md:block bg-white shrink-0', className)}>
      <div className="py-4 px-3 space-y-5">
        {NAV_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, label: itemLabel, icon: Icon }) => {
                let isActive = pathname === href || pathname.startsWith(href + '/');
                if (href === '/recipes' && pathname.startsWith('/recipes/saved')) {
                  isActive = false;
                }
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-violet-50 text-violet-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-violet-600' : 'text-slate-400')} />
                    {itemLabel}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}