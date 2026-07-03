'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Edit3, Trash2, Check, ShieldAlert, BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

const CATEGORIES = ['CODING','REPORT','SLIDE','RESEARCH','WRITING','PLANNING','MATH','ENGLISH',
  'BUSINESS','DESIGN','DATA','LAW','ECONOMICS','CREATIVE','MARKETING','HR','PSYCHOLOGY','SCIENCE','HISTORY','CAREER','AI_PROMPTING'];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-600" />
            {recipe ? 'Chỉnh sửa Recipe' : 'Tạo Recipe mới'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">ID (Unique)</label>
              <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition font-mono" placeholder="vd: coding-001" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Best AI</label>
              <select value={form.bestAI} onChange={e => setForm(f => ({ ...f, bestAI: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition cursor-pointer">
                {['Gemini','Groq','OpenRouter'].map(ai => <option key={ai}>{ai}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Tiêu đề (Title) *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition font-semibold text-slate-800" placeholder="Nhập tiêu đề prompt..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Danh mục (Category) *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition cursor-pointer">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Tags (cách nhau dấu phẩy)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition" placeholder="react, nextjs, typescript" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Mô tả ngắn (Description) *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition resize-none text-slate-700" placeholder="Mô tả công dụng của prompt này..." />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Nội dung Prompt *</label>
            <textarea value={form.prompt} onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
              rows={6} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition resize-none font-mono text-slate-800 leading-relaxed bg-slate-50" placeholder="Viết nội dung prompt ở đây. Dùng [Biến] nếu cần..." />
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm">
            Hủy bỏ
          </button>
          <button
            onClick={() => onSave({ ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) })}
            className="flex-1 py-3 rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/20 transition"
          >
            {recipe ? 'Lưu thay đổi' : 'Tạo Recipe'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [modal, setModal] = useState<{ open: boolean; recipe?: any }>({ open: false });
  const [confirmAction, setConfirmAction] = useState<{ id: string; name: string } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const r = await fetch(`${API}/api/admin/recipes?${params}`, { headers: authHeaders() });
      const j = await r.json();
      if (j.success) setRecipes(j.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSaveRecipe = async (data: any) => {
    const isEdit = !!modal.recipe;
    const url = isEdit ? `${API}/api/admin/recipes/${modal.recipe.id}` : `${API}/api/admin/recipes`;
    const method = isEdit ? 'PUT' : 'POST';
    
    try {
      const r = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(data) });
      const j = await r.json();
      if (j.success) {
        showToast(isEdit ? 'Đã cập nhật Recipe' : 'Đã tạo Recipe mới');
        setModal({ open: false });
        fetchRecipes();
      } else {
        showToast(j.message || 'Có lỗi xảy ra', 'error');
      }
    } catch (e) {
      showToast('Lỗi mạng', 'error');
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      const r = await fetch(`${API}/api/admin/recipes/${id}`, { method: 'DELETE', headers: authHeaders() });
      const j = await r.json();
      if (j.success) { 
        showToast('Đã xóa Recipe thành công'); 
        fetchRecipes(); 
      } else {
        showToast(j.message, 'error');
      }
    } catch (e) {
      showToast('Lỗi khi xóa', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Thư viện Prompt</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý {recipes.length} công thức AI trên hệ thống</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-50 transition-all shadow-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Tìm tên, ID..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-slate-400 font-medium" 
            />
          </div>
          
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:border-violet-500 shadow-sm cursor-pointer"
          >
            <option value="All">Tất cả danh mục</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <button 
            onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700 shadow-sm hover:shadow-violet-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Thêm mới
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                {['ID / Tiêu đề', 'Danh mục', 'Best AI', 'Tags', 'Hành động'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-semibold">Đang tải thư viện...</td>
                </tr>
              ) : recipes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <BookOpen className="w-10 h-10 text-slate-300" />
                      <p className="font-semibold text-base text-slate-500">Không tìm thấy Recipe nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recipes.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4 max-w-sm">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{r.title}</p>
                      <p className="text-xs text-slate-400 font-mono mt-1">{r.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100 tracking-wide uppercase">
                        {r.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <div className={cn('w-2 h-2 rounded-full', r.bestAI === 'Gemini' ? 'bg-blue-500' : 'bg-orange-500')} />
                        {r.bestAI}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {r.tags?.slice(0, 3).map((t: string) => (
                          <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {t}
                          </span>
                        ))}
                        {r.tags?.length > 3 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-slate-400">+{r.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setModal({ open: true, recipe: r })}
                          title="Chỉnh sửa Recipe"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 hover:border-violet-300"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => setConfirmAction({ id: r.id, name: r.title })}
                          title="Xóa Recipe vĩnh viễn"
                          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <RecipeModal
          recipe={modal.recipe}
          onClose={() => setModal({ open: false })}
          onSave={handleSaveRecipe}
        />
      )}

      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold text-white animate-in slide-in-from-bottom-4',
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
        )}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 mb-2">Xác nhận Xóa Recipe</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa công thức <span className="font-bold text-slate-700">"{confirmAction.name}"</span> vĩnh viễn không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  handleDeleteRecipe(confirmAction.id);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white transition shadow-sm bg-red-600 hover:bg-red-700"
              >
                Đồng ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
