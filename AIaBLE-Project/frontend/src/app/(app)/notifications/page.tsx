'use client';

import { Bell, CheckCircle2, Sparkles, Clock, AlertTriangle, Info } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Profile Updated',
    message: 'Tài khoản của bạn đã được cập nhật thành công.',
    time: 'Vài giây trước',
    read: false,
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  {
    id: 2,
    type: 'ai',
    title: 'AI Sandbox Sẵn sàng',
    message: 'Tính năng Sandbox mới đã được mở khoá. Trải nghiệm ngay 3 model AI mạnh mẽ nhất.',
    time: '2 giờ trước',
    read: false,
    icon: Sparkles,
    color: 'text-violet-600',
    bg: 'bg-violet-100',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Hạn mức API sắp hết',
    message: 'Bạn đã sử dụng 90% quota của Google Gemini. Vui lòng cập nhật API Key mới trong Cài đặt.',
    time: '1 ngày trước',
    read: true,
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  {
    id: 4,
    type: 'info',
    title: 'Chào mừng đến với AIaBLE',
    message: 'Khám phá ngay thư viện Recipes khổng lồ và bắt đầu tự động hoá công việc của bạn.',
    time: '3 ngày trước',
    read: true,
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Thông báo</h1>
            <p className="text-slate-500 text-sm mt-0.5">Cập nhật những hoạt động mới nhất</p>
          </div>
        </div>
        <button className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition">
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {NOTIFICATIONS.map((notif) => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id} 
                className={`p-5 flex items-start gap-4 transition hover:bg-slate-50 cursor-pointer ${
                  notif.read ? 'opacity-70' : 'bg-violet-50/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-bold truncate pr-4 ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {notif.time}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-600 shrink-0 mt-2 shadow-sm shadow-violet-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
