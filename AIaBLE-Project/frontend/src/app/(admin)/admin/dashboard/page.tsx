'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, BookOpen, Zap, TrendingUp, RefreshCw, 
  Wand2, GitBranch, FlaskConical, Shield,
  Server, Clock, Cpu, Database, Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
          <div
            className="w-full rounded-sm bg-violet-400 hover:bg-violet-600 transition-all"
            style={{ height: `${Math.max(2, (d.count / max) * 56)}px` }}
          />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
            {d.date.slice(5)}: {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 transition-transform hover:-translate-y-1">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/health`, { headers: authHeaders() })
      ]);
      
      const statsJson = await statsRes.json();
      const healthJson = await healthRes.json();

      if (statsRes.status === 401 || statsRes.status === 403) {
        router.push('/home'); // Redirect if not admin
        return;
      }

      if (statsJson.success) setStats(statsJson.data);
      if (healthJson.success) setHealth(healthJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <p className="text-sm font-semibold">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Các chỉ số quan trọng của AIaBLE platform</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {stats && (
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Tổng users" value={stats.overview.totalUsers} icon={Users} color="bg-violet-600 shadow-violet-200" />
            <StatCard label="Tổng recipes" value={stats.overview.totalRecipes} icon={BookOpen} color="bg-emerald-500 shadow-emerald-200" />
            <StatCard label="API requests" value={stats.overview.totalApiCalls} icon={Zap} color="bg-blue-500 shadow-blue-200" />
            <StatCard label="Đã lưu trữ" value={stats.overview.totalSavedRecipes} icon={TrendingUp} color="bg-amber-500 shadow-amber-200" />
          </div>

          {/* Feature breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Optimizer', icon: Wand2, val: stats.overview.optimizerCount, color: 'text-violet-600 bg-violet-50' },
              { label: 'Task Matcher', icon: GitBranch, val: stats.overview.taskMatcherCount, color: 'text-blue-600 bg-blue-50' },
              { label: 'Sandbox', icon: FlaskConical, val: stats.overview.sandboxCount, color: 'text-fuchsia-600 bg-fuchsia-50' },
              { label: 'Validator', icon: Shield, val: stats.overview.validatorCount, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Recipes', icon: BookOpen, val: stats.overview.recipeCount, color: 'text-amber-600 bg-amber-50' },
            ].map(({ label, icon: Icon, val, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center hover:border-violet-200 transition">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3', color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900">{val}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-base font-black text-slate-800 mb-6">Lưu lượng API (14 ngày qua)</p>
              <MiniBarChart data={stats.charts.daily} />
              <div className="flex justify-between text-xs text-slate-400 mt-3 font-semibold">
                <span>{stats.charts.daily[0]?.date.slice(5)}</span>
                <span>{stats.charts.daily[13]?.date.slice(5)}</span>
              </div>
            </div>

            {/* Top Subjects */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
              <p className="text-base font-black text-slate-800 mb-6">Môn học phổ biến (Task Matcher)</p>
              <div className="flex-1 flex flex-col justify-center gap-3">
                {stats.charts.topSubjects.slice(0, 5).map((s: any, idx: number) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                      #{idx + 1}
                    </div>
                    <span className="flex-1 text-sm font-semibold text-slate-700 truncate">{s.name}</span>
                    <span className="text-sm font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">{s.value}</span>
                  </div>
                ))}
                {stats.charts.topSubjects.length === 0 && <p className="text-sm text-slate-400 text-center">Chưa có dữ liệu</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* System Health Section */}
      {health && (
        <div className="mt-8">
          <h2 className="text-lg font-black text-slate-800 mb-4">Trạng thái máy chủ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Server Status */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Core</p>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400">Online</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Uptime</span>
                  <span className="font-bold">{health.uptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Cpu className="w-4 h-4" /> Node.js</span>
                  <span className="font-bold">{health.env.nodeVersion}</span>
                </div>
              </div>
            </div>

            {/* Memory Status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Memory Usage</p>
              <div className="space-y-4">
                {[
                  { label: 'Heap Used', val: health.memory.heapUsed, max: health.memory.heapTotal },
                  { label: 'RSS (Total)', val: health.memory.rss, max: health.memory.rss },
                ].map(({ label, val, max }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-semibold">{label}</span>
                      <span className="font-black text-slate-800">{val} MB</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${Math.min((val / (max || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Configs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Environment Keys</p>
               <div className="space-y-3">
                 {[
                   { label: 'Gemini API Key', ok: health.env.hasGeminiKey },
                   { label: 'Google Search Key', ok: health.env.hasGoogleSearch },
                   { label: 'SMTP Services', ok: health.env.hasSmtp },
                 ].map(({ label, ok }) => (
                   <div key={label} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                     <span className="text-slate-600 font-semibold flex items-center gap-2">
                       <Wifi className="w-3.5 h-3.5 text-slate-400" /> {label}
                     </span>
                     <span className={cn('text-[10px] font-black px-2 py-0.5 rounded uppercase', ok ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
                       {ok ? 'Ready' : 'Missing'}
                     </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
