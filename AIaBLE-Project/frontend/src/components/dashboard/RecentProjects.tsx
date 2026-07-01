import { ArrowRight, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'archived';
  updatedAt: number;
}

const statusDot: Record<string, string> = {
  yellow: 'bg-yellow-400',
  green: 'bg-emerald-500',
  red: 'bg-red-400',
  blue: 'bg-blue-400',
};

const t = {
  vi: {
    title: 'My Recent Projects',
    status: 'Trạng thái',
    lastEdited: 'Cập nhật lần cuối',
    viewAll: 'Tất cả Project'
  },
  en: {
    title: 'My Recent Projects',
    status: 'Status',
    lastEdited: 'Last Edited',
    viewAll: 'Projects'
  }
};

export function RecentProjects() {
  const [lang, setLang] = useState('vi');
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const json = await res.json();
        if (json.success) {
          // Chỉ lấy 3 project mới cập nhật nhất
          setProjects(json.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const text = t[lang as 'en' | 'vi'] || t.vi;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'blue';
      case 'in-progress':
      case 'review': return 'yellow';
      case 'completed': return 'green';
      case 'archived': return 'red';
      default: return 'yellow';
    }
  };

  const getStatusText = (status: string) => {
    if (lang === 'vi') {
      switch (status) {
        case 'planning': return 'Đang lên kế hoạch';
        case 'in-progress': return 'Đang thực hiện';
        case 'review': return 'Đang xem xét';
        case 'completed': return 'Đã hoàn thành';
        case 'archived': return 'Đã lưu trữ';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800">{text.title}</h2>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <Settings className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{text.status}</span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{text.lastEdited}</span>
      </div>

      {/* Project list */}
      <div className="space-y-2">
        {projects.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-400">
            {lang === 'vi' ? 'Chưa có dự án nào' : 'No projects found'}
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/projects`)}
              className="group flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2.5 hover:border-violet-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className={cn('w-2 h-2 rounded-full shrink-0', statusDot[getStatusColor(project.status)])} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate max-w-[140px] group-hover:text-violet-700 transition-colors">
                    {project.title}
                  </p>
                  <p className="text-[10px] text-slate-400">{getStatusText(project.status)}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2 shrink-0">
                {new Date(project.updatedAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4">
        <button 
          onClick={() => router.push('/projects')}
          className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition"
        >
          {text.viewAll}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
