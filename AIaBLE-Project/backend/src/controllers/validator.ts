import { Request, Response } from 'express';
import { validateText, fallbackValidate } from '../services/validatorService';

// POST /api/validator
// Body: { text: string, geminiKey?: string }
export const handleValidate = async (req: Request, res: Response) => {
  try {
    const { text, geminiKey } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đoạn văn bản tối thiểu 20 ký tự để kiểm chứng.',
      });
    }

    if (text.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Văn bản quá dài. Tối đa 5000 ký tự.',
      });
    }

    const result = await validateText(text.trim(), geminiKey);
    res.json(result);
  } catch (error: any) {
    console.error('[Validator Controller Error]:', error.message);

    // Graceful fallback — không để FE bị lỗi trắng màn hình
    try {
      const fallback = fallbackValidate(req.body.text || '');
      res.json(fallback);
    } catch {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi kiểm chứng văn bản.',
      });
    }
  }
};
