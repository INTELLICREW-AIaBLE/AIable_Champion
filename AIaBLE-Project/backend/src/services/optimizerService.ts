import { callGemini } from './gemini';
import { callGroq } from './groq';
import { callOpenRouter } from './openrouter';
import dotenv from 'dotenv';

dotenv.config();

export interface OptimizeResult {
  optimized: string;
  improvements: { label: string; before: number; after: number; unit: string }[];
  suggestions: string[];
  ethicsFlag: boolean;
  ethicsReason?: string;
}

// ─── Prompt Injection Detector ─────────────────────────────────────────────────
// Detects attempts to override system instructions or inject malicious role plays
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+(instructions?|prompts?)/i,
  /forget\s+(all\s+)?previous\s+(instructions?|prompts?)/i,
  /disregard\s+(all\s+)?(previous\s+)?instructions?/i,
  /bỏ\s+qua\s+(các\s+)?(gợi\s+ý|hướng\s+dẫn|lệnh)/i,
  /override\s+(the\s+)?system/i,
  /you\s+are\s+now\s+(a|an)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /act\s+as\s+(?!an?\s+(?:expert|specialist|professor|teacher|analyst|researcher|engineer|student))/i,
  /jailbreak/i,
  /DAN\s+mode/i,
];

function detectPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

// ─── Input Sanity Checker ──────────────────────────────────────────────────────
// Rejects if input is meaninglessly long without substance (TC3: 1700 lines of noise)
function assessInputQuality(prompt: string): { isJunk: boolean; reason: string } {
  const wordCount = prompt.trim().split(/\s+/).length;
  const uniqueWords = new Set(prompt.toLowerCase().match(/\b\w{3,}\b/g) || []);
  const uniquenessRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  // More than 800 words with less than 15% unique vocabulary = junk/noise text
  if (wordCount > 800 && uniquenessRatio < 0.15) {
    return {
      isJunk: true,
      reason: `Văn bản quá dài (${wordCount} từ) nhưng có quá ít nội dung thực chất (chỉ ${Math.round(uniquenessRatio * 100)}% từ vựng độc nhất). Vui lòng nhập prompt có ý nghĩa và tập trung hơn.`
    };
  }

  return { isJunk: false, reason: '' };
}

/**
 * Build improved system instruction for the optimizer - fixes TC1, TC2, TC4
 */
function buildSystemInstruction(modelName: string, tone: string): string {
  return `
You are an expert Prompt Engineer for Vietnamese university students, specializing in optimizing raw prompts into highly effective, context-aware academic prompts.

Target Model: "${modelName}" | Tone: "${tone}" (academic, technical, creative, or concise)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — INTENT EXTRACTION (Critical - fixes vague/misunderstood prompts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Carefully analyze the raw prompt to determine:
- The ACTUAL subject/topic the student wants to explore
- The REAL task type: writing | research | coding | slides | analysis | calculation | summary
- The INTENDED audience or purpose (e.g., course assignment, thesis, presentation, lab report)
- Any SPECIFIC constraints or requirements already mentioned (e.g., format, length, structure)

⚠️ DO NOT:
- Invent a domain not mentioned (e.g., do not add "Cơ sở dữ liệu" if user only said "Deadlock")
- Assume a duration, page count, or specific structure the user did NOT explicitly request
- Rewrite "Làm slide thuyết trình về X" without adding missing critical components for slides (Audience, Slide Count Suggestion, Speaker Notes guidance, Visual Elements hints)
- Leave a coding task as a generic template; always extract the language/framework and expand the TASK with specific implementation details

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — STRUCTURED OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rewrite the prompt into this exact structure:

[VAI TRÒ / ROLE]: A highly specific role based on the ACTUAL task type. For coding: senior developer with the relevant language. For slides: experienced academic presenter. For research: domain expert.

[BỐI CẢNH / CONTEXT]: Background derived ONLY from what the student actually wrote. Include: level (đại học/cao học), subject domain only if stated.

[NHIỆM VỤ / TASK]: Expand the task meaningfully based on task type:
- For CODING tasks: specify input/output, core features, error handling, code structure
- For SLIDES tasks: specify clear slide structure, visual element guidance, speaker notes approach, audience level
- For REPORT/WRITING tasks: specify sections, argumentation approach, target length range
- For RESEARCH tasks: specify research questions, methodology, source requirements

[ĐỊNH DẠNG / FORMAT]: Task-specific format. Never generic bullet lists for slides tasks.

[RÀNG BUỘC / CONSTRAINTS]: Relevant guardrails only. No hallucinated or generic constraints.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — ETHICS AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If the prompt clearly requests wholesale assignment completion without learning intent (e.g. "làm hộ", "viết thay", "thi hộ", "làm bài giúm"):
- Set "ethicsFlag": true
- Set "ethicsReason": a Vietnamese message explaining why and offering better alternatives

If safe: "ethicsFlag": false, "ethicsReason": null

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — IMPROVEMENT METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rate objectively:
- Clarity Score: before (how vague/ambiguous the raw prompt is, 5-50), after (85-98)
- Word Count: actual count before and after
- Structure: before (0-25 for unstructured raw prompts), after (80-95)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provide 3 specific, actionable Vietnamese suggestions tailored to THIS prompt's task type.

Return ONLY valid JSON:
{
  "optimized": "string",
  "improvements": [
    { "label": "Clarity Score", "before": number, "after": number, "unit": "%" },
    { "label": "Word Count", "before": number, "after": number, "unit": "w" },
    { "label": "Structure", "before": number, "after": number, "unit": "%" }
  ],
  "suggestions": ["string", "string", "string"],
  "ethicsFlag": boolean,
  "ethicsReason": "string or null"
}
`;
}

export const optimizePrompt = async (
  rawPrompt: string,
  modelName: string,
  tone: string,
  userKey?: string
): Promise<OptimizeResult> => {
  // ── TC5: Prompt Injection Check ───────────────────────────────────────────────
  if (detectPromptInjection(rawPrompt)) {
    throw new Error(
      '🛡️ Phát hiện tấn công Prompt Injection. Yêu cầu của bạn chứa lệnh cố ý ghi đè hướng dẫn hệ thống. AIaBLE từ chối xử lý yêu cầu này.'
    );
  }

  // ── TC3: Input Quality Check ──────────────────────────────────────────────────
  const quality = assessInputQuality(rawPrompt);
  if (quality.isJunk) {
    throw new Error(quality.reason);
  }

  // ── Call AI Model ─────────────────────────────────────────────────────────────
  const systemInstruction = buildSystemInstruction(modelName, tone);
  const promptInput = `${systemInstruction}\n\nRaw Prompt to optimize:\n"""\n${rawPrompt}\n"""`;

  let responseText: string;

  try {
    if (modelName === 'Groq') {
      if (process.env.GROQ_API_KEY) {
        responseText = await callGroq(promptInput, { jsonMode: true });
      } else {
        const groqStylePrompt = `You are Llama 3.1 via Groq. ${promptInput}`;
        responseText = await callGemini(groqStylePrompt, userKey);
      }
    } else if (modelName === 'OpenRouter') {
      if (process.env.OPENROUTER_API_KEY) {
        responseText = await callOpenRouter(promptInput, { jsonMode: true });
      } else {
        const openRouterStylePrompt = `You are an AI via OpenRouter. ${promptInput}`;
        responseText = await callGemini(openRouterStylePrompt, userKey);
      }
    } else {
      responseText = await callGemini(promptInput, userKey);
    }
  } catch (error: any) {
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit') || msg.includes('overloaded')) {
      throw new Error(
        '⚠️ Hệ thống AI đang quá tải hoặc đã hết hạn ngạch (Rate Limit). Vui lòng thử lại sau vài phút.'
      );
    }
    if (msg.includes('timeout') || msg.includes('network') || msg.includes('econnrefused')) {
      throw new Error(
        '🔌 Không thể kết nối đến dịch vụ AI. Kiểm tra kết nối mạng và thử lại.'
      );
    }
    throw new Error(`Lỗi gọi AI (${modelName}): ${error.message}`);
  }

  // ── Parse JSON ────────────────────────────────────────────────────────────────
  let jsonText = responseText.trim();
  try {
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    const parsed: OptimizeResult = JSON.parse(jsonText.trim());
    return parsed;
  } catch (parseError) {
    try {
      let cleaned = jsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
      cleaned = cleaned.replace(/\}\s*\}$/, '}');
      const parsed: OptimizeResult = JSON.parse(cleaned);
      return parsed;
    } catch {
      throw new Error(
        'Hệ thống AI trả về dữ liệu không đọc được. Vui lòng thử lại.'
      );
    }
  }
};
