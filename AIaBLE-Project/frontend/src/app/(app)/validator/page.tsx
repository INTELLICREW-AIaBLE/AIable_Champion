'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCcw,
  Search,
  FileText,
  ScanSearch,
  ChevronRight,
  Target
} from 'lucide-react';

interface ValidationResult {
  score: number;
  hallucinations: { text: string; reason: string; severity: 'high' | 'medium' | 'low' }[];
  suggestions: string[];
  isSafe: boolean;
  formatting: { label: string; passed: boolean }[];
}

export default function ValidatorPage() {
  const [output, setOutput] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const charCount = output.length;
  const canValidate = output.trim().length >= 20 && !loading;

  const handleValidate = async () => {
    if (!canValidate) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/validator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: output,
          geminiKey: typeof window !== 'undefined' ? localStorage.getItem('geminiKey') || undefined : undefined
        }),
      });

      const json = await res.json();
      
      if (res.ok && json.success !== false) {
        // Map backend ValidatorResult to frontend ValidationResult
        const formattedResult: ValidationResult = {
          score: json.overallScore || 0,
          isSafe: json.disputedCount === 0,
          hallucinations: (json.claims || [])
            .filter((c: any) => c.status === 'disputed' || c.status === 'unverified')
            .map((c: any) => ({
              text: c.claim,
              reason: c.explanation,
              severity: c.status === 'disputed' ? 'high' : 'medium'
            })),
          suggestions: [
            json.summary || '',
            'Kiểm tra lại các nguồn thông tin nếu có phát ngôn chưa xác thực.',
          ],
          formatting: [
            { label: `Kiểm tra ${json.totalClaims || 0} phát ngôn (Claims)`, passed: (json.totalClaims || 0) > 0 },
            { label: 'Độ tin cậy tổng thể > 50%', passed: (json.overallScore || 0) > 50 },
            { label: 'Không có phát ngôn bị bác bỏ', passed: json.disputedCount === 0 },
          ]
        };
        setResult(formattedResult);
      } else {
        console.error('Validation error:', json.message);
        alert(json.message || 'Có lỗi xảy ra khi kiểm định.');
      }
    } catch (error) {
      console.error('Failed to validate output:', error);
      alert('Không thể kết nối đến server backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOutput('');
    setContext('');
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-200">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Output Validator</h1>
          </div>
          <p className="text-sm text-slate-500">
            Kiểm định kết quả từ AI, phát hiện ảo giác (hallucination) và đánh giá độ chính xác, an toàn.
          </p>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* ── Input Area ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Văn bản cần kiểm định (AI Output)
              </span>
              <span className={`text-xs font-medium ${charCount > 5000 ? 'text-amber-500' : 'text-slate-400'}`}>
                {charCount}/5000 ký tự
              </span>
            </div>

            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Dán câu trả lời của AI vào đây để kiểm tra tính chính xác..."
              maxLength={5000}
              rows={8}
              className="w-full px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-5 py-3 border-b border-slate-100 bg-slate-50/50">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-400" />
                Ngữ cảnh / Yêu cầu gốc (Tùy chọn)
              </span>
            </div>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Nhập prompt ban đầu hoặc tài liệu tham khảo để đối chiếu tốt hơn..."
              rows={3}
              className="w-full px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5" />
              Nhập tối thiểu 20 ký tự để bắt đầu kiểm định
            </div>
            <button
              onClick={handleValidate}
              disabled={!canValidate}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Đang phân tích...
                </>
              ) : (
                <>
                  <ScanSearch className="w-4 h-4" />
                  Kiểm định ngay
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Instructions / Rules (Right Column) ─────────────────────────────────── */}
        {!result && !loading && (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 self-start">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Tiêu chí kiểm định
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Độ tin cậy (Hallucination)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Phát hiện các thông tin bịa đặt, sai sự thật do AI tự sinh ra.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Đánh giá tính logic</p>
                  <p className="text-xs text-slate-500 mt-0.5">Kiểm tra xem câu trả lời có mâu thuẫn nội tại hay không.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">An toàn & Đạo đức</p>
                  <p className="text-xs text-slate-500 mt-0.5">Lọc từ ngữ độc hại, thiên kiến hoặc vi phạm tiêu chuẩn cộng đồng.</p>
                </div>
              </li>
            </ul>
          </div>
        )}

        {/* ── Loading Skeleton (Right Column) ───────────────────────────────────── */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse self-start">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
            <div className="h-24 bg-slate-100 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 rounded-xl w-full" />
          </div>
        )}

        {/* ── Validation Results (Right Column) ───────────────────────────────────── */}
        {result && !loading && (
          <div className="space-y-4 self-start">
            
            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Confidence Score</p>
               <div className="flex items-end justify-center gap-1">
                 <span className={`text-5xl font-black ${result.score >= 80 ? 'text-emerald-600' : result.score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                   {result.score}
                 </span>
                 <span className="text-xl font-bold text-slate-400 mb-1">/100</span>
               </div>
               <p className="text-xs text-slate-400 mt-2">
                 Dựa trên đối chiếu đa chiều và fact-checking.
               </p>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Kiểm tra định dạng & ngữ cảnh</h3>
              <div className="space-y-2.5">
                {result.formatting.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    {item.passed ? (
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                       <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-violet-50 rounded-2xl border border-violet-100 p-5">
              <h3 className="text-sm font-bold text-violet-800 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Gợi ý cải thiện
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-violet-700 leading-relaxed">
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>

      {/* ── Hallucination Findings (Bottom Full Width) ─────────────────────────── */}
      {result && !loading && result.hallucinations.length > 0 && (
         <div className="bg-white rounded-2xl border border-red-100 shadow-sm shadow-red-50 p-5">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Phát hiện nguy cơ ảo giác (Hallucinations)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.hallucinations.map((h, i) => (
                <div key={i} className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      h.severity === 'high' ? 'bg-red-200 text-red-700' : 
                      h.severity === 'medium' ? 'bg-amber-200 text-amber-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {h.severity} risk
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1.5 line-clamp-2">
                    "{h.text}"
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-red-600">Lý do: </span>
                    {h.reason}
                  </p>
                </div>
              ))}
            </div>
         </div>
      )}

    </div>
  );
}
