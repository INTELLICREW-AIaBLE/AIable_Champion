import Link from 'next/link';
import { ShieldCheck, BookOpen, KeyRound, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800 transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang Đăng ký
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-violet-600 to-purple-800 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-black mb-3">Điều khoản & Điều kiện</h1>
              <p className="text-violet-100 opacity-90 text-sm">
                Cập nhật lần cuối: Tháng 6, 2026. Vui lòng đọc kỹ trước khi sử dụng AIaBLE.
              </p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">1. Đạo đức Học thuật (Academic Integrity)</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>AIaBLE được xây dựng với mục tiêu trở thành <strong>"Trợ lý Học tập"</strong> chứ không phải công cụ gian lận. Bằng việc đăng ký, bạn cam kết:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Không sử dụng nền tảng để yêu cầu AI "làm bài hộ", "thi hộ" hay giải quyết 100% khối lượng bài tập.</li>
                  <li>Mọi thông tin do AI trả về cần được đối chiếu, fact-check và trích dẫn rõ ràng (ví dụ: dùng chuẩn APA) khi đưa vào báo cáo học thuật.</li>
                  <li>Nếu hệ thống phát hiện prompt vi phạm quy định đạo đức (yêu cầu gian lận), tính năng cảnh báo tự động sẽ được kích hoạt.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">2. Quyền riêng tư & Quản lý API Keys</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>Bảo vệ dữ liệu người dùng là cốt lõi trong nguyên tắc vận hành của AIaBLE:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>API Keys cá nhân:</strong> Các mã API (Gemini, Claude, OpenAI) mà bạn cung cấp chỉ được lưu trữ cục bộ (Local Storage) hoặc mã hoá an toàn theo phiên. Chúng tôi KHÔNG chia sẻ cho bất kỳ bên thứ 3 nào.</li>
                  <li><strong>Quyền sở hữu Prompt:</strong> Toàn bộ "Recipes" và "Raw Prompts" của bạn thuộc quyền sở hữu của bạn. Hệ thống sẽ không sử dụng dữ liệu này để train model AI nếu không có sự đồng ý rõ ràng.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">3. Trách nhiệm người dùng</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-slate-600 leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Người dùng tự chịu trách nhiệm về nội dung (content) được tạo ra từ nền tảng khi nộp bài cho giảng viên hoặc xuất bản ra ngoài.</li>
                  <li>Không chia sẻ tài khoản với nhiều người. Nếu phát hiện lạm dụng tài nguyên (spam API), AIaBLE có quyền khóa tài khoản mà không cần báo trước.</li>
                </ul>
              </div>
            </section>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
            <p className="text-sm text-slate-500 mb-4">Nếu bạn đã hiểu rõ và đồng ý với các quy định trên, hãy tiến hành tạo tài khoản.</p>
            <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition shadow-sm">
              Đồng ý và Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
