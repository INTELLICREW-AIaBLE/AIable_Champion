# Bảng Theo Dõi Tiến Độ Dự Án (Project Progress Tracking)

## 📌 Tổng Quan Dự Án (Project Overview)
**AIaBLE** là nền tảng quản lý prompt thông minh và hỗ trợ định hướng phương pháp học tập cho sinh viên đại học. 
Dự án được cấu trúc dạng Monorepo (Next.js Frontend + Express/TypeScript Backend).

## 🚀 Các Tính Năng Cốt Lõi (Core Features)

| Tính năng | Trạng thái | Ghi chú |
| :--- | :---: | :--- |
| **Prompt-Optimizer Engine** | 🟡 Đang phát triển | Hỗ trợ tối ưu hoá và chuẩn hoá prompt |
| **AI Task-Matcher** | 🟡 Đang phát triển | Phân rã bài tập lớn và gợi ý công cụ AI |
| **AI Recipe Library** | 🟡 Đang phát triển | Thư viện template prompt mẫu chuẩn |
| **AI Ethics Guardrail** | 🟡 Đang phát triển | Cảnh báo đạo đức học thuật (AI content) |
| **AI Accuracy Validator** | 🟡 Đang phát triển | Đối chiếu, xác thực thông tin do AI sinh ra |
| **AIaBLE Personal Sandbox** | 🟢 Đã hoàn thiện UI | Không gian thử nghiệm, tuỳ chỉnh API keys |

---

## ✅ Các Công Việc Vừa Hoàn Thành (Recent Updates)

*Cập nhật gần nhất: 02/07/2026*

- **Cải tiến UI/UX & Hệ thống Thông báo (Notification System):**
  - Xây dựng hệ thống thông báo thời gian thực (real-time notification) bằng `CustomEvent` và `localStorage` (tại `lib/notifications.ts`).
  - Gắn thành công thông báo cho các thao tác quan trọng: Tạo/Xóa/Khôi phục dự án, Lưu prompt vào dự án, Đổi mật khẩu, Đổi cài đặt.
  - Tách hệ thống thông báo thành Icon Chuông độc lập trên thanh điều hướng (`AppNavbar`), tích hợp giao diện hiện đại và báo chấm đỏ khi có tin mới.
  - Cập nhật trang `/notifications` kết nối với dữ liệu thật, tự động quy đổi thời gian (Ví dụ: "Vừa xong", "5 phút trước").
  - Gỡ bỏ cấu hình "API Keys" phức tạp khỏi trang cài đặt theo đúng yêu cầu tối giản hoá giao diện.
  - Chuyển đổi toàn bộ phím tắt từ `⌘` sang `Shift` và triển khai thực tế tính năng bắt phím tắt toàn cục (Global Shortcuts): `Shift+K` (Tìm kiếm), `Shift+S` (Lưu), `Shift+Enter` (Chạy model), và bộ phím `G+H`, `G+P`, `G+S` để điều hướng nhanh.
  - Gỡ bỏ Icon bánh răng (Cài đặt) ở mục "My Recent Projects" và xóa nút "Cài đặt mô hình" thừa trong giao diện Sandbox.
  - Chuyển đổi hộp hiển thị kết quả AI trong Sandbox từ văn bản tĩnh sang dạng **Textarea cho phép chỉnh sửa trực tiếp** trước khi lưu vào dự án.

- **Sửa lỗi tính năng & Lịch sử hoạt động:**
  - Khắc phục triệt để lỗi sập ngầm (`ReferenceError: data is not defined`) trong Sandbox, giúp các prompt từ người dùng được **lưu thẳng vào Lịch sử hoạt động** (`/history`) một cách trơn tru.
  - Sửa lỗi sập trang Cài đặt (Settings) do biến ngôn ngữ (`lang`) vô tình bị mất, khôi phục lại khả năng đổi giao diện và đa ngôn ngữ.
  - **Sửa lỗi Cache Backend Sandbox**: Khắc phục hiện tượng Groq và OpenRouter trả về kết quả cũ với các câu lệnh mới (thời gian phản hồi cực thấp 8-10ms). Nguyên nhân do thuật toán Cache giới hạn key ở 200 ký tự khiến các prompt mô phỏng bị trùng lặp. Đã bỏ giới hạn ký tự để đảm bảo AI sinh lại kết quả mới hoàn toàn.

- **Quản lý Tài Khoản & Bảo mật:**
  - **Quên mật khẩu (Forgot Password):** Tích hợp thành công thư viện `nodemailer` (Backend) để gửi email xác nhận.
  - Xây dựng trang `/reset-password` (Frontend) hỗ trợ người dùng nhập token từ email và tiến hành đổi mật khẩu an toàn.
  - Sửa lỗi màn hình trắng của `GatewayGuard` và thiết lập luồng điều hướng bảo mật.

- **Đồng bộ Đa ngôn ngữ (Global i18n):** 
  - Hoàn thiện luồng dịch thuật tự động (Tiếng Việt/Tiếng Anh) cho toàn bộ các module trong Dashboard: **AI Task-Matcher**, **AI Sandbox**, **Prompt Optimizer**, **Output Validator**, **Recipe Library**, và **Projects**.
  - Các thành phần điều hướng chính như **Sidebar** và **Dropdown Avatar (AppNavbar)** cũng đã được liên kết với `localStorage`, đảm bảo giao diện lập tức thay đổi đồng bộ trên toàn trang khi ngôn ngữ được điều chỉnh mà không cần tải lại trang.

---

## 🚧 Công Việc Đề Xuất Tiếp Theo (Next Steps)

1. Tích hợp logic xử lý API cho thao tác Đổi mật khẩu trong Settings (hiện tại mới chỉ có frontend).
2. Triển khai logic Backend AI cho các tính năng lõi (Validator, Sandbox, Optimizer,...).
