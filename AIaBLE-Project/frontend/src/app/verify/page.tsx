'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile';

export default function VerifyPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerifySuccess = async (token: string) => {
    setVerifying(true);
    setError('');
    
    // Gửi token lên backend để kiểm tra
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstileToken: token })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Xác minh thành công, gán cờ an toàn trong 2 tiếng
        localStorage.setItem('is_human', 'true');
        localStorage.setItem('is_human_expiry', (Date.now() + 2 * 60 * 60 * 1000).toString());
        
        // Điều hướng lại trang ban đầu hoặc trang login
        const redirectTo = sessionStorage.getItem('redirect_after_verify') || '/login';
        sessionStorage.removeItem('redirect_after_verify');
        router.replace(redirectTo);
      } else {
        setError('Xác minh thất bại. Vui lòng thử tải lại trang.');
        setVerifying(false);
      }
    } catch (e) {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-8 font-sans selection:bg-gray-800">
      <div className="max-w-3xl w-full">
        <h1 className="text-[28px] font-semibold mb-2">alable.edu.vn</h1>
        <h2 className="text-[22px] font-medium mb-4">Performing security verification</h2>
        <p className="text-gray-400 mb-8 text-[15px] leading-relaxed max-w-2xl">
          This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.
        </p>

        <div className="min-h-[65px] mb-2 flex items-center">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
            onSuccess={handleVerifySuccess}
            onError={() => setError('Tiện ích xác thực bị lỗi. Vui lòng tải lại trang.')}
            options={{ theme: 'dark', size: 'normal' }}
          />
        </div>

        {error && <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>}

        <div className="border-t border-gray-800 mt-20 pt-6 text-center">
          <p className="text-gray-500 text-[13px]">
            Ray ID: {Math.random().toString(36).substring(2, 15)}a9b8<br />
            Performance and Security by <span className="underline cursor-pointer">AIaBLE Gateway</span> | <span className="underline cursor-pointer">Privacy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
