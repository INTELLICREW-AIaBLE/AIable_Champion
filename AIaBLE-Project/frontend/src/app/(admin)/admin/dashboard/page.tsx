'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, BookOpen, Zap, TrendingUp, RefreshCw,
  Wand2, GitBranch, FlaskConical, Shield,
  Server, Clock, Cpu, Database, Wifi, AlertTriangle, Edit2, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-32 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative h-full justify-end">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-violet-200 to-violet-500 group-hover:from-violet-400 group-hover:to-violet-600 transition-all shadow-sm"
            style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
          />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10 transition-opacity shadow-xl">
            {d.count} lượt
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, gradient }: { label: string; value: number | string; icon: any; color: string; gradient: string }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-all hover:-translate-y-1">
      {/* Background glowing orb */}
      <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity", gradient)} />

      <div className="flex items-center gap-5 relative z-10">
        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}
export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, healthRes, tokensRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/health`, { headers: authHeaders() }),
        fetch(`${API}/api/admin/tokens`, { headers: authHeaders() })
      ]);

      const statsJson = await statsRes.json();
      const healthJson = await healthRes.json();
      const tokensJson = await tokensRes.json();

      if (statsRes.status === 401 || statsRes.status === 403) {
        router.push('/home'); // Redirect if not admin
        return;
      }

      if (statsJson.success) setStats(statsJson.data);
      if (healthJson.success) setHealth(healthJson.data);
      if (tokensJson.success) setTokens(tokensJson.data);

      // Trigger client side notifications for API token warnings
      if (statsJson.success && statsJson.data.tokenWarnings) {
        statsJson.data.tokenWarnings.forEach((w: any) => {
          const key = `notif_token_${w.name}_${Math.floor(Date.now() / (60 * 60 * 1000))}`; // Limit to once per hour per api
          if (!localStorage.getItem(key)) {
            import('@/lib/notifications').then(({ addNotification }) => {
              addNotification(`Hạn mức API sắp hết`, w.message);
            });
            localStorage.setItem(key, 'true');
          }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateLimit = async (name: string) => {
    try {
      const res = await fetch(`${API}/api/admin/tokens/limit`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, limit: editLimit, warningThreshold: editThreshold })
      });
      const json = await res.json();
      if (json.success) {
        setEditingToken(null);
        fetchData();
      } else {
        alert(json.message || 'Cập nhật thất bại');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetUsage = async (name: string) => {
    if (!window.confirm(`Bạn có chắc muốn reset số lượng token đã dùng của API ${name}?`)) return;
    try {
      const res = await fetch(`${API}/api/admin/tokens/reset`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name })
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
      } else {
        alert(json.message || 'Reset thất bại');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <p className="text-sm font-semibold">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1.5">Các chỉ số quan trọng của AIaBLE platform</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* Dangerous API Token Warning Banner */}
      {stats && stats.tokenWarnings && stats.tokenWarnings.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/60 rounded-3xl p-5 flex flex-col gap-3.5 shadow-sm">
          <div className="flex items-center gap-3 text-rose-800">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Cảnh báo hạn mức API</h3>
              <p className="text-xs font-semibold text-rose-600/80 mt-0.5">Một số API Key đã gần đạt hoặc vượt ngưỡng giới hạn cấu hình</p>
            </div>
          </div>
          <div className="divide-y divide-rose-100 bg-white/60 rounded-2xl border border-rose-100 overflow-hidden">
            {stats.tokenWarnings.map((w: any, idx: number) => (
              <div key={idx} className="px-5 py-3.5 flex items-center justify-between gap-4 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  {w.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats && (
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <Link href="/admin/users">
              <StatCard label="Tổng users" value={stats.overview.totalUsers} icon={Users} color="bg-gradient-to-tr from-violet-600 to-fuchsia-600" gradient="bg-violet-500" />
            </Link>
            <Link href="/admin/recipes">
              <StatCard label="Tổng recipes" value={stats.overview.totalRecipes} icon={BookOpen} color="bg-gradient-to-tr from-emerald-500 to-teal-400" gradient="bg-emerald-500" />
            </Link>
            <Link href="/admin/activities">
              <StatCard label="API requests" value={stats.overview.totalApiCalls} icon={Zap} color="bg-gradient-to-tr from-blue-600 to-cyan-500" gradient="bg-blue-500" />
            </Link>
            <Link href="/admin/activities">
              <StatCard label="Đã lưu trữ" value={stats.overview.totalSavedRecipes} icon={TrendingUp} color="bg-gradient-to-tr from-amber-500 to-orange-400" gradient="bg-amber-500" />
            </Link>
          </div>

          {/* Feature breakdown */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {[
                { label: 'Optimizer', icon: Wand2, val: stats.overview.optimizerCount, color: 'text-violet-600 bg-violet-50', link: '/admin/activities' },
                { label: 'Task Matcher', icon: GitBranch, val: stats.overview.taskMatcherCount, color: 'text-blue-600 bg-blue-50', link: '/admin/activities' },
                { label: 'Sandbox', icon: FlaskConical, val: stats.overview.sandboxCount, color: 'text-fuchsia-600 bg-fuchsia-50', link: '/admin/activities' },
                { label: 'Validator', icon: Shield, val: stats.overview.validatorCount, color: 'text-emerald-600 bg-emerald-50', link: '/admin/activities' },
                { label: 'Recipes', icon: BookOpen, val: stats.overview.recipeCount, color: 'text-amber-600 bg-amber-50', link: '/admin/recipes' },
              ].map(({ label, icon: Icon, val, color, link }) => (
                <Link href={link} key={label} className="p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-50/50 transition-colors">
                  <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300', color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 leading-none mb-1">{val}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily chart */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-800">Lưu lượng API</p>
                  <p className="text-xs font-semibold text-slate-400">14 ngày qua</p>
                </div>
              </div>
              <MiniBarChart data={stats.charts.daily} />
              <div className="flex justify-between text-xs text-slate-400 mt-4 font-semibold px-1">
                <span>{stats.charts.daily[0]?.date.slice(5)}</span>
                <span>{stats.charts.daily[13]?.date.slice(5)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LLM Usage */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-fuchsia-600" />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-800">Hoạt động LLMs</p>
                  <p className="text-xs font-semibold text-slate-400">Top 5 mô hình AI</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                {stats.charts.byModel.slice(0, 5).map((m: any, idx: number) => (
                  <div key={m.name} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <span className="font-black text-lg">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-800">{m.name || 'Mặc định'}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">AI Model</p>
                    </div>
                    <span className="text-sm font-black text-violet-700 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-100">
                      {m.value} lượt
                    </span>
                  </div>
                ))}
                {stats.charts.byModel.length === 0 && <p className="text-sm text-slate-400 text-center">Chưa có dữ liệu</p>}
              </div>
            </div>

            {/* Top Subjects */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-800">Môn học phổ biến</p>
                  <p className="text-xs font-semibold text-slate-400">Từ công cụ Task Matcher</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3">
                {stats.charts.topSubjects.slice(0, 5).map((s: any, idx: number) => (
                  <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black shrink-0">
                      {idx + 1}
                    </div>
                    <span className="flex-1 text-sm font-bold text-slate-700 truncate">{s.name}</span>
                    <span className="text-sm font-black text-blue-600 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">{s.value}</span>
                  </div>
                ))}
                {stats.charts.topSubjects.length === 0 && <p className="text-sm text-slate-400 text-center">Chưa có dữ liệu</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── API Token Management ── */}
      {tokens && tokens.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-800">Quản lý Hạn mức Token API</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Theo dõi lượng token tiêu thụ và cấu hình ngưỡng cảnh báo</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tokens.map((t: any) => {
              const usagePercent = t.limit > 0 ? (t.usedTokens / t.limit) * 100 : 0;
              const isEditing = editingToken === t.name;
              const isDanger = usagePercent >= t.warningThreshold;

              return (
                <div key={t.name} className={cn(
                  "bg-white rounded-3xl border shadow-sm p-6 relative overflow-hidden transition-all hover:shadow-md",
                  isDanger ? "border-amber-200 bg-amber-50/5" : "border-slate-100"
                )}>
                  {/* Visual danger indicator */}
                  {isDanger && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        isDanger ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-violet-50 text-violet-600"
                      )}>
                        {isDanger ? <AlertTriangle className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{t.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Integration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (isEditing) {
                            setEditingToken(null);
                          } else {
                            setEditingToken(t.name);
                            setEditLimit(t.limit);
                            setEditThreshold(t.warningThreshold);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 transition"
                        title="Cấu hình"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleResetUsage(t.name)}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-rose-600 transition"
                        title="Reset số dùng"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3.5 py-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hạn mức (tokens)</label>
                        <input
                          type="number"
                          value={editLimit}
                          onChange={(e) => setEditLimit(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cảnh báo khi đạt (%)</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={editThreshold}
                          onChange={(e) => setEditThreshold(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold text-slate-700"
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => setEditingToken(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleUpdateLimit(t.name)}
                          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Đã sử dụng</span>
                          <p className="text-lg font-black text-slate-800 mt-0.5">{t.usedTokens.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Hạn mức</span>
                          <p className="text-sm font-bold text-slate-600 mt-0.5">{t.limit.toLocaleString()}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-slate-500">Mức sử dụng</span>
                          <span className={cn(
                            "font-bold",
                            isDanger ? "text-amber-600" : "text-violet-600"
                          )}>
                            {usagePercent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            usagePercent >= 90 ? "bg-rose-500" : usagePercent >= t.warningThreshold ? "bg-amber-500" : "bg-violet-500"
                          )} style={{ width: `${Math.min(usagePercent, 100)}%` }} />
                        </div>
                      </div>

                      {isDanger && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50/50 border border-amber-100 p-2 rounded-xl">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Đã vượt ngưỡng cấu hình ({t.warningThreshold}%)!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System Health Section */}
      {health && (
        <div className="mt-8">
          <h2 className="text-lg font-black text-slate-800 mb-4">Trạng thái máy chủ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Server Status */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Core</p>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Online</span>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Uptime</span>
                  <span className="font-bold text-lg">{health.uptime}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Cpu className="w-4 h-4" /> Node.js</span>
                  <span className="font-bold">{health.env.nodeVersion}</span>
                </div>
              </div>
            </div>

            {/* Memory Status */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Database className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-wider">Memory Usage</p>
              </div>
              <div className="space-y-5">
                {[
                  { label: 'Heap Used', val: health.memory.heapUsed, max: health.memory.heapTotal },
                  { label: 'RSS (Total)', val: health.memory.rss, max: health.memory.rss },
                ].map(({ label, val, max }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-600 font-bold">{label}</span>
                      <span className="font-black text-slate-900">{val} MB</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-amber-500 rounded-full" style={{ width: `${Math.min((val / (max || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Configs */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-wider">API Keys & Services</p>
              </div>
              <div className="space-y-3.5">
                {[
                  { label: 'Gemini API Key', val: health.env.geminiKey, type: 'llm' },
                  { label: 'Groq API Key', val: health.env.groqKey, type: 'llm' },
                  { label: 'OpenRouter Key', val: health.env.openRouterKey, type: 'llm' },
                  { label: 'Google Search API', val: health.env.googleSearch ? 'Configured' : null, type: 'service' },
                  { label: 'SMTP Mailer', val: health.env.smtp ? 'Configured' : null, type: 'service' },
                ].map(({ label, val, type }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <span className="text-slate-700 font-bold flex items-center gap-2">
                      {label}
                      {type === 'llm' && <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-violet-100 text-violet-700 uppercase">LLM</span>}
                    </span>
                    {val ? (
                      <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {val}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                        Missing
                      </span>
                    )}
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
