'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAPIRequest } from '@/hooks/useAPIRequest';
import { ArrowLeft, Clock, FileText, Bot, CheckCircle2, Circle, MoreVertical, Copy, Trash2, Expand } from 'lucide-react';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  aiModel?: string;
  prompt?: string;
  result?: string;
  createdAt: number;
  completedAt?: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  tasks: ProjectTask[];
  tags: string[];
  color: string;
  createdAt: number;
  updatedAt: number;
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { execute, loading } = useAPIRequest();
  
  const [project, setProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    if (!id) return;
    
    const result = await execute(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects/${id}`,
      { method: 'GET' }
    );
    
    if (!result) return; // Request was aborted or errored out
    
    if (result.success) {
      setProject(result.data);
    } else {
      alert('Không tìm thấy dự án!');
      router.push('/projects');
    }
  };

  const handleDeleteTask = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc muốn xóa task này?')) return;

    const result = await execute(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects/${id}/tasks/${taskId}`,
      { method: 'DELETE' }
    );

    if (result?.success) {
      fetchProject();
    }
  };

  if (loading && !project) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full mr-3" />
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/projects')}
          className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color || '#8B5CF6' }}></span>
            {project.title}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{project.description}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-600" />
            Danh sách Kết quả / Tác vụ ({project.tasks.length})
          </h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {project.tasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Dự án này chưa có tác vụ hay kết quả nào được lưu.
            </div>
          ) : (
            project.tasks.sort((a, b) => b.createdAt - a.createdAt).map(task => (
              <div 
                key={task.id}
                onClick={() => {
                  setSelectedTask(task);
                  setShowTaskDetail(true);
                }}
                className="p-5 flex items-start gap-4 hover:bg-slate-50 transition cursor-pointer group"
              >
                <div className="shrink-0 mt-1">
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition">{task.title}</h3>
                    {task.aiModel && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Bot className="w-3 h-3" />
                        {task.aiModel}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-slate-600 line-clamp-1 mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(task.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDeleteTask(e, task.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-violet-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                    title="Xem chi tiết"
                  >
                    <Expand className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTaskDetail(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Chi tiết: {selectedTask.title}
              </h3>
              <button onClick={() => setShowTaskDetail(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {selectedTask.description && (
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700">
                  <span className="font-bold mr-2">Mô tả:</span> {selectedTask.description}
                </div>
              )}

              {selectedTask.prompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">Prompt đã sử dụng</h4>
                    <button onClick={() => navigator.clipboard.writeText(selectedTask.prompt!)} className="text-xs flex items-center gap-1 text-slate-400 hover:text-violet-600 transition">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                    {selectedTask.prompt}
                  </div>
                </div>
              )}

              {selectedTask.result && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">Kết quả Output {selectedTask.aiModel ? `(${selectedTask.aiModel})` : ''}</h4>
                    <button onClick={() => navigator.clipboard.writeText(selectedTask.result!)} className="text-xs flex items-center gap-1 text-slate-400 hover:text-violet-600 transition">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 text-sm text-slate-800 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                    {selectedTask.result}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
