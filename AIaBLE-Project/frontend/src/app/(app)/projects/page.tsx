'use client';

import { FolderOpen, Plus, MoreVertical, Clock, FileText, Users, Search } from 'lucide-react';
import Link from 'next/link';

const PROJECTS = [
  {
    id: 1,
    title: 'Tiểu luận Cuối kỳ - Trí tuệ nhân tạo',
    desc: 'Nghiên cứu về ứng dụng của LLMs trong giáo dục đại học.',
    updated: '2 giờ trước',
    status: 'Đang làm',
    color: 'bg-emerald-500',
    progress: 75,
    members: 3,
    files: 12
  },
  {
    id: 2,
    title: 'Đồ án Nhập môn Kỹ thuật Phần mềm',
    desc: 'Thiết kế hệ thống quản lý thư viện sinh viên bằng Java Spring Boot.',
    updated: '1 ngày trước',
    status: 'Sắp đến hạn',
    color: 'bg-amber-500',
    progress: 40,
    members: 5,
    files: 8
  },
  {
    id: 3,
    title: 'Thuyết trình Marketing Căn bản',
    desc: 'Phân tích chiến lược 4P của chiến dịch Vinamilk Green Farm.',
    updated: '3 ngày trước',
    status: 'Hoàn thành',
    color: 'bg-violet-500',
    progress: 100,
    members: 4,
    files: 5
  },
  {
    id: 4,
    title: 'Bài tập nhóm - Xác suất thống kê',
    desc: 'Thu thập số liệu và dùng R để vẽ biểu đồ phân phối chuẩn.',
    updated: '1 tuần trước',
    status: 'Đang làm',
    color: 'bg-blue-500',
    progress: 15,
    members: 2,
    files: 3
  }
];

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Projects của bạn</h1>
            <p className="text-slate-500 text-sm mt-0.5">Quản lý tài liệu và các luồng công việc AI theo dự án.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm dự án..." 
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-violet-200">
            <Plus className="w-4 h-4" />
            Tạo Project mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project) => (
          <div key={project.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition p-6 group cursor-pointer relative overflow-hidden">
            {/* Top Color Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${project.color}`} />
            
            <div className="flex items-start justify-between mb-4 mt-1">
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500`}>
                {project.status}
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition">
              {project.title}
            </h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
              {project.desc}
            </p>

            {/* Progress */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Tiến độ</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${project.color} rounded-full`} style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  {project.files}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {project.members}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {project.updated}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
