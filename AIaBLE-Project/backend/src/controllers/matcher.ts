import { Request, Response } from 'express';
import { matchTask } from '../services/taskMatcher';

// POST /api/task-matcher
// Body: { subject: string, description: string }

export const matchTaskController = async (req: Request, res: Response) => {
  try {
    const { subject, description } = req.body;

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

    const result = await matchTask(subject.trim(), description.trim());

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