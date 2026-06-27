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
      className="group relative flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />

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
