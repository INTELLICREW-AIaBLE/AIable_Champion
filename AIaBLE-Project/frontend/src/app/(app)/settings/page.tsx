'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Bell, Lock, Key, Globe, Moon, Shield, Sparkles, Monitor, KeyRound, Smartphone } from 'lucide-react';
import { addNotification } from '@/lib/notifications';

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
      saveBtn: 'Lưu thay đổi',
      success: 'Đã lưu cài đặt giao diện và ngôn ngữ!'
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
      marketingDesc: 'Nhận tips và recipes AI mới nhất qua email',
      saveBtn: 'Lưu tuỳ chọn',
      success: 'Đã lưu cấu hình thông báo!'
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
      saveBtn: 'Save Changes',
      success: 'Appearance and language settings saved!'
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
      marketingDesc: 'Receive latest AI tips and recipes via email',
      saveBtn: 'Save Preferences',
      success: 'Notification settings saved!'
    },
    alertLang: 'Language has been updated for this page.'
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('vi');
  const [draftTheme, setDraftTheme] = useState('light');
  const [draftLang, setDraftLang] = useState('vi');
  const [notifs, setNotifs] = useState({ sys: true, ai: true, marketing: false });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') || 'light';
    const savedLang = localStorage.getItem('app_lang') || 'vi';
    setTheme(savedTheme);
    setDraftTheme(savedTheme);
    
    setLang(savedLang);
    setDraftLang(savedLang);
  }, []);

  const handleSavePreferences = () => {
    setTheme(draftTheme);
    localStorage.setItem('app_theme', draftTheme);
    if (draftTheme === 'dark') {
      document.documentElement.classList.add('dark-mode-active');
    } else {
      document.documentElement.classList.remove('dark-mode-active');
    }

    setLang(draftLang);
    localStorage.setItem('app_lang', draftLang);
    window.dispatchEvent(new Event('app_lang_changed'));

    const currentText = t[draftLang as 'en' | 'vi'];
    alert(currentText.prefs.success);
    addNotification('Cập nhật cài đặt', currentText.prefs.success);
  };

  const handleSaveNotifs = () => {
    // In a real app, send `notifs` to backend here
    const currentText = t[lang as 'en' | 'vi'];
    alert(currentText.notifs.success);
    addNotification('Cập nhật thông báo', currentText.notifs.success);
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
    addNotification('Bảo mật', text.account.success);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'account', label: text.tabs.account, icon: Shield },
    { id: 'preferences', label: text.tabs.prefs, icon: Monitor },
    { id: 'notifications', label: text.tabs.notifs, icon: Bell },
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
                    onClick={() => setDraftTheme('light')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition ${draftTheme === 'light' ? 'border-violet-500 bg-slate-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                  >
                    {draftTheme === 'light' && <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-transparent pointer-events-none" />}
                    <Monitor className={`w-6 h-6 mb-2 ${draftTheme === 'light' ? 'text-violet-600' : 'text-slate-400'}`} />
                    <p className={`font-semibold text-sm ${draftTheme === 'light' ? 'text-slate-900' : 'text-slate-500'}`}>{text.prefs.light}</p>
                  </div>
                  
                  <div 
                    onClick={() => setDraftTheme('dark')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer relative overflow-hidden transition ${draftTheme === 'dark' ? 'border-violet-500 bg-slate-900' : 'border-slate-100 hover:border-slate-800 hover:bg-slate-800 bg-slate-900'}`}
                  >
                    <Moon className={`w-6 h-6 mb-2 ${draftTheme === 'dark' ? 'text-violet-400' : 'text-slate-400'}`} />
                    <p className={`font-semibold text-sm ${draftTheme === 'dark' ? 'text-white' : 'text-slate-300'}`}>{text.prefs.dark}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">{text.prefs.langTitle}</h2>
                <select 
                  value={draftLang}
                  onChange={(e) => setDraftLang(e.target.value)}
                  className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-medium bg-white text-slate-900"
                >
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSavePreferences} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-violet-200">
                  {text.prefs.saveBtn}
                </button>
              </div>
            </div>
          )}



          {/* ── Tab: Thông báo ── */}
          {activeTab === 'notifications' && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{text.notifs.title}</h2>
              
              <div className="space-y-4">
                {[
                  { id: 'sys', title: text.notifs.sys, desc: text.notifs.sysDesc },
                  { id: 'ai', title: text.notifs.ai, desc: text.notifs.aiDesc },
                  { id: 'marketing', title: text.notifs.marketing, desc: text.notifs.marketingDesc },
                ].map((item) => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        checked={notifs[item.id as keyof typeof notifs]} 
                        onChange={(e) => setNotifs({...notifs, [item.id]: e.target.checked})}
                      />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSaveNotifs} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-violet-200">
                  {text.notifs.saveBtn}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
