import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface QuickAccessCardProps {
  icon: ReactNode;
  decorIcon: ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  decorColor: string;
  href?: string;
}

export function QuickAccessCard({
  icon,
  decorIcon,
  title,
  description,
  iconBg,
  iconColor,
  decorColor,
  href = '#',
}: QuickAccessCardProps) {
  return (
    <a
      href={href}
      className="group relative flex items-start gap-3 rounded-2xl border-2 border-violet-100 bg-white p-5 shadow-md hover:shadow-xl hover:border-violet-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer ring-1 ring-violet-50 hover:ring-violet-200"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Main Icon */}
      <div className={cn('relative shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', iconBg)}>
        <span className={cn('w-5 h-5', iconColor)}>{icon}</span>
      </div>

      {/* Text */}
      <div className="relative flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-800 leading-tight">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>
      </div>

      {/* Decorative icon - top right */}
      <div className={cn('absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity', decorColor)}>
        {decorIcon}
      </div>
    </a>
  );
}
