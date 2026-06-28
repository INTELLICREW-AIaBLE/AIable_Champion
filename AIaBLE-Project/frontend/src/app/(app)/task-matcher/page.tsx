'use client';

import { useState } from 'react';
import {
  Sparkles,
  Clock,
  ChevronRight,
  X,
  BookOpen,
  FileText,
  PenLine,
  Presentation,
  Bot,
  Layers,
} from 'lucide-react';

type TimelineStep = {
  id: number;
  title: string;
  description: string;
  tool: string;
  toolDesc: string;
  estimate: string;
  icon: React.ElementType;
  color: string;
  bg: string;
};

const MOCK_STEPS: TimelineStep[] = [
  {
    id: 1,
    title: 'Nghiên cứu & thu thập tài liệu',
    description:
      'Tìm hiểu khái niệm microservices, so sánh với monolithic, tìm case study thực tế từ Netflix, Amazon, Uber.',
    tool: 'Dùng Claude',
    toolDesc: 'mạnh về phân tích ngữ cảnh sâu',
    estimate: '1 ngày',
    icon: BookOpen,
    color: 'text-violet-600',
    bg: 'bg-violet-50 border-violet-100',
  },
  {
    id: 2,
    title: 'Tổng hợp & xây dựng outline báo cáo',
    description:
      'Tổng hợp thông tin đã nghiên cứu, xây dựng cấu trúc báo cáo chuẩn học thuật gồm: Giới thiệu, Cơ sở lý thuyết, Phân tích, Kết luận.',
    tool: 'Dùng Gemini',
    toolDesc: 'free tier ổn định, tốt cho tổng hợp',
    estimate: '1 ngày',
    icon: FileText,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 border-cyan-100',
  },
  {
    id: 3,
    title: 'Viết nội dung chính từng chương',
    description:
      'Viết chi tiết từng phần dựa trên outline, đảm bảo ngôn ngữ học thuật, có trích dẫn nguồn đúng format APA/IEEE.',
    tool: 'Dùng ChatGPT',
    toolDesc: 'tốt cho viết lách và diễn đạt',
    estimate: '1–2 ngày',
    icon: PenLine,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  {
    id: 4,
    title: 'Thiết kế slide thuyết trình',
    description:
      'Chuyển nội dung báo cáo thành slide trực quan với sơ đồ kiến trúc, biểu đồ so sánh và storytelling logic.',
    tool: 'Dùng Canva AI',
    toolDesc: 'thiết kế đẹp, nhanh, template sẵn',
    estimate: '1 ngày',
    icon: Presentation,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-100',
  },
];

export default function TaskMatcherPage() {
  const [selectedStep, setSelectedStep] = useState<TimelineStep | null>(null);

  /*
  // API template later, babe:
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/task-matcher');
        const json = await res.json();

        setSteps(Array.isArray(json.data) ? json.data : []);
      } catch (error) {
        console.error('Failed to fetch task workflow:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, []);
  */

  const steps = MOCK_STEPS;

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">AI Task-Matcher</h1>
        </div>

        <p className="text-sm text-slate-500">
          Mô tả bài tập lớn — hệ thống phân rã thành từng bước và gợi ý công cụ AI phù hợp nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_150px] gap-3">
        <input
          defaultValue="Làm báo cáo môn Software Engineering về kiến trúc microservices"
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-700 focus:outline-none focus:border-violet-300"
        />

        <select className="px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-medium text-slate-600 focus:outline-none">
          <option>Software Engineering</option>
          <option>Database</option>
          <option>Web Development</option>
          <option>Presentation</option>
        </select>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-purple-800 active:scale-95 transition">
          <Bot className="w-4 h-4" />
          Phân tích nhiệm vụ
        </button>
      </div>

      <div className="rounded-2xl bg-violet-50 border border-violet-100 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-violet-600" />
          <span className="font-bold text-violet-800">
            Báo cáo SE — Kiến trúc Microservices
          </span>
          <span className="text-violet-400">•</span>
          <span className="font-semibold text-violet-600">Estimated: 3–4 ngày</span>
        </div>
      </div>

      <section className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => setSelectedStep(step)}
              className="w-full group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-violet-100 transition-all duration-300 p-4 text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${step.bg} ${step.color}`}>
                  {step.id}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 group-hover:text-violet-700 transition">
                        {step.title}
                      </h2>

                      <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                        {step.description}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 shrink-0 mt-1" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${step.bg} ${step.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {step.tool} — {step.toolDesc}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {step.estimate}
                    </span>

                    <span className="ml-auto text-[11px] font-bold text-violet-600 group-hover:underline">
                      Xem prompt mẫu →
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {selectedStep && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedStep(null)}
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mb-1">
                  Step {selectedStep.id}
                </p>

                <h2 className="text-xl font-black text-slate-900">
                  {selectedStep.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedStep(null)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Mô tả bước
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedStep.description}
                </p>
              </div>

              <div className={`rounded-2xl border p-4 ${selectedStep.bg}`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2">
                  Công cụ đề xuất
                </p>
                <p className={`text-sm font-black ${selectedStep.color}`}>
                  {selectedStep.tool}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedStep.toolDesc}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mb-2">
                  Prompt mẫu
                </p>

                <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-mono">
                  {`Bạn là trợ lý học thuật.

Nhiệm vụ:
${selectedStep.title}

Ngữ cảnh:
Tôi đang làm bài tập lớn môn Software Engineering về kiến trúc microservices.

Yêu cầu:
- Trình bày rõ ràng
- Có cấu trúc từng phần
- Gợi ý ví dụ thực tế
- Không làm thay hoàn toàn, chỉ hỗ trợ định hướng`}
                </pre>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
