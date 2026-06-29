'use client';

import { useEffect, useState } from 'react';
import {
  Bot,
  ChevronRight,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

type TimelineStep = {
  stepName: string;
  description: string;
  suggestedTool: string;
  reason: string;
  suggestedPrompt: string;
};

const MOCK_STEPS: TimelineStep[] = [
  {
    stepName: 'Phân tích yêu cầu',
    description:
      'Xác định bài toán, đối tượng sử dụng, chức năng chính của hệ thống.',
    suggestedTool: 'Gemini',
    reason: 'Gemini giúp brainstorm nhanh các use case và yêu cầu hệ thống.',
    suggestedPrompt:
      'Phân tích yêu cầu hệ thống cho dự án [TÊN_DỰ_ÁN]...',
  },
];

export default function TaskMatcherPage() {
  const [selectedStep, setSelectedStep] = useState<TimelineStep | null>(null);

  const [taskDescription, setTaskDescription] = useState(
    'Làm báo cáo môn Software Engineering về kiến trúc microservices'
  );

  const [subject, setSubject] = useState('software engineering');
  const [steps, setSteps] = useState<TimelineStep[]>(MOCK_STEPS);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        setLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/task-matcher`);
        const json = await res.json();

        setSteps(Array.isArray(json.data) ? json.data : MOCK_STEPS);
      } catch (error) {
        console.error('Failed to fetch task workflow:', error);
        setSteps(MOCK_STEPS);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, []);

  const handleMatchTask = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/task-matcher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          description: taskDescription,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Task matcher failed');
      }

      setSteps(Array.isArray(json.steps) ? json.steps : []);
      setSource(json.source || '');
    } catch (error) {
      console.error('Failed to match task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            AI Task-Matcher
          </h1>
        </div>

        <p className="text-sm text-slate-500">
          Mô tả bài tập lớn — hệ thống phân rã thành từng bước và gợi ý công cụ
          AI phù hợp nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_150px] gap-3">
        <input
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-700 focus:outline-none focus:border-violet-300"
        />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-medium text-slate-600 focus:outline-none"
        >
          <option value="software engineering">Software Engineering</option>
          <option value="marketing">Marketing</option>
          <option value="business administration">
            Business Administration
          </option>
          <option value="data science">Data Science</option>
        </select>

        <button
          onClick={handleMatchTask}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-purple-800 active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Bot className="w-4 h-4" />
          {loading ? 'Đang phân tích...' : 'Phân tích nhiệm vụ'}
        </button>
      </div>

      <div className="rounded-2xl bg-violet-50 border border-violet-100 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-violet-600" />
          <span className="font-bold text-violet-800">
            Báo cáo SE — Kiến trúc Microservices
          </span>
          <span className="text-violet-400">•</span>
          <span className="font-semibold text-violet-600">
            Estimated: 3–4 ngày
          </span>

          {source && (
            <>
              <span className="text-violet-400">•</span>
              <span className="font-semibold text-violet-600">
                Source: {source}
              </span>
            </>
          )}
        </div>
      </div>

      <section className="space-y-3">
        {steps.map((step, index) => (
          <button
            key={`${step.stepName}-${index}`}
            onClick={() => setSelectedStep(step)}
            className="w-full group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-violet-100 transition-all duration-300 p-4 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-black text-slate-800">
                      {index + 1}. {step.stepName}
                    </h2>

                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 shrink-0 mt-1" />
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-violet-50 text-violet-600">
                    {step.suggestedTool}
                  </span>

                  <span className="ml-auto text-[11px] font-bold text-violet-600 group-hover:underline">
                    Xem prompt mẫu →
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
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
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide">
                  Chi tiết bước
                </p>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedStep.stepName}
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

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">
                  Công cụ đề xuất
                </p>

                <p className="text-sm font-black text-purple-800">
                  {selectedStep.suggestedTool}
                </p>

                <p className="text-sm text-slate-700 leading-relaxed mt-2">
                  {selectedStep.reason}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mb-2">
                  Prompt mẫu
                </p>

                <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-mono">
                  {selectedStep.suggestedPrompt ||
                    `Bạn là trợ lý học thuật.

Nhiệm vụ:
${selectedStep.stepName}

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
