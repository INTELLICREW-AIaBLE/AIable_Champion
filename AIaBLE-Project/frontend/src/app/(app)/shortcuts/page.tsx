'use client';

import { Keyboard, Command, Sparkles, BookOpen, Search, User } from 'lucide-react';

const SHORTCUT_GROUPS = [
  {
    title: 'Điều hướng chung',
    items: [
      { key: ['⌘', 'K'], label: 'Mở thanh tìm kiếm toàn cục' },
      { key: ['G', 'H'], label: 'Đi tới trang chủ (Home)' },
      { key: ['G', 'P'], label: 'Đi tới trang cá nhân (Profile)' },
      { key: ['G', 'S'], label: 'Đi tới cài đặt (Settings)' },
    ]
  },
  {
    title: 'AI Workflow',
    items: [
      { key: ['⌘', 'Enter'], label: 'Chạy Prompt / Generate' },
      { key: ['⌘', 'S'], label: 'Lưu thay đổi' },
      { key: ['Esc'], label: 'Hủy / Đóng Modal' },
      { key: ['⌘', 'Z'], label: 'Hoàn tác (Undo)' },
    ]
  },
  {
    title: 'Trình chỉnh sửa (Editor)',
    items: [
      { key: ['⌘', 'B'], label: 'In đậm văn bản' },
      { key: ['⌘', 'I'], label: 'In nghiêng văn bản' },
      { key: ['⌘', '/'], label: 'Comment code / text' },
      { key: ['⌘', 'F'], label: 'Tìm kiếm trong trang' },
    ]
  }
];

export default function ShortcutsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Keyboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Phím tắt</h1>
          <p className="text-slate-500 text-sm mt-0.5">Làm việc hiệu quả hơn với các tổ hợp phím thông minh</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHORTCUT_GROUPS.map((group, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Command className="w-4 h-4 text-indigo-500" />
              {group.title}
            </h2>
            <div className="space-y-4">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.key.map((k, j) => (
                      <kbd key={j} className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-sans font-bold rounded-lg shadow-sm">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
