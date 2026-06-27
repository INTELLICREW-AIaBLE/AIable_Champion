import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-12 border-r min-h-[calc(100vh-3.5rem)] w-64 hidden md:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            <Link href="/" className={cn(buttonVariants({ variant: "secondary" }), "w-full justify-start")}>
              Home
            </Link>
            <Link href="/projects" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>
              Projects
            </Link>
            <Link href="/settings" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}