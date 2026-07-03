'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Cpu, 
  Layers, 
  GraduationCap, 
  Sparkles,
  BookOpen,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const t = {
  vi: {
    desc: 'AIaBLE là không gian học thuật và tối ưu hóa Prompt thông minh dành riêng cho sinh viên. Giúp nâng cao kỹ năng viết prompt, lập kế hoạch bài tập và kiểm chứng kết quả AI.',
    team: 'Phát triển bởi Nhóm INTELLICREW',
    features: 'Các chức năng sản phẩm',
    resources: 'Tài nguyên học tập',
    contact: 'Thông tin liên hệ',
    techStack: 'Công nghệ tích hợp',
    
    // Feature Descriptions for details in footer
    recipes: 'Thư viện Prompt mẫu (AI Recipes)',
    recipesDesc: 'Kho biểu mẫu prompt học tập chất lượng cao đã qua kiểm chứng.',
    matcher: 'Phân rã nhiệm vụ (Task Matcher)',
    matcherDesc: 'Phân rã đề tài bài tập thành lộ trình các bước chi tiết.',
    optimizer: 'Tối ưu hóa Prompt (Optimizer)',
    optimizerDesc: 'Tinh chỉnh prompt thô thành prompt chuẩn cấu trúc sư phạm.',
    sandbox: 'AI Sandbox (So sánh LLMs)',
    sandboxDesc: 'Chạy thử nghiệm song song và so sánh kết quả của nhiều mô hình.',
    validator: 'Bộ kiểm chứng học thuật',
    validatorDesc: 'Kiểm chứng độ chính xác và phát hiện lỗi ảo tưởng nguồn AI.',
    
    address: 'Đại học FPT Hà Nội',
    addressDetail: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    phone: 'Số điện thoại hỗ trợ',
    help: 'Trung tâm trợ giúp',
    changelog: 'Nhật ký thay đổi',
    ethics: 'Đạo đức sử dụng AI',
    terms: 'Điều khoản sử dụng',
    copyright: '© 2026 AIaBLE. Mọi quyền được bảo lưu. Thiết kế và phát triển bởi INTELLICREW.'
  },
  en: {
    desc: 'AIaBLE is an intelligent academic workspace and prompt optimizer tailored for university students. Learn, plan, optimize prompts, and validate AI output.',
    team: 'Developed by Team INTELLICREW',
    features: 'Product Features',
    resources: 'Academic Resources',
    contact: 'Contact Info',
    techStack: 'Technology Stack',
    
    recipes: 'Prompt Recipes Library',
    recipesDesc: 'Vetted academic prompt templates for quick utilization.',
    matcher: 'Task Milestone Matcher',
    matcherDesc: 'Break down assignment topics into actionable timeline steps.',
    optimizer: 'Prompt Optimizer Engine',
    optimizerDesc: 'Refine raw prompts into structured, context-rich inputs.',
    sandbox: 'AI Model Sandbox',
    sandboxDesc: 'Execute side-by-side comparative testing across multiple LLMs.',
    validator: 'Academic Output Validator',
    validatorDesc: 'Verify source credibility and check for AI hallucinations.',
    
    address: 'FPT University Hanoi',
    addressDetail: 'Hoa Lac Hi-Tech Park, Thach That, Hanoi, Vietnam',
    phone: 'Support Hotline',
    help: 'Help & Guides',
    changelog: 'Changelog',
    ethics: 'AI Ethics Guide',
    terms: 'Terms of Service',
    copyright: '© 2026 AIaBLE. All rights reserved. Designed and developed by INTELLICREW.'
  }
};

export function Footer() {
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    setLang(localStorage.getItem('app_lang') || 'vi');
    const handleLangChange = () => setLang(localStorage.getItem('app_lang') || 'vi');
    window.addEventListener('storage', handleLangChange);
    window.addEventListener('app_lang_changed', handleLangChange);
    return () => {
      window.removeEventListener('storage', handleLangChange);
      window.removeEventListener('app_lang_changed', handleLangChange);
    };
  }, []);

  const currentLang = (lang === 'en' ? 'en' : 'vi') as 'en' | 'vi';
  const text = t[currentLang];

  return (
    <footer className="relative w-full bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-8 overflow-hidden z-10 transition-colors duration-300">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Introduction Column */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link href="/" className="flex items-center group logo-container">
              <Image 
                src="/logo.png" 
                alt="AIaBLE Logo" 
                width={130} 
                height={30} 
                className="h-7.5 w-auto object-contain logo-img" 
              />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {text.desc}
            </p>
            <div className="flex items-center gap-2 pt-1 text-violet-600 dark:text-violet-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{text.team}</span>
            </div>
            
            {/* Github Link */}
            <div className="pt-1">
              <a 
                href="https://github.com/INTELLICREW-AIaBLE/AIable_Champion" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition duration-200"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="font-medium">GitHub Org @INTELLICREW</span>
              </a>
            </div>
          </div>

          {/* Product Features Column */}
          <div className="space-y-4 lg:col-span-1">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              {text.features}
            </h4>
            <ul className="space-y-4 text-xs">
              <li className="group">
                <Link href="/recipes" className="hover:text-violet-600 dark:hover:text-violet-400 font-bold flex items-center gap-1.5 transition">
                  <Bookmark className="w-3.5 h-3.5 text-violet-500" />
                  <span>{text.recipes}</span>
                </Link>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 pl-5 leading-normal">
                  {text.recipesDesc}
                </p>
              </li>
              <li className="group">
                <Link href="/task-matcher" className="hover:text-violet-600 dark:hover:text-violet-400 font-bold flex items-center gap-1.5 transition">
                  <GitBranch className="w-3.5 h-3.5 text-violet-500" />
                  <span>{text.matcher}</span>
                </Link>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 pl-5 leading-normal">
                  {text.matcherDesc}
                </p>
              </li>
              <li className="group">
                <Link href="/optimizer" className="hover:text-violet-600 dark:hover:text-violet-400 font-bold flex items-center gap-1.5 transition">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  <span>{text.optimizer}</span>
                </Link>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 pl-5 leading-normal">
                  {text.optimizerDesc}
                </p>
              </li>
              <li className="group">
                <Link href="/sandbox" className="hover:text-violet-600 dark:hover:text-violet-400 font-bold flex items-center gap-1.5 transition">
                  <Cpu className="w-3.5 h-3.5 text-violet-500" />
                  <span>{text.sandbox}</span>
                </Link>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 pl-5 leading-normal">
                  {text.sandboxDesc}
                </p>
              </li>
              <li className="group">
                <Link href="/validator" className="hover:text-violet-600 dark:hover:text-violet-400 font-bold flex items-center gap-1.5 transition">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
                  <span>{text.validator}</span>
                </Link>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 pl-5 leading-normal">
                  {text.validatorDesc}
                </p>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              {text.resources}
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/help" className="hover:text-violet-600 dark:hover:text-violet-400 transition">
                  {text.help}
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-violet-600 dark:hover:text-violet-400 transition">
                  {text.changelog}
                </Link>
              </li>
              <li>
                <Link href="/help#ethics" className="hover:text-violet-600 dark:hover:text-violet-400 transition">
                  {text.ethics}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-violet-600 dark:hover:text-violet-400 transition">
                  {text.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column (FPT Uni Address & Hotline) */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              {text.contact}
            </h4>
            <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{text.address}</p>
                  <p className="text-[11px] leading-relaxed text-slate-500 mt-0.5">{text.addressDetail}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <Phone className="w-4 h-4 text-violet-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{text.phone}</p>
                  <a href="tel:0981583316" className="text-sm font-black text-slate-800 dark:text-slate-200 hover:text-violet-600 transition">
                    0981583316
                  </a>
                </div>
              </div>
              <div className="flex gap-2 items-center pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <Mail className="w-4 h-4 text-violet-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Email Support</p>
                  <a href="mailto:aiable.support.su26@gmail.com" className="text-sm font-black text-slate-800 dark:text-slate-200 hover:text-violet-600 transition">
                    aiable.support.su26@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Tech Badges Row */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 pb-6 flex flex-wrap gap-4 items-center justify-between text-xs">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              {text.techStack}:
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/40 dark:border-slate-800/40">
              Next.js 14
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/40 dark:border-slate-800/40">
              React 18
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/40 dark:border-slate-800/40">
              Tailwind CSS
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/40 dark:border-slate-800/40">
              Gemini & Groq APIs
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/40 dark:border-slate-800/40">
              MongoDB Atlas
            </span>
          </div>
        </div>

        {/* Copyright & Team credit */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p className="text-center sm:text-left">{text.copyright}</p>
          <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-bold">
            <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Academic AI Workspace</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
export default Footer;
