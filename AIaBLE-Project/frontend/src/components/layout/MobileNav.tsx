'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wand2, BookOpen, FolderOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const items = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/optimizer', label: 'Optimize', icon: Wand2 },
    { href: '/recipes', label: 'Recipes', icon: BookOpen },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-violet-600' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-colors", 
                isActive ? "bg-violet-100" : "bg-transparent"
              )}>
                <Icon className={cn('w-5 h-5', isActive ? 'text-violet-600' : 'text-slate-500')} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive ? "font-bold" : "font-medium"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
