'use client';

import { useEffect, useState } from 'react';
import {
  Bot,
  ChevronRight,
  Layers,
  Sparkles,
  X,
  Play,
  CheckCircle,
  Copy,
  Save,
  RefreshCcw,
  ArrowRight,
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import SaveToProjectModal from '@/components/shared/SaveToProjectModal';

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

const t = {
  vi: {
    title: 'AI Task-Matcher',
    desc: 'Mô tả bài tập lớn — hệ thống phân rã thành từng bước và gợi ý công cụ AI phù hợp nhất.',
    placeholder: 'Làm báo cáo môn Software Engineering về kiến trúc microservices',
    analyzing: 'Đang phân tích...',
    analyzeBtn: 'Phân tích nhiệm vụ',
    estimated: 'Estimated: 3–4 ngày',
    viewPrompt: 'Xem prompt mẫu →',
    stepDetail: 'Chi tiết bước',
    stepDesc: 'Mô tả bước',
    suggestTool: 'Công cụ đề xuất',
    promptSample: 'Prompt mẫu',
    promptDefault: `Bạn là trợ lý học thuật.\n\nNhiệm vụ:\n{stepName}\n\nNgữ cảnh:\nTôi đang làm bài tập lớn...\n\nYêu cầu:\n- Trình bày rõ ràng\n- Có cấu trúc từng phần\n- Gợi ý ví dụ thực tế\n- Không làm thay hoàn toàn, chỉ hỗ trợ định hướng`,
    subjects: {
      'it_cs': 'Công nghệ thông tin & Khoa học máy tính',
      'econ_biz': 'Kinh tế & Quản trị',
      'lang_culture': 'Ngôn ngữ & Văn hóa học',
      'data_analytics': 'Khoa học dữ liệu & Phân tích',
      'engineering_tech': 'Kỹ thuật & Công nghệ',
      'mechanical': 'Kỹ thuật Cơ khí',
      'mechatronics_automation': 'Cơ điện tử & Tự động hóa',
      'health_sciences': 'Khoa học sức khỏe',
      'law_politics': 'Luật & Chính trị',
      'social_humanities': 'Khoa học xã hội & Nhân văn',
      'agri_environment': 'Nông Lâm Ngư nghiệp & Môi trường',
      'art_design': 'Nghệ thuật & Thiết kế'
    }
  },
  en: {
    title: 'AI Task-Matcher',
    desc: 'Describe your large assignment — the system breaks it down step-by-step and recommends the best AI tool.',
    placeholder: 'Write a Software Engineering report on microservices architecture',
    analyzing: 'Analyzing...',
    analyzeBtn: 'Analyze Task',
    estimated: 'Estimated: 3-4 days',
    viewPrompt: 'View sample prompt →',
    stepDetail: 'Step Details',
    stepDesc: 'Step Description',
    suggestTool: 'Suggested Tool',
    promptSample: 'Sample Prompt',
    promptDefault: `You are an academic assistant.\n\nTask:\n{stepName}\n\nContext:\nI'm working on an assignment...\n\nRequirements:\n- Present clearly\n- Structured sections\n- Provide real-world examples\n- Do not do it all for me, only assist with directions`,
    subjects: {
      'it_cs': 'Information Technology & Computer Science',
      'econ_biz': 'Economics & Management',
      'lang_culture': 'Linguistics & Cultural Studies',
      'data_analytics': 'Data Science & Analytics',
      'engineering_tech': 'Engineering & Technology',
      'mechanical': 'Mechanical Engineering',
      'mechatronics_automation': 'Mechatronics & Automation',
      'health_sciences': 'Health Sciences',
      'law_politics': 'Law & Politics',
      'social_humanities': 'Social Sciences & Humanities',
      'agri_environment': 'Agriculture & Environmental Resources',
      'art_design': 'Art & Design'
    }
  }
};

export default function TaskMatcherPage() {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [lang, setLang] = useState('vi');
  const [outputs, setOutputs] = useState<Record<number, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({});
  const [executingStep, setExecutingStep] = useState<number | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

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

  const text = t[lang as 'en' | 'vi'] || t.vi;

  const [taskDescription, setTaskDescription] = useState('');

  const [subject, setSubject] = useState('it_cs');
  const [steps, setSteps] = useState<TimelineStep[]>(MOCK_STEPS);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');
  const [activeTask, setActiveTask] = useState<{subject: string, desc: string} | null>(null);

  const selectedStep = selectedStepIndex !== null ? steps[selectedStepIndex] : null;

  const getInputForStep = (index: number): string => {
    if (customInputs[index] !== undefined) {
      return customInputs[index];
    }
    if (index === 0) {
      return taskDescription.trim() || text.placeholder;
    }
    return outputs[index - 1] || '';
  };

  const handleExecuteStep = async (index: number) => {
    if (index > 0 && !outputs[index - 1]) return;
    
    setExecutingStep(index);
    try {
      const token = localStorage.getItem('token');
      const step = steps[index];
      const stepInput = getInputForStep(index);
      const initialGoal = taskDescription.trim() || text.placeholder;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/task-matcher/execute-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stepName: step.stepName,
          description: step.description,
          suggestedPrompt: step.suggestedPrompt,
          suggestedTool: step.suggestedTool,
          input: stepInput,
          initialPrompt: initialGoal,
          lang
        })
      });

      const json = await res.json();
      if (json.success && json.output) {
        setOutputs(prev => ({ ...prev, [index]: json.output }));
        
        // Log activity history
        if (token) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/history`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              action: `Execute workflow step ${index + 1}`,
              tool: 'Task Matcher',
              detail: `Step: ${step.stepName} - ${initialGoal.substring(0, 30)}...`,
              model: 'Gemini'
            })
          }).catch(err => console.error('Lỗi khi lưu lịch sử:', err));
        }
      } else {
        alert(json.message || 'Thực thi bước thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error executing step:', error);
      alert('Không thể kết nối đến server backend.');
    } finally {
      setExecutingStep(null);
    }
  };

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/task-matcher`);
        const json = await res.json();
        setSteps(Array.isArray(json.data) ? json.data : MOCK_STEPS);
        setActiveTask({ subject: 'it_cs', desc: text.placeholder });
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
      // Reset pipeline state on new task analysis
      setOutputs({});
      setCustomInputs({});
      setSelectedStepIndex(null);

      const finalDesc = taskDescription.trim() || text.placeholder;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/task-matcher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description: finalDesc, lang }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Task matcher failed');
      setSteps(Array.isArray(json.steps) ? json.steps : []);
      setSource(json.source || '');
      setActiveTask({ subject, desc: finalDesc });
      
      // Log lịch sử hoạt động
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'Match workflow task',
            tool: 'Task Matcher',
            detail: `Subject: ${subject} - ${finalDesc.substring(0, 40)}${finalDesc.length > 40 ? '...' : ''}`,
            model: json.source || 'Groq'
          })
        }).catch(err => console.error('Lỗi khi lưu lịch sử:', err));
      }
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
            {text.title}
          </h1>
        </div>

        <p className="text-sm text-slate-500">
          {text.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px_150px] gap-3">
        <input maxLength={100}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder={text.placeholder}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-700 focus:outline-none focus:border-violet-300 w-full"
        />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-medium text-slate-600 focus:outline-none text-ellipsis overflow-hidden whitespace-nowrap"
        >
          {Object.entries(text.subjects).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <button
          onClick={handleMatchTask}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-purple-800 active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Bot className="w-4 h-4" />
          {loading ? text.analyzing : text.analyzeBtn}
        </button>
      </div>

      {activeTask && (
        <div className="rounded-2xl bg-violet-50 border border-violet-100 px-5 py-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-violet-600" />
            <span className="font-bold text-violet-800">
              {((text.subjects as any)[activeTask.subject] || activeTask.subject).toUpperCase()} — {activeTask.desc.substring(0, 40)}{activeTask.desc.length > 40 ? '...' : ''}
            </span>
            <span className="text-violet-400">•</span>
            <span className="font-semibold text-violet-600">
              {lang === 'vi' ? 'Đã phân tích' : 'Analyzed'}
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
      )}

      <section className="space-y-3">
        {steps.map((step, index) => (
          <button
            key={`${step.stepName}-${index}`}
            onClick={() => setSelectedStepIndex(index)}
            className={`w-full group bg-white rounded-2xl border transition-all duration-300 p-4 text-left ${selectedStepIndex === index ? 'border-violet-400 ring-2 ring-violet-50' : 'border-slate-100 shadow-sm hover:shadow-lg hover:shadow-violet-100'}`}
          >
            <div className="flex items-start gap-4">
              {/* Step number and status indicator */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${outputs[index] ? 'bg-emerald-100 text-emerald-700' : executingStep === index ? 'bg-violet-100 text-violet-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                {outputs[index] ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      {step.stepName}
                      {outputs[index] && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                          {lang === 'vi' ? 'Đã chạy' : 'Completed'}
                        </span>
                      )}
                      {executingStep === index && (
                        <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          {lang === 'vi' ? 'Đang chạy...' : 'Running...'}
                        </span>
                      )}
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
                    {outputs[index] ? (lang === 'vi' ? 'Xem kết quả →' : 'View result →') : text.viewPrompt}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </section>

      {selectedStepIndex !== null && selectedStep && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedStepIndex(null)}
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl p-6 overflow-y-auto flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Node {selectedStepIndex + 1} của Quy trình n8n
                </p>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedStep.stepName}
                </h2>
              </div>

              <button
                onClick={() => setSelectedStepIndex(null)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 flex-1 pb-10">
              {/* Step Description */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {text.stepDesc}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedStep.description}
                </p>
              </div>

              {/* Suggested Tool */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">
                  {text.suggestTool}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-purple-800 bg-purple-100/50 px-2 py-0.5 rounded-md">
                    {selectedStep.suggestedTool}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {selectedStep.reason}
                </p>
              </div>

              {/* Input for this step (n8n node input) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    📥 Dữ liệu đầu vào cho bước này
                  </p>
                  {selectedStepIndex > 0 && !outputs[selectedStepIndex - 1] && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Yêu cầu chạy bước trước
                    </span>
                  )}
                </div>

                {selectedStepIndex > 0 && !outputs[selectedStepIndex - 1] ? (
                  <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-xs leading-relaxed">
                    ⚠️ Chưa có dữ liệu từ bước trước. Hãy thực thi Bước {selectedStepIndex} ("{steps[selectedStepIndex - 1].stepName}") trước để tự động truyền kết quả sang bước này.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400">
                      * Bạn có thể chỉnh sửa/bổ dung dữ liệu dưới đây trước khi thực thi node này:
                    </p>
                    <textarea
                      rows={5}
                      value={getInputForStep(selectedStepIndex)}
                      onChange={(e) => setCustomInputs(prev => ({ ...prev, [selectedStepIndex!]: e.target.value }))}
                      className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400 bg-slate-50 focus:bg-white transition-colors"
                      placeholder="Dán hoặc chỉnh sửa thông tin đầu vào tại đây..."
                    />
                  </div>
                )}
              </div>

              {/* Execution Action Button */}
              {!(selectedStepIndex > 0 && !outputs[selectedStepIndex - 1]) && (
                <button
                  onClick={() => handleExecuteStep(selectedStepIndex)}
                  disabled={executingStep !== null}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-100 transition active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {executingStep === selectedStepIndex ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Đang thực thi với AI... (Gemini)</span>
                    </>
                  ) : outputs[selectedStepIndex] ? (
                    <>
                      <RefreshCcw className="w-4 h-4" />
                      <span>Chạy lại bước này</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Thực thi bước này (Chạy Node)</span>
                    </>
                  )}
                </button>
              )}

              {/* Output for this step (n8n node output) */}
              {outputs[selectedStepIndex] && (
                <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                      📤 Kết quả đầu ra (Node Output)
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(outputs[selectedStepIndex!]);
                          alert('Đã copy kết quả vào clipboard!');
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition flex items-center gap-1 text-[10px] font-bold"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </button>
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className="p-1.5 bg-violet-50 hover:bg-violet-100 rounded-lg text-violet-600 transition flex items-center gap-1 text-[10px] font-bold"
                        title="Save to project"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Lưu vào Dự án
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const rawOutput = outputs[selectedStepIndex!];
                    const audioUrl = rawOutput.match(/\[audio_url:(https?:\/\/[^\]]+)\]/)?.[1];
                    const cleanedOutput = rawOutput.replace(/\[audio_url:[^\]]+\]/g, '').trim();

                    return (
                      <div className="space-y-4">
                        {audioUrl && (
                          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col gap-2.5 shadow-inner">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                              Bản nhạc sinh ra từ Suno AI (Suno Audio Player)
                            </span>
                            <audio controls src={audioUrl} className="w-full h-10 mt-1" />
                          </div>
                        )}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs leading-relaxed max-h-[300px] overflow-y-auto">
                          <MarkdownRenderer content={cleanedOutput} />
                        </div>
                      </div>
                    );
                  })()}

                  {selectedStepIndex < 4 && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-[11px] rounded-xl font-medium">
                      <ArrowRight className="w-4 h-4 shrink-0" />
                      <span>Kết quả này đã được tự động truyền làm đầu vào cho Bước {selectedStepIndex + 2} ("{steps[selectedStepIndex + 1].stepName}").</span>
                    </div>
                  )}

                  {selectedStepIndex === 4 && (
                    <div className="flex items-center gap-2 p-3.5 bg-violet-50 text-violet-900 text-xs rounded-xl font-bold border border-violet-100">
                      <Sparkles className="w-5 h-5 shrink-0 text-violet-600 animate-pulse" />
                      <span>Tuyệt vời! Quy trình đã hoàn tất và kết quả cuối cùng đã đáp ứng trọn vẹn yêu cầu ban đầu của bạn. Bạn có thể lưu kết quả này vào dự án của mình để nộp bài hoặc phát triển tiếp!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {showSaveModal && selectedStepIndex !== null && (
        <SaveToProjectModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          data={{
            prompt: getInputForStep(selectedStepIndex),
            result: outputs[selectedStepIndex],
            aiModel: steps[selectedStepIndex].suggestedTool
          }}
        />
      )}
    </div>
  );
}
