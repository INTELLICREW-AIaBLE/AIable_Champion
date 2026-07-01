'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Bell, Lock, Key, Globe, Moon, Shield, Sparkles, Monitor, KeyRound, Smartphone } from 'lucide-react';

const t = {
  vi: {
    title: 'Cài đặt',
    desc: 'Quản lý cấu hình tài khoản và trải nghiệm của bạn',
    tabs: { account: 'Tài khoản', prefs: 'Giao diện & Ngôn ngữ', notifs: 'Thông báo', keys: 'API Keys' },
    account: {
      title: 'Đổi mật khẩu',
      curr: 'Mật khẩu hiện tại',
      new: 'Mật khẩu mới',
      confirm: 'Xác nhận mật khẩu mới',
      update: 'Cập nhật mật khẩu',
      forgot: 'Quên mật khẩu hiện tại?',
      success: 'Mật khẩu đã được cập nhật!',
      errorMismatch: 'Mật khẩu mới không khớp!',
      errorEmpty: 'Vui lòng nhập đầy đủ thông tin!'
    },
    prefs: {
      themeTitle: 'Giao diện (Theme)',
      light: 'Sáng (Light)',
      dark: 'Tối (Dark)',
      langTitle: 'Ngôn ngữ (Language)',
    },
    keys: {
      title: 'Cấu hình API Keys',
      desc: 'Kết nối trực tiếp tài khoản của bạn với các nhà cung cấp AI. Key được lưu trữ cục bộ (Local Storage).',
      connected: 'Đã kết nối',
      unconnected: 'Chưa kết nối',
      saveBtn: 'Lưu cấu hình API',
      success: '🎉 Đã lưu API Keys thành công!',
      fail: 'Lưu thất bại'
    },
    notifs: {
      title: 'Tuỳ chọn thông báo',
      sys: 'Thông báo hệ thống',
      sysDesc: 'Cập nhật tính năng mới, bảo trì hệ thống',
      ai: 'Hoạt động AI',
      aiDesc: 'Khi Optimize hoặc Match task hoàn tất',
      marketing: 'Email Marketing',
      marketingDesc: 'Nhận tips và recipes AI mới nhất qua email'
    },
    alertLang: 'Ngôn ngữ đã được cập nhật cho trang này.'
  },
  en: {
    title: 'Settings',
    desc: 'Manage your account configuration and experience',
    tabs: { account: 'Account', prefs: 'Appearance & Language', notifs: 'Notifications', keys: 'API Keys' },
    account: {
      title: 'Change Password',
      curr: 'Current Password',
      new: 'New Password',
      confirm: 'Confirm New Password',
      update: 'Update Password',
      forgot: 'Forgot current password?',
      success: 'Password updated successfully!',
      errorMismatch: 'New passwords do not match!',
      errorEmpty: 'Please fill in all fields!'
    },
    prefs: {
      themeTitle: 'Theme',
      light: 'Light',
      dark: 'Dark',
      langTitle: 'Language',
    },
    keys: {
      title: 'API Keys Configuration',
      desc: 'Connect your account directly with AI providers. Keys are stored locally (Local Storage).',
      connected: 'Connected',
      unconnected: 'Not Connected',
      saveBtn: 'Save API Config',
      success: '🎉 API Keys saved successfully!',
      fail: 'Save failed'
    },
    notifs: {
      title: 'Notification Preferences',
      sys: 'System Notifications',
      sysDesc: 'New feature updates, system maintenance',
      ai: 'AI Activity',
      aiDesc: 'When Optimize or Match task completes',
      marketing: 'Email Marketing',
      marketingDesc: 'Receive latest AI tips and recipes via email'
    },
    alertLang: 'Language has been updated for this page.'
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [apiKeys, setApiKeys] = useState({ openai: '', anthropic: '', gemini: '' });
  
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('vi');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
  };

  const currentLang = (lang === 'en' ? 'en' : 'vi') as 'en' | 'vi';
  const text = t[currentLang];

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert(text.account.errorEmpty);
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(text.account.errorMismatch);
      return;
    }
    // TODO: Connect to backend password update endpoint
    alert(text.account.success);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
        alert(text.keys.success);
      } else {
        alert(data.message || text.keys.fail);
      }
    } catch (e) {
      alert(text.keys.fail);
    }
  };

  const tabs = [
    { id: 'account', label: text.tabs.account, icon: Shield },
    { id: 'preferences', label: text.tabs.prefs, icon: Monitor },
    { id: 'notifications', label: text.tabs.notifs, icon: Bell },
    { id: 'api_keys', label: text.tabs.keys, icon: KeyRound },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{text.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{text.desc}</p>
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
                <h2 className="text-lg font-bold text-slate-900 mb-4">{text.account.title}</h2>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{text.account.curr}</label>
                      <Link href="/forgot-password" className="text-xs text-violet-600 font-semibold hover:underline">{text.account.forgot}</Link>
                    </div>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{text.account.new}</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{text.account.confirm}</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <button onClick={handleUpdatePassword} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition">
                    {text.account.update}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Giao diện ── */}
          {activeTab === 'preferences' && (
            <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">{text.prefs.themeTitle}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleThemeChange('light')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition ${theme === 'light' ? 'border-violet-500 bg-slate-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                  >
                    {theme === 'light' && <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-transparent pointer-events-none" />}
                    <Monitor className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-violet-600' : 'text-slate-400'}`} />
                    <p className={`font-semibold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-500'}`}>{text.prefs.light}</p>
                  </div>
                  
                  <div 
                    onClick={() => handleThemeChange('dark')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition ${theme === 'dark' ? 'border-violet-500 bg-slate-900' : 'border-slate-100 hover:border-slate-800 hover:bg-slate-800 bg-slate-900'}`}
                  >
                    <Moon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-violet-400' : 'text-slate-400'}`} />
                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-300'}`}>{text.prefs.dark}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">{text.prefs.langTitle}</h2>
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
                <h2 className="text-lg font-bold text-slate-900 mb-2">{text.keys.title}</h2>
                <p className="text-sm text-slate-500 mb-6">{text.keys.desc}</p>
                
                <div className="space-y-4">
                  {/* OpenAI */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#00A67E] flex items-center justify-center"><Sparkles className="w-3 h-3 text-white"/></div>
                        <span className="font-bold text-sm text-slate-800">OpenAI (GPT-4)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apiKeys.openai ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {apiKeys.openai ? text.keys.connected : text.keys.unconnected}
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

                  <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#D97757] flex items-center justify-center"><Sparkles className="w-3 h-3 text-white"/></div>
                        <span className="font-bold text-sm text-slate-800">Anthropic (Claude)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apiKeys.anthropic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {apiKeys.anthropic ? text.keys.connected : text.keys.unconnected}
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
                        {apiKeys.gemini ? text.keys.connected : text.keys.unconnected}
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
                    {text.keys.saveBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Thông báo ── */}
          {activeTab === 'notifications' && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{text.notifs.title}</h2>
              
              <div className="space-y-4">
                {[
                  { title: text.notifs.sys, desc: text.notifs.sysDesc, checked: true },
                  { title: text.notifs.ai, desc: text.notifs.aiDesc, checked: true },
                  { title: text.notifs.marketing, desc: text.notifs.marketingDesc, checked: false },
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
