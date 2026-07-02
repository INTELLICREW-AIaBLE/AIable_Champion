'use client';

import { Sparkles, Rocket, Bug, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const CHANGELOGS = [
  {
    version: 'v1.3.0',
    date: '02 Th07, 2026',
    title: 'Tối ưu UI, Phím Tắt & Sandbox',
    badge: 'Mới nhất',
    items: [
      { type: 'feature', text: 'Triển khai hệ thống phím tắt toàn cục (Global Shortcuts): Shift+K, Shift+Enter, Shift+S và phím điều hướng nhanh (G+H/P/S).' },
      { type: 'improve', text: 'Cho phép chỉnh sửa trực tiếp (Textarea) các kết quả do AI sinh ra trong Sandbox trước khi lưu.' },
      { type: 'bug', text: 'Khắc phục triệt để lỗi bộ nhớ đệm (Cache) khiến Sandbox trả về kết quả cũ với prompt mới.' },
      { type: 'improve', text: 'Tối giản UI: Lược bỏ các tuỳ chọn cài đặt và nút cấu hình không cần thiết.' }
    ]
  },
  {
    version: 'v1.2.0',
    date: '30 Th06, 2026',
    title: 'Trải nghiệm cá nhân hoá & UI Mới',
    items: [
      { type: 'feature', text: 'Ra mắt tính năng tải ảnh Avatar và Ảnh bìa cá nhân.' },
      { type: 'feature', text: 'Bổ sung bản đồ Google Maps tương tác vào phần chọn địa điểm.' },
      { type: 'improve', text: 'Giao diện Settings và Notifications được làm lại đẹp mắt hơn.' },
      { type: 'bug', text: 'Sửa lỗi xung đột khi gõ phím tắt trong input field.' }
    ]
  },
  {
    version: 'v1.1.0',
    date: '26 Th06, 2026',
    title: 'Hệ thống Auth & AI Sandbox',
    items: [
      { type: 'feature', text: 'Hoàn thiện luồng Đăng nhập / Đăng ký.' },
      { type: 'feature', text: 'Tích hợp AI Sandbox cho phép chat cùng lúc với 3 models.' },
      { type: 'improve', text: 'Cải thiện tốc độ tải trang lên 40%.' }
    ]
  },
  {
    version: 'v1.0.0',
    date: '22 Th06, 2026',
    title: 'Chính thức khởi chạy dự án AIaBLE',
    items: [
      { type: 'feature', text: 'Phát hành bộ khung AI Recipe Library.' },
      { type: 'feature', text: 'Tính năng Optimize Prompt tự động hoá quy trình.' },
    ]
  }
];

const t = {
  vi: {
    title: 'Tính năng mới',
    desc: 'Theo dõi những cập nhật mới nhất, tính năng vừa ra mắt và các bản sửa lỗi của AIaBLE.'
  },
  en: {
    title: "What's New",
    desc: 'Track the latest updates, newly launched features, and bug fixes for AIaBLE.'
  }
};

export default function ChangelogPage() {
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    setLang(localStorage.getItem('app_lang') || 'vi');
    const handleLangChange = () => setLang(localStorage.getItem('app_lang') || 'vi');
    window.addEventListener('storage', handleLangChange);
    window.addEventListener('app_lang_changed', handleLangChange);
    return () => {
      window.removeEventListener('storage', handleLangChange);
      window.removeEventListener('app_lang_changed', handleLangChange);
    };
  }, []);

  const text = t[lang as 'vi' | 'en'] || t.vi;
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'feature': return <Rocket className="w-4 h-4 text-emerald-500" />;
      case 'improve': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'bug': return <Bug className="w-4 h-4 text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16">
      <div className="flex flex-col items-center text-center mt-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-xl shadow-amber-200/50 mb-6 rotate-12">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-3">{text.title}</h1>
        <p className="text-slate-500 max-w-md">{text.desc}</p>
      </div>

      <div className="space-y-10 relative">
        <div className="absolute top-0 bottom-0 left-[27px] md:left-[119px] w-px bg-slate-200" />
        
        {CHANGELOGS.map((log, idx) => (
          <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:gap-12 group">
            {/* Date line (Left) */}
            <div className="md:w-24 shrink-0 pt-2 flex items-center md:justify-end gap-4 md:gap-0 pl-14 md:pl-0">
              <p className="text-sm font-bold text-slate-400 group-hover:text-violet-600 transition md:text-right">{log.date}</p>
            </div>

            {/* Node */}
            <div className="absolute left-6 md:left-[115px] top-3.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white group-hover:bg-violet-600 transition z-10" />

            {/* Content Card */}
            <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 ml-14 md:ml-0 hover:shadow-md transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-slate-900">{log.version} - {log.title}</h2>
                {log.badge && (
                  <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider">
                    {log.badge}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {log.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-md bg-slate-50 shrink-0">
                      {getTypeIcon(item.type)}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pt-0.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
