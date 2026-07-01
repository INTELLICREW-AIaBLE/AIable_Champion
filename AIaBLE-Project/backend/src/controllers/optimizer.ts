import { Request, Response } from 'express';
import { optimizePrompt } from '../services/optimizerService';

export const handleOptimizePrompt = async (req: Request, res: Response) => {
  try {
    const { prompt, model, tone, geminiKey, stream } = req.body;

    // Validate inputs
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Raw prompt is required.'
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
        const result = await optimizePrompt(prompt.trim(), modelName, toneType, geminiKey);

        // Send data in chunks for smoother UX
        const words = result.optimized.split(' ');
        for (let i = 0; i < words.length; i += 5) {
          const chunk = words.slice(i, i + 5).join(' ') + ' ';
          res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
          await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming
        }

        // Send final result with metadata
        res.write(`data: ${JSON.stringify({
          type: 'complete',
          result: {
            ...result,
            cached: false
          }
        })}\n\n`);
        res.end();
      } catch (error: any) {
        res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
        res.end();
      }
      return;
    }

    // Normal JSON response
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
