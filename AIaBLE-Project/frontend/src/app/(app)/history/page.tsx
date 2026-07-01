'use client';

import { useState, useEffect } from 'react';
import { Clock, Wand2, Sparkles, BookOpen, Search, ArrowUpRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/profile/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Lịch sử hoạt động</h1>
            <p className="text-slate-500 text-sm mt-0.5">Xem lại tất cả các thao tác AI bạn đã thực hiện trong 30 ngày qua.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-2">
        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Đang tải lịch sử...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Chưa có lịch sử hoạt động.</div>
          ) : history.map((item) => {
            let Icon = Activity;
            if (item.tool === 'Optimizer') Icon = Wand2;
            else if (item.tool === 'Sandbox') Icon = Sparkles;
            else if (item.tool === 'Library') Icon = BookOpen;

            // Simple time formatter for testing
            const formattedTime = item.time ? new Date(item.time).toLocaleString('vi-VN') : 'Gần đây';

            return (
              <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition rounded-2xl group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color || 'text-violet-600 bg-violet-100'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{item.action}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.tool}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate mr-4">
                    {item.detail}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0 pt-1">
                  <span className="text-xs font-semibold text-slate-400">{formattedTime}</span>
                  <span className="text-[10px] font-medium text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded text-right max-w-[100px] truncate">
                    {item.model}
                  </span>
                </div>

                <div className="pt-2.5 pl-2 opacity-0 group-hover:opacity-100 transition transform translate-x-[-10px] group-hover:translate-x-0">
                  <ArrowUpRight className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 text-center border-t border-slate-50 mt-2">
          <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
            Tải thêm lịch sử cũ hơn...
          </button>
        </div>
      </div>
    </div>
  );
}
