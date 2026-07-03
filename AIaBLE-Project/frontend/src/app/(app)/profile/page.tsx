'use client';

import { useState, useEffect } from 'react';
// ... (imports remain mostly same but I am doing exact replace so I must be careful)
import {
  Camera, Edit3, Check, X, MapPin, Mail, Calendar, Link2,
  Wand2, GitBranch, BookOpen, ShieldCheck, Star, Zap, Award,
  TrendingUp, Clock, Code2, FileText, Presentation, Copy,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_SKILLS = [
  'Python', 'Machine Learning', 'Prompt Engineering', 'Data Analysis',
  'React', 'TypeScript', 'SQL', 'Technical Writing', 'AI Research',
];

function EditableField({
  value, onChange, multiline = false, type = "text", placeholder = "Thêm thông tin"
}: {
  value: string; onChange: (v: string) => void; multiline?: boolean; type?: string; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <span
        className="group/field relative cursor-pointer inline-block min-w-[50px]"
        onClick={() => setEditing(true)}
        title="Nhấn để chỉnh sửa"
      >
        {value || <span className="opacity-50 italic">{placeholder}</span>}
        <Edit3 className="inline-block ml-1.5 w-3 h-3 text-slate-400 opacity-0 group-hover/field:opacity-100 transition -mt-0.5" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 flex-1">
      {multiline ? (
        <textarea maxLength={5000}
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="text-sm border border-violet-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none w-full"
          rows={3}
        />
      ) : (
        <input maxLength={100}
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
        className="group/loc relative cursor-pointer hover:text-violet-600 transition inline-block min-w-[50px]"
        onClick={() => { setDraft(value); setMapQuery(value); setIsOpen(true); }}
        title="Chọn địa điểm trên bản đồ"
      >
        {value || <span className="opacity-50 italic">Thêm Tỉnh/Thành phố, Quốc gia</span>}
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
                <input maxLength={100} 
                  type="text" 
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Nhập Tỉnh/Thành phố, Quốc gia..."
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
  const [name,     setName]     = useState('');
  const [username, setUsername] = useState('');
  const [bio,      setBio]      = useState('');
  const [location, setLocation] = useState('');
  const [website,  setWebsite]  = useState('');
  const [avatar,   setAvatar]   = useState('');
  const [cover,    setCover]    = useState('');
  const [email,    setEmail]    = useState('');
  const [birthday, setBirthday] = useState('');

  const [favoriteModels, setFavoriteModels] = useState<any[]>([]);
  const [dynamicStats, setDynamicStats] = useState({ projects: 0, recipesUsed: 0, promptsOptimized: 0, outputsVerified: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [activityChart, setActivityChart] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile`, {
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
          setBirthday(data.data.birthday || '');
          setSkills(data.data.skills || []);
        }

        // Fetch history to calculate favorite models
        try {
          const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const historyData = await historyRes.json();
          if (historyData.success && historyData.data) {
            const history = historyData.data;
            const modelCounts: Record<string, number> = {};
            let totalModels = 0;
            history.forEach((item: any) => {
              if (item.model) {
                // Normalize model names if necessary
                const mName = item.model;
                modelCounts[mName] = (modelCounts[mName] || 0) + 1;
                totalModels++;
              }
            });
            
            if (totalModels > 0) {
              const colors = [
                'from-violet-500 to-purple-600',
                'from-blue-400 to-cyan-500',
                'from-emerald-400 to-teal-500',
                'from-orange-400 to-amber-500'
              ];
              
              const sortedModels = Object.entries(modelCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, count], index) => ({
                  name,
                  pct: Math.round((count / totalModels) * 100),
                  color: colors[index % colors.length]
                }));
                
              setFavoriteModels(sortedModels);
            }

            setTotalActivities(history.length);
            
            // Map activities
            const mappedActivities = history.slice(0, 6).map((item: any) => {
              let Icon = Wand2;
              if (item.tool === 'Optimizer') Icon = Wand2;
              else if (item.tool === 'Sandbox') Icon = Zap;
              else if (item.tool === 'Recipe Library' || item.tool === 'Saved Recipes') Icon = BookOpen;
              return {
                icon: Icon,
                color: item.color || 'bg-violet-100 text-violet-600',
                title: item.detail || item.action,
                time: item.time ? new Date(item.time).toLocaleString('vi-VN') : 'Gần đây',
                tag: item.tool || 'Action'
              };
            });
            if (mappedActivities.length > 0) setActivities(mappedActivities);

            // Filter recent recipes
            const recipes = history.filter((item: any) => item.action?.includes('Recipe') || item.tool?.includes('Recipe'));
            const mappedRecipes = recipes.slice(0, 4).map((item: any) => ({
              title: item.detail?.replace('Applied saved recipe: ', '')?.replace('Applied recipe: ', '') || 'Recipe',
              type: 'RECIPE',
              model: item.model || 'Unknown',
              icon: BookOpen,
              iconBg: 'bg-blue-50',
              iconColor: 'text-blue-600'
            }));
            if (mappedRecipes.length > 0) setRecentRecipes(mappedRecipes);

            // Stats
            const recipesUsed = recipes.length;
            const promptsOptimized = history.filter((item: any) => item.tool?.includes('Optimizer')).length;
            const outputsVerified = history.filter((item: any) => item.action?.includes('Verify') || item.tool?.includes('Validator')).length;

            // Calculate activity for the last 14 days
            const last14Days = Array.from({length: 14}, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (13 - i));
              return d.toISOString().split('T')[0];
            });
            const activityByDay: Record<string, number> = {};
            last14Days.forEach(d => activityByDay[d] = 0);
            
            history.forEach((item: any) => {
              if (item.time) {
                const dStr = item.time.split('T')[0];
                if (activityByDay[dStr] !== undefined) {
                  activityByDay[dStr]++;
                }
              }
            });
            
            const maxActivity = Math.max(...Object.values(activityByDay), 1);
            setActivityChart(last14Days.map(d => ({
              date: d,
              count: activityByDay[d],
              height: Math.max((activityByDay[d] / maxActivity) * 100, 4) // min 4% height
            })));

            // Fetch projects for stats
            try {
              const projRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const projData = await projRes.json();
              const projects = projData.success ? projData.data.length : 0;
              setDynamicStats({ projects, recipesUsed, promptsOptimized, outputsVerified });
            } catch (e) {
              setDynamicStats(prev => ({ ...prev, recipesUsed, promptsOptimized, outputsVerified }));
            }

          }
        } catch (err) {
          console.error('Lỗi khi tải lịch sử:', err);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, username, bio, location, website, email, birthday, avatar, cover, skills })
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

  // Calculate badges dynamically based on user stats!
  const earnedBadges = [];
  earnedBadges.push({ label: 'Early Adopter', icon: Star, color: 'from-amber-400 to-orange-500', desc: 'Tham gia từ những ngày đầu (Beta)' });
  
  if (totalActivities >= 10) {
    earnedBadges.push({ label: 'Active Member', icon: Zap, color: 'from-violet-500 to-purple-600', desc: 'Thực hiện hơn 10 thao tác hệ thống' });
  }
  if (dynamicStats.recipesUsed >= 3) {
    earnedBadges.push({ label: 'Recipe Explorer', icon: BookOpen, color: 'from-emerald-400 to-teal-500', desc: 'Khám phá và sử dụng nhiều công thức' });
  }
  if (dynamicStats.promptsOptimized >= 5) {
    earnedBadges.push({ label: 'Prompt Master', icon: TrendingUp, color: 'from-blue-400 to-cyan-500', desc: 'Chuyên gia tối ưu hóa Prompt' });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        {/* Gradient banner */}
        <div 
          className={`h-44 relative bg-cover bg-center ignore-dark-mode ${!cover ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700' : ''}`}
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
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white overflow-hidden bg-cover bg-center ignore-dark-mode"
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
          <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-2xl min-h-[1.5rem]">
            <EditableField value={bio} onChange={setBio} multiline placeholder="Thêm tiểu sử của bạn..." />
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <LocationSelector value={location} onSave={setLocation} />
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <EditableField value={email} onChange={setEmail} placeholder="Thêm email" />
            </span>
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-violet-600 hover:underline cursor-pointer">
                <EditableField value={website} onChange={setWebsite} placeholder="Thêm website/link" />
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <EditableField value={birthday} onChange={setBirthday} type="date" placeholder="Thêm ngày sinh" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: dynamicStats.projects, icon: GitBranch, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Recipes Used', value: dynamicStats.recipesUsed, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Prompts Optimized', value: dynamicStats.promptsOptimized, icon: Wand2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Outputs Verified', value: dynamicStats.outputsVerified, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="group text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-100 hover:from-violet-100 hover:to-indigo-100 transition cursor-default flex items-center gap-1"
                >
                  {skill}
                  <button 
                    onClick={() => setSkills(skills.filter(s => s !== skill))}
                    className="opacity-0 group-hover:opacity-100 text-violet-400 hover:text-red-500 transition-all focus:outline-none"
                    title="Xóa kỹ năng"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {isAddingSkill ? (
                <div className="flex items-center gap-1">
                  <input maxLength={100}
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        if (!skills.includes(newSkill.trim())) {
                          setSkills([...skills, newSkill.trim()]);
                        }
                        setNewSkill('');
                        setIsAddingSkill(false);
                      } else if (e.key === 'Escape') {
                        setNewSkill('');
                        setIsAddingSkill(false);
                      }
                    }}
                    autoFocus
                    placeholder="Nhập kỹ năng..."
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 w-28 bg-white"
                  />
                  <button 
                    onClick={() => {
                      if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                        setSkills([...skills, newSkill.trim()]);
                      }
                      setNewSkill('');
                      setIsAddingSkill(false);
                    }}
                    className="p-1 rounded-full text-emerald-500 hover:bg-emerald-50 transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setNewSkill(''); setIsAddingSkill(false); }}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingSkill(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-violet-400 hover:text-violet-600 transition"
                >
                  + Thêm
                </button>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Thành tích
            </h2>
            <div className="space-y-3">
              {earnedBadges.map(({ label, icon: Icon, color, desc }) => (
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
              {favoriteModels.map(({ name, pct, color }) => (
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
            <div className="h-28 mt-4 flex items-end gap-1.5 px-1">
              {activityChart.length > 0 ? activityChart.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
                    {day.count} hoạt động
                  </div>
                  {/* Bar */}
                  <div className="w-full bg-slate-50 rounded-t-md flex items-end h-full relative overflow-hidden">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-700 ease-out absolute bottom-0 ${day.count > 0 ? 'bg-violet-500 group-hover:bg-violet-600' : 'bg-slate-200'}`} 
                      style={{ height: `${day.height}%` }}
                    />
                  </div>
                </div>
              )) : (
                <div className="w-full text-center text-slate-400 text-sm mt-10">Đang tải biểu đồ...</div>
              )}
            </div>
            <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-3 px-1 border-t border-slate-50 pt-2">
              <span>14 ngày trước</span>
              <span>Hôm nay</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{totalActivities} hoạt động trong 12 tháng qua</p>
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
              {activities.length === 0 ? (
                <div className="text-sm text-slate-500 py-4 text-center">Chưa có hoạt động nào</div>
              ) : activities.map((item, i) => {
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
              {recentRecipes.length === 0 ? (
                <div className="col-span-full text-sm text-slate-500 py-4 text-center">Chưa dùng công thức nào</div>
              ) : recentRecipes.map((r) => {
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
