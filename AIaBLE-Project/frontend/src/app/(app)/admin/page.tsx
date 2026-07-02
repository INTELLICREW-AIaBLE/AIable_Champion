'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Activity, Server,
  TrendingUp, ChevronRight, Trash2, Edit3, Plus, X,
  Check, AlertTriangle, RefreshCw, Search, Shield,
  Zap, MessageSquare, GitBranch, Wand2, FlaskConical,
  Clock, Database, Cpu, Wifi, ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'users' | 'recipes' | 'activity' | 'health';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

// ─── Mini bar chart ───────────────────────────────────────────────────────────
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

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={cn('fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white animate-in slide-in-from-bottom-4',
      type === 'success' ? 'bg-emerald-600' : 'bg-red-500')}>
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {msg}
    </div>
  );
}

// ─── Recipe Modal ─────────────────────────────────────────────────────────────
function RecipeModal({ recipe, onClose, onSave }: { recipe: any; onClose: () => void; onSave: (r: any) => void }) {
  const [form, setForm] = useState({
    id: recipe?.id || '',
    title: recipe?.title || '',
    category: recipe?.category || 'CODING',
    description: recipe?.description || '',
    prompt: recipe?.prompt || '',
    bestAI: recipe?.bestAI || 'Gemini',
    tags: recipe?.tags?.join(', ') || '',
  });

  const CATEGORIES = ['CODING','REPORT','SLIDE','RESEARCH','WRITING','PLANNING','MATH','ENGLISH',
    'BUSINESS','DESIGN','DATA','LAW','ECONOMICS','CREATIVE','MARKETING','HR','PSYCHOLOGY','SCIENCE','HISTORY','CAREER','AI_PROMPTING'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-900">{recipe ? 'Sửa Recipe' : 'Thêm Recipe mới'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">ID</label>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400" placeholder="coding-001" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">Best AI</label>
              <select value={form.bestAI} onChange={e => setForm(f => ({ ...f, bestAI: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none">
                {['Gemini','Groq','OpenRouter'].map(ai => <option key={ai}>{ai}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400" placeholder="Tiêu đề recipe" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">Tags (phân cách bằng dấu phẩy)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400" placeholder="tag1, tag2" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Description *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Prompt *</label>
            <textarea value={form.prompt} onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
              rows={6} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 resize-none font-mono" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Hủy</button>
          <button
            onClick={() => onSave({ ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) })}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700 transition">
            {recipe ? 'Lưu thay đổi' : 'Tạo recipe'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [recipeModal, setRecipeModal] = useState<{ open: boolean; recipe?: any }>({ open: false });
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotal, setActivityTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('All');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/admin/stats`, { headers: authHeaders() });
      const j = await r.json();
      if (r.status === 401 || r.status === 403) {
        showToast(j.message || 'Không có quyền truy cập', 'error');
        router.push('/recipes');
        return;
      }
      if (j.success) setStats(j.data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    const r = await fetch(`${API}/api/admin/users`, { headers: authHeaders() });
    const j = await r.json();
    if (j.success) setUsers(j.data);
  }, []);

  const fetchRecipes = useCallback(async () => {
    const params = new URLSearchParams();
    if (recipeCategory !== 'All') params.set('category', recipeCategory);
    if (recipeSearch) params.set('search', recipeSearch);
    const r = await fetch(`${API}/api/admin/recipes?${params}`, { headers: authHeaders() });
    const j = await r.json();
    if (j.success) setRecipes(j.data);
  }, [recipeCategory, recipeSearch]);

  const fetchActivity = useCallback(async (page = 1) => {
    const r = await fetch(`${API}/api/admin/activity?page=${page}&limit=20`, { headers: authHeaders() });
    const j = await r.json();
    if (j.success) { setActivity(j.data); setActivityTotal(j.total); setActivityPage(page); }
  }, []);

  const fetchHealth = useCallback(async () => {
    const r = await fetch(`${API}/api/admin/health`, { headers: authHeaders() });
    const j = await r.json();
    if (j.success) setHealth(j.data);
  }, []);

  useEffect(() => {
    if (tab === 'dashboard') fetchStats();
    else if (tab === 'users') fetchUsers();
    else if (tab === 'recipes') fetchRecipes();
    else if (tab === 'activity') fetchActivity(1);
    else if (tab === 'health') fetchHealth();
  }, [tab]);

  useEffect(() => { if (tab === 'recipes') fetchRecipes(); }, [recipeCategory, recipeSearch]);

  // ── User actions ─────────────────────────────────────────────────────────────
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Xóa user này?')) return;
    const r = await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
    const j = await r.json();
    if (j.success) { showToast('Đã xóa user'); fetchUsers(); }
    else showToast(j.message, 'error');
  };

  const handleRoleChange = async (id: string, role: string) => {
    const r = await fetch(`${API}/api/admin/users/${id}/role`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ role }),
    });
    const j = await r.json();
    if (j.success) { showToast('Đã cập nhật role'); fetchUsers(); }
    else showToast(j.message, 'error');
  };

  // ── Recipe actions ────────────────────────────────────────────────────────────
  const handleSaveRecipe = async (data: any) => {
    const isEdit = !!recipeModal.recipe;
    const url = isEdit ? `${API}/api/admin/recipes/${recipeModal.recipe.id}` : `${API}/api/admin/recipes`;
    const method = isEdit ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(data) });
    const j = await r.json();
    if (j.success) {
      showToast(isEdit ? 'Đã cập nhật recipe' : 'Đã tạo recipe mới');
      setRecipeModal({ open: false });
      fetchRecipes();
    } else showToast(j.message, 'error');
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Xóa recipe này?')) return;
    const r = await fetch(`${API}/api/admin/recipes/${id}`, { method: 'DELETE', headers: authHeaders() });
    const j = await r.json();
    if (j.success) { showToast('Đã xóa recipe'); fetchRecipes(); }
    else showToast(j.message, 'error');
  };

  // ── Sidebar nav ───────────────────────────────────────────────────────────────
  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users',     label: 'Users',     icon: Users },
    { id: 'recipes',   label: 'Recipes',   icon: BookOpen },
    { id: 'activity',  label: 'Activity',  icon: Activity },
    { id: 'health',    label: 'System',    icon: Server },
  ] as const;

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
          <p className="text-xs text-slate-500">Quản lý toàn bộ hệ thống AIaBLE</p>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <aside className="w-44 shrink-0">
          <nav className="space-y-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id as Tab)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  tab === id ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'text-slate-600 hover:bg-slate-50')}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* ── DASHBOARD ────────────────────────────────────────────────────── */}
          {tab === 'dashboard' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-800">Tổng quan hệ thống</h2>
                <button onClick={fetchStats} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                  <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                </button>
              </div>

              {loading && <p className="text-sm text-slate-400">Đang tải...</p>}

              {stats && (
                <>
                  {/* Overview cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard label="Tổng users" value={stats.overview.totalUsers} icon={Users} color="bg-violet-600" />
                    <StatCard label="Tổng recipes" value={stats.overview.totalRecipes} icon={BookOpen} color="bg-emerald-500" />
                    <StatCard label="Tổng API calls" value={stats.overview.totalApiCalls} icon={Zap} color="bg-blue-500" />
                    <StatCard label="Recipe đã lưu" value={stats.overview.totalSavedRecipes} icon={TrendingUp} color="bg-amber-500" />
                  </div>

                  {/* Feature breakdown */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      { label: 'Optimizer', icon: Wand2, val: stats.overview.optimizerCount, color: 'text-violet-600 bg-violet-50' },
                      { label: 'Task Matcher', icon: GitBranch, val: stats.overview.taskMatcherCount, color: 'text-blue-600 bg-blue-50' },
                      { label: 'Sandbox', icon: FlaskConical, val: stats.overview.sandboxCount, color: 'text-fuchsia-600 bg-fuchsia-50' },
                      { label: 'Validator', icon: Shield, val: stats.overview.validatorCount, color: 'text-emerald-600 bg-emerald-50' },
                      { label: 'Recipes', icon: BookOpen, val: stats.overview.recipeCount, color: 'text-amber-600 bg-amber-50' },
                    ].map(({ label, icon: Icon, val, color }) => (
                      <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2', color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-xl font-black text-slate-900">{val}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Daily chart */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <p className="text-sm font-bold text-slate-700 mb-4">API calls 14 ngày gần nhất</p>
                      <MiniBarChart data={stats.charts.daily} />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                        <span>{stats.charts.daily[0]?.date.slice(5)}</span>
                        <span>{stats.charts.daily[13]?.date.slice(5)}</span>
                      </div>
                    </div>

                    {/* By tool */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <p className="text-sm font-bold text-slate-700 mb-3">Top features sử dụng</p>
                      <div className="space-y-2">
                        {stats.charts.byTool.slice(0, 6).map((t: any) => (
                          <div key={t.name} className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 w-32 truncate">{t.name}</span>
                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                              <div className="bg-violet-500 h-2 rounded-full"
                                style={{ width: `${(t.value / (stats.charts.byTool[0]?.value || 1)) * 100}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 w-6 text-right">{t.value}</span>
                          </div>
                        ))}
                        {stats.charts.byTool.length === 0 && <p className="text-xs text-slate-400">Chưa có dữ liệu</p>}
                      </div>
                    </div>
                  </div>

                  {/* Top subjects */}
                  {stats.charts.topSubjects.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <p className="text-sm font-bold text-slate-700 mb-3">Môn học được dùng Task Matcher nhiều nhất</p>
                      <div className="flex flex-wrap gap-2">
                        {stats.charts.topSubjects.map((s: any) => (
                          <span key={s.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100 text-xs font-semibold text-violet-700">
                            {s.name} <span className="bg-violet-200 text-violet-800 px-1.5 py-0.5 rounded-md text-[10px]">{s.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── USERS ───────────────────────────────────────────────────────── */}
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-800">Quản lý Users ({users.length})</h2>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 w-52 focus-within:border-violet-400 transition">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="text" placeholder="Tìm user..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Tên / Email', 'Role', 'Activity', 'Saved', 'Login type', 'Thao tác'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800 text-sm">{u.fullName}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select value={u.role || 'user'} onChange={e => handleRoleChange(u.id, e.target.value)}
                            className={cn('text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none',
                              u.role === 'admin' ? 'bg-violet-50 text-violet-700 border-violet-100' : 'bg-slate-50 text-slate-600 border-slate-100')}>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 font-semibold">{u.historyCount} actions</td>
                        <td className="px-4 py-3 text-xs text-slate-600 font-semibold">{u.savedRecipesCount} recipes</td>
                        <td className="px-4 py-3">
                          <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full', u.isGoogleUser ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600')}>
                            {u.isGoogleUser ? 'Google' : 'Email'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">Không tìm thấy user</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── RECIPES ─────────────────────────────────────────────────────── */}
          {tab === 'recipes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-lg font-black text-slate-800">Quản lý Recipes ({recipes.length})</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 w-44 focus-within:border-violet-400 transition">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input type="text" placeholder="Tìm recipe..." value={recipeSearch} onChange={e => setRecipeSearch(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full" />
                  </div>
                  <select value={recipeCategory} onChange={e => setRecipeCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 focus:outline-none">
                    <option>All</option>
                    {['CODING','REPORT','SLIDE','RESEARCH','WRITING','PLANNING','MATH','ENGLISH','BUSINESS','DESIGN',
                      'DATA','LAW','ECONOMICS','CREATIVE','MARKETING','HR','PSYCHOLOGY','SCIENCE','HISTORY','CAREER','AI_PROMPTING']
                      .map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={() => setRecipeModal({ open: true })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-700 transition">
                    <Plus className="w-3.5 h-3.5" /> Thêm mới
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Title', 'Category', 'Best AI', 'Tags', 'Thao tác'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recipes.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800 text-sm line-clamp-1">{r.title}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{r.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-violet-50 text-violet-700">{r.category}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 font-semibold">{r.bestAI}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {r.tags?.slice(0, 2).map((t: string) => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setRecipeModal({ open: true, recipe: r })}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteRecipe(r.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {recipes.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">Không tìm thấy recipe</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ACTIVITY ────────────────────────────────────────────────────── */}
          {tab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-800">Activity Log ({activityTotal} records)</h2>
                <button onClick={() => fetchActivity(1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                  <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Thời gian', 'User', 'Tính năng', 'Chi tiết', 'Model'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activity.map((a, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {a.time ? new Date(a.time).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-semibold text-slate-700">{a.userName || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-400">{a.userEmail}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-violet-50 text-violet-700">{a.tool || a.action || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 max-w-xs">
                          <p className="line-clamp-1">{a.detail || '—'}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-medium">{a.model || '—'}</td>
                      </tr>
                    ))}
                    {activity.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">Chưa có activity nào</td></tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {activityTotal > 20 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Trang {activityPage} / {Math.ceil(activityTotal / 20)}</p>
                    <div className="flex gap-2">
                      <button disabled={activityPage <= 1} onClick={() => fetchActivity(activityPage - 1)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </button>
                      <button disabled={activityPage >= Math.ceil(activityTotal / 20)} onClick={() => fetchActivity(activityPage + 1)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SYSTEM HEALTH ───────────────────────────────────────────────── */}
          {tab === 'health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-800">System Health</h2>
                <button onClick={fetchHealth} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {health && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Server Status</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-emerald-700">Online</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Uptime</span>
                        <span className="font-bold text-slate-800">{health.uptime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Node.js</span>
                        <span className="font-bold text-slate-800">{health.env.nodeVersion}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Last check</span>
                        <span className="font-bold text-slate-800 text-xs">{new Date(health.timestamp).toLocaleTimeString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Memory */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Memory Usage</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Heap Used', val: health.memory.heapUsed, max: health.memory.heapTotal },
                        { label: 'Heap Total', val: health.memory.heapTotal, max: health.memory.heapTotal },
                        { label: 'RSS', val: health.memory.rss, max: health.memory.rss },
                      ].map(({ label, val, max }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">{label}</span>
                            <span className="font-bold text-slate-700">{val} MB</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full">
                            <div className="h-2 bg-blue-400 rounded-full" style={{ width: `${Math.min((val / (max || 1)) * 100, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data files */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Data Files</p>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> users.json</span>
                        <span className="font-bold text-slate-800">{health.dataFiles.users} users</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> recipes.json</span>
                        <span className="font-bold text-slate-800">{health.dataFiles.recipes} recipes</span>
                      </div>
                    </div>
                  </div>

                  {/* API Keys */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Environment / API Keys</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Gemini API Key', ok: health.env.hasGeminiKey },
                        { label: 'Google Search Key', ok: health.env.hasGoogleSearch },
                        { label: 'SMTP Email', ok: health.env.hasSmtp },
                      ].map(({ label, ok }) => (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Wifi className="w-3.5 h-3.5" /> {label}
                          </span>
                          <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', ok ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
                            {ok ? '✓ Configured' : '✗ Missing'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!health && <p className="text-sm text-slate-400">Đang tải dữ liệu hệ thống...</p>}
            </div>
          )}

        </main>
      </div>

      {/* Recipe Modal */}
      {recipeModal.open && (
        <RecipeModal
          recipe={recipeModal.recipe}
          onClose={() => setRecipeModal({ open: false })}
          onSave={handleSaveRecipe}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
