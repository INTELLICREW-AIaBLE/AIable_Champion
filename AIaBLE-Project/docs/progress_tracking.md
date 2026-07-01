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

*Cập nhật gần nhất: 01/07/2026 (Phiên 2)*

- **Sửa lỗi UI/UX & Điều hướng:**
  - Cấu hình lại `GatewayGuard`: Bỏ qua xác minh Bot/Turnstile đối với các trang công khai (`/`, `/login`, `/register`, `/forgot-password`). Khắc phục triệt để lỗi màn hình đen/trắng (blank page) khi tải trang lần đầu mà không cần reload.
- **Trang Cài đặt (Settings Page):**
  - **Cải thiện luồng lưu trữ:** Đã bổ sung nút "Lưu thay đổi" (Save Changes) rõ ràng cho tab Giao diện & Ngôn ngữ và tab Thông báo thay vì tự động lưu ngay lập tức.
  - Xóa tùy chọn Tiếng Nhật khỏi hệ thống.
  - **Quản lý tài khoản:** Cấu trúc form Đổi mật khẩu chuẩn xác, bỏ nút Xóa tài khoản, sửa font chữ.
- **Đa ngôn ngữ (i18n):** 
  - Tính năng đa ngôn ngữ (Tiếng Việt/Tiếng Anh) giờ đây được đồng bộ hóa và lưu trữ trong `localStorage`. Các trang công khai (Landing Page, Navbar, Đăng nhập, Đăng ký) sẽ tự động ghi nhớ và hiển thị đúng ngôn ngữ bạn đã chọn từ màn Cài đặt ngay cả khi đã đăng xuất khỏi tài khoản.

---

## 🚧 Công Việc Đề Xuất Tiếp Theo (Next Steps)

1. Tích hợp logic xử lý API (Backend) cho thao tác Đổi mật khẩu trong Settings.
2. Thiết kế và xử lý luồng Gửi Email/Reset khi nhấn vào "Quên mật khẩu".
3. Thiết lập hệ thống Đa ngôn ngữ (i18n) cho toàn bộ ứng dụng (Next.js i18n hoặc next-intl) nếu cần thiết thay vì chỉ áp dụng ở trang Settings.
4. Triển khai logic Backend cho các tính năng lõi (Validator, Sandbox, Optimizer,...).
