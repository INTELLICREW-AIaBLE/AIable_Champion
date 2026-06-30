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
  Target,
} from 'lucide-react';

interface SourceLink {
  title: string;
  url: string;
  snippet: string;
}

interface AnalyzedClaim {
  claim: string;
  status: 'verified' | 'unverified' | 'disputed';
  explanation: string;
  sources: SourceLink[];
  confidence: number;
}

interface ValidationResult {
  success: boolean;
  overallScore: number;
  totalClaims: number;
  verifiedCount: number;
  unverifiedCount: number;
  disputedCount: number;
  claims: AnalyzedClaim[];
  summary: string;
  source: string;
  message?: string;
}

export default function ValidatorPage() {
  const [output, setOutput] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const charCount = output.length;
  const canValidate = output.trim().length >= 20 && output.trim().length <= 5000 && !loading;

  const getStatusLabel = (status: AnalyzedClaim['status']) => {
    if (status === 'verified') return 'Xác thực';
    if (status === 'disputed') return 'Có vấn đề';
    return 'Chưa rõ';
  };

  const getStatusStyle = (status: AnalyzedClaim['status']) => {
    if (status === 'verified') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'disputed') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const handleValidate = async () => {
    if (!canValidate) return;

    setLoading(true);
    setResult(null);

    try {
      const textToValidate = context.trim()
        ? `Ngữ cảnh / yêu cầu gốc:\n${context.trim()}\n\nVăn bản cần kiểm định:\n${output.trim()}`
        : output.trim();

      const res = await fetch('http://localhost:5001/api/validator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToValidate,
        }),
      });

      const data: ValidationResult = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Kiểm chứng thất bại.');
      }

      setResult(data);
    } catch (error) {
      console.error('[Validate Error]:', error);

      setResult({
        success: false,
        overallScore: 0,
        totalClaims: 0,
        verifiedCount: 0,
        unverifiedCount: 0,
        disputedCount: 0,
        claims: [],
        summary:
          error instanceof Error
            ? error.message
            : 'Không thể kết nối tới backend validator.',
        source: 'frontend-error',
      });
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
            <h1 className="text-2xl font-black text-slate-900">
              Output Validator
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Kiểm định kết quả từ AI, phát hiện ảo giác hallucination và đánh giá độ chính xác.
          </p>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reset
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
                Văn bản cần kiểm định AI Output
              </span>

              <span
                className={`text-xs font-medium ${
                  charCount > 5000 ? 'text-red-500' : 'text-slate-400'
                }`}
              >
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
                Ngữ cảnh / Yêu cầu gốc Tùy chọn
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
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
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

        {/* ── Instructions / Rules Right Column ─────────────────────────────── */}
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
                  <p className="text-sm font-semibold text-slate-700">
                    Tách phát ngôn
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AI sẽ tách văn bản thành các claim có thể kiểm chứng.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Đối chiếu nguồn
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Backend dùng Gemini và Google Search nếu đã cấu hình key.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Kết luận độ tin cậy
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mỗi claim được phân loại là xác thực, chưa rõ, hoặc có vấn đề.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        )}

        {/* ── Loading Skeleton Right Column ────────────────────────────────── */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse self-start">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
            <div className="h-24 bg-slate-100 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 rounded-xl w-full" />
          </div>
        )}

        {/* ── Validation Results Right Column ──────────────────────────────── */}
        {result && !loading && (
          <div className="space-y-4 self-start">
            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                Confidence Score
              </p>

              <div className="flex items-end justify-center gap-1">
                <span
                  className={`text-5xl font-black ${getScoreColor(
                    result.overallScore
                  )}`}
                >
                  {result.overallScore}
                </span>
                <span className="text-xl font-bold text-slate-400 mb-1">
                  /100
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Nguồn xử lý: {result.source}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-2">
                Tóm tắt kết quả
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Claim Counts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                Thống kê claim
              </h3>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Tổng phát ngôn</span>
                  <span className="font-bold text-slate-800">
                    {result.totalClaims}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Đã xác thực</span>
                  <span className="font-bold text-emerald-600">
                    {result.verifiedCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Chưa rõ</span>
                  <span className="font-bold text-amber-500">
                    {result.unverifiedCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Có vấn đề</span>
                  <span className="font-bold text-red-500">
                    {result.disputedCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Status */}
            <div
              className={`rounded-2xl border p-5 ${
                result.success
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-red-50 border-red-100'
              }`}
            >
              <h3
                className={`text-sm font-bold mb-2 flex items-center gap-2 ${
                  result.success ? 'text-emerald-800' : 'text-red-800'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {result.success ? 'Backend phản hồi thành công' : 'Có lỗi xảy ra'}
              </h3>

              <p
                className={`text-xs leading-relaxed ${
                  result.success ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {result.success
                  ? 'Kết quả bên dưới được lấy trực tiếp từ API /api/validator.'
                  : result.summary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Claim Findings Bottom Full Width ───────────────────────────────── */}
      {result && !loading && result.claims.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-emerald-600" />
            Chi tiết các phát ngôn được kiểm chứng
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.claims.map((claim, i) => (
              <div
                key={i}
                className="bg-slate-50/70 border border-slate-100 rounded-xl p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                      claim.status
                    )}`}
                  >
                    {getStatusLabel(claim.status)}
                  </span>

                  <span className="text-[10px] font-bold text-slate-400">
                    {claim.confidence}/100
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-800 mb-2 leading-relaxed">
                  “{claim.claim}”
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  <span className="font-semibold text-slate-700">
                    Giải thích:{' '}
                  </span>
                  {claim.explanation}
                </p>

                {claim.sources.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500">
                      Nguồn tham khảo
                    </p>

                    {claim.sources.map((source, sourceIndex) => (
                      <a
                        key={sourceIndex}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-slate-100 bg-white p-3 hover:bg-slate-50 transition"
                      >
                        <p className="text-xs font-semibold text-emerald-700 line-clamp-1">
                          {source.title || source.url}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {source.snippet}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    Không có nguồn web trả về cho claim này.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {result && !loading && result.claims.length === 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Không tìm thấy claim cụ thể
          </h3>
          <p className="text-sm text-slate-600">
            Backend không tách được phát ngôn nào đủ rõ để kiểm chứng.
          </p>
        </div>
      )}
    </div>
  );
}
