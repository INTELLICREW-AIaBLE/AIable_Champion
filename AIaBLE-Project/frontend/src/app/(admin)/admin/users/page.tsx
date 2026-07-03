'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, ShieldAlert, Check, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/admin/users`, { headers: authHeaders() });
      const j = await r.json();
      if (j.success) setUsers(j.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa user này vĩnh viễn?')) return;
    try {
      const r = await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
      const j = await r.json();
      if (j.success) { 
        showToast('Đã xóa user thành công'); 
        fetchUsers(); 
      } else {
        showToast(j.message, 'error');
      }
    } catch (e) {
      showToast('Lỗi khi xóa user', 'error');
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const r = await fetch(`${API}/api/admin/users/${id}/role`, {
        method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ role }),
      });
      const j = await r.json();
      if (j.success) { 
        showToast('Cập nhật quyền thành công'); 
        fetchUsers(); 
      } else {
        showToast(j.message, 'error');
      }
    } catch (e) {
      showToast('Lỗi khi cập nhật quyền', 'error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500 mt-1">Tổng cộng {users.length} tài khoản trên hệ thống</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 w-full sm:w-72 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-50 transition-all shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700 font-medium" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                {['Tên / Email', 'Quyền (Role)', 'Tương tác', 'Đã lưu', 'Đăng nhập', 'Hành động'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-semibold">Đang tải danh sách...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <UserX className="w-10 h-10 text-slate-300" />
                      <p className="font-semibold text-base text-slate-500">Không tìm thấy tài khoản nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900 text-sm">{u.fullName}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{u.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <select 
                        value={u.role || 'user'} 
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className={cn(
                          'text-xs font-black px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition',
                          u.role === 'admin' 
                            ? 'bg-violet-50 text-violet-700 border-violet-200 focus:ring-violet-100 hover:bg-violet-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 focus:ring-slate-100 hover:bg-slate-100'
                        )}
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-600">
                      {u.historyCount} <span className="font-medium text-slate-400">lần</span>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-600">
                      {u.savedRecipesCount} <span className="font-medium text-slate-400">công thức</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider', 
                        u.isGoogleUser ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      )}>
                        {u.isGoogleUser ? 'Google' : 'Mật khẩu'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        title="Xóa tài khoản"
                        className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 focus:ring-4 focus:ring-red-50 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold text-white animate-in slide-in-from-bottom-4',
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
        )}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
