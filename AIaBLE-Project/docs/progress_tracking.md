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

*Cập nhật gần nhất: 01/07/2026*

- **Giao diện cốt lõi (Core UI):** Sửa lỗi hiển thị font tiếng Việt không đồng nhất (thêm subset `vietnamese` cho Google Font `Inter` trong `layout.tsx`).
- **Trang Cài đặt (Settings Page):**
  - **Đa ngôn ngữ (Local i18n):** Tích hợp tính năng chuyển đổi ngôn ngữ Anh/Việt hoạt động tức thời không cần tải lại trang.
  - **Quản lý tài khoản (Account Tab):** 
    - Gỡ bỏ hoàn toàn cảnh báo và nút "Xoá tài khoản".
    - Bổ sung cấu trúc form Đổi mật khẩu mới (có thêm trường Xác nhận mật khẩu mới, bắt lỗi UI nếu không khớp hoặc để trống).
    - Thêm nút "Quên mật khẩu hiện tại?" vào ngay trên form nhập.

---

## 🚧 Công Việc Đề Xuất Tiếp Theo (Next Steps)

1. Tích hợp logic xử lý API (Backend) cho thao tác Đổi mật khẩu trong Settings.
2. Thiết kế và xử lý luồng Gửi Email/Reset khi nhấn vào "Quên mật khẩu".
3. Thiết lập hệ thống Đa ngôn ngữ (i18n) cho toàn bộ ứng dụng (Next.js i18n hoặc next-intl) nếu cần thiết thay vì chỉ áp dụng ở trang Settings.
4. Triển khai logic Backend cho các tính năng lõi (Validator, Sandbox, Optimizer,...).
