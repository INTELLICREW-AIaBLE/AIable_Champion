'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, X } from 'lucide-react';
import {
  User, Settings, BookOpen, FolderOpen, Bell, HelpCircle, LogOut,
  Wand2, GitBranch, ShieldCheck, Code2, FileText, Presentation, Home,
  Sparkles, Keyboard, Moon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ─── Search Data ──────────────────────────────────────────────────────────────
type SearchCategory = 'page' | 'tool' | 'recipe';
interface SearchItem {
  id: string;
  category: SearchCategory;
  label: string;
  description?: string;
  href: string;
  icon: React.ElementType;
  tag?: string;
}

const SEARCH_DATA: SearchItem[] = [
  // Pages
  { id: 'home', category: 'page', label: 'Home', description: 'Trang chủ dashboard', href: '/home', icon: Home },
  { id: 'projects', category: 'page', label: 'Projects', description: 'Quản lý dự án của bạn', href: '/projects', icon: FolderOpen },
  { id: 'settings', category: 'page', label: 'Settings', description: 'Cài đặt tài khoản', href: '/settings', icon: Settings },
  { id: 'profile', category: 'page', label: 'Profile', description: 'Thông tin cá nhân', href: '/profile', icon: User },
  // Tools
  { id: 'optimizer', category: 'tool', label: 'Optimize Prompt', description: 'Tối ưu hoá raw prompts của bạn', href: '/optimizer', icon: Wand2 },
  { id: 'task-matcher', category: 'tool', label: 'Match Task', description: 'Ghép task với AI workflow phù hợp', href: '/task-matcher', icon: GitBranch },
  { id: 'validator', category: 'tool', label: 'Verify Output', description: 'Kiểm tra kết quả AI với nguồn', href: '/validator', icon: ShieldCheck },
  { id: 'sandbox', category: 'tool', label: 'AI Sandbox', description: 'So sánh kết quả từ nhiều model AI', href: '/sandbox', icon: Sparkles },
  { id: 'recipes-all', category: 'tool', label: 'Browse Recipes', description: 'Khám phá thư viện AI Recipe', href: '/recipes', icon: BookOpen },
  // Recipes
  { id: 'r1', category: 'recipe', label: 'Debug code Python step-by-step', description: 'Coding · Best: Claude', href: '/recipes', icon: Code2, tag: 'CODING' },
  { id: 'r2', category: 'recipe', label: 'Giải thuật toàn tử đề thi', description: 'Coding · Best: GPT-4', href: '/recipes', icon: Code2, tag: 'CODING' },
  { id: 'r3', category: 'recipe', label: 'Báo cáo môn học theo chuẩn APA', description: 'Report · Best: Claude', href: '/recipes', icon: FileText, tag: 'REPORT' },
  { id: 'r4', category: 'recipe', label: 'Tổng kết dự án phần mềm', description: 'Report · Best: GPT-4', href: '/recipes', icon: FileText, tag: 'REPORT' },
  { id: 'r5', category: 'recipe', label: 'Thiết kế slide thuyết trình', description: 'Slide · Best: Claude', href: '/recipes', icon: Presentation, tag: 'SLIDE' },
  { id: 'r6', category: 'recipe', label: 'Viết unit test cho function', description: 'Coding · Best: Gemini', href: '/recipes', icon: Code2, tag: 'CODING' },
];

const CATEGORY_LABEL: Record<SearchCategory, string> = {
  page: 'Trang',
  tool: 'Công cụ',
  recipe: 'Recipes',
};

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-violet-100 text-violet-700 rounded px-0.5 not-italic font-semibold">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Neural Net Decoration ────────────────────────────────────────────────────
function NeuralNetDot({ cx, cy, r = 3.5, opacity = 1 }: { cx: number; cy: number; r?: number; opacity?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="#8B5CF6" opacity={opacity} />;
}
function NeuralNetworkDecor({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="180" height="48" viewBox="0 0 180 48" className="opacity-25 select-none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <line x1="8" y1="24" x2="40" y2="8" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="8" y1="24" x2="40" y2="40" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="40" y1="8" x2="90" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="40" y1="40" x2="90" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="90" y1="24" x2="140" y2="8" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="90" y1="24" x2="140" y2="40" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="140" y1="8" x2="172" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <line x1="140" y1="40" x2="172" y2="24" stroke="#8B5CF6" strokeWidth="1" />
      <NeuralNetDot cx={8} cy={24} r={4} />
      <NeuralNetDot cx={40} cy={8} r={3.5} />
      <NeuralNetDot cx={40} cy={40} r={3.5} />
      <NeuralNetDot cx={90} cy={24} r={5} />
      <NeuralNetDot cx={140} cy={8} r={3.5} />
      <NeuralNetDot cx={140} cy={40} r={3.5} />
      <NeuralNetDot cx={172} cy={24} r={4} />
      <NeuralNetDot cx={25} cy={14} r={2} opacity={0.6} />
      <NeuralNetDot cx={60} cy={35} r={2} opacity={0.6} />
      <NeuralNetDot cx={115} cy={14} r={2} opacity={0.6} />
      <NeuralNetDot cx={158} cy={38} r={2} opacity={0.5} />
    </svg>
  );
}

// ─── User menu items ──────────────────────────────────────────────────────────
const menuItems = [
  { icon: User, label: 'Thông tin cá nhân', href: '/profile', dividerAfter: false },
  { icon: Bell, label: 'Thông báo', href: '/notifications', dividerAfter: false },
  { icon: Sparkles, label: "What's New", href: '/changelog', dividerAfter: false },
  { icon: Settings, label: 'Cài đặt', href: '/settings', dividerAfter: true },
  { icon: Keyboard, label: 'Phím tắt', href: '/shortcuts', dividerAfter: false },
  { icon: HelpCircle, label: 'Trợ giúp', href: '/help', dividerAfter: false },
];

// ─── AppNavbar ────────────────────────────────────────────────────────────────
export function AppNavbar() {
  const router = useRouter();

  // Avatar dropdown
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // User Profile
  const { userProfile, loading: profileLoading } = useAuth();
  const initials = userProfile.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() || 'U';

  // Search
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length === 0
    ? []
    : SEARCH_DATA.filter(
      (item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
    );

  const grouped = (['page', 'tool', 'recipe'] as SearchCategory[])
    .map((cat) => ({ cat, items: results.filter((r) => r.category === cat) }))
    .filter((g) => g.items.length > 0);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setActiveIdx(-1);
  }, []);

  const selectItem = useCallback((item: SearchItem) => {
    router.push(item.href);
    setQuery('');
    closeSearch();
    inputRef.current?.blur();
  }, [router, closeSearch]);

  // Click outside handler
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) closeSearch();
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closeSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      selectItem(results[activeIdx]);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  const handleLogout = () => {
    setAvatarOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-14 items-center px-4 gap-2">

        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2.5 shrink-0 w-52 group">
          <Image src="/logo.png" alt="AIaBLE Logo" width={36} height={36} priority className="rounded-lg" />
          <div className="font-bold text-xl">
            <span className="text-black">Ala</span>
            <span className="text-purple-600">BLE</span>
          </div>
        </Link>

        {/* Neural Network decoration */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <NeuralNetworkDecor />
          <NeuralNetworkDecor flip />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* ── Search ── */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                id="navbar-search"
                type="text"
                value={query}
                placeholder="Search..."
                autoComplete="off"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                  setActiveIdx(-1);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleKeyDown}
                className="h-8 w-52 rounded-md border border-slate-200 bg-slate-50 pl-8 pr-8 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent focus:w-64 transition-all duration-200"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setActiveIdx(-1); inputRef.current?.focus(); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {searchOpen && query.trim().length > 0 && (
              <div className="absolute right-0 mt-1.5 w-80 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 py-2 z-50 max-h-[420px] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Không tìm thấy kết quả</p>
                    <p className="text-xs text-slate-400 mt-1">Thử từ khoá khác</p>
                  </div>
                ) : (
                  <>
                    {grouped.map(({ cat, items }) => (
                      <div key={cat}>
                        <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          {CATEGORY_LABEL[cat]}
                        </p>
                        {items.map((item) => {
                          const globalIdx = results.indexOf(item);
                          const isActive = globalIdx === activeIdx;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onMouseDown={() => selectItem(item)}
                              onMouseEnter={() => setActiveIdx(globalIdx)}
                              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition group ${isActive ? 'bg-violet-50' : 'hover:bg-slate-50'
                                }`}
                            >
                              <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition ${isActive
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600'
                                }`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium truncate ${isActive ? 'text-violet-700' : 'text-slate-800'}`}>
                                  <Highlight text={item.label} query={query} />
                                </p>
                                {item.description && (
                                  <p className="text-xs text-slate-400 truncate">
                                    <Highlight text={item.description} query={query} />
                                  </p>
                                )}
                              </div>
                              {item.tag && (
                                <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                  {item.tag}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}

                    {/* Footer keyboard hints */}
                    <div className="px-4 pt-2 pb-1 border-t border-slate-100 mt-1 flex items-center gap-3 text-[10px] text-slate-400">
                      <span><kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500">↑↓</kbd> điều hướng</span>
                      <span><kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500">Enter</kbd> chọn</span>
                      <span><kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500">Esc</kbd> đóng</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── User Avatar + Dropdown ── */}
          <div className="relative" ref={avatarRef}>
            <button
              id="btn-user-avatar"
              onClick={() => setAvatarOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 group"
              aria-haspopup="true"
              aria-expanded={avatarOpen}
            >
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-violet-200 ring-2 ring-white group-hover:ring-violet-200 transition overflow-hidden bg-cover bg-center ignore-dark-mode"
                style={userProfile.avatar ? { backgroundImage: `url(${userProfile.avatar})` } : {}}>
                {!userProfile.avatar && initials}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${avatarOpen ? 'rotate-180' : ''}`} />
            </button>

            {avatarOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden bg-cover bg-center ignore-dark-mode"
                      style={userProfile.avatar ? { backgroundImage: `url(${userProfile.avatar})` } : {}}>
                      {!userProfile.avatar && initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{userProfile.name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                    </div>
                  </div>
                </div>

                {menuItems.map(({ icon: Icon, label, href, dividerAfter }) => (
                  <div key={href}>
                    <Link
                      href={href}
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition group"
                    >
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition" />
                      {label}
                    </Link>
                    {dividerAfter && <div className="my-1.5 h-px bg-slate-100 mx-2" />}
                  </div>
                ))}

                <div className="my-1.5 h-px bg-slate-100 mx-2" />

                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition group"
                >
                  <LogOut className="w-4 h-4 group-hover:text-red-600 transition" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
