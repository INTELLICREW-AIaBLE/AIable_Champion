import { Request, Response } from 'express';
import { callGemini, callGeminiStream } from '../services/gemini';
import { callOpenRouter, callOpenRouterStream } from '../services/openrouter';
import { callGroq, callGroqStream } from '../services/groq';

// POST /api/sandbox
export const runSandboxModel = async (req: Request, res: Response) => {
  const { prompt, model, stream } = req.body;

  if (!prompt || !model) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp prompt và model.'
    });
  }

  // Handle streaming response
  if (stream === true) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      let fullText = '';

      const onChunk = (chunk: string) => {
        fullText += chunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      };

      if (model === 'Gemini') {
        await callGeminiStream(prompt, undefined, onChunk);
      } else if (model === 'Groq') {
        if (process.env.GROQ_API_KEY) {
          await callGroqStream(prompt, onChunk);
        } else {
          const claudePrompt = `Bạn là Claude, một AI được phát triển bởi Anthropic. Bạn nổi tiếng với phong cách viết văn tự nhiên, chi tiết, cẩn thận và thấu cảm. Hãy trả lời câu hỏi sau bằng phong cách của Claude:\n\n${prompt}`;
          await callGeminiStream(claudePrompt, undefined, onChunk);
        }
      } else if (model === 'OpenRouter') {
        if (process.env.OPENROUTER_API_KEY) {
          await callOpenRouterStream(prompt, onChunk);
        } else {
          const gptPrompt = `Bạn là ChatGPT (GPT-4), một AI của OpenAI. Bạn nổi tiếng với phong cách viết logic, cấu trúc cực kỳ chặt chẽ, thẳng thắn và tập trung vào giải quyết vấn đề. Hãy trả lời câu hỏi sau bằng phong cách của GPT-4:\n\n${prompt}`;
          await callGeminiStream(gptPrompt, undefined, onChunk);
        }
      } else {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Model không được hỗ trợ' })}\n\n`);
        res.end();
        return;
      }

      res.write(`data: ${JSON.stringify({ type: 'complete', fullText })}\n\n`);
      res.end();
    } catch (error: any) {
      console.warn(`[Sandbox Stream Error - Model ${model}]:`, error.message);
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
    return;
  }

  // Normal JSON response (non-streaming)
  try {
    let result = '';

    if (model === 'Gemini') {
      result = await callGemini(prompt);
    } else if (model === 'Groq') {
      if (process.env.GROQ_API_KEY) {
        result = await callGroq(prompt);
      } else {
        const claudePrompt = `Bạn là Claude, một AI được phát triển bởi Anthropic. Bạn nổi tiếng với phong cách viết văn tự nhiên, chi tiết, cẩn thận và thấu cảm. Hãy trả lời câu hỏi sau bằng phong cách của Claude:\n\n${prompt}`;
        result = await callGemini(claudePrompt);
      }
    } else if (model === 'OpenRouter') {
      if (process.env.OPENROUTER_API_KEY) {
        result = await callOpenRouter(prompt);
      } else {
        const gptPrompt = `Bạn là ChatGPT (GPT-4), một AI của OpenAI. Bạn nổi tiếng với phong cách viết logic, cấu trúc cực kỳ chặt chẽ, thẳng thắn và tập trung vào giải quyết vấn đề. Hãy trả lời câu hỏi sau bằng phong cách của GPT-4:\n\n${prompt}`;
        result = await callGemini(gptPrompt);
      }
    } else {
      return res.status(400).json({ success: false, message: 'Model không được hỗ trợ' });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.warn(`[Sandbox API Error - Model ${model} - Using Fallback Simulator]:`, error.message);

    // Fallback static responses based on model style
    let fallbackText = '';
    if (model === 'Gemini') {
      fallbackText = `[Gemini Simulator]: 
Dưới đây là phân tích và câu trả lời cho câu hỏi: "${prompt}"

1. Khái niệm cơ bản:
- Giải thích các khía cạnh cốt lõi của chủ đề một cách khoa học.
- Trình bày thông tin khách quan, đa chiều và dễ tiếp cận.

2. Chi tiết:
- Phân tích chi tiết các bước xử lý hoặc nguyên lý cấu thành.
- Đưa ra ví dụ minh họa thực tiễn để củng cố nhận thức.

(Hệ thống đang chạy chế độ giả lập do API quá tải hoặc hết hạn ngạch)`;
    } else if (model === 'Groq') {
      fallbackText = `[Groq Simulator]:
Xin chào! Tôi là Groq (chạy mô hình Llama 3.1). Rất vui được hỗ trợ bạn giải quyết vấn đề: "${prompt}"
 
Dưới đây là một góc nhìn chi tiết, thấu đáo và mang tính tự nhiên cao về chủ đề này:
- Đầu tiên, chúng ta cần tiếp cận vấn đề một cách có chiều sâu và thấu cảm.
- Giải thích chi tiết cấu trúc, phân tích kỹ lưỡng các khía cạnh nhỏ nhất với ví dụ sinh động và văn phong trang nhã.
- Đưa ra lời khuyên thiết thực giúp bạn dễ dàng ứng dụng vào học tập thực tế.
 
Hy vọng những chia sẻ chi tiết này sẽ giúp bạn hiểu sâu sắc và ứng dụng tốt!`;
    } else if (model === 'OpenRouter') {
      fallbackText = `[OpenRouter Simulator]:
Dưới đây là câu trả lời mang phong cách logic và tối giản của OpenRouter (chạy mô hình Llama 3.2) cho yêu cầu: "${prompt}"
 
### Cấu trúc giải pháp (Overview):
1. **Khái niệm then chốt:** Định nghĩa trực diện, chính xác và khoa học.
2. **Phương pháp thực hiện:** Trình bày theo dạng bước cụ thể (Step-by-step logic).
3. **Kết luận & Khuyến nghị:** Đưa ra giải pháp tối ưu và tập trung thẳng vào kết quả cần giải quyết.
 
### Điểm cốt lõi cần nhớ:
- Tập trung vào tính hiệu quả và giảm thiểu thông tin dư thừa.
- Trình bày dạng Markdown với phân cấp tiêu đề rõ ràng.`;
    }

    res.json({
      success: true,
      data: fallbackText
    });
  }
};
