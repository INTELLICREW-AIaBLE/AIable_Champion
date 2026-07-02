'use client';

import { useState, useEffect } from 'react';
import { X, FolderPlus, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { addNotification } from '@/lib/notifications';

interface Project {
  id: string;
  title: string;
  category: string;
}

interface SaveToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    prompt?: string;
    result?: string;
    aiModel?: string;
  };
}

export default function SaveToProjectModal({ isOpen, onClose, data }: SaveToProjectModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  
  // Form state
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('other');
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setTaskTitle('');
      setTaskDescription('');
      fetchProjects();
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!success && !isSaving) {
          handleSave();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, success, isSaving, taskTitle, selectedProjectIds, mode, newProjectTitle]);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects?userId=default-user`);
      const json = await res.json();
      if (json.success) {
        setProjects(json.data);
        if (json.data.length > 0) {
          setSelectedProjectIds([json.data[0].id]);
        } else {
          setMode('new');
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSave = async () => {
    if (!taskTitle.trim()) {
      alert('Vui lòng nhập tên công việc (Task Title)');
      return;
    }

    setIsSaving(true);
    try {
      const addTaskToProject = async (projectId: string) => {
        const taskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects/${projectId}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'default-user',
            title: taskTitle,
            description: taskDescription || 'Saved output',
            prompt: data.prompt,
            result: data.result,
            aiModel: data.aiModel || 'System'
          })
        });
        const taskJson = await taskRes.json();
        if (!taskJson.success) throw new Error(taskJson.message);
      };

      // 1. Create new project if needed
      if (mode === 'new') {
        if (!newProjectTitle.trim()) {
          alert('Vui lòng nhập tên dự án mới');
          setIsSaving(false);
          return;
        }
        const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'default-user',
            title: newProjectTitle,
            description: 'Created from Sandbox/Optimizer',
            category: newProjectCategory
          })
        });
        const createJson = await createRes.json();
        if (!createJson.success) throw new Error(createJson.message);
        await addTaskToProject(createJson.data.id);
        setSelectedProjectIds([createJson.data.id]);
      } else {
        if (selectedProjectIds.length === 0) {
          alert('Vui lòng chọn ít nhất 1 dự án');
          setIsSaving(false);
          return;
        }
        await Promise.all(selectedProjectIds.map(id => addTaskToProject(id)));
      }

      setSuccess(true);
      addNotification('Lưu thành công', `Đã lưu nội dung AI vào dự án của bạn.`);

    } catch (error: any) {
      console.error('Error saving to project:', error);
      alert('Đã xảy ra lỗi: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Save className="w-4 h-4 text-violet-600" />
            Lưu vào Dự án
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Lưu thành công!</h4>
            <p className="text-sm text-slate-500 mt-1">Đã lưu kết quả vào dự án của bạn.</p>
            
            <div className="mt-8 flex items-center justify-center gap-3 w-full">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition"
              >
                Đóng
              </button>
              {selectedProjectIds.length === 1 && (
                <button
                  onClick={() => window.location.href = `/projects/${selectedProjectIds[0]}`}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-200"
                >
                  Xem Dự án
                </button>
              )}
              {selectedProjectIds.length > 1 && (
                <button
                  onClick={() => window.location.href = `/projects`}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-200"
                >
                  Quản lý Dự án
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto">
            
            {/* Project Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-bold text-slate-700">Chọn Dự án lưu trữ</label>
              
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setMode('existing')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${mode === 'existing' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Dự án có sẵn
                </button>
                <button
                  onClick={() => setMode('new')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${mode === 'new' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  + Tạo mới
                </button>
              </div>

              {mode === 'existing' ? (
                isLoadingProjects ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                    Bạn chưa có dự án nào. Vui lòng tạo mới.
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 border border-slate-200 rounded-xl">
                    {projects.map(p => {
                      const isSelected = selectedProjectIds.includes(p.id);
                      return (
                        <label 
                          key={p.id} 
                          className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition ${isSelected ? 'bg-violet-50 border-violet-200' : 'hover:bg-slate-50'}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedProjectIds(selectedProjectIds.filter(id => id !== p.id));
                              } else {
                                setSelectedProjectIds([...selectedProjectIds, p.id]);
                              }
                            }}
                            className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{p.category}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Tên dự án mới..."
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <select
                    value={newProjectCategory}
                    onChange={(e) => setNewProjectCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  >
                    <option value="software-engineering">Software Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="academic">Academic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}
            </div>

            {/* Task Details */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Thông tin lưu trữ (Task)</label>
              <div>
                <input
                  type="text"
                  placeholder="Tên tác vụ (VD: Generate API docs)"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 mb-2"
                />
                <textarea
                  placeholder="Mô tả ngắn gọn (Tùy chọn)"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
                />
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        {!success && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || (mode === 'existing' && selectedProjectIds.length === 0)}
              className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Lưu ngay
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
