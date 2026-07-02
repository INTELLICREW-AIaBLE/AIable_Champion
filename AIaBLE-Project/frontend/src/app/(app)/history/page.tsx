'use client';

import { useState, useEffect } from 'react';
import { Clock, Wand2, Sparkles, BookOpen, Search, ArrowUpRight, Activity, X, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/history`, {
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

            const handleNavigate = () => {
              if (item.prompt || item.result) {
                setSelectedItem(item);
                return;
              }
              const tool = (item.tool || '').toLowerCase();
              if (tool.includes('optimizer')) router.push('/optimizer');
              else if (tool.includes('sandbox')) router.push('/sandbox');
              else if (tool.includes('matcher')) router.push('/matcher');
              else if (tool.includes('saved')) router.push('/recipes/saved');
              else if (tool.includes('library') || tool.includes('recipe')) router.push('/recipes');
              else router.push('/dashboard');
            };

            return (
              <div 
                key={item.id} 
                onClick={handleNavigate}
                className="p-4 flex items-start gap-4 hover:bg-slate-50 transition rounded-2xl group cursor-pointer"
              >
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

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                Chi tiết hoạt động
              </h3>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-slate-900">{selectedItem.action}</span>
                <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                  {selectedItem.tool}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-auto">
                  {selectedItem.model}
                </span>
              </div>

              {selectedItem.prompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">Dữ liệu đầu vào (Prompt)</h4>
                    <button onClick={() => navigator.clipboard.writeText(selectedItem.prompt)} className="text-xs flex items-center gap-1 text-slate-400 hover:text-violet-600 transition">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                    {selectedItem.prompt}
                  </div>
                </div>
              )}

              {selectedItem.result && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">Kết quả (Output)</h4>
                    <button onClick={() => navigator.clipboard.writeText(selectedItem.result)} className="text-xs flex items-center gap-1 text-slate-400 hover:text-violet-600 transition">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 text-sm text-slate-800 whitespace-pre-wrap max-h-64 overflow-y-auto font-mono">
                    {selectedItem.result}
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
