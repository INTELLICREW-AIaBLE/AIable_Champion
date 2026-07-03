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

*Cập nhật gần nhất: 03/07/2026*

- **Xây dựng Hệ thống Quản trị (Admin Dashboard & Infrastructure) (03/07/2026):**
  - **Tách biệt Layout:** Tạo Route Group `(admin)` độc lập với layout riêng (giao diện sáng chuẩn) để tránh xung đột với công cụ Dark Mode của trình duyệt, thay thế hoàn toàn thư mục `(app)/admin` cũ rườm rà.
  - **Phân quyền Đăng nhập:** Cập nhật API Đăng nhập trả về trường `role` và lưu vào localStorage. Tự động điều hướng Admin vào `/admin/dashboard` và User vào `/home`. Xử lý xóa quyền (role) khi Logout để bảo mật phiên.
  - **Quản lý Người Dùng (User Management):** 
    - Thêm trường `isLocked` vào CSDL MongoDB. Xây dựng API và giao diện Khóa/Mở khóa (Ban/Unban) tài khoản chỉ với 1 thao tác.
    - Chặn hoàn toàn quyền đăng nhập của các tài khoản bị khóa (trả về lỗi 403 ở Backend).
    - Thay thế hộp thoại `confirm()` mặc định bằng Custom Modal xịn xò, yêu cầu xác nhận trước khi Khóa/Mở khóa hoặc Xóa tài khoản vĩnh viễn.
  - **Dashboard & Thống kê LLM:** 
    - Mở rộng Dashboard hiển thị số lượng người dùng, prompt, tần suất gọi API của từng công cụ.
    - Bổ sung bảng **"Tình hình hoạt động LLMs"**, liệt kê top 5 mô hình AI được gọi nhiều nhất (phân tích trực tiếp từ dữ liệu lịch sử hệ thống).
  - **Fix lỗi hạ tầng:** Cấu hình sửa lỗi CORS (bổ sung method `PATCH` bị thiếu) cho các tính năng cập nhật quyền và trạng thái. Đồng bộ nhận diện thương hiệu bằng cách thay thế icon bảo mật thành logo AIaBLE chính thức trong Sidebar Admin.

- **Hoàn thiện Giao diện Landing Page & Cấu hình Hạ tầng API (03/07/2026 - Phiên tiếp theo):**
  - **Việt hóa Landing Page:** Hoàn thành dịch thuật 100% các đoạn text còn cứng trên Landing Page (mục "Vấn đề của sinh viên" và "6 Năng lực Cốt lõi"). Thay thế lỗi hiển thị `**text**` bằng định dạng in đậm chuẩn (thẻ `<strong>`), tạo giao diện mượt mà và chuyên nghiệp hơn.
  - **Kích hoạt SMTP Mailer:** Cấu hình thành công **App Password** cho email hệ thống (`aiable.support.su26@gmail.com`) vào file `.env`. Chính thức khởi chạy tính năng gửi email xác thực phục vụ luồng **Quên Mật Khẩu (Forgot Password)** (thông qua `nodemailer`).
  - **Kích hoạt Google Search API:** Thiết lập `GOOGLE_SEARCH_API_KEY` và Mã định danh công cụ tìm kiếm `GOOGLE_SEARCH_CX` (Custom Search Engine) vào backend `.env`. Tính năng **AI Accuracy Validator** (Kiểm chứng sự thật) hiện đã có thể gọi Google Search API tự động để tìm nguồn tin hỗ trợ fact-check AI.
  - **Tinh chỉnh Admin Dashboard:** Ẩn các hộp cảnh báo cấu hình "MISSING" (dành cho API Email và Google Search) trên giao diện theo dõi sức khoẻ hệ thống (System Health), giúp giao diện UI gọn gàng, sạch sẽ phục vụ cho mục đích quay video/demo dự án tốt nhất.

- **Hoàn Thiện Localization (Đa ngôn ngữ) & Sửa lỗi UI/UX (02/07/2026):**
  - **Việt Hoá 100%:** Rà soát và dịch thuật toàn bộ các từ khóa tiếng Anh còn sót lại trên UI (như các badge mô hình trong Optimizer, danh mục Tag của Recipe, thanh trạng thái Task-Matcher, menu What's New). Đảm bảo giao diện 100% thuần Việt khi bật Tiếng Việt.
  - **Sửa lỗi Code:** Khắc phục lỗi sập trang (`Invalid hook call`) trong component `RecipeCard` do sử dụng hook `useEffect` bên trong block import động, giúp tính năng Fast Refresh hoạt động ổn định.
  - **Tối ưu UX Task-Matcher:** Gỡ bỏ nội dung văn bản điền sẵn trong ô nhập liệu nhiệm vụ, chuyển sang định dạng placeholder mờ để tránh người dùng phải xoá tay trước khi gõ.
  - **Cập nhật Help Center:** Gỡ bỏ các hướng dẫn cũ liên quan đến "Cấu hình API Key" (do tính năng đã bị lược bỏ). Bổ sung tài liệu giải thích và hướng dẫn về "Cảnh báo Đạo đức học thuật" (Ethics Guardrail) để định hướng sinh viên sử dụng AI học tập liêm chính.

- **Xử lý UX/UI, Tính ổn định Phiên đăng nhập & Bảo mật (02/07/2026):**
  - **Auth Persistence:** Khắc phục lỗi Landing Page và Navbar không nhận diện được phiên đăng nhập. Tích hợp đọc Token giúp điều hướng trực tiếp vào Dashboard thay vì kẹt ở màn hình "Đăng nhập".
  - **Quản lý Sandbox:** Tích hợp `AbortController`, chuyển đổi nút bấm sang dạng "Dừng AI" để người dùng có thể ngắt request ngay lập tức khi Model bị treo hoặc ảo giác.
  - **Task-Matcher:** Sửa lỗi lệch ngôn ngữ bằng cách ép AI trả kết quả 100% tiếng Việt theo tuỳ chọn cấu hình; cập nhật UI thanh trạng thái phân tích từ tĩnh sang "Động" phản ánh đúng nhiệm vụ người dùng vừa nhập.
  - **Bảo mật:** Vá lỗ hổng Payload DoS ở tính năng Optimizer bằng cách giới hạn đầu vào 3000 ký tự, kết hợp với bộ lọc API Limiter và xác minh chống ReDoS cho toàn bộ hệ Regex.
  - **Tài liệu người dùng:** Xây dựng mới hoàn toàn 1 Tab "Hướng dẫn sử dụng" rất chi tiết trên trang Help, kèm thanh tìm kiếm thông minh.

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
