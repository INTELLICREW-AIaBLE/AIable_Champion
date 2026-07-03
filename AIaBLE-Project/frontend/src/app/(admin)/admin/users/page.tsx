'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, ShieldAlert, Check, UserX, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'lock';
    id: string;
    name: string;
    isLocked?: boolean;
  } | null>(null);

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

  const handleLockUser = async (id: string) => {
    try {
      const r = await fetch(`${API}/api/admin/users/${id}/lock`, { method: 'PATCH', headers: authHeaders() });
      const j = await r.json();
      if (j.success) { 
        showToast(j.message); 
        fetchUsers(); 
      } else {
        showToast(j.message, 'error');
      }
    } catch (e) {
      showToast('Lỗi khi khóa/mở user', 'error');
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
          <input maxLength={100} 
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
                {['Tên / Email', 'Quyền (Role)', 'Tương tác', 'Đã lưu', 'Trạng thái', 'Hành động'].map(h => (
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
                      <div className="flex gap-2">
                        <span className={cn(
                          'text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider', 
                          u.isGoogleUser ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        )}>
                          {u.isGoogleUser ? 'Google' : 'Mật khẩu'}
                        </span>
                        {u.isLocked && (
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                            Đã khóa
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setConfirmAction({ type: 'lock', id: u.id, name: u.fullName, isLocked: u.isLocked })}
                          title={u.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm",
                            u.isLocked 
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300" 
                              : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:border-amber-300"
                          )}
                        >
                          {u.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          {u.isLocked ? "Mở khóa" : "Khóa"}
                        </button>
                        <button 
                          onClick={() => setConfirmAction({ type: 'delete', id: u.id, name: u.fullName })}
                          title="Xóa tài khoản vĩnh viễn"
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
            <h3 className="text-lg font-black text-slate-900 mb-2">
              {confirmAction.type === 'delete' ? 'Xác nhận Xóa User' : (confirmAction.isLocked ? 'Xác nhận Mở Khóa User' : 'Xác nhận Khóa User')}
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {confirmAction.type === 'delete' 
                ? `Bạn có chắc chắn muốn xóa tài khoản "${confirmAction.name}" vĩnh viễn không? Thao tác này không thể hoàn tác.`
                : `Bạn có chắc chắn muốn ${confirmAction.isLocked ? 'mở khóa' : 'khóa'} tài khoản "${confirmAction.name}" không?`
              }
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
                  if (confirmAction.type === 'delete') handleDeleteUser(confirmAction.id);
                  else handleLockUser(confirmAction.id);
                  setConfirmAction(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold text-white transition shadow-sm",
                  confirmAction.type === 'delete' ? "bg-red-600 hover:bg-red-700" : (confirmAction.isLocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700")
                )}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
