import { Request, Response } from 'express';
import { callGemini, callGeminiStream } from '../services/gemini';
import { callOpenRouter, callOpenRouterStream } from '../services/openrouter';
import { callGroq, callGroqStream } from '../services/groq';

// ─── Helper: Classify AI error into a user-friendly message ──────────────────
function classifyAIError(error: any, modelName: string): { status: number; message: string } {
  const msg = (error.message || '').toLowerCase();
  if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
    return {
      status: 429,
      message: `⚠️ Mô hình ${modelName} đang bị quá tải (Rate Limit). Vui lòng thử lại sau vài phút hoặc chuyển sang mô hình khác.`
    };
  }
  if (msg.includes('timeout') || msg.includes('econnreset') || msg.includes('econnrefused')) {
    return {
      status: 503,
      message: `🔌 Không thể kết nối đến dịch vụ ${modelName}. Kiểm tra kết nối mạng của bạn và thử lại.`
    };
  }
  if (msg.includes('api key') || msg.includes('invalid key') || msg.includes('unauthorized')) {
    return {
      status: 401,
      message: `🔑 API Key của ${modelName} không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại trong Cài đặt.`
    };
  }
  if (msg.includes('overloaded') || msg.includes('capacity')) {
    return {
      status: 503,
      message: `🏗️ Máy chủ ${modelName} đang bảo trì hoặc quá tải. Thử lại sau ít phút.`
    };
  }
  return {
    status: 500,
    message: `Lỗi từ ${modelName}: ${error.message || 'Không xác định được nguyên nhân. Vui lòng thử lại.'}`
  };
}

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
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Mô hình AI không được hỗ trợ.' })}\n\n`);
        res.end();
        return;
      }

      res.write(`data: ${JSON.stringify({ type: 'complete', fullText })}\n\n`);
      res.end();
    } catch (error: any) {
      const { message } = classifyAIError(error, model);
      console.error(`[Sandbox Stream Error - Model ${model}]:`, error.message);
      res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
      res.end();
    }
    return;
  }

  // Normal JSON response — no silent fallback
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
      return res.status(400).json({ success: false, message: 'Mô hình AI không được hỗ trợ.' });
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    const { status, message } = classifyAIError(error, model);
    console.error(`[Sandbox API Error - Model ${model}]:`, error.message);
    res.status(status).json({ success: false, message });
  }
};
