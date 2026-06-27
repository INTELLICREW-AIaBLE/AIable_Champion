# Danh Sách Đầu Việc & Tiến Độ: Phạm Quốc Anh
**Vai trò:** Project Leader & Backend Lead (BE1)  
**Cặp phối hợp Frontend:** Nguyễn Huy Hoàng (FE1)

Bảng tiến độ này giúp theo dõi chi tiết các công việc cần hoàn thành từ đầu đến cuối dự án **AIaBLE**. Tích chọn `[x]` sau khi hoàn thành mỗi đầu việc.

---

## 📅 NGÀY 1: KHỞI TẠO NỀN TẢNG & THÔNG SUỐT API CƠ BẢN
*Mục tiêu: Dựng xong khung dự án Backend và thiết lập kết nối API nền tảng với Anthropic & Google.*

### 🚀 Công việc kỹ thuật:
- [x] **Khởi tạo dự án Express + TypeScript:**
  - Khởi tạo thư mục `backend/`, chạy `npm init -y`.
  - Cài đặt các thư viện cần thiết: `express`, `cors`, `dotenv`, `typescript`, `@types/express`, `@types/node`, `ts-node-dev`.
  - Thiết lập cấu hình `backend/tsconfig.json` và định nghĩa scripts chạy dev (`npm run dev`) trong `package.json`.
- [x] **Thiết lập Entry Point (`backend/src/index.ts`):**
  - Dựng cấu trúc server lắng nghe ở port `5000` (hoặc cấu hình động `process.env.PORT`).
  - Cấu hình middleware `express.json()` để parse request body.
  - Cài đặt middleware `cors()` mở hoàn toàn cho domain của Frontend Next.js.
- [x] **Viết Middleware xử lý lỗi (`backend/src/middleware/errorHandler.ts`):**
  - Viết middleware bắt lỗi tập trung để trả về định dạng lỗi JSON đồng nhất cho Frontend (thay vì làm sập server).
- [x] **Cấu hình Client kết nối SDK API:**
  - Viết file `backend/src/services/claude.ts` cấu hình kết nối SDK `@anthropic-ai/sdk`.
  - Viết file `backend/src/services/gemini.ts` cấu hình kết nối SDK `@google/generative-ai`.
  - Đảm bảo các API Key được lấy từ `process.env.CLAUDE_API_KEY` và `process.env.GEMINI_API_KEY`.


### 🤝 Cột mốc bàn giao & Tích hợp (Ngày 1):
- [x] Chạy server Backend local hoạt động ổn định (cổng 5001).
- [ ] Phối hợp với **Nguyễn Huy Hoàng (FE1)**: Huy Hoàng gửi request Ping từ Next.js đến Backend, xác nhận không bị chặn CORS và nhận được phản hồi OK.


---

## 📅 NGÀY 2: PHAT TRIỂN TÍNH NĂNG CỐT LÕI (PROMPT-OPTIMIZER & ETHICS CARD)
*Mục tiêu: Hoàn thiện API lõi phân tích và tối ưu prompt thô thành dạng JSON.*

### 🚀 Công việc kỹ thuật:
- [ ] **Thiết lập System Prompt cho Claude API (`backend/src/services/claude.ts`):**
  - Thiết kế prompt hướng dẫn Claude nhận văn bản thô từ sinh viên và tái cấu trúc thành JSON dạng:
    ```json
    {
      "role": "...",
      "context": "...",
      "task": "...",
      "format": "...",
      "constraints": "...",
      "ethics_guardrail": ["câu_hỏi_1", "câu_hỏi_2", "câu_hỏi_3"]
    }
    ```
- [ ] **Viết Router & Controller `/api/optimizer`:**
  - Viết file `backend/src/routes/optimizer.ts` tiếp nhận request `POST`.
  - Trích xuất prompt thô và loại bài tập (Assignment, code, slide, report) từ request body.
  - Gọi dịch vụ `claude.ts`, truyền ngữ cảnh tương ứng của loại bài tập để Claude tối ưu hóa chính xác.
  - Kiểm tra và bắt lỗi nếu Claude API trả về lỗi hoặc payload không đúng format JSON.
- [ ] **Tích hợp bộ câu hỏi phản biện (Ethics Guardrail):**
  - Đảm bảo trong JSON kết quả trả về của Claude luôn có mảng `ethics_guardrail` chứa từ 3-5 câu hỏi kích thích tư duy phản biện phù hợp với loại bài tập đã chọn.

### 🤝 Cột mốc bàn giao & Tích hợp (Ngày 2):
- [ ] Đẩy code lên nhánh Git `feature/sandbox-quocanh`.
- [ ] Bàn giao API endpoint `/api/optimizer` kèm theo cấu trúc dữ liệu JSON trả về cho **Nguyễn Huy Hoàng (FE1)**.
- [ ] Phối hợp kiểm thử: Huy Hoàng gửi prompt thô từ giao diện Next.js, Backend trả về dữ liệu tối ưu thành công và hiển thị song song Before/After cùng thẻ Ethics Card.

---

## 📅 NGÀY 3: PHÒNG THỬ NGHIỆM ĐA MÔ HÌNH (PERSONAL SANDBOX)
*Mục tiêu: Tích hợp thêm GPT-4 và viết API gọi song song cả 3 mô hình AI.*

### 🚀 Công việc kỹ thuật:
- [ ] **Tích hợp OpenAI SDK (`backend/src/services/openai.ts`):**
  - Cài đặt thư viện `openai` và cấu hình kết nối qua `process.env.OPENAI_API_KEY`.
- [ ] **Viết Route & Controller `/api/sandbox`:**
  - Viết file `backend/src/routes/sandbox.ts` nhận một prompt duy nhất từ user.
  - Viết hàm gọi API song song bằng `Promise.all`:
    ```typescript
    const [claudeRes, geminiRes, gptRes] = await Promise.all([
      callClaude(prompt),
      callGemini(prompt),
      callGPT4(prompt)
    ]);
    ```
  - Định dạng dữ liệu trả về dưới dạng:
    ```json
    {
      "claude": "câu trả lời...",
      "gemini": "câu trả lời...",
      "gpt4": "câu trả lời..."
    }
    ```
  - Bắt lỗi riêng lẻ từng mô hình (nếu 1 trong 3 mô hình bị lỗi API hoặc hết hạn mức, các mô hình còn lại vẫn hiển thị kết quả bình thường thay vị lỗi cả request).

### 🤝 Cột mốc bàn giao & Tích hợp (Ngày 3):
- [ ] Đẩy code lên nhánh Git `feature/sandbox-quocanh`.
- [ ] Bàn giao API endpoint `/api/sandbox` cho **Nguyễn Huy Hoàng (FE1)**.
- [ ] Phối hợp kiểm thử: Huy Hoàng gửi prompt từ giao diện Sandbox, backend trả về kết quả đồng thời của cả 3 AI hiển thị lên 3 cột dọc.

---

## 📅 NGÀY 4: DEPLOY HỆ THỐNG, KIỂM THỬ TẢI & HOÀN THIỆN
*Mục tiêu: Đưa backend lên môi trường production chạy thực tế và điều phối bàn giao dự án.*

### 🚀 Công việc kỹ thuật:
- [ ] **Deploy Backend lên Cloud (Vercel Serverless / Render):**
  - Tạo cấu hình deploy cho backend.
  - Cấu hình các biến môi trường (`CLAUDE_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`) trên bảng điều khiển của hosting.
  - Fix các lỗi liên quan đến CORS khi gọi từ domain production của Next.js.
- [ ] **Bảo vệ hệ thống (Rate Limiting):**
  - Cài đặt thư viện `express-rate-limit`.
  - Cấu hình giới hạn mỗi IP chỉ được gửi tối đa 20 request tối ưu/sandbox trong vòng 15 phút để bảo vệ tài khoản API khỏi bị cạn kiệt tài nguyên.

### 👑 Quản lý dự án (Project Leader Tasks):
- [ ] **Đồng bộ Production:** Đảm bảo toàn bộ nhóm đổi địa chỉ Axios ở frontend sang URL Backend Production của bạn.
- [ ] **Điều phối Kiểm thử chéo:** Yêu cầu các thành viên kiểm tra chéo các tính năng của nhau để bắt bug giao diện và logic.
- [ ] **Thu thập Feedback:** Gửi link deploy thực tế cho 5-10 sinh viên dùng thử để lấy phản hồi nhanh.
- [ ] **Tài liệu hướng dẫn (README.md):** Hoàn thiện file `README.md` hướng dẫn chi tiết cách clone dự án, cài đặt môi trường, và chạy local cả frontend/backend cho giảng viên chấm điểm.

### 🤝 Cột mốc bàn giao & Tích hợp (Ngày 4):
- [ ] Link production của Frontend Next.js gọi thành công các API trên server backend online của bạn, toàn bộ 5 tính năng hoạt động trơn tru không lỗi.
- [ ] Có báo cáo feedback ngắn từ người dùng thực tế và hoàn thiện mã nguồn sạch để nộp bài.
