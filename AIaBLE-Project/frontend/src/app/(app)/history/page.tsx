'use client';

import { Clock, Wand2, Sparkles, BookOpen, Search, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const HISTORY = [
  {
    id: 1,
    action: 'Tối ưu Prompt',
    tool: 'Optimizer',
    icon: Wand2,
    color: 'text-violet-600 bg-violet-100',
    detail: '"Giải thích thuật toán quicksort" → "Đóng vai chuyên gia hệ thống, giải thích..."',
    time: '10 phút trước',
    model: 'Gemini 2.0 Flash'
  },
  {
    id: 2,
    action: 'Thử nghiệm AI',
    tool: 'Sandbox',
    icon: Sparkles,
    color: 'text-fuchsia-600 bg-fuchsia-100',
    detail: 'So sánh Claude và GPT-4o cho tác vụ "Viết email xin lỗi sếp".',
    time: '2 giờ trước',
    model: 'Multi-model'
  },
  {
    id: 3,
    action: 'Lưu Recipe',
    tool: 'Library',
    icon: BookOpen,
    color: 'text-emerald-600 bg-emerald-100',
    detail: 'Đã lưu công thức "Báo cáo môn học theo chuẩn APA".',
    time: 'Hôm qua',
    model: 'System'
  },
  {
    id: 4,
    action: 'Tối ưu Prompt',
    tool: 'Optimizer',
    icon: Wand2,
    color: 'text-violet-600 bg-violet-100',
    detail: '"Viết luận văn về môi trường" → "Xây dựng đề cương chi tiết 3 chương..."',
    time: '3 ngày trước',
    model: 'Claude 3.5 Sonnet'
  }
];

export default function HistoryPage() {
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
          {HISTORY.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition rounded-2xl group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
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
                  <span className="text-xs font-semibold text-slate-400">{item.time}</span>
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
