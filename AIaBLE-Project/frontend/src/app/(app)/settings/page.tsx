'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Lock, Key, Globe, Moon, Shield, Sparkles, Monitor, KeyRound, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [apiKeys, setApiKeys] = useState({ openai: '', anthropic: '', gemini: '' });
  
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data?.apiKeys) {
          setApiKeys(data.data.apiKeys);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();

    setTheme(localStorage.getItem('app_theme') || 'light');
    setLang(localStorage.getItem('app_lang') || 'vi');
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-mode-active');
    } else {
      document.documentElement.classList.remove('dark-mode-active');
    }
  };

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
    alert('Ngôn ngữ đã được cập nhật. (Trong bản MVP các label sẽ tự dịch sau).');
  };

  const handleSaveApiKeys = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ apiKeys })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('openaiKey', apiKeys.openai);
        localStorage.setItem('anthropicKey', apiKeys.anthropic);
        localStorage.setItem('geminiKey', apiKeys.gemini);
        alert('🎉 Đã lưu API Keys thành công! Các models sẽ sử dụng key này ngay lập tức.');
      } else {
        alert(data.message || 'Lưu thất bại');
      }
    } catch (e) {
      alert('Lỗi kết nối');
    }
  };

  const tabs = [
    { id: 'account', label: 'Tài khoản', icon: Shield },
    { id: 'preferences', label: 'Giao diện & Ngôn ngữ', icon: Monitor },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'api_keys', label: 'API Keys', icon: KeyRound },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Cài đặt</h1>
          <p className="text-slate-500 text-sm mt-0.5">Quản lý cấu hình tài khoản và trải nghiệm của bạn</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive 
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-200' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-200' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          
          {/* ── Tab: Tài Khoản ── */}
          {activeTab === 'account' && (
            <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Đổi mật khẩu</h2>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu hiện tại</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition">
                    Cập nhật mật khẩu
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div>
                <h2 className="text-lg font-bold text-red-600 mb-2">Xoá tài khoản</h2>
                <p className="text-sm text-slate-500 mb-4">Lưu ý: Hành động này không thể hoàn tác. Mọi dữ liệu sẽ bị xoá vĩnh viễn.</p>
                <button className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition border border-red-100">
                  Xoá tài khoản của tôi
                </button>
              </div>
            </div>
          )}

          {/* ── Tab: Giao diện ── */}
          {activeTab === 'preferences' && (
            <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Giao diện (Theme)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleThemeChange('light')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition ${theme === 'light' ? 'border-violet-500 bg-slate-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                  >
                    {theme === 'light' && <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-transparent pointer-events-none" />}
                    <Monitor className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-violet-600' : 'text-slate-400'}`} />
                    <p className={`font-semibold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-500'}`}>Sáng (Light)</p>
                  </div>
                  
                  <div 
                    onClick={() => handleThemeChange('dark')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition ${theme === 'dark' ? 'border-violet-500 bg-slate-900' : 'border-slate-100 hover:border-slate-800 hover:bg-slate-800 bg-slate-900'}`}
                  >
                    <Moon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-violet-400' : 'text-slate-400'}`} />
                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-300'}`}>Tối (Dark)</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Ngôn ngữ</h2>
                <select 
                  value={lang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-medium bg-white text-slate-900"
                >
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                  <option value="en">English (US)</option>
                  <option value="ja">日本語 (Japanese)</option>
                </select>
              </div>
            </div>
          )}

          {/* ── Tab: API Keys ── */}
          {activeTab === 'api_keys' && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Cấu hình API Keys</h2>
                <p className="text-sm text-slate-500 mb-6">Kết nối trực tiếp tài khoản của bạn với các nhà cung cấp AI. Key được lưu trữ cục bộ (Local Storage).</p>
                
                <div className="space-y-4">
                  {/* OpenAI */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#00A67E] flex items-center justify-center"><Sparkles className="w-3 h-3 text-white"/></div>
                        <span className="font-bold text-sm text-slate-800">OpenAI (GPT-4)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apiKeys.openai ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {apiKeys.openai ? 'Đã kết nối' : 'Chưa kết nối'}
                      </span>
                    </div>
                    <input 
                      type="password" 
                      value={apiKeys.openai} 
                      onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                      placeholder="sk-proj-..." 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-violet-400" 
                    />
                  </div>

                  {/* Anthropic */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#D97757] flex items-center justify-center"><Sparkles className="w-3 h-3 text-white"/></div>
                        <span className="font-bold text-sm text-slate-800">Anthropic (Claude)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apiKeys.anthropic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {apiKeys.anthropic ? 'Đã kết nối' : 'Chưa kết nối'}
                      </span>
                    </div>
                    <input 
                      type="password" 
                      value={apiKeys.anthropic} 
                      onChange={(e) => setApiKeys({...apiKeys, anthropic: e.target.value})}
                      placeholder="sk-ant-..." 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-violet-400" 
                    />
                  </div>

                  {/* Google */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#4285F4] flex items-center justify-center"><Sparkles className="w-3 h-3 text-white"/></div>
                        <span className="font-bold text-sm text-slate-800">Google (Gemini)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apiKeys.gemini ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {apiKeys.gemini ? 'Đã kết nối' : 'Chưa kết nối'}
                      </span>
                    </div>
                    <input 
                      type="password" 
                      value={apiKeys.gemini} 
                      onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                      placeholder="AIzaSy..." 
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-violet-400" 
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={handleSaveApiKeys} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-violet-200">
                    Lưu cấu hình API
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Thông báo ── */}
          {activeTab === 'notifications' && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Tuỳ chọn thông báo</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'Thông báo hệ thống', desc: 'Cập nhật tính năng mới, bảo trì hệ thống', checked: true },
                  { title: 'Hoạt động AI', desc: 'Khi Optimize hoặc Match task hoàn tất', checked: true },
                  { title: 'Email Marketing', desc: 'Nhận tips và recipes AI mới nhất qua email', checked: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input type="checkbox" className="peer sr-only" defaultChecked={item.checked} />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
