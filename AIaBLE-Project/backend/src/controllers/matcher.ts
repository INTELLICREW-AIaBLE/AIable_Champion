import { Request, Response } from 'express';
import { matchTask } from '../services/taskMatcher';
import { callGemini } from '../services/gemini';
import { callOpenRouter } from '../services/openrouter';
import { callGroq } from '../services/groq';
import { generateSunoMusic } from '../services/sunoService';

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

// Helper to get model-specific system instruction personas
const getModelPersonaInstruction = (tool: string): string => {
  const toolLower = tool.toLowerCase();
  if (toolLower.includes('claude')) {
    return `
You are simulating Anthropic's Claude 3.5 Sonnet.
CLAUDE STYLE GUIDELINES:
- Tone: Exceptionally intellectual, clear, objective, analytical, and professional.
- Presentation: Use sophisticated but clear structure. Avoid standard AI preambles (e.g. "Sure, I can help with that..."). Go straight to the point.
- Detail: Provide deeply reasoned and highly detailed analysis. Avoid buzzwords or generic hype words. Use bullet points and paragraphs with precise definitions.
- Formatting: Clean, structured markdown, using bold headings.
`;
  }
  if (toolLower.includes('gpt') || toolLower.includes('chatgpt')) {
    return `
You are simulating OpenAI's GPT-4o.
GPT-4o STYLE GUIDELINES:
- Tone: Highly practical, structured, clear, and very direct.
- Presentation: Start with a brief, helpful 1-sentence outline if helpful, then present structured sections.
- Detail: Focus on actionable steps, checklists, and clean formats.
- Formatting: Extensive use of markdown tables, list items, and bold text for visual structure.
`;
  }
  if (toolLower.includes('llama') || toolLower.includes('groq') || toolLower.includes('copilot')) {
    return `
You are simulating Meta's Llama 3 (via Groq).
LLAMA 3 STYLE GUIDELINES:
- Tone: Direct, technical, highly concise, and coder-friendly.
- Presentation: Go straight to the facts or code. Do not use generic explanations or unnecessary descriptions.
- Detail: Short, impact-driven sentences, technical bullet points, and clean syntax boxes.
- Formatting: Compact lists, code blocks, and markdown tables without wordy paragraphs.
`;
  }
  // Default Gemini style
  return `
You are Google's Gemini.
GEMINI STYLE GUIDELINES:
- Tone: Creative, extremely friendly, comprehensive, and highly engaging.
- Presentation: Outlines with clear headings and summaries.
- Detail: Multi-dimensional, covers broad context, integrates examples.
- Formatting: Colorful markdown structure, using emojis (1-2 per section) to keep readability high.
`;
};

// POST /api/task-matcher/execute-step
// Execute a single step in the n8n pipeline
export const executeStepController = async (req: Request, res: Response) => {
  try {
    const { stepName, description, suggestedPrompt, input, initialPrompt, lang, suggestedTool } = req.body;

    if (!stepName || !description || !initialPrompt) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: stepName, description, or initialPrompt'
      });
    }

    const languageInstruction = lang === 'en' ? 'MUST BE IN ENGLISH' : 'BẮT BUỘC BẰNG TIẾNG VIỆT';
    const personaInstruction = getModelPersonaInstruction(suggestedTool || 'Gemini');

    const systemPrompt = `
${personaInstruction}

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
6. Style instruction: Adhere strictly to the STYLE GUIDELINES defined at the top of this prompt. Make your output style match the specified model perfectly.

OUTPUT:
`;

    const toolLower = (suggestedTool || '').toLowerCase();
    let result = '';

    try {
      if (toolLower.includes('suno')) {
        result = await generateSunoMusic(input || initialPrompt);
      } else if (toolLower.includes('claude')) {
        console.log('[Model Router] Routing to Claude 3.5 Sonnet via OpenRouter...');
        result = await callOpenRouter(systemPrompt, { modelName: 'anthropic/claude-3.5-sonnet' });
      } else if (toolLower.includes('gpt') || toolLower.includes('chatgpt')) {
        console.log('[Model Router] Routing to GPT-4o via OpenRouter...');
        result = await callOpenRouter(systemPrompt, { modelName: 'openai/gpt-4o' });
      } else if (toolLower.includes('llama') || toolLower.includes('groq') || toolLower.includes('copilot')) {
        console.log('[Model Router] Routing to Llama 3 via Groq...');
        result = await callGroq(systemPrompt);
      } else {
        console.log('[Model Router] Routing to Gemini...');
        result = await callGemini(systemPrompt);
      }
    } catch (routeError: any) {
      console.warn(`[Model Router Warning] Router failed for tool "${suggestedTool}" (${routeError.message}). Falling back to Gemini...`);
      
      // Fallback: we still pass the persona instruction so Gemini behaves like the requested tool!
      result = await callGemini(systemPrompt);
    }

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
