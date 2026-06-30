# AIaBLE (AI able) - Nền tảng hỗ trợ học tập & tương tác AI thông minh

AIaBLE là nền tảng quản lý prompt thông minh và hỗ trợ định hướng phương pháp học tập dành riêng cho sinh viên đại học. Dự án được phát triển bởi đội **INTELLICREW** nhằm tối ưu hóa cách sinh viên tương tác với các mô hình ngôn ngữ lớn (LLM), tránh việc chép bài mù quáng và thúc đẩy tư duy phản biện.

---

## 🌟 6 Tính năng cốt lõi (Core Capabilities)

1.  **Prompt-Optimizer Engine:** Tối ưu hóa các prompt thô sơ, ngắn của sinh viên thành các prompt đầy đủ cấu trúc chuẩn: `Role` + `Context` + `Task` + `Format` + `Constraints`.
2.  **AI Task-Matcher:** Phân rã bài tập lớn/nhiệm vụ học tập phức tạp thành một chuỗi 5 bước thực hiện logic, đồng thời gợi ý công cụ AI thích hợp nhất cho từng bước kèm theo lý do cụ thể.
3.  **AI Recipe Library:** Thư viện hơn 15+ công thức prompt mẫu chuẩn thuộc các nhóm chủ đề: Lập trình (Coding), Viết báo cáo (Writing/Report), Thiết kế thuyết trình (Slide), và Nghiên cứu khoa học.
4.  **AI Ethics Guardrail (Critical Thinking Card):** Hệ thống quét tự động các từ khóa gian lận (thi hộ, làm hộ bài,...) và đưa ra bộ câu hỏi phản biện cảnh báo để đảm bảo sinh viên tự học thay vì lạm dụng AI.
5.  **AI Accuracy Validator:** Nhận văn bản do AI sinh ra, thẩm định chéo với các nguồn dữ liệu mạng internet thời gian thực để chỉ ra mức độ tin cậy của thông tin (Màu xanh: Đã kiểm chứng, Màu đỏ: Có nguy cơ ảo tưởng/Hallucination).
6.  **AIaBLE Personal Sandbox:** Không gian chạy thử nghiệm AI song song. Nhập một câu prompt duy nhất và đối chiếu đồng thời kết quả trả về của 3 mô hình lớn là **Claude**, **GPT-4**, và **Gemini** trên 3 cột dọc trực quan.

---

## 🏗️ Kiến trúc dự án (Project Architecture)

Dự án được cấu trúc theo mô hình Monorepo:
*   **`backend/`:** Chạy Express + TypeScript kết nối SDK Google Gemini, OpenAI, và Anthropic. Lắng nghe ở cổng **`5001`**.
*   **`frontend/`:** Chạy Next.js 14 + Tailwind CSS + shadcn/ui. Lắng nghe ở cổng **`3000`**.

---

## 🚀 Hướng dẫn Cài đặt & Chạy dưới local (Local Setup)

### 📋 Yêu cầu hệ thống
*   Đã cài đặt sẵn **Node.js** (Khuyến nghị phiên bản `v18.x` trở lên)
*   Đã cài đặt **npm** hoặc **yarn**

### 1. Cài đặt các thư viện (Dependencies)
Từ thư mục dự án gốc `/AIaBLE-Project`, hãy mở terminal và chạy lệnh:
```bash
# Cài đặt dependency cho cả monorepo (frontend & backend)
npm install
```

### 2. Cấu hình biến môi trường (Environment Variables)

#### Cấu hình cho Backend:
Tạo file `.env` bên trong thư mục `/AIaBLE-Project/backend/.env` với nội dung sau:
```env
PORT=5001
GEMINI_API_KEY=Nhập_API_Key_Gemini_Của_Bạn

# Các API Key mở rộng (Không bắt buộc, hệ thống tự động fallback sang giả lập Gemini nếu thiếu):
OPENAI_API_KEY=Nhập_API_Key_OpenAI_Nếu_Có
CLAUDE_API_KEY=Nhập_API_Key_Anthropic_Nếu_Có
```

#### Cấu hình cho Frontend:
Tạo file `.env.local` bên trong thư mục `/AIaBLE-Project/frontend/.env.local` với nội dung sau:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 3. Khởi chạy dự án ở môi trường phát triển (Development)
Từ thư mục gốc `/AIaBLE-Project`, chạy lệnh:
```bash
npm run dev
```
Hệ thống sẽ chạy song song:
*   **Frontend:** [http://localhost:3000](http://localhost:3000)
*   **Backend:** [http://localhost:5001](http://localhost:5001)

---

## 🛡️ Cơ chế Dự phòng & Chống quá tải (Robustness & Fallback)

*   **API Rate Limiting:** Hệ thống tích hợp middleware bảo vệ chống spam API. Mỗi địa chỉ IP bị giới hạn tối đa **20 requests mỗi 15 phút** cho các API AI để tránh cạn kiệt tài nguyên API key.
*   **Quota Fallback:** Nếu API key của Gemini bị lỗi hết hạn ngạch miễn phí (lỗi 429 Quota Exceeded) hoặc thiếu API Key cho OpenAI/Claude, Backend sẽ kích hoạt **thuật toán tạo prompt và phản biện cục bộ** để trả về dữ liệu nhanh chóng. Đảm bảo ứng dụng **luôn phản hồi 200 OK mượt mà**, phục vụ chấm điểm chấm demo không gián đoạn.
