'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function GatewayGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isHuman, setIsHuman] = useState<boolean | null>(null);

  useEffect(() => {
    // Các trang công khai không cần verify bot ngay lập tức
    const publicPaths = ['/', '/login', '/register', '/forgot-password'];
    if (pathname === '/verify' || publicPaths.includes(pathname)) {
      setIsHuman(true);
      return;
    }

    // Check localStorage for the human flag
    const humanFlag = localStorage.getItem('is_human');
    const expiry = localStorage.getItem('is_human_expiry');

    if (!humanFlag || !expiry || Date.now() > parseInt(expiry)) {
      // If no flag or expired, clear and redirect to /verify
      localStorage.removeItem('is_human');
      localStorage.removeItem('is_human_expiry');
      
      // Remember where the user originally wanted to go
      sessionStorage.setItem('redirect_after_verify', pathname);
      
      setIsHuman(false);
      router.replace('/verify');
    } else {
      setIsHuman(true);
    }
  }, [pathname, router]);

  // Prevent flash of unverified content only for protected routes
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/verify'];
  const isPublicRoute = publicPaths.includes(pathname);

  if (isHuman === null && !isPublicRoute) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (isHuman === false && !isPublicRoute) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return <>{children}</>;
}
