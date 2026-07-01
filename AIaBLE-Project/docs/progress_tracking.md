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

*Cập nhật gần nhất: 01/07/2026 (Phiên 3)*

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
