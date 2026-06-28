import { Request, Response } from 'express';
import { optimizePrompt } from '../services/optimizerService';

export const handleOptimizePrompt = async (req: Request, res: Response) => {
  try {
    const { prompt, model, tone, geminiKey } = req.body;

    // Validate inputs
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Raw prompt is required.'
      });
    }

    const modelName = model || 'Gemini';
    const toneType = tone || 'academic';

    const result = await optimizePrompt(prompt.trim(), modelName, toneType, geminiKey);

    res.json(result);
  } catch (error: any) {
    console.error('[Optimizer Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to optimize prompt.'
    });
  }
};
