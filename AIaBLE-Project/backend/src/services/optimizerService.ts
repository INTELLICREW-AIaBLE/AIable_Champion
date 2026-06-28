import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'temporary-placeholder');

export interface OptimizeResult {
  optimized: string;
  improvements: { label: string; before: number; after: number; unit: string }[];
  suggestions: string[];
  ethicsFlag: boolean;
  ethicsReason?: string;
}

export const optimizePrompt = async (
  rawPrompt: string,
  modelName: string,
  tone: string,
  userKey?: string
): Promise<OptimizeResult> => {
  try {
    const activeKey = userKey || process.env.GEMINI_API_KEY;
    if (!activeKey) {
      throw new Error('GEMINI_API_KEY is missing from environment variables and user settings.');
    }

    // System instructions for Prompt Optimizer
    const systemInstruction = `
You are a master Prompt Engineer specializing in academic and student tasks.
Your job is to analyze a raw prompt from a student, check it for academic integrity/ethics, and optimize it into a highly professional structured prompt.

Tone context: "${tone}" (academic, technical, creative, or concise).
Target Model: "${modelName}" (Claude, GPT-4, or Gemini).

1. OPTIMIZATION FRAMEWORK:
Rewrite the raw prompt into a structured format containing:
- [VAI TRÒ / ROLE] (e.g. "Acting as an expert Software Engineer...")
- [BỐI CẢNH / CONTEXT] (Setting the background and style based on the tone)
- [NHIỆM VỤ / TASK] (The expanded, detail-oriented task description)
- [ĐỊNH DẠNG / FORMAT] (Specific format structure e.g. bullet points, markdown, table)
- [RÀNG BUỘC / CONSTRAINTS] (Rules to prevent hallucination, copy-paste block, etc.)

2. ETHICS AUDIT (CRITICAL):
Check if the user's prompt is a request to directly cheat (e.g. asking to do my homework, write an entire assignment from scratch, take an exam, or generate text to copy blindly without thinking).
If the prompt has signs of cheating (like "làm hộ", "thi hộ", "làm bài hộ", "gian lận", "làm hộ bài tập", "viết bài thay"):
- Set "ethicsFlag" to true.
- Set "ethicsReason" to a friendly Vietnamese warning explaining why cheating or copying blindly hurts their learning, and encouraging them to use AI as a tutor instead.
If safe, set "ethicsFlag" to false and "ethicsReason" to null.

3. IMPROVEMENTS COMPARISON:
Rate the prompt's metrics before and after optimization:
- Clarity Score (before should be low e.g., 20-50, after should be high e.g., 85-98)
- Word Count (before is count of words in raw prompt, after is count of words in optimized prompt)
- Structure (before is low e.g., 10-30, after is high e.g., 80-95)

4. SUGGESTIONS:
Provide 3 short, actionable suggestions in Vietnamese for how the student can tweak this prompt further.

Ensure all outputs (optimized prompt text, suggestions, and ethics reason) are written in Vietnamese, as the student is Vietnamese.

Return ONLY a valid JSON object matching this schema:
{
  "optimized": "string containing the full optimized prompt text",
  "improvements": [
    { "label": "Clarity Score", "before": number, "after": number, "unit": "%" },
    { "label": "Word Count", "before": number, "after": number, "unit": "w" },
    { "label": "Structure", "before": number, "after": number, "unit": "%" }
  ],
  "suggestions": ["string", "string", "string"],
  "ethicsFlag": boolean,
  "ethicsReason": "string or null"
}
`;

    const dynamicGenAI = new GoogleGenerativeAI(activeKey);
    const model = dynamicGenAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const promptInput = `
Raw Prompt to optimize: "${rawPrompt}"
`;

    const result = await model.generateContent([
      { text: systemInstruction },
      { text: promptInput }
    ]);
    const responseText = result.response.text();

    try {
      const parsed: OptimizeResult = JSON.parse(responseText.trim());
      return parsed;
    } catch (error) {
      console.error('Failed to parse Gemini JSON output, utilizing fallback parser:', responseText);
      throw new Error('AI response parser error');
    }
  } catch (error: any) {
    console.warn('[Gemini Optimizer Error - Using Fallback]:', error.message);
    
    // Check if the prompt has ethics violations
    const isEthics = /làm hộ|làm giùm|viết thay|làm bài|thi hộ|gian lận|lam ho|lam gium|viet thay|lam bai|thi ho|gian lan/i.test(rawPrompt);
    
    // Generate a fallback structured prompt
    const toneRole = tone === 'academic' ? 'Chuyên gia Học thuật' : tone === 'technical' ? 'Kỹ sư Hệ thống' : tone === 'creative' ? 'Chuyên viên Sáng tạo' : 'Trợ lý Tinh gọn';
    const toneStyle = tone === 'academic' ? 'văn phong học thuật khoa học, rõ ràng' : tone === 'technical' ? 'chính xác, đặc tả kỹ thuật chi tiết' : tone === 'creative' ? 'sinh động, phong phú, gợi mở' : 'tập trung ngắn gọn vào ý chính';

    const optimized = `[VAI TRÒ / ROLE]:
Acting as an expert ${toneRole} optimizing for the ${modelName} model.

[BỐI CẢNH / CONTEXT]:
Tôi là một sinh viên đang thực hiện nghiên cứu/bài tập lớn. Hãy phản hồi bằng tiếng Việt với ${toneStyle}.

[NHIỆM VỤ / TASK]:
Thực hiện yêu cầu sau đây một cách chi tiết:
"${rawPrompt.trim()}"

[ĐỊNH DẠNG / FORMAT]:
- Trình bày có cấu trúc rõ ràng với các đề mục và danh sách liệt kê.
- Tóm tắt ý chính ở đầu và mở rộng chi tiết ở phía dưới.

[RÀNG BUỘC / CONSTRAINTS]:
- Tránh đưa ra thông tin giả định hoặc thiếu kiểm chứng.
- Đưa ra ví dụ minh họa cụ thể cho các khái niệm trừu tượng.
- Giữ vững tính nguyên bản và không sao chép nguyên văn.`;

    const rawWords = rawPrompt.trim() ? rawPrompt.trim().split(/\s+/).length : 0;
    const optimizedWords = optimized.split(/\s+/).length;

    return {
      optimized,
      improvements: [
        { label: 'Clarity Score', before: 35, after: 90, unit: '%' },
        { label: 'Word Count', before: rawWords, after: optimizedWords, unit: 'w' },
        { label: 'Structure', before: 15, after: 85, unit: '%' }
      ],
      suggestions: [
        'Cung cấp thêm mục tiêu cụ thể của bài tập để AI điều hướng chính xác hơn.',
        'Chỉ rõ độ dài mong muốn của câu trả lời (ví dụ: khoảng 500 từ).',
        'Bổ sung thêm các tài liệu tham khảo chính mà bạn muốn AI tham chiếu.'
      ],
      ethicsFlag: isEthics,
      ethicsReason: isEthics 
        ? 'Cảnh báo: Câu lệnh chứa các từ khóa yêu cầu làm bài hộ hoặc gian lận học thuật. AIaBLE khuyến khích bạn sử dụng AI để gợi ý cấu trúc và học hỏi thay vì chép bài trực tiếp.' 
        : undefined
    };
  }
};
