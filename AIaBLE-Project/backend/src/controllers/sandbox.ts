import { Request, Response } from 'express';
import { callGemini } from '../services/gemini';

// POST /api/sandbox
export const runSandboxModel = async (req: Request, res: Response) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt || !model) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp prompt và model.'
      });
    }

    let result = '';

    // Hiện tại do mình mới chỉ có GEMINI_API_KEY, 
    // nên em sẽ cấu hình cho Gemini "đóng vai" các model khác (Claude, GPT-4) 
    // để anh có thể test giao diện Sandbox hoạt động song song.
    if (model === 'Gemini') {
      result = await callGemini(prompt);
    } else if (model === 'Claude') {
      const claudePrompt = `Bạn là Claude, một AI được phát triển bởi Anthropic. Bạn nổi tiếng với phong cách viết văn tự nhiên, chi tiết, cẩn thận và thấu cảm. Hãy trả lời câu hỏi sau bằng phong cách của Claude:\n\n${prompt}`;
      result = await callGemini(claudePrompt);
    } else if (model === 'GPT-4') {
      const gptPrompt = `Bạn là ChatGPT (GPT-4), một AI của OpenAI. Bạn nổi tiếng với phong cách viết logic, cấu trúc cực kỳ chặt chẽ, thẳng thắn và tập trung vào giải quyết vấn đề. Hãy trả lời câu hỏi sau bằng phong cách của GPT-4:\n\n${prompt}`;
      result = await callGemini(gptPrompt);
    } else {
      return res.status(400).json({ success: false, message: 'Model không được hỗ trợ' });
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error(`[Sandbox Error] Model ${req.body.model}:`, error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi gọi API AI'
    });
  }
};
