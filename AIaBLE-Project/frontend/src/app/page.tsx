'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  ArrowRight, 
  Wand2, 
  GitBranch, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  GraduationCap, 
  Zap, 
  ChevronRight,
  Columns,
  Search,
  Scale,
  Brain,
  TrendingUp,
  Clock,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

const t = {
  vi: {
    badge: 'Dự án AIaBLE bởi INTELLICREW',
    h1_1: 'Tương tác AI thông minh hơn',
    h1_2: 'Dành cho',
    h1_3: 'Sinh viên hiện đại',
    sub: 'AIaBLE là không gian làm việc và quản lý prompt thông minh dành riêng cho sinh viên. Học cách viết prompt, lập kế hoạch, khám phá thư viện mẫu và kiểm chứng AI.',
    btnStart: 'Bắt đầu ngay (Miễn phí)',
    btnExplore: 'Khám phá tính năng',
    btnEnter: 'Vào không gian làm việc AIaBLE',
    ready: 'Sẵn sàng học tập hiệu quả cùng AI?',
    readySub: 'Không còn sao chép mù quáng. Xây dựng kỹ năng viết prompt và đảm bảo bài tập đạt chuẩn học thuật với AIaBLE.',
    foundersTitle: 'Gặp Gỡ Đội Ngũ Co-Founders',
    foundersSub: 'Đội ngũ INTELLICREW kiến tạo và phát triển không gian làm việc học tập AI học thuật tối ưu.',
    founders: [
      {
        name: 'Phạm Quốc Anh',
        initials: 'QA',
        image: '/quoc_anh.jpg',
        role: 'Leader / Lead Backend & Devops',
        desc: 'Thiết kế cấu trúc API, tích hợp dịch vụ AI (Claude & Gemini), quản lý cơ sở dữ liệu và triển khai toàn bộ hệ thống.'
      },
      {
        name: 'Nguyễn Huy Hoàng',
        initials: 'HH',
        image: '/huy_hoang.jpg',
        role: 'Lead Frontend & Cấu trúc UI',
        desc: 'Xây dựng layout tổng thể, phát triển landing page, thiết kế hệ thống style và các thành phần giao diện chính.'
      },
      {
        name: 'Nguyễn Duy Nhật Anh',
        initials: 'NA',
        image: '/nhat_anh.jpg',
        role: 'Frontend & Tương tác Logic',
        desc: 'Lập trình logic tương tác trên các phân hệ Sandbox, Validator, Task-Matcher và đảm bảo tính mượt mà của UX.'
      },
      {
        name: 'Lê Duy Hưng',
        initials: 'DH',
        image: '/duy_hung.jpg',
        role: 'Backend & Quản lý API Tĩnh',
        desc: 'Quản lý thư viện công thức prompt học thuật (Recipes), viết các thuật toán bổ trợ và xác thực nguồn tin tức.'
      }
    ],
    worksBadge: 'AIaBLE Hoạt Động Thế Nào',
    worksTitle: 'Từ bài tập thô đến giải pháp đã kiểm chứng',
    worksDesc: 'Làm theo quy trình chuẩn của chúng tôi để khai thác tối đa AI tạo sinh mà không ảnh hưởng đến tính liêm chính học thuật.',
    step1Title: 'Chọn Mẫu hoặc Viết Nháp',
    step1Desc_1: 'Chọn một template đã được kiểm chứng từ ',
    step1Desc_strong: 'Thư Viện Prompt',
    step1Desc_2: ' hoặc tự viết một prompt nháp cơ bản.',
    step2Title: 'Tối ưu & Tìm AI Phù hợp',
    step2Desc_1: 'Tối ưu prompt với ',
    step2Desc_strong1: 'Optimizer Engine',
    step2Desc_2: ' và dùng ',
    step2Desc_strong2: 'Task-Matcher',
    step2Desc_3: ' để có gợi ý AI tốt nhất cho từng bước.',
    step3Title: 'So sánh & Kiểm chứng',
    step3Desc_1: 'Chạy prompt trong ',
    step3Desc_strong1: 'Sandbox',
    step3Desc_2: ' để so sánh các mô hình và đưa kết quả qua ',
    step3Desc_strong2: 'Accuracy Validator',
    step3Desc_3: '.',
    step4Title: 'Phản biện & Hoàn thiện',
    step4Desc_1: 'Trả lời các câu hỏi trong ',
    step4Desc_strong: 'Thẻ Tư duy Phản biện (Đạo đức học thuật)',
    step4Desc_2: ' để đảm bảo bài làm là bản gốc và chính xác.',
    dilemmaBadge: 'Vấn Đề Của Sinh Viên',
    dilemmaTitle: 'Tại sao các công cụ AI chung chung làm lãng phí thời gian của bạn',
    dilemmaDesc1_1: 'Theo Digital Education Council, ',
    dilemmaDesc1_strong1: '86% sinh viên',
    dilemmaDesc1_2: ' sử dụng AI tạo sinh, nhưng ',
    dilemmaDesc1_strong2: '58% không chắc chắn',
    dilemmaDesc1_3: ' nên dùng công cụ nào và cách tương tác hiệu quả.',
    dilemmaDesc2_1: 'Khảo sát của INTELLICREW cho thấy ',
    dilemmaDesc2_strong1: '87.6% sinh viên',
    dilemmaDesc2_2: ' phải sửa prompt nhiều lần, và ',
    dilemmaDesc2_strong2: '40.7% mất hơn 15 phút',
    dilemmaDesc2_3: ' loay hoay mới lấy được kết quả dùng được. AIaBLE được tạo ra để giải quyết vấn đề này.',
    stat1: 'Lãng phí TG Viết Prompt',
    stat2: 'Không biết chọn AI',
    stat3: 'Mất >15 Phút/Task',
    stat4: 'Cần Hướng dẫn Task',
    featBadge: '6 Năng lực Cốt lõi',
    featTitle: 'Quản lý quy trình làm việc toàn diện cho nhiệm vụ học thuật',
    feat1Title: 'Công cụ Tối ưu Prompt',
    feat1Sub: 'Tính năng 1',
    feat1Desc_1: 'Nhập prompt thô. AI biến đổi thành prompt chuẩn theo khung: ',
    feat1Desc_strong: 'Vai trò + Bối cảnh + Nhiệm vụ + Định dạng + Ràng buộc',
    feat1Desc_2: ' kèm so sánh Trước/Sau.',
    feat1Link: 'Thử Trình Tối ưu',
    feat2Title: 'Gợi ý Công cụ AI',
    feat2Sub: 'Tính năng 2',
    feat2Desc: 'Nhập mô tả bài tập lớn. Hệ thống phân rã thành các bước logic, và ghép nối từng bước với công cụ AI phù hợp nhất kèm giải thích.',
    feat2Link: 'Thử Gợi ý',
    feat3Title: 'Thư viện Prompt',
    feat3Sub: 'Tính năng 3',
    feat3Desc: 'Truy cập 15+ công thức prompt được tinh chỉnh riêng cho sinh viên: Lập trình, Viết báo cáo, Dàn ý thuyết trình, và Nghiên cứu.',
    feat3Link: 'Xem Thư viện',
    feat4Title: 'Thẻ Đạo đức AI',
    feat4Sub: 'Tính năng 4 (Bổ sung)',
    feat4Desc_1: 'Thúc đẩy sử dụng AI có trách nhiệm bằng cách gắn ',
    feat4Desc_strong: 'Thẻ Tư duy Phản biện',
    feat4Desc_2: ' kèm 3-5 câu hỏi dưới mỗi gợi ý để tránh sao chép mù quáng.',
    feat4Link: 'Học Đạo đức',
    feat5Title: 'Kiểm chứng Độ chính xác AI',
    feat5Sub: 'Tính năng 5 (Mở rộng)',
    feat5Desc: 'Chống ảo tưởng AI. Dán kết quả AI để xác thực trích dẫn, số liệu, và nguồn qua web APIs, hiển thị độ tin cậy bằng mã màu.',
    feat5Link: 'Thử Kiểm chứng',
    feat6Title: 'Không gian Sandbox Cá nhân',
    feat6Sub: 'Tính năng 6 (Mở rộng)',
    feat6Desc_1: 'Sân chơi đa mô hình. Chạy một prompt đã tối ưu qua ',
    feat6Desc_strong: 'Groq, Gemini, và OpenRouter',
    feat6Desc_2: ' song song để so sánh chất lượng.',
    feat6Link: 'Thử Sandbox',
    teamBadge: 'Nhóm INTELLICREW',
    excellenceBadge: 'Thành tựu Học thuật',
  },
  en: {
    badge: 'Project AIaBLE by INTELLICREW',
    h1_1: 'Smarter AI Interaction',
    h1_2: 'For',
    h1_3: 'Modern Students',
    sub: 'AIaBLE is a smart prompt management & learning workspace built specifically for university students. Learn how to write prompts, plan assignments, explore prompt recipes, and fact-check AI outputs.',
    btnStart: 'Get Started Now (Free)',
    btnExplore: 'Explore Features',
    btnEnter: 'Enter AIaBLE Workspace',
    ready: 'Ready to learn effectively alongside AI?',
    readySub: 'No more blind copying. Build prompt engineering skills and ensure your assignments match academic standards with AIaBLE.',
    foundersTitle: 'Meet Our Co-Founders',
    foundersSub: 'The visionary INTELLICREW team behind the academic AI workspace.',
    founders: [
      {
        name: 'Pham Quoc Anh',
        initials: 'QA',
        image: '/quoc_anh.jpg',
        role: 'Leader / Lead Backend & Devops',
        desc: 'Designs backend APIs, integrates LLMs (Claude & Gemini), manages databases, and oversees cloud deployments.'
      },
      {
        name: 'Nguyen Huy Hoang',
        initials: 'HH',
        image: '/huy_hoang.jpg',
        role: 'Lead Frontend & UI Architecture',
        desc: 'Establishes UI layout guidelines, develops the landing page, and styles core visual dashboard components.'
      },
      {
        name: 'Nguyen Duy Nhat Anh',
        initials: 'NA',
        image: '/nhat_anh.jpg',
        role: 'Frontend & Logic Developer',
        desc: 'Powers client-side state machine, handles interactive flows for Sandbox, Validator, and Task-Matcher features.'
      },
      {
        name: 'Le Duy Hung',
        initials: 'DH',
        image: '/duy_hung.jpg',
        role: 'Backend & Data API Engineer',
        desc: 'Curates learning prompt library, builds search index algorithms, and validates source credibility checks.'
      }
    ],
    worksBadge: 'How AIaBLE Works',
    worksTitle: 'From raw assignment to verified solution',
    worksDesc: 'Follow our structured workflow model to get the most out of generative AI without compromising academic integrity.',
    step1Title: 'Choose Recipe or Draft Prompt',
    step1Desc_1: 'Select a vetted template from the ',
    step1Desc_strong: 'AI Recipe Library',
    step1Desc_2: ' or key in a basic draft prompt.',
    step2Title: 'Optimize & Get AI Tool Match',
    step2Desc_1: 'Optimize prompts with ',
    step2Desc_strong1: 'Optimizer Engine',
    step2Desc_2: ' and use ',
    step2Desc_strong2: 'Task-Matcher',
    step2Desc_3: ' to get the best AI suggestions for each task milestone.',
    step3Title: 'Compare & Fact-Check Outputs',
    step3Desc_1: 'Run prompts inside the ',
    step3Desc_strong1: 'Sandbox',
    step3Desc_2: ' to compare models and run the output through the ',
    step3Desc_strong2: 'Accuracy Validator',
    step3Desc_3: '.',
    step4Title: 'Reflect & Finalize Output',
    step4Desc_1: 'Answer questions in the ',
    step4Desc_strong: 'Critical Thinking Card (Ethics Guardrail)',
    step4Desc_2: ' to ensure work is original and accurate.',
    dilemmaBadge: 'The Student Dilemma',
    dilemmaTitle: 'Why generic AI tools waste your time',
    dilemmaDesc1_1: 'According to the Digital Education Council, ',
    dilemmaDesc1_strong1: '86% of students',
    dilemmaDesc1_2: ' use generative AI, but ',
    dilemmaDesc1_strong2: '58% are unsure',
    dilemmaDesc1_3: ' which AI tool to use and how to interact with it effectively.',
    dilemmaDesc2_1: 'INTELLICREW conducted a survey showing that ',
    dilemmaDesc2_strong1: '87.6% of students',
    dilemmaDesc2_2: ' have to modify prompts multiple times to get a decent response, and ',
    dilemmaDesc2_strong2: '40.7% spend 15+ minutes',
    dilemmaDesc2_3: ' struggling to get usable output. AIaBLE was built to bridge this gap.',
    stat1: 'Waste Time Prompting',
    stat2: 'Unsure of Best AI Tool',
    stat3: 'Spend 15+ Mins per Task',
    stat4: 'Want a Task Guide',
    featBadge: '6 Core Capabilities',
    featTitle: 'Comprehensive workflow management built for academic tasks',
    feat1Title: 'Prompt-Optimizer Engine',
    feat1Sub: 'Features 1',
    feat1Desc_1: 'Input rough prompts. AI transforms them into structured prompts following the framework: ',
    feat1Desc_strong: 'Role + Context + Task + Format + Constraints',
    feat1Desc_2: ' with a Before/After comparison.',
    feat1Link: 'Try Optimizer',
    feat2Title: 'AI Task-Matcher',
    feat2Sub: 'Features 2',
    feat2Desc: 'Enter a large task brief. Our system decomposes it into logical workflow steps, and matches each step to the most suitable AI tool with reasoning.',
    feat2Link: 'Try Task-Matcher',
    feat3Title: 'AI Recipe Library',
    feat3Sub: 'Features 3',
    feat3Desc: 'Access 15+ curated prompt formulas designed specifically for students: Coding, Report writing, Presentation layouts, and Research.',
    feat3Link: 'Browse Recipes',
    feat4Title: 'AI Ethics Guardrail',
    feat4Sub: 'Features 4 (Bonus)',
    feat4Desc_1: 'Promotes responsible AI use by appending a ',
    feat4Desc_strong: 'Critical Thinking Card',
    feat4Desc_2: ' with 3-5 reflection questions under every prompt suggestion to prevent blind copying.',
    feat4Link: 'Learn Ethics',
    feat5Title: 'AI Accuracy Validator',
    feat5Sub: 'Features 5 (Expansion)',
    feat5Desc: 'Combat AI hallucinations. Paste AI text output to verify citations, statistics, and references using web APIs, presenting color-coded reliability.',
    feat5Link: 'Try Validator',
    feat6Title: 'Personal Sandbox',
    feat6Sub: 'Features 6 (Expansion)',
    feat6Desc_1: 'A multi-model playground. Run a single optimized prompt across ',
    feat6Desc_strong: 'Groq, Gemini, and OpenRouter',
    feat6Desc_2: ' side-by-side to compare output quality.',
    feat6Link: 'Try Sandbox',
    teamBadge: 'INTELLICREW Team',
    excellenceBadge: 'Academic Excellence',
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState('vi');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }
    setLang(localStorage.getItem('app_lang') || 'vi');
    const handleLangChange = () => setLang(localStorage.getItem('app_lang') || 'vi');
    window.addEventListener('storage', handleLangChange);
    window.addEventListener('app_lang_changed', handleLangChange);
    return () => {
      window.removeEventListener('storage', handleLangChange);
      window.removeEventListener('app_lang_changed', handleLangChange);
    };
  }, []);

  const text = t[lang as 'en' | 'vi'] || t.vi;
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden pb-16">
      <Navbar />
      {/* Decorative Gradients & Grid Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-violet-100/50 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto">
        {/* Team & Pitch Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100/60 border border-violet-200 text-violet-800 text-xs font-semibold mb-8 hover:bg-violet-100 transition duration-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
          <span>{text.badge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
          {text.h1_1} <br />
          {text.h1_2} <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{text.h1_3}</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
          {text.sub}
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href={isLoggedIn ? "/home" : "/login"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-lg shadow-violet-200 hover:-translate-y-0.5"
          >
            {isLoggedIn ? text.btnEnter : text.btnStart}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 transition duration-200 shadow-sm"
          >
            {text.btnExplore}
          </a>
        </div>
      </section>

      {/* Survey & Market Pains Section (From Proposal Survey Data) */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto mb-16">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 uppercase tracking-wider mb-3">
                <AlertCircle className="w-4 h-4" /> {text.dilemmaBadge}
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
                {text.dilemmaTitle}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {text.dilemmaDesc1_1}<strong className="font-bold text-slate-900">{text.dilemmaDesc1_strong1}</strong>{text.dilemmaDesc1_2}<strong className="font-bold text-slate-900">{text.dilemmaDesc1_strong2}</strong>{text.dilemmaDesc1_3}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                {text.dilemmaDesc2_1}<strong className="font-bold text-slate-900">{text.dilemmaDesc2_strong1}</strong>{text.dilemmaDesc2_2}<strong className="font-bold text-slate-900">{text.dilemmaDesc2_strong2}</strong>{text.dilemmaDesc2_3}
              </p>
            </div>
            
            {/* Visual Stats grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-violet-600">87.6%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">{text.stat1}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-indigo-600">58%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">{text.stat2}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-purple-600">40.7%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">{text.stat3}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-blue-600">96.9%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">{text.stat4}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section (Covers all 6 Proposal Features) */}
      <section id="features" className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">{text.featBadge}</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {text.featTitle}
          </h3>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Prompt-Optimizer Engine */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-violet-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6 group-hover:scale-105 transition duration-300">
              <Wand2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{text.feat1Title}</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">{text.feat1Sub}</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              {text.feat1Desc_1}<strong className="font-bold text-violet-700">{text.feat1Desc_strong}</strong>{text.feat1Desc_2}
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 group-hover:gap-2 transition-all">
              {text.feat1Link} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: AI Task-Matcher */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-105 transition duration-300">
              <GitBranch className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{text.feat2Title}</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">{text.feat2Sub}</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              {text.feat2Desc}
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
              {text.feat2Link} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: AI Recipe Library */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-105 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{text.feat3Title}</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">{text.feat3Sub}</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              {text.feat3Desc}
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:gap-2 transition-all">
              {text.feat3Link} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: AI Ethics Guardrail */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-105 transition duration-300">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{text.feat4Title}</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">{text.feat4Sub}</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              {text.feat4Desc_1}<strong className="font-bold text-amber-700">{text.feat4Desc_strong}</strong>{text.feat4Desc_2}
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:gap-2 transition-all">
              {text.feat4Link} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5: AI Accuracy Validator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-105 transition duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{text.feat5Title}</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">{text.feat5Sub}</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              {text.feat5Desc}
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:gap-2 transition-all">
              {text.feat5Link} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6: Personal Sandbox */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-rose-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6 group-hover:scale-105 transition duration-300">
              <Columns className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{text.feat6Title}</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">{text.feat6Sub}</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              {text.feat6Desc_1}<strong className="font-bold text-rose-700">{text.feat6Desc_strong}</strong>{text.feat6Desc_2}
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:gap-2 transition-all">
              {text.feat6Link} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Student Journey Workflow Section */}
      <section className="py-20 px-4 md:px-8 bg-slate-50 text-slate-900 -mx-4 md:-mx-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">{text.worksBadge}</span>
            <h3 className="text-3xl font-extrabold mt-3">{text.worksTitle}</h3>
            <p className="text-slate-600 text-sm mt-3 max-w-xl mx-auto">
              {text.worksDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Steps line connector */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 hidden md:block z-0" />
            
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold mb-4">1</div>
              <h4 className="font-bold text-base mb-2">{text.step1Title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {text.step1Desc_1}<strong className="font-bold text-violet-700">{text.step1Desc_strong}</strong>{text.step1Desc_2}
              </p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">2</div>
              <h4 className="font-bold text-base mb-2">{text.step2Title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {text.step2Desc_1}<strong className="font-bold text-blue-700">{text.step2Desc_strong1}</strong>{text.step2Desc_2}<strong className="font-bold text-blue-700">{text.step2Desc_strong2}</strong>{text.step2Desc_3}
              </p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold mb-4">3</div>
              <h4 className="font-bold text-base mb-2">{text.step3Title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {text.step3Desc_1}<strong className="font-bold text-purple-700">{text.step3Desc_strong1}</strong>{text.step3Desc_2}<strong className="font-bold text-purple-700">{text.step3Desc_strong2}</strong>{text.step3Desc_3}
              </p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-4">4</div>
              <h4 className="font-bold text-base mb-2">{text.step4Title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {text.step4Desc_1}<strong className="font-bold text-emerald-700">{text.step4Desc_strong}</strong>{text.step4Desc_2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Co-founders Grid Section ────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Glow indicators */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4 animate-pulse" />
            {text.teamBadge}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            {text.foundersTitle}
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            {text.foundersSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {(text.founders || []).map((founder: any, idx: number) => (
            <div 
              key={idx}
              className="group relative bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-lg shadow-slate-100/40 hover:shadow-2xl hover:shadow-violet-100/60 hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              {/* Inner ambient light glow that expands on hover */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-tr from-violet-600/10 to-indigo-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div>
                {/* Photo Space (Avatar Slot) - Rectangular Portrait format */}
                <div className="relative w-full aspect-[3/4] rounded-2xl bg-gradient-to-tr from-violet-100 via-indigo-50 to-purple-100 border border-slate-100 overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                  {founder.image ? (
                    <Image 
                      src={founder.image} 
                      alt={founder.name} 
                      fill 
                      sizes="(max-w-7xl) 25vw, 100vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <span className="text-3xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent select-none">
                      {founder.initials}
                    </span>
                  )}
                </div>

                {/* Founder Info */}
                <h3 className="text-lg font-black text-slate-800 tracking-tight mt-6 group-hover:text-violet-700 transition-colors duration-300">
                  {founder.name}
                </h3>
                
                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded bg-violet-50 inline-block">
                  {founder.role}
                </p>
              </div>

              {/* Responsibilities */}
              <p className="text-xs text-slate-500 leading-relaxed mt-6 pt-5 border-t border-slate-100 font-medium">
                {founder.desc}
              </p>

              {/* Hover bottom accent bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner - added padding-bottom to separate from footer */}
      <section className="pt-20 pb-32 px-4 md:px-8 text-center max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
          <GraduationCap className="w-4 h-4" /> {text.excellenceBadge}
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">
          {text.ready}
        </h3>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto text-sm">
          {text.readySub}
        </p>
        <Link
          href={isLoggedIn ? "/home" : "/login"}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-lg shadow-violet-200"
        >
          {text.btnEnter}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
