'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Activity, 
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import { Inter, Be_Vietnam_Pro } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-sans' });
const beVietnamPro = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700', '800'], variable: '--font-heading' });

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
  { href: '/admin/recipes', label: 'Thư viện Prompt', icon: BookOpen },
  { href: '/admin/activities', label: 'Nhật ký hệ thống', icon: Activity },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={cn('min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-slate-50 to-slate-100 flex', inter.variable, beVietnamPro.variable, 'font-sans')}>
      {/* ── Admin Sidebar ── */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 sticky top-0 h-screen shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="AIaBLE Logo" 
              width={120} 
              height={28} 
              priority 
              className="h-7 w-auto object-contain logo-img" 
            />
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-600 uppercase tracking-widest border border-rose-100/50">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Bảng điều khiển
          </p>
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-semibold',
                  isActive 
                    ? 'bg-violet-50 text-violet-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-violet-600" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <Link 
            href="/home" 
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            Về giao diện User
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
          <h2 className="text-sm font-bold text-slate-800">
            {ADMIN_NAV.find(n => n.href === pathname)?.label || 'Quản trị viên'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center border border-violet-200">
                <span className="text-xs font-bold text-violet-700">AD</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">Admin User</p>
                <p className="text-[10px] text-slate-500">Hệ thống AIaBLE</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
