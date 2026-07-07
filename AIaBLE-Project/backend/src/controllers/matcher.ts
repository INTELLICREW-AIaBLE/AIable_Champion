import { Request, Response } from 'express';
import { matchTask } from '../services/taskMatcher';
import { callGemini } from '../services/gemini';

// POST /api/task-matcher
// Body: { subject: string, description: string }

export const matchTaskController = async (req: Request, res: Response) => {
  try {
    const { subject, description, lang } = req.body;

    // Validate input
    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: subject and description'
      });
    }

    if (typeof subject !== 'string' || typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'subject and description must be strings'
      });
    }

    const result = await matchTask(subject.trim(), description.trim(), lang);

    res.json(result);

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to match task'
    });
  }
};

// GET /api/task-matcher
// Return a default workflow for initial load
export const getDefaultWorkflowController = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        stepName: 'Phân tích yêu cầu',
        description: 'Xác định bài toán, đối tượng sử dụng, chức năng chính của hệ thống.',
        suggestedTool: 'Gemini',
        reason: 'Gemini giúp brainstorm nhanh các use case và yêu cầu hệ thống.',
        suggestedPrompt: 'Phân tích yêu cầu hệ thống cho dự án [TÊN_DỰ_ÁN]...'
      }
    ]
  });
};

// POST /api/task-matcher/execute-step
// Execute a single step in the n8n pipeline
export const executeStepController = async (req: Request, res: Response) => {
  try {
    const { stepName, description, suggestedPrompt, input, initialPrompt, lang } = req.body;

    if (!stepName || !description || !initialPrompt) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: stepName, description, or initialPrompt'
      });
    }

    const languageInstruction = lang === 'en' ? 'MUST BE IN ENGLISH' : 'BẮT BUỘC BẰNG TIẾNG VIỆT';

    const systemPrompt = `
You are an expert AI agent executing step "${stepName}" of a complex university assignment workflow (n8n-style node execution).

============================================================
INITIAL GOAL (De bai goc):
"${initialPrompt}"

NODE STEP NAME: "${stepName}"
NODE DESCRIPTION: "${description}"
SUGGESTED STEP PROMPT: "${suggestedPrompt || ''}"
============================================================

INPUT DATA (Dau vao tu buoc truoc hoac tu de bai goc):
"""
${input || initialPrompt}
"""

INSTRUCTIONS:
1. Generate the detailed, high-quality output for this step.
2. The output MUST build upon the INPUT DATA and align with the INITIAL GOAL.
3. Make the response highly detailed, practical, and formatted in clean Markdown (using headings, lists, or tables as appropriate).
4. Do not include introductory/outro sentences (e.g. "Dưới đây là kết quả..."). Start directly with the results.
5. Language instruction: ${languageInstruction}.

OUTPUT:
`;

    const result = await callGemini(systemPrompt);
    res.json({
      success: true,
      output: result
    });
  } catch (error: any) {
    console.error('[Execute Step Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute step'
    });
  }
};