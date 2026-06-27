import { ArrowRight, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const projects = [
  {
    id: 1,
    name: 'Software Engineering Report',
    status: 'Draft',
    statusColor: 'yellow',
    lastEdited: 'Edited 2h ago',
    icon: '📄',
  },
  {
    id: 2,
    name: 'Python Debugger for lab',
    status: 'Complete',
    statusColor: 'green',
    lastEdited: 'Edited 1d ago',
    icon: '✅',
  },
  {
    id: 3,
    name: 'Marketer Slides',
    status: 'Draft',
    statusColor: 'yellow',
    lastEdited: 'Edited 3h ago',
    icon: '📊',
  },
];

const statusDot: Record<string, string> = {
  yellow: 'bg-yellow-400',
  green: 'bg-emerald-500',
  red: 'bg-red-400',
  blue: 'bg-blue-400',
};

export function RecentProjects() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800">My Recent Projects</h2>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <Settings className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Edited</span>
      </div>

      {/* Project list */}
      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2.5 hover:border-violet-200 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className={cn('w-2 h-2 rounded-full shrink-0', statusDot[project.statusColor])} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate max-w-[140px] group-hover:text-violet-700 transition-colors">
                  {project.name}
                </p>
                <p className="text-[10px] text-slate-400">{project.status}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2 shrink-0">
              {project.lastEdited}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4">
        <button className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition">
          Projects
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
