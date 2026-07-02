'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Sparkles, Clock, AlertTriangle, Info, BellRing } from 'lucide-react';
import { getNotifications, markAllAsRead, Notification } from '@/lib/notifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(getNotifications());
    
    const handleRead = () => setNotifications(getNotifications());
    window.addEventListener('aiable_notifications_read', handleRead);
    
    return () => {
      window.removeEventListener('aiable_notifications_read', handleRead);
    };
  }, []);

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const formatTime = (ms: number) => {
    const diff = Date.now() - ms;
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff/60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)} giờ trước`;
    return `${Math.floor(diff/86400000)} ngày trước`;
  };

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
        <button onClick={handleMarkAllRead} className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition">
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <BellRing className="w-12 h-12 mx-auto text-slate-200 mb-3" />
              <p>Chưa có thông báo nào</p>
            </div>
          ) : (
            notifications.map((notif) => {
              return (
                <div 
                  key={notif.id} 
                  className={`p-5 flex items-start gap-4 transition hover:bg-slate-50 cursor-pointer ${
                    notif.read ? 'opacity-70' : 'bg-violet-50/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-100 text-slate-500' : 'bg-violet-100 text-violet-600'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-sm font-bold truncate pr-4 ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 shrink-0 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(notif.createdAt)}
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
