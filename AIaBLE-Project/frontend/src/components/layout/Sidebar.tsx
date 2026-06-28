'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Wand2, GitBranch, BookOpen, ShieldCheck,
  FolderOpen, Bookmark, Clock, Sparkles,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Navigation',
    items: [
      { href: '/home', label: 'Home', icon: Home },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/optimizer',    label: 'Optimize Prompt', icon: Wand2 },
      { href: '/task-matcher', label: 'Match Task',       icon: GitBranch },
      { href: '/recipes',      label: 'Browse Recipes',   icon: BookOpen },
      { href: '/validator',    label: 'Verify Output',    icon: ShieldCheck },
      { href: '/sandbox',      label: 'AI Sandbox',       icon: Sparkles },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/projects',      label: 'Projects',       icon: FolderOpen },
      { href: '/recipes/saved', label: 'Saved Recipes',  icon: Bookmark },
      { href: '/history',       label: 'History',         icon: Clock },
    ],
  },
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <div className={cn('pb-12 border-r min-h-[calc(100vh-3.5rem)] w-56 hidden md:block bg-white shrink-0', className)}>
      <div className="py-4 px-3 space-y-5">
        {NAV_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, label: itemLabel, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/');
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