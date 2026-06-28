'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connect to backend auth
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    // Redirect to home after successful login
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <Image
            src="/logo.png"
            alt="AIaBLE Logo"
            width={44}
            height={44}
            priority
            className="rounded-xl"
          />
          <div className="font-bold text-2xl">
            <span className="text-black">Ala</span>
            <span className="text-purple-600">BLE</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-slate-900 text-center mb-7">
          Đăng nhập vào AlaBLE
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-username" className="text-sm font-semibold text-slate-700">
              Tên đăng nhập hoặc Email
            </label>
            <input
              id="login-username"
              type="text"
              required
              placeholder="ví dụ: sinhvien@alable.edu.vn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-sm font-semibold text-slate-700">
                Mật khẩu
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="btn-login-submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-md shadow-violet-200 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">Hoặc</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.5 35.2 26.9 36 24 36c-5.3 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.5 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.3 5.3C37 37.3 44 32 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          Đăng nhập bằng Gmail
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="font-bold text-violet-600 hover:text-violet-700 transition"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
