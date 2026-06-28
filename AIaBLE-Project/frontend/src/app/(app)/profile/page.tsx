'use client';

import { useState, useEffect } from 'react';
// ... (imports remain mostly same but I am doing exact replace so I must be careful)
import {
  Camera, Edit3, Check, X, MapPin, Mail, Calendar, Link2,
  Wand2, GitBranch, BookOpen, ShieldCheck, Star, Zap, Award,
  TrendingUp, Clock, Code2, FileText, Presentation, Copy,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Projects',        value: 12,   icon: GitBranch, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Recipes Used',    value: 48,   icon: BookOpen,  color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { label: 'Prompts Optimized', value: 137, icon: Wand2,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Outputs Verified', value: 64,  icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const BADGES = [
  { label: 'Early Adopter',    icon: Star,      color: 'from-amber-400 to-orange-500',   desc: 'Tham gia từ những ngày đầu' },
  { label: 'Power User',       icon: Zap,       color: 'from-violet-500 to-purple-600',  desc: 'Sử dụng hơn 100 prompts' },
  { label: 'Top Contributor',  icon: Award,     color: 'from-emerald-400 to-teal-500',   desc: 'Đóng góp recipe nổi bật' },
  { label: 'Prompt Master',    icon: TrendingUp, color: 'from-blue-400 to-cyan-500',    desc: 'Tỉ lệ tối ưu đạt 95%' },
];

const SKILLS = [
  'Python', 'Machine Learning', 'Prompt Engineering', 'Data Analysis',
  'React', 'TypeScript', 'SQL', 'Technical Writing', 'AI Research',
];

const ACTIVITY = [
  { icon: Wand2,      color: 'bg-violet-100 text-violet-600', title: 'Optimized prompt for Python debugging', time: '2 giờ trước', tag: 'Optimizer' },
  { icon: BookOpen,   color: 'bg-blue-100 text-blue-600',     title: 'Applied "Giải thuật toàn tử đề thi" recipe', time: '5 giờ trước', tag: 'Recipe' },
  { icon: GitBranch,  color: 'bg-indigo-100 text-indigo-600', title: 'Created project "Software Engineering R..."', time: 'Hôm qua',    tag: 'Project' },
  { icon: ShieldCheck,color: 'bg-emerald-100 text-emerald-600', title: 'Verified output for APA report', time: 'Hôm qua',    tag: 'Verify' },
  { icon: Code2,      color: 'bg-orange-100 text-orange-600', title: 'Used recipe "Viết unit test cho function"', time: '2 ngày trước', tag: 'Recipe' },
  { icon: FileText,   color: 'bg-pink-100 text-pink-600',     title: 'Generated "Báo cáo môn học theo chuẩn APA"', time: '3 ngày trước', tag: 'Recipe' },
];

function EditableField({
  value, onChange, multiline = false, type = "text"
}: {
  value: string; onChange: (v: string) => void; multiline?: boolean; type?: string;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <span
        className="group/field relative cursor-pointer"
        onClick={() => setEditing(true)}
        title="Nhấn để chỉnh sửa"
      >
        {value}
        <Edit3 className="inline-block ml-1.5 w-3 h-3 text-slate-400 opacity-0 group-hover/field:opacity-100 transition -mt-0.5" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 flex-1">
      {multiline ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="text-sm border border-violet-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none w-full"
          rows={3}
        />
      ) : (
        <input
          type={type}
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="text-sm border border-violet-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      )}
    </span>
  );
}

// ─── Location Selector Modal ──────────────────────────────────────────────────
function LocationSelector({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [mapQuery, setMapQuery] = useState(value);

  const handleSearch = () => setMapQuery(draft);

  return (
    <>
      <span
        className="group/loc relative cursor-pointer hover:text-violet-600 transition"
        onClick={() => { setDraft(value); setMapQuery(value); setIsOpen(true); }}
        title="Chọn địa điểm trên bản đồ"
      >
        {value}
        <Edit3 className="inline-block ml-1.5 w-3 h-3 text-slate-400 opacity-0 group-hover/loc:opacity-100 transition -mt-0.5" />
      </span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-600" /> Tìm kiếm địa điểm
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Nhập thành phố, quốc gia..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button 
                  onClick={handleSearch}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-sm font-semibold transition"
                >
                  Tìm
                </button>
              </div>

              <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery || 'Vietnam')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
              >
                Hủy
              </button>
              <button 
                onClick={() => { onSave(draft); setIsOpen(false); }}
                className="px-6 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition shadow-md shadow-violet-200"
              >
                Lưu địa điểm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [name,     setName]     = useState('Nguyễn Văn A');
  const [username, setUsername] = useState('nguyenvana');
  const [bio,      setBio]      = useState('AI enthusiast & Computer Science student. Đam mê prompt engineering và ứng dụng AI trong học tập.');
  const [location, setLocation] = useState('Ho Chi Minh City, Vietnam');
  const [website,  setWebsite]  = useState('github.com/nguyenvana');
  const [avatar,   setAvatar]   = useState('');
  const [cover,    setCover]    = useState('');
  const [email,    setEmail]    = useState('user@alable.edu.vn');
  const [birthday, setBirthday] = useState('2000-01-01');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setName(data.data.name);
          setUsername(data.data.username);
          setBio(data.data.bio);
          setLocation(data.data.location);
          setWebsite(data.data.website);
          setAvatar(data.data.avatar || '');
          setCover(data.data.cover || '');
          setEmail(data.data.email || '');
          setBirthday(data.data.birthday || 'Chưa cập nhật');
        }
      } catch (err) {
        console.error('Lỗi khi tải profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, username, bio, location, website, email, birthday, avatar, cover })
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event('profileUpdated'));
        alert('🎉 Lưu thay đổi thành công! Dữ liệu đã được cập nhật.');
      } else {
        alert(data.message || 'Lưu thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi lưu profile:', err);
      alert('Không thể kết nối đến server.');
    }
  };

  const handleImageUpload = (field: 'avatar' | 'cover') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (field === 'avatar') setAvatar(base64);
        else setCover(base64);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const initials = name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        {/* Gradient banner */}
        <div 
          className={`h-44 relative bg-cover bg-center ${!cover ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700' : ''}`}
          style={cover ? { backgroundImage: `url(${cover})` } : {}}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-16 w-32 h-32 bg-violet-400/20 rounded-full blur-xl pointer-events-none" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          {/* Change banner button */}
          <button 
            onClick={() => handleImageUpload('cover')}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white text-xs font-medium backdrop-blur-md transition z-10"
          >
            <Camera className="w-3.5 h-3.5" />
            Đổi ảnh bìa
          </button>
        </div>

        {/* Profile info row */}
        <div className="bg-white px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
            {/* Avatar */}
            <div className="relative shrink-0 -mt-14">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white overflow-hidden bg-cover bg-center"
                   style={avatar ? { backgroundImage: `url(${avatar})` } : {}}>
                {!avatar && initials}
              </div>
              <button 
                onClick={() => handleImageUpload('avatar')}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-md hover:bg-violet-700 transition"
                title="Đổi ảnh đại diện"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name + username + actions */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">
                  <EditableField value={name} onChange={setName} />
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  @<EditableField value={username} onChange={setUsername} />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSaveAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition shadow-md shadow-violet-200"
                >
                  <Check className="w-3.5 h-3.5" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-2xl">
            <EditableField value={bio} onChange={setBio} multiline />
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <LocationSelector value={location} onSave={setLocation} />
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <EditableField value={email} onChange={setEmail} />
            </span>
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-violet-600 hover:underline cursor-pointer">
                <EditableField value={website} onChange={setWebsite} />
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <EditableField value={birthday} onChange={setBirthday} type="date" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition group">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="space-y-6">

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-500" /> Kỹ năng & Chuyên môn
            </h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-100 hover:from-violet-100 hover:to-indigo-100 transition cursor-default"
                >
                  {skill}
                </span>
              ))}
              <button className="text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-violet-400 hover:text-violet-600 transition">
                + Thêm
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Thành tích
            </h2>
            <div className="space-y-3">
              {BADGES.map(({ label, icon: Icon, color, desc }) => (
                <div key={label} className="flex items-center gap-3 group">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Model Preferences */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-500" /> AI Model ưa thích
            </h2>
            <div className="space-y-2.5">
              {[
                { name: 'Claude',  pct: 45, color: 'from-orange-400 to-amber-500' },
                { name: 'GPT-4',   pct: 35, color: 'from-emerald-400 to-teal-500' },
                { name: 'Gemini',  pct: 20, color: 'from-blue-400 to-cyan-500' },
              ].map(({ name, pct, color }) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{name}</span>
                    <span className="text-slate-500">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (activity feed) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Contribution heatmap (simplified) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" /> Hoạt động gần đây
            </h2>
            {/* Mini heatmap */}
            <div className="flex gap-1 mb-1 flex-wrap">
              {Array.from({ length: 52 }).map((_, col) => (
                <div key={col} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, row) => {
                    const intensity = Math.random();
                    const cls =
                      intensity > 0.85 ? 'bg-violet-600' :
                      intensity > 0.65 ? 'bg-violet-400' :
                      intensity > 0.4  ? 'bg-violet-200' :
                      intensity > 0.2  ? 'bg-violet-100' :
                                         'bg-slate-100';
                    return <div key={row} className={`w-2.5 h-2.5 rounded-sm ${cls}`} />;
                  })}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">137 hoạt động trong 12 tháng qua</p>
          </div>

          {/* Activity timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Lịch sử hoạt động
              </h2>
              <button className="text-xs text-violet-600 hover:text-violet-800 font-semibold transition">Xem tất cả</button>
            </div>
            <div className="space-y-1">
              {ACTIVITY.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0 group hover:bg-slate-50 rounded-xl px-2 -mx-2 transition cursor-pointer">
                    <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 font-medium leading-snug truncate">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {item.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent recipes used */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> Recipes đã dùng gần đây
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Debug code Python step-by-step', type: 'CODING', model: 'Claude', icon: Code2,       iconBg: 'bg-violet-50',  iconColor: 'text-violet-600' },
                { title: 'Báo cáo môn học theo chuẩn APA', type: 'REPORT', model: 'Claude', icon: FileText,    iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
                { title: 'Thiết kế slide thuyết trình',    type: 'SLIDE',  model: 'Claude', icon: Presentation, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
                { title: 'Viết unit test cho function',    type: 'CODING', model: 'Gemini', icon: Code2,        iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:shadow-sm transition group cursor-pointer">
                    <div className={`w-9 h-9 rounded-lg ${r.iconBg} ${r.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate leading-tight">{r.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.type} · {r.model}</p>
                    </div>
                    <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 transition shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
