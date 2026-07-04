import { Request, Response } from 'express';
import { optimizePrompt } from '../services/optimizerService';

export const handleOptimizePrompt = async (req: Request, res: Response) => {
  try {
    const { prompt, model, tone, geminiKey, stream } = req.body;

    // Validate inputs
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập prompt cần tối ưu.'
      });
    }

    if (typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Prompt phải là chuỗi văn bản hợp lệ.'
      });
    }

    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Prompt quá ngắn. Vui lòng nhập ít nhất 5 ký tự.'
      });
    }

    if (trimmedPrompt.length > 5000) {
      return res.status(400).json({
        success: false,
        message: `Prompt quá dài (${trimmedPrompt.length} ký tự). Vui lòng giới hạn dưới 5000 ký tự để hệ thống phân tích hiệu quả nhất.`
      });
    }

    const modelName = model || 'Gemini';
    const toneType = tone || 'academic';

    // Handle streaming response
    if (stream === true) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const result = await optimizePrompt(trimmedPrompt, modelName, toneType, geminiKey);

        // Send data in chunks for smoother UX
        const words = result.optimized.split(' ');
        for (let i = 0; i < words.length; i += 5) {
          const chunk = words.slice(i, i + 5).join(' ') + ' ';
          res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        res.write(`data: ${JSON.stringify({
          type: 'complete',
          result: { ...result, cached: false }
        })}\n\n`);
        res.end();
      } catch (error: any) {
        res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
        res.end();
      }
      return;
    }

    // Normal JSON response - optimizePrompt now throws on ALL failures (no silent fallback)
    const result = await optimizePrompt(trimmedPrompt, modelName, toneType, geminiKey);
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[Optimizer Controller Error]:', error.message);
    // Return specific error message - no more generic fallback
    res.status(error.message?.includes('Prompt Injection') ? 403 : 503).json({
      success: false,
      message: error.message || 'Hệ thống gặp sự cố không xác định. Vui lòng thử lại sau.'
    });
  }
};
