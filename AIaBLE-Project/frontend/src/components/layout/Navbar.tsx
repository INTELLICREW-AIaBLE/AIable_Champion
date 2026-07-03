'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function NeuralNetDot({ cx, cy, r = 3.5, opacity = 1 }: { cx: number; cy: number; r?: number; opacity?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="#8B5CF6" opacity={opacity} />;
}

function NeuralNetworkDecor({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="180"
      height="48"
      viewBox="0 0 180 48"
      className="opacity-25 select-none"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* Connection lines */}
      <line x1="8" y1="24" x2="40" y2="8" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="8" y1="24" x2="40" y2="40" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="40" y1="8" x2="90" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="40" y1="40" x2="90" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="90" y1="24" x2="140" y2="8" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="90" y1="24" x2="140" y2="40" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="140" y1="8" x2="172" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="140" y1="40" x2="172" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="25" y1="14" x2="40" y2="8" stroke="#A78BFA" strokeWidth="0.8" />
      <line x1="60" y1="35" x2="40" y2="40" stroke="#A78BFA" strokeWidth="0.8" />
      <line x1="115" y1="14" x2="140" y2="8" stroke="#A78BFA" strokeWidth="0.8" />
      {/* Nodes */}
      <NeuralNetDot cx={8} cy={24} r={4} />
      <NeuralNetDot cx={40} cy={8} r={3.5} />
      <NeuralNetDot cx={40} cy={40} r={3.5} />
      <NeuralNetDot cx={90} cy={24} r={5} />
      <NeuralNetDot cx={140} cy={8} r={3.5} />
      <NeuralNetDot cx={140} cy={40} r={3.5} />
      <NeuralNetDot cx={172} cy={24} r={4} />
      {/* Small scattered nodes */}
      <NeuralNetDot cx={25} cy={14} r={2} opacity={0.6} />
      <NeuralNetDot cx={60} cy={35} r={2} opacity={0.6} />
      <NeuralNetDot cx={115} cy={14} r={2} opacity={0.6} />
      <NeuralNetDot cx={158} cy={38} r={2} opacity={0.5} />
    </svg>
  );
}

const t = {
  vi: { login: 'Đăng nhập', register: 'Đăng ký' },
  en: { login: 'Log in', register: 'Register' }
};

export function Navbar() {
  const [lang, setLang] = useState('vi');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }
    setLang(localStorage.getItem('app_lang') || 'vi');
    const handleLangChange = () => setLang(localStorage.getItem('app_lang') || 'vi');
    window.addEventListener('storage', handleLangChange);
    window.addEventListener('app_lang_changed', handleLangChange);
    return () => {
      window.removeEventListener('storage', handleLangChange);
      window.removeEventListener('app_lang_changed', handleLangChange);
    };
  }, []);

  const currentLang = (lang === 'en' ? 'en' : 'vi') as 'en' | 'vi';
  const text = t[currentLang];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-14 items-center px-4 gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 w-52 group">
          <Image 
            src="/logo.png" 
            alt="AIaBLE Logo" 
            width={140} 
            height={32} 
            priority 
            className="h-8 w-auto object-contain logo-img" 
          />
        </Link>

        {/* Neural Network decoration (center) */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <NeuralNetworkDecor />
          <NeuralNetworkDecor flip />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Beautiful Sliding Pill Language Switcher */}
          <div className="relative flex items-center bg-slate-100 border border-slate-200/50 rounded-full p-0.5 shadow-inner select-none">
            <button
              onClick={() => {
                if (lang !== 'vi') {
                  setLang('vi');
                  localStorage.setItem('app_lang', 'vi');
                  window.dispatchEvent(new Event('app_lang_changed'));
                }
              }}
              className={`px-3 py-1 text-[11px] font-extrabold rounded-full transition-all duration-300 whitespace-nowrap ${
                lang === 'vi' 
                  ? 'bg-white text-violet-600 shadow-sm border border-slate-200/10' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => {
                if (lang !== 'en') {
                  setLang('en');
                  localStorage.setItem('app_lang', 'en');
                  window.dispatchEvent(new Event('app_lang_changed'));
                }
              }}
              className={`px-3 py-1 text-[11px] font-extrabold rounded-full transition-all duration-300 whitespace-nowrap ${
                lang === 'en' 
                  ? 'bg-white text-violet-600 shadow-sm border border-slate-200/10' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              EN
            </button>
          </div>

          {isLoggedIn ? (
            <Link
              href="/home"
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-md shadow-violet-200 whitespace-nowrap"
            >
              {lang === 'en' ? 'Dashboard' : 'Vào không gian'}
            </Link>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition duration-200 shadow-sm whitespace-nowrap"
              >
                {text.login}
              </Link>
              {/* Register */}
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-md shadow-violet-200 whitespace-nowrap"
              >
                {text.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}