'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, Plus, MoreVertical, Clock, FileText, CheckCircle2, Search, Trash2, Edit2, X, Folder, RefreshCcw } from 'lucide-react';
import { useAPIRequest } from '@/hooks/useAPIRequest';
import { addNotification } from '@/lib/notifications';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'archived';
  tasks: any[];
  tags: string[];
  color: string;
  createdAt: number;
  updatedAt: number;
}

const t = {
  vi: {
    title: 'Dự án của bạn',
    desc: 'Quản lý dự án và theo dõi tiến độ công việc.',
    searchPlaceholder: 'Tìm kiếm dự án...',
    createBtn: 'Tạo Dự án',
    loading: 'Đang tải projects...',
    notFound: 'Không tìm thấy project nào',
    noProjects: 'Chưa có project nào',
    noProjectsHint: 'Tạo project đầu tiên để bắt đầu!',
    progress: 'Tiến độ',
    details: 'Xem chi tiết',
    delete: 'Xóa',
    restore: 'Khôi phục',
    activeProjects: 'Đang hoạt động',
    trash: 'Thùng rác',
    confirmDeleteTitle: 'Xác nhận xóa',
    confirmDeleteMsg: 'Bạn có chắc muốn xóa project',
    confirmDeleteWarn: 'Hành động này không thể hoàn tác.',
    cancel: 'Hủy',
    deleteBtn: 'Xóa',
    createModalTitle: 'Tạo Project Mới',
    nameLabel: 'Tên Project *',
    namePlaceholder: 'VD: Đồ án Nhập môn Kỹ thuật Phần mềm',
    descLabel: 'Mô tả *',
    descPlaceholder: 'Mô tả ngắn gọn về project...',
    categoryLabel: 'Danh mục *',
    tagsLabel: 'Tags (tùy chọn)',
    tagsPlaceholder: 'VD: Java, Spring Boot, MySQL (cách nhau bởi dấu phẩy)',
    colorLabel: 'Màu chủ đạo',
    creating: 'Đang tạo...',
    statusLabels: {
      'planning': 'Đang lên kế hoạch',
      'in-progress': 'Đang thực hiện',
      'review': 'Đang review',
      'completed': 'Hoàn thành',
      'archived': 'Đã lưu trữ'
    },
    categoryLabels: {
      'software-engineering': 'Phần mềm',
      'data-science': 'Data Science',
      'marketing': 'Marketing',
      'business': 'Kinh doanh',
      'academic': 'Học thuật',
      'research': 'Nghiên cứu',
      'other': 'Khác'
    }
  },
  en: {
    title: 'Your Projects',
    desc: 'Manage projects and track work progress.',
    searchPlaceholder: 'Search projects...',
    createBtn: 'Create Project',
    loading: 'Loading projects...',
    notFound: 'No projects found',
    noProjects: 'No projects yet',
    noProjectsHint: 'Create your first project to get started!',
    progress: 'Progress',
    details: 'View details',
    delete: 'Delete',
    restore: 'Restore',
    activeProjects: 'Active Projects',
    trash: 'Trash',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteMsg: 'Are you sure you want to delete the project',
    confirmDeleteWarn: 'This action cannot be undone.',
    cancel: 'Cancel',
    deleteBtn: 'Delete',
    createModalTitle: 'Create New Project',
    nameLabel: 'Project Name *',
    namePlaceholder: 'Ex: Intro to Software Engineering Project',
    descLabel: 'Description *',
    descPlaceholder: 'Brief description of the project...',
    categoryLabel: 'Category *',
    tagsLabel: 'Tags (optional)',
    tagsPlaceholder: 'Ex: Java, Spring Boot, MySQL (comma separated)',
    colorLabel: 'Primary Color',
    creating: 'Creating...',
    statusLabels: {
      'planning': 'Planning',
      'in-progress': 'In Progress',
      'review': 'In Review',
      'completed': 'Completed',
      'archived': 'Archived'
    },
    categoryLabels: {
      'software-engineering': 'Software Eng.',
      'data-science': 'Data Science',
      'marketing': 'Marketing',
      'business': 'Business',
      'academic': 'Academic',
      'research': 'Research',
      'other': 'Other'
    }
  }
};

const STATUS_COLORS: Record<string, string> = {
  'planning': 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'review': 'bg-purple-100 text-purple-700',
  'completed': 'bg-emerald-100 text-emerald-700',
  'archived': 'bg-slate-100 text-slate-500'
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');

  const { execute, loading } = useAPIRequest();

  // Fetch projects
  const fetchProjects = async (tab: 'active' | 'trash' = activeTab) => {
    const endpoint = tab === 'trash' ? '/api/projects/trash' : '/api/projects';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const result = await execute(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (result?.success) {
      setProjects(result.data);
    }
  };

  const [lang, setLang] = useState('vi');

  useEffect(() => {
    setLang(localStorage.getItem('app_lang') || 'vi');
    const handleLangChange = () => setLang(localStorage.getItem('app_lang') || 'vi');
    window.addEventListener('storage', handleLangChange);
    window.addEventListener('app_lang_changed', handleLangChange);
    return () => {
      window.removeEventListener('storage', handleLangChange);
      window.removeEventListener('app_lang_changed', handleLangChange);
    };
  }, []);

  const text = t[lang as 'en' | 'vi'] || t.vi;

  useEffect(() => {
    fetchProjects(activeTab);
  }, [activeTab]);

  // Delete project
  const handleDelete = async () => {
    if (!selectedProject) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const result = await execute(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects/${selectedProject.id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (result?.success) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setShowDeleteConfirm(false);
      setSelectedProject(null);
      addNotification('Xóa dự án', `Đã xóa dự án "${selectedProject.title}".`);
    }
  };

  // Restore project
  const handleRestore = async (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const result = await execute(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects/${id}/restore`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (result?.success) {
      setProjects(projects.filter(p => p.id !== id));
      setSelectedProject(null);
      addNotification('Khôi phục dự án', `Đã khôi phục thành công.`);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate progress
  const getProgress = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    const completed = project.tasks.filter(t => t.status === 'done').length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{text.title}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{text.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input maxLength={100}
              type="text"
              placeholder={text.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 w-64"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-violet-200"
          >
            <Plus className="w-4 h-4" />
            {text.createBtn}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'active' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          {text.activeProjects}
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'trash' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          {text.trash}
        </button>
      </div>

      {/* Projects Grid */}
      {loading && projects.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <div className="animate-spin w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto mb-4" />
          {text.loading}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">
            {searchQuery ? text.notFound : text.noProjects}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {!searchQuery && text.noProjectsHint}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const progress = getProgress(project);
            const completedTasks = project.tasks.filter(t => t.status === 'done').length;

            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition p-6 group cursor-pointer relative overflow-hidden"
              >
                {/* Top Color Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: project.color || '#8B5CF6' }} />

                <div className="flex items-start justify-between mb-4 mt-1">
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[project.status]}`}>
                    {(text.statusLabels as any)[project.status]}
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(selectedProject?.id === project.id ? null : project);
                      }}
                      className="text-slate-400 hover:text-slate-600 transition"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {selectedProject?.id === project.id && (
                      <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 min-w-[150px]">
                        {activeTab === 'active' ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/projects/${project.id}`;
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Edit2 className="w-4 h-4" />
                              {text.details}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(true);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              {text.delete}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestore(project.id);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                            >
                              <RefreshCcw className="w-4 h-4" />
                              {text.restore}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <a href={`/projects/${project.id}`} className="block">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 text-[10px] font-semibold">
                      {(text.categoryLabels as any)[project.category] || project.category}
                    </span>
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{text.progress}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: project.color || '#8B5CF6'
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        {project.tasks.length}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {completedTasks}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(project.updatedAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateProjectModal
          text={text}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchProjects();
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{text.confirmDeleteTitle}</h3>
            <p className="text-sm text-slate-600 mb-6">
              {text.confirmDeleteMsg} "<strong>{selectedProject.title}</strong>"?
              {text.confirmDeleteWarn}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedProject(null);
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                {text.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                {text.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Create Project Modal Component
function CreateProjectModal({ onClose, onSuccess, text }: { onClose: () => void; onSuccess: () => void; text: any }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic' as any,
    tags: '',
    color: '#8B5CF6'
  });

  const { execute, loading } = useAPIRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const result = await execute(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      }
    );

    if (result?.success) {
      addNotification('Tạo dự án mới', `Dự án "${formData.title}" đã được tạo.`);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{text.createModalTitle}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{text.nameLabel}</label>
            <input maxLength={100}
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={text.namePlaceholder}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{text.descLabel}</label>
            <textarea maxLength={5000}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={text.descPlaceholder}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{text.categoryLabel}</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400"
            >
              {Object.entries(text.categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label as string}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{text.tagsLabel}</label>
            <input maxLength={100}
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder={text.tagsPlaceholder}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{text.colorLabel}</label>
            <div className="flex gap-2">
              {['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition ${formData.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              {text.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-50"
            >
              {loading ? text.creating : text.createBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
