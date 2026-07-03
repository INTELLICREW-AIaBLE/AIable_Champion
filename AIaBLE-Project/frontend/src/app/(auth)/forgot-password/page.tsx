'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with real API endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      // For now, simulate success if the API is not ready
      console.log('Simulating success due to API connection error');
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
      // setError('Không thể kết nối đến server.');
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-10 relative">
        
        {/* Back to Login */}
        <Link 
          href="/login"
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition p-1"
          aria-label="Quay lại đăng nhập"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center mb-6 mt-2">
          <Image
            src="/logo.png"
            alt="AIaBLE Logo"
            width={160}
            height={36}
            priority
            className="h-9 w-auto object-contain logo-img"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-slate-900 text-center mb-2">
          Quên mật khẩu
        </h1>
        <p className="text-sm text-slate-500 text-center mb-7">
          Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
        </p>

        {success ? (
          <div className="text-center space-y-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Kiểm tra email của bạn</h2>
            <p className="text-sm text-slate-600">
              Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến <br/>
              <span className="font-medium text-slate-800">{email}</span>
            </p>
            <Link 
              href="/login"
              className="inline-block mt-4 text-sm font-semibold text-violet-600 hover:text-violet-700 transition"
            >
              Quay lại Đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="forgot-email" className="text-sm font-semibold text-slate-700">
                Email đăng ký
              </label>
              <input maxLength={100}
                id="forgot-email"
                type="email"
                required
                placeholder="ví dụ: sinhvien@alable.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-500 font-medium text-center bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-md shadow-violet-200 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Đang gửi...
                </>
              ) : (
                'Gửi liên kết khôi phục'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
