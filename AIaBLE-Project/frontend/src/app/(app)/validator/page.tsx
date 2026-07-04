'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  FolderPlus,
  Loader2,
  Paperclip,
  Check,
  History,
  Copy,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import SaveToProjectModal from '@/components/shared/SaveToProjectModal';
import Tesseract from 'tesseract.js';
import { useAuth } from '@/hooks/useAuth';

interface Claim {
  _id: string;
  text: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  signals: {
    selfInconsistency: number;
    noSourceFound: number;
    sourceContradiction: number;
    overconfidenceLanguage: number;
  };
  card: {
    reasonText: string;
    guidingQuestions: string[];
    suggestedSearchTerms: string[];
    sourceUrl?: string;
  };
  resolution: {
    resolved: boolean;
    resolvedAt?: string;
    userNote?: string;
  };
}

interface Essay {
  _id: string;
  rawText: string;
  criticalThinkingScore: number;
  summary: string;
  createdAt: string;
}

const t = {
  vi: {
    title: 'AI Ethics Guardrail',
    desc: 'Phát hiện rủi ro ảo giác (Hallucination) & Thẻ tư duy phản biện hỗ trợ sinh viên học tập chủ động.',
    reset: 'Đặt lại',
    inputLabel: 'Văn bản AI cần phân tích',
    inputPlaceholder: 'Dán câu trả lời của AI vào đây để phân tích nguy cơ ảo giác và nhận thẻ phản biện...',
    chars: 'ký tự',
    hint: 'Nhập tối thiểu 20 ký tự để bắt đầu kiểm định',
    analyzing: 'Đang phân tích...',
    validateBtn: 'Phân tích phản biện',
    criteriaTitle: 'Tiêu chí kiểm định',
    c1: 'Độ bất nhất (CoVe)',
    c1d: 'Đo lường mức độ sai lệch qua các câu hỏi xác thực độc lập.',
    c2: 'Tra cứu đối chiếu (RAG)',
    c2d: 'Tìm kiếm chéo dữ liệu trên Wikipedia và Web.',
    c3: 'Ngôn ngữ phóng đại',
    c3d: 'Cảnh báo các từ ngữ khẳng định 100% nhưng thiếu dẫn nguồn.',
    score: 'Critical Thinking Index',
    scoreDesc: 'Chỉ số chất lượng lập luận và kiểm chứng tư duy.',
    checkTitle: 'Thống kê kiểm chứng',
    check1: 'Đã phát hiện {n} luận điểm học thuật',
    check2: 'Điểm tư duy độc lập > 50%',
    check3: 'Mức độ cảnh báo an toàn',
    suggestTitle: 'Tóm tắt nhận định',
    suggestMsg1: 'Hãy bấm vào từng câu bị bôi đậm màu để rèn luyện tư duy phản biện.',
    errConn: 'Không thể kết nối đến server backend.',
    errGen: 'Có lỗi xảy ra khi phân tích.',
    scanImg: 'Quét từ Ảnh/Tài liệu',
    scanning: 'Đang trích xuất chữ...',
    scanErr: 'Không thể nhận diện văn bản. Vui lòng thử lại.',
    disclaimer: 'AIaBLE là trợ lý rèn luyện tư duy học tập. Kết quả phân tích mang tính gợi ý cảnh báo rủi ro ảo giác, sinh viên chịu trách nhiệm kiểm chứng cuối cùng.',
    resolveBtn: 'Xác nhận đã tự kiểm chứng',
    resolvePlaceholder: 'Nhập ghi chú phản biện của bạn (ví dụ: nguồn tin cậy tìm được, nội dung đúng thực tế...)',
    resolvedStatus: 'Sinh viên đã tự kiểm chứng',
    riskHigh: 'Cảnh báo rủi ro cao',
    riskMedium: 'Cần đối chiếu nguồn',
    riskLow: 'Độ nhất quán cao',
    guidingTitle: 'Câu hỏi định hướng phản biện',
    searchTitle: 'Từ khóa gợi ý tự tra cứu',
    emptyState: 'Chọn một phân đoạn có gạch chân sóng trong văn bản để mở Thẻ Tư duy Phản biện tương ứng.',
    historyBtn: 'Lịch sử bài viết',
    resolvedCount: 'Đã kiểm chứng: {k}/{n} luận điểm',
    copySuccess: 'Đã copy từ khóa!',
    resolveSuccess: 'Đã lưu ghi chú kiểm chứng thành công!'
  },
  en: {
    title: 'AI Ethics Guardrail',
    desc: 'Detect AI hallucinations and get Critical Thinking Cards to encourage active student self-verification.',
    reset: 'Reset',
    inputLabel: 'AI Text to Analyze',
    inputPlaceholder: 'Paste the AI answer here to check for hallucination risks and get thinking cards...',
    chars: 'chars',
    hint: 'Enter at least 20 characters to start analysis',
    analyzing: 'Analyzing...',
    validateBtn: 'Analyze Critical Thinking',
    criteriaTitle: 'Evaluation Criteria',
    c1: 'Consistency (CoVe)',
    c1d: 'Measure deviation via independent verification questions.',
    c2: 'Cross-Check (RAG)',
    c2d: 'Cross-reference data on Wikipedia and Web.',
    c3: 'Exaggerated Language',
    c3d: 'Warn against absolute claims lacking citation references.',
    score: 'Critical Thinking Index',
    scoreDesc: 'Academic logic quality and self-verification score.',
    checkTitle: 'Verification Statistics',
    check1: 'Detected {n} academic claims',
    check2: 'Critical Thinking Index > 50%',
    check3: 'Safety warning level',
    suggestTitle: 'Analysis Summary',
    suggestMsg1: 'Click on each wavy underlined statement to train your critical thinking.',
    errConn: 'Cannot connect to backend server.',
    errGen: 'An error occurred during analysis.',
    scanImg: 'Scan from Image/Document',
    scanning: 'Extracting text...',
    scanErr: 'Could not recognize text. Please try again.',
    disclaimer: 'AIaBLE is an academic support assistant. Analysis results are warnings of hallucination risks; students bear the final responsibility for verification.',
    resolveBtn: 'Confirm Self-Verified',
    resolvePlaceholder: 'Enter your verification notes (e.g. reliable source found, verified facts...)',
    resolvedStatus: 'Student Self-Verified',
    riskHigh: 'High Risk Warning',
    riskMedium: 'Needs Cross-Referencing',
    riskLow: 'Highly Consistent',
    guidingTitle: 'Guiding Critical Questions',
    searchTitle: 'Suggested Search Queries',
    emptyState: 'Click on a wavy underlined statement in the text to open its Critical Thinking Card.',
    historyBtn: 'Essay History',
    resolvedCount: 'Verified: {k}/{n} claims',
    copySuccess: 'Search terms copied!',
    resolveSuccess: 'Verification note saved successfully!'
  }
};

export default function ValidatorPage() {
  const { userProfile } = useAuth();
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

  const text = t[lang as 'en' | 'vi'] || t.vi;

  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [essay, setEssay] = useState<Essay | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isScanning, setIsScanning] = useState<'output' | null>(null);
  const [historyList, setHistoryList] = useState<{ essay: Essay; claims: Claim[] }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Resolve input form state
  const [userNote, setUserNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch History on mount if user is admin
  useEffect(() => {
    if (userProfile && userProfile.role === 'admin') {
      fetchHistory();
    }
  }, [userProfile]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/validator/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setHistoryList(json.data || []);
        }
      }
    } catch (err) {
      console.error('Lỗi lấy lịch sử:', err);
    }
  };

  const processImageFile = async (file: File, target: 'output') => {
    try {
      setIsScanning(target);
      const ocrLang = lang === 'vi' ? 'vie+eng' : 'eng';
      
      const resultData = await Tesseract.recognize(file, ocrLang, {
        logger: (m) => console.log(m)
      });
      
      const extractedText = resultData.data.text.trim();
      if (extractedText) {
        if (target === 'output') {
          setOutput(prev => prev ? `${prev}\n\n${extractedText}` : extractedText);
        }
      } else {
        alert(text.scanErr);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      alert(text.scanErr);
    } finally {
      setIsScanning(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'output') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      await processImageFile(file, target);
    } else {
      setIsScanning(target);
      const reader = new FileReader();
      reader.onload = (event) => {
        const extractedText = event.target?.result as string;
        if (extractedText) {
          if (target === 'output') {
            setOutput(prev => prev ? `${prev}\n\n[Nội dung file ${file.name}]:\n${extractedText}` : `[Nội dung file ${file.name}]:\n${extractedText}`);
          }
        }
        setIsScanning(null);
      };
      reader.onerror = () => {
        alert(text.scanErr);
        setIsScanning(null);
      };
      reader.readAsText(file);
    }

    if (target === 'output' && fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, target: 'output') => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          processImageFile(file, target);
          break;
        }
      }
    }
  };

  const charCount = output.length;
  const combinedText = output.trim();
  const canValidate = combinedText.length >= 20 && !loading;

  const handleValidate = async () => {
    if (!canValidate) return;
    setLoading(true);
    setEssay(null);
    setClaims([]);
    setSelectedClaim(null);

    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'default-user' : 'default-user';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/validator/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: combinedText,
          userId,
          geminiKey: typeof window !== 'undefined' ? localStorage.getItem('geminiKey') || undefined : undefined
        }),
      });

      const json = await res.json();
      
      if (res.ok && json.success !== false) {
        setEssay(json.essay);
        setClaims(json.claims || []);
        fetchHistory(); // Refresh history list

        // Save activity log
        const token = localStorage.getItem('token');
        if (token) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/profile/history`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              action: 'AI Ethics Guardrail Analysis',
              tool: 'AI Ethics Guardrail',
              detail: `Text length: ${combinedText.length} chars. Claims flagged: ${(json.claims || []).length}`,
              model: 'Gemini',
              prompt: combinedText,
              result: json.essay.summary
            })
          }).catch(err => console.error('Lỗi khi lưu lịch sử:', err));
        }
      } else {
        console.error('Validation error:', json.message);
        alert(json.message || text.errGen);
      }
    } catch (error) {
      console.error('Failed to validate output:', error);
      alert(text.errConn);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOutput('');
    setEssay(null);
    setClaims([]);
    setSelectedClaim(null);
  };

  const handleResolveClaim = async () => {
    if (!selectedClaim) return;
    setResolving(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/validator/claims/${selectedClaim._id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolved: true,
          userNote
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const updatedClaim = json.data;
        // Update claims list in state
        setClaims(prev => prev.map(c => c._id === updatedClaim._id ? updatedClaim : c));
        setSelectedClaim(updatedClaim);
        setUserNote('');
        alert(text.resolveSuccess);
      } else {
        alert(json.message || text.errGen);
      }
    } catch (error) {
      console.error('Failed to resolve claim:', error);
      alert(text.errConn);
    } finally {
      setResolving(false);
    }
  };

  const selectHistoryItem = (historyItem: { essay: Essay; claims: Claim[] }) => {
    setEssay(historyItem.essay);
    setClaims(historyItem.claims);
    setOutput(historyItem.essay.rawText);
    setSelectedClaim(null);
    setShowHistory(false);
  };

  // Helper to copy search query
  const handleCopyText = (textToCopy: string, index: number) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to render highlights dynamically inside raw text
  const renderHighlightedText = (rawText: string) => {
    if (!claims || claims.length === 0) return <p className="whitespace-pre-wrap">{rawText}</p>;

    // Sort claims by length descending to match longest substrings first
    const sortedClaims = [...claims].sort((a, b) => b.text.length - a.text.length);

    let parts: { text: string; claim?: Claim }[] = [{ text: rawText }];

    for (const claim of sortedClaims) {
      const newParts: { text: string; claim?: Claim }[] = [];
      for (const part of parts) {
        if (part.claim) {
          newParts.push(part);
          continue;
        }

        const idx = part.text.indexOf(claim.text);
        if (idx !== -1) {
          const before = part.text.substring(0, idx);
          const match = claim.text;
          const after = part.text.substring(idx + claim.text.length);

          if (before) newParts.push({ text: before });
          newParts.push({ text: match, claim });
          if (after) newParts.push({ text: after });
        } else {
          newParts.push(part);
        }
      }
      parts = newParts;
    }

    return (
      <p className="whitespace-pre-wrap leading-relaxed text-slate-800 text-sm md:text-base">
        {parts.map((part, index) => {
          if (!part.claim) return <span key={index}>{part.text}</span>;

          const claimObj = part.claim;
          const isSelected = selectedClaim && selectedClaim._id === claimObj._id;
          const isResolved = claimObj.resolution.resolved;

          let underlineClass = '';
          if (isResolved) {
            underlineClass = 'underline decoration-solid decoration-emerald-500 decoration-2 underline-offset-4 bg-emerald-50 text-emerald-900 font-medium';
          } else if (claimObj.riskLevel === 'high') {
            underlineClass = 'underline decoration-wavy decoration-red-500 decoration-2 underline-offset-4 hover:bg-red-50 text-slate-900';
          } else if (claimObj.riskLevel === 'medium') {
            underlineClass = 'underline decoration-wavy decoration-amber-500 decoration-2 underline-offset-4 hover:bg-amber-50 text-slate-900';
          } else {
            underlineClass = 'underline decoration-wavy decoration-emerald-500 decoration-2 underline-offset-4 hover:bg-emerald-50 text-slate-900';
          }

          return (
            <span
              key={index}
              onClick={() => {
                // Find latest state of claimObj (in case it was updated in claims state)
                const freshClaim = claims.find(c => c._id === claimObj._id) || claimObj;
                setSelectedClaim(freshClaim);
              }}
              className={`cursor-pointer transition duration-150 px-0.5 rounded ${underlineClass} ${
                isSelected ? 'ring-2 ring-violet-500 ring-offset-1 bg-violet-50/50' : ''
              }`}
              title={isResolved ? text.resolvedStatus : text[('risk' + claimObj.riskLevel.charAt(0).toUpperCase() + claimObj.riskLevel.slice(1)) as 'riskHigh' | 'riskMedium' | 'riskLow']}
            >
              {part.text}
            </span>
          );
        })}
      </p>
    );
  };

  const resolvedClaimsCount = claims.filter(c => c.resolution.resolved).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center shadow-md shadow-violet-200">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">{text.title}</h1>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            {text.desc}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userProfile && userProfile.role === 'admin' && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition"
            >
              <History className="w-3.5 h-3.5" /> {text.historyBtn}
            </button>
          )}
          {essay && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> {text.reset}
            </button>
          )}
        </div>
      </div>

      {/* ── Essay History Dropdown Drawer ────────────────────────────────────── */}
      {showHistory && userProfile && userProfile.role === 'admin' && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 animate-in slide-in-from-top duration-200">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
            <History className="w-4 h-4 text-violet-600" />
            Lịch sử phân tích bài luận gần đây
          </h3>
          {historyList.length === 0 ? (
            <p className="text-xs text-slate-400">Không tìm thấy bài viết nào trước đây.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {historyList.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectHistoryItem(item)}
                  className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-violet-300 hover:shadow transition cursor-pointer text-left"
                >
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    "{item.essay.rawText}"
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.essay.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                    </span>
                    <span className="text-xs font-bold text-violet-600">
                      CTI: {item.essay.criticalThinkingScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Main Workspace: Two Column Layout ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        
        {/* Left Column: Input / Wavy Underline Viewer */}
        <div className="space-y-4">
          {!essay ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  {text.inputLabel}
                </span>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*,.txt,.md,.csv,.json" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFileUpload(e, 'output')} 
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning !== null}
                    title={text.scanImg}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 disabled:opacity-50 transition"
                  >
                    {isScanning === 'output' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isScanning === 'output' ? text.scanning : text.scanImg}</span>
                  </button>
                  <span className={`text-xs font-medium ${charCount > 5000 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {charCount}/5000 {text.chars}
                  </span>
                </div>
              </div>

              <textarea 
                maxLength={5000}
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder={text.inputPlaceholder}
                rows={12}
                className="w-full px-5 py-4 text-sm md:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed min-h-[300px]"
                onPaste={(e) => handlePaste(e, 'output')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleValidate();
                  }
                }}
              />

              {isScanning === 'output' && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2 text-violet-600 bg-white px-4 py-3 rounded-xl shadow-lg border border-violet-100 animate-in zoom-in duration-200">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm font-bold">{text.scanning}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Wavy Highlight Read-only Viewer */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-violet-500" />
                  Văn bản đã bóc tách phân tích
                </span>
                <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-bold">
                  {text.resolvedCount.replace('{k}', resolvedClaimsCount.toString()).replace('{n}', claims.length.toString())}
                </span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 min-h-[300px]">
                {renderHighlightedText(essay.rawText)}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 max-w-[70%]">
              <Info className="w-3.5 h-3.5 shrink-0" />
              {!essay ? text.hint : 'Bấm vào bất kỳ cụm từ gạch chân lượn sóng nào ở trên để mở Thẻ Phản biện.'}
            </div>
            {!essay && (
              <button
                onClick={handleValidate}
                disabled={!canValidate}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    {text.analyzing}
                  </>
                ) : (
                  <>
                    <ScanSearch className="w-4 h-4" />
                    {text.validateBtn}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Permanent Academic Disclaimer Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-left">
            <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {text.disclaimer}
            </p>
          </div>
        </div>

        {/* Right Column: Standard Cards OR Critical Thinking Card */}
        <div className="space-y-4">
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
              <div className="h-24 bg-slate-100 rounded-xl w-full" />
              <div className="h-16 bg-slate-100 rounded-xl w-full" />
              <div className="h-16 bg-slate-100 rounded-xl w-full" />
            </div>
          )}

          {!essay && !loading && (
            <div className="bg-slate-50 rounded-2xl border border-slate-150 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-600" />
                {text.criteriaTitle}
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{text.c1}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{text.c1d}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{text.c2}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{text.c2d}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{text.c3}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{text.c3d}</p>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {/* Essay Results Loaded */}
          {essay && !loading && (
            <div className="space-y-4">
              
              {/* Score / Critical Thinking Index Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center relative overflow-hidden">
                <button onClick={() => setShowSaveModal(true)} className="absolute top-3 right-3 p-1.5 text-violet-600 hover:bg-violet-50 rounded-lg transition z-10" title="Lưu vào Dự án">
                  <FolderPlus className="w-5 h-5" />
                </button>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{text.score}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className={`text-5xl font-black ${essay.criticalThinkingScore >= 80 ? 'text-emerald-600' : essay.criticalThinkingScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                    {essay.criticalThinkingScore}
                  </span>
                  <span className="text-xl font-bold text-slate-400 mb-1">/100</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {text.scoreDesc}
                </p>
              </div>

              {/* Dynamic Panel: Critical Thinking Card details or Placeholder */}
              {!selectedClaim ? (
                /* Card Placeholder */
                <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-6 text-center border-dashed min-h-[250px] flex flex-col items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[80%] mx-auto">
                    {text.emptyState}
                  </p>
                </div>
              ) : (
                /* ACTIVE Critical Thinking Card */
                <div className="bg-white rounded-2xl border border-slate-250 shadow-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-violet-600" />
                  
                  {/* Card Title & Risk Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-violet-600 uppercase tracking-widest">
                      🎓 Thẻ tư duy phản biện
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                      selectedClaim.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                      selectedClaim.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {text[('risk' + selectedClaim.riskLevel.charAt(0).toUpperCase() + selectedClaim.riskLevel.slice(1)) as 'riskHigh' | 'riskMedium' | 'riskLow']}
                    </span>
                  </div>

                  {/* Claim Text */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Luận điểm cần thẩm định</p>
                    <p className="text-xs md:text-sm font-semibold text-slate-700 italic">
                      "{selectedClaim.text}"
                    </p>
                  </div>

                  {/* Risk Assessment Reason */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Phân tích nguy cơ rủi ro</p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/50">
                      {selectedClaim.card.reasonText}
                    </p>
                  </div>

                  {/* Verified Source URL Link */}
                  {selectedClaim.card.sourceUrl && (
                    <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                          🔗 Nguồn kiểm chứng thực tế
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5" title={selectedClaim.card.sourceUrl}>
                          {selectedClaim.card.sourceUrl}
                        </p>
                      </div>
                      <a
                        href={selectedClaim.card.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition shrink-0"
                      >
                        <span>Xem nguồn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Guiding Questions */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">{text.guidingTitle}</p>
                    <ul className="space-y-2">
                      {selectedClaim.card.guidingQuestions.map((q, idx) => (
                        <li key={idx} className="flex gap-1.5 text-xs text-slate-600 leading-relaxed items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Search Queries */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">{text.searchTitle}</p>
                    <div className="space-y-1.5">
                      {selectedClaim.card.suggestedSearchTerms.map((term, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                          <span className="font-mono text-slate-600 truncate mr-2">{term}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleCopyText(term, idx)}
                              className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded transition"
                              title="Sao chép từ khóa"
                            >
                              {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(term)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-slate-200 text-slate-400 hover:text-blue-600 rounded transition"
                              title="Tra cứu trên Google"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resolve / Verify Form Section */}
                  <div className="border-t border-slate-100 pt-4 mt-2">
                    {selectedClaim.resolution.resolved ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-800">{text.resolvedStatus}</p>
                          {selectedClaim.resolution.userNote && (
                            <p className="text-[11px] text-emerald-700 mt-1 italic">
                              "{selectedClaim.resolution.userNote}"
                            </p>
                          )}
                          <p className="text-[9px] text-emerald-500 mt-1">
                            {selectedClaim.resolution.resolvedAt ? new Date(selectedClaim.resolution.resolvedAt).toLocaleString() : ''}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          value={userNote}
                          onChange={(e) => setUserNote(e.target.value)}
                          placeholder={text.resolvePlaceholder}
                          rows={2}
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none placeholder:text-slate-400"
                        />
                        <button
                          onClick={handleResolveClaim}
                          disabled={resolving}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-emerald-600 text-xs font-bold text-white rounded-lg hover:bg-emerald-750 active:scale-95 transition disabled:opacity-50"
                        >
                          {resolving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          {text.resolveBtn}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Suggestions Summary from AI */}
              <div className="bg-violet-50 rounded-2xl border border-violet-100 p-5">
                <h3 className="text-xs font-black text-violet-800 mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  {text.suggestTitle}
                </h3>
                <p className="text-xs text-violet-700 leading-relaxed">
                  {essay.summary}
                </p>
                <div className="mt-3 flex items-start gap-1.5 text-[10px] text-violet-600">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-70" />
                  <span>{text.suggestMsg1}</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── Save to Project Modal ─────────────────────────────────────────────────── */}
      {essay && (
        <SaveToProjectModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          data={{
            prompt: output,
            result: `Critical Thinking Score: ${essay.criticalThinkingScore}/100\nSummary: ${essay.summary}`,
            aiModel: 'Gemini'
          }}
        />
      )}
    </div>
  );
}
