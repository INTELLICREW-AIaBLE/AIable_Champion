'use client';

import { HelpCircle, Search, Mail, MessageSquare, FileText, ChevronRight } from 'lucide-react';

const FAQS = [
  { question: 'Làm thế nào để đổi API Key?', answer: 'Bạn có thể truy cập vào Cài đặt > API Keys để nhập và lưu trữ mã API của riêng mình. Mã này chỉ lưu ở trình duyệt của bạn.' },
  { question: 'AI Sandbox khác gì Optimize Prompt?', answer: 'AI Sandbox cho phép bạn so sánh kết quả của nhiều model (GPT, Claude, Gemini) cùng lúc, trong khi Optimize tập trung vào việc tự động viết lại prompt của bạn sao cho chuẩn xác nhất.' },
  { question: 'Dữ liệu của tôi có được bảo mật không?', answer: 'Hoàn toàn bảo mật. Các dự án, prompt và thông tin của bạn được lưu trữ an toàn. AIaBLE không sử dụng dữ liệu của người dùng để train model.' },
  { question: 'Tôi có thể chia sẻ Recipe của mình không?', answer: 'Có, trong phiên bản tới bạn sẽ có tuỳ chọn Publish recipe của mình lên Community Library để chia sẻ với mọi người.' },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 backdrop-blur-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black mb-3">Xin chào, chúng tôi có thể giúp gì cho bạn?</h1>
          <p className="text-violet-100 mb-6">Tìm kiếm câu trả lời nhanh chóng hoặc liên hệ trực tiếp với đội ngũ hỗ trợ.</p>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nhập câu hỏi của bạn..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-violet-400/50 shadow-sm transition placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-600" />
            Câu hỏi thường gặp
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group p-6 cursor-pointer marker:content-['']">
                <summary className="flex items-center justify-between font-bold text-slate-800 select-none">
                  {faq.question}
                  <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="pt-4 text-slate-600 text-sm leading-relaxed pr-8">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-600" />
            Liên hệ
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0 text-violet-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 mb-1">Email Hỗ Trợ</p>
                <p className="text-xs text-slate-500 mb-2">Phản hồi trong vòng 24h làm việc.</p>
                <a href="mailto:support@alable.edu.vn" className="text-sm font-semibold text-violet-600 hover:underline">support@alable.edu.vn</a>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 mb-1">Live Chat</p>
                <p className="text-xs text-slate-500 mb-2">Trực tiếp với tư vấn viên.</p>
                <button className="text-sm font-semibold text-blue-600 hover:underline">Bắt đầu chat</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
