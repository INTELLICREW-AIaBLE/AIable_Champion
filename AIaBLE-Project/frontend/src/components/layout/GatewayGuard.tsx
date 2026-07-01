'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function GatewayGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isHuman, setIsHuman] = useState<boolean | null>(null);

  useEffect(() => {
    // If we are already on the verify page, don't do anything to block it
    if (pathname === '/verify') {
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
      if (pathname !== '/' && pathname !== '/login') {
        sessionStorage.setItem('redirect_after_verify', pathname);
      }
      
      setIsHuman(false);
      router.replace('/verify');
    } else {
      setIsHuman(true);
    }
  }, [pathname, router]);

  // Prevent flash of unverified content
  if (isHuman === null) {
    return (
      <div className="min-h-screen bg-black"></div>
    );
  }

  // If not human and not on verify page, render nothing until redirect happens
  if (isHuman === false && pathname !== '/verify') {
    return (
      <div className="min-h-screen bg-black"></div>
    );
  }

  return <>{children}</>;
}
