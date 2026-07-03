'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock, RefreshCw, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export default function AdminActivityPage() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchActivity = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/admin/activity?page=${p}&limit=20`, { headers: authHeaders() });
      const j = await r.json();
      if (j.success) {
        setActivity(j.data);
        setTotal(j.total);
        setPage(p);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity(1);
  }, [fetchActivity]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nhật ký hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi tương tác của người dùng ({total} records)</p>
        </div>
        <button onClick={() => fetchActivity(1)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                {['Thời gian', 'Người dùng', 'Tính năng', 'Chi tiết', 'Model AI'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-semibold">Đang tải nhật ký...</td>
                </tr>
              ) : activity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Activity className="w-10 h-10 text-slate-300" />
                      <p className="font-semibold text-base text-slate-500">Chưa có nhật ký hoạt động nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activity.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                      {a.time ? new Date(a.time).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800 text-sm">{a.userName || 'Unknown'}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{a.userEmail}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100 uppercase tracking-wide">
                        {a.tool || a.action || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-600 max-w-sm">
                      <p className="line-clamp-2 leading-relaxed">{a.detail || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      {a.model ? (
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {a.model}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">
              Trang <span className="font-bold text-slate-800">{page}</span> / {Math.ceil(total / 20)}
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page <= 1} 
                onClick={() => fetchActivity(page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>
              <button 
                disabled={page >= Math.ceil(total / 20)} 
                onClick={() => fetchActivity(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
              >
                Sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
