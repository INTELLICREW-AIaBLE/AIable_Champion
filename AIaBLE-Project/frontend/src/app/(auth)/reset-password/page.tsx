'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const t = searchParams.get('token');
    const e = searchParams.get('email');
    if (t) setToken(t);
    if (e) setEmail(e);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }
    if (!token || !email) {
      setError('Link khôi phục không hợp lệ hoặc đã hết hạn.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Lỗi khi đặt lại mật khẩu.');
        setLoading(false);
        return;
      }

      setSuccess('Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err) {
      setError('Không thể kết nối tới server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-10">
        
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <Image src="/logo.png" alt="AIaBLE Logo" width={44} height={44} priority className="rounded-xl" />
          <div className="font-bold text-2xl">
            <span className="text-black">Ala</span>
            <span className="text-purple-600">BLE</span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 text-center mb-7">
          Đặt lại mật khẩu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 font-medium text-center bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}
          {success && <p className="text-sm text-green-600 font-medium text-center bg-green-50 border border-green-200 rounded-xl px-4 py-2">{success}</p>}

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-md shadow-violet-200 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/login" className="font-bold text-violet-600 hover:text-violet-700 transition">
            Quay lại Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
