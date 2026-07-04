import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// ─── Google Custom Search helper ─────────────────────────────────────────────

const searchWikipedia = async (query: string): Promise<{ title: string; url: string; snippet: string }[]> => {
  try {
    const url = `https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=3`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.query || !data.query.search) return [];
    
    return data.query.search.map((item: any) => ({
      title: item.title,
      url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
      snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, "") // remove HTML tags
    }));
  } catch (err) {
    console.error('Wiki search error:', err);
    return [];
  }
};

const searchWeb = async (query: string): Promise<{ title: string; url: string; snippet: string }[]> => {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  // Nếu không cấu hình Google Search, tự động dùng Wikipedia
  if (!apiKey || !cx) {
    return searchWikipedia(query);
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) {
      console.log('Google Search API returned no items or error, falling back to Wikipedia...');
      return searchWikipedia(query);
    }

    return (data.items as any[]).map((item) => ({
      title: item.title || '',
      url: item.link || '',
      snippet: item.snippet || '',
    }));
  } catch (error) {
    console.log('Google Search API throw exception, falling back to Wikipedia...');
    return searchWikipedia(query);
  }
};

// Heuristic check for overconfidence language
const checkOverconfidence = (text: string): number => {
  const absoluteWords = ['100%', 'luôn luôn', 'chắc chắn', 'tuyệt đối', 'hoàn toàn', 'always', 'definitely', 'absolutely'];
  const citationIndicators = ['[', 'source', 'nguồn', 'theo', 'báo cáo', 'nghiên cứu', 'according to', 'report', 'study'];

  const lowerText = text.toLowerCase();
  const hasAbsoluteWord = absoluteWords.some(word => lowerText.includes(word));
  const hasCitation = citationIndicators.some(indicator => lowerText.includes(indicator));

  return hasAbsoluteWord && !hasCitation ? 1 : 0;
};

// ─── Main validator logic (FACTSCORE + Factored CoVe) ───────────────────────────────────

export const validateText = async (
  text: string,
  userKey?: string
): Promise<any> => {
  const activeKey = userKey || process.env.GEMINI_API_KEY;

  if (!activeKey) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  const genAI = new GoogleGenerativeAI(activeKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    generationConfig: { responseMimeType: 'application/json' },
  });

  // ── Step 1: Phân rã văn bản (Claim Segmentation) & Tạo câu hỏi xác thực ──
  const segmentationPrompt = `
You are an expert academic analysis assistant.
Task: Extract up to 5 key factual claims (statistics, named events, historical facts, scientific assertions) from the following text.
CRITICAL RULE: The extracted claim string MUST match EXACTLY word-for-word a substring inside the text so that it can be highlighted. Do not rephrase, do not change capitalization, do not add punctuation.
For each extracted claim, generate 1 or 2 specific verification questions (in Vietnamese or English matching the text language) that can test if the claim is factually correct.

Return ONLY a valid JSON array of objects:
[
  {
    "claim": "exact substring from text",
    "questions": ["verification question 1", "verification question 2"]
  }
]

Text to analyze:
"""
${text.trim()}
"""
`;

  let segmentations: { claim: string; questions: string[] }[] = [];
  try {
    const segmentResult = await model.generateContent(segmentationPrompt);
    const raw = segmentResult.response.text().trim();
    segmentations = JSON.parse(raw);
    if (!Array.isArray(segmentations)) segmentations = [];
  } catch (error) {
    console.error('[Segmentation Error]:', error);
    // Fallback if AI fails
    segmentations = [];
  }

  if (segmentations.length === 0) {
    // If no claims, attempt a basic fallback sentence segmentation
    const sentences = text
      .split(/[.!?]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20)
      .slice(0, 3);
    segmentations = sentences.map(s => ({
      claim: s,
      questions: [`Có đúng là: "${s}" không?`]
    }));
  }

  // Gather all unique questions for the batch CoVe step
  const allQuestions: string[] = [];
  segmentations.forEach(seg => {
    seg.questions.forEach(q => {
      if (!allQuestions.includes(q)) {
        allQuestions.push(q);
      }
    });
  });

  // ── Step 2: Factored CoVe (Trả lời câu hỏi độc lập) ──
  let coveAnswers: Record<string, string> = {};
  if (allQuestions.length > 0) {
    const covePrompt = `
You are an objective factual database. Answer the following questions concisely, directly, and objectively.
Do not refer to any essay, claimant, or surrounding context. Just provide the direct facts.
Return ONLY a valid JSON object mapping each question to its concise answer:
{
  "question": "answer"
}

Questions:
${JSON.stringify(allQuestions)}
`;

    try {
      const coveResult = await model.generateContent(covePrompt);
      const rawAnswers = coveResult.response.text().trim();
      coveAnswers = JSON.parse(rawAnswers);
    } catch (error) {
      console.error('[CoVe Answers Error]:', error);
    }
  }

  // ── Step 3 & 4: Tra cứu RAG + Đánh giá Rủi ro (G-Eval style) cho từng claim ──
  const claimsResults: any[] = [];
  
  // We process each claim in parallel
  const analysisPromises = segmentations.map(async (seg) => {
    const { claim, questions } = seg;
    const overconfidenceLanguage = checkOverconfidence(claim);

    // Get answers corresponding to this claim's questions
    const qAndA: Record<string, string> = {};
    questions.forEach(q => {
      qAndA[q] = coveAnswers[q] || 'Không có câu trả lời.';
    });

    // Run Google Search/Wikipedia for this claim
    const searchResults = await searchWeb(claim);
    const searchSnippets = searchResults
      .map((s, idx) => `[${idx + 1}] ${s.title}: ${s.snippet}`)
      .join('\n');

    // Risk aggregation via G-Eval
    const evalPrompt = `
You are an AI Hallucination Detector and Critical Thinking Trainer. Analyze the reliability of the following claim using the provided CoVe independent answers and search results.

Claim: "${claim}"
CoVe Answers (Independent fact verification answers):
${JSON.stringify(qAndA)}

Search Snippets:
${searchSnippets || 'No web search results available.'}

Overconfidence Heuristic Flag: ${overconfidenceLanguage} (1 if user used words like always/100% without citations, 0 otherwise)

Evaluate and assign the following parameters:
1. selfInconsistency (0.0 to 1.0): Do the independent CoVe answers contradict the claim? (1.0 if they completely contradict, 0.0 if they fully support).
2. noSourceFound (0.0 or 1.0): Are there no supporting sources found in the search results? (1.0 if no support/no sources, 0.0 if supported).
3. sourceContradiction (0.0 to 1.0): Do the search results explicitly contradict the claim? (1.0 if they say the opposite, 0.0 if they support).

Calculate the overall riskScore (0.0 to 1.0) using the weighted formula:
riskScore = 0.4 * selfInconsistency + 0.3 * noSourceFound + 0.2 * sourceContradiction + 0.1 * overconfidenceLanguage

Write a Critical Thinking Card for this claim in Vietnamese. Explain why this claim might be risky (reasonText). Generate 2 open-ended guiding questions (guidingQuestions) to help students self-research, and suggest 2 google search terms (suggestedSearchTerms) they can copy.

Return ONLY a JSON object:
{
  "selfInconsistency": number,
  "noSourceFound": number,
  "sourceContradiction": number,
  "riskScore": number,
  "reasonText": "Vietnamese explanation",
  "guidingQuestions": ["question 1", "question 2"],
  "suggestedSearchTerms": ["term 1", "term 2"]
}
`;

    try {
      const evalResult = await model.generateContent(evalPrompt);
      const parsed = JSON.parse(evalResult.response.text().trim());

      const riskScore = typeof parsed.riskScore === 'number' ? parsed.riskScore : 0.5;
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (riskScore > 0.6) riskLevel = 'high';
      else if (riskScore >= 0.3) riskLevel = 'medium';

      const sourceUrl = searchResults && searchResults.length > 0 ? searchResults[0].url : '';

      return {
        text: claim,
        riskScore,
        riskLevel,
        signals: {
          selfInconsistency: parsed.selfInconsistency || 0,
          noSourceFound: parsed.noSourceFound || 0,
          sourceContradiction: parsed.sourceContradiction || 0,
          overconfidenceLanguage
        },
        card: {
          reasonText: parsed.reasonText || 'Đoạn văn này chứa khẳng định cần kiểm chứng thêm nguồn gốc.',
          guidingQuestions: parsed.guidingQuestions || ['Bạn có thể tìm nguồn độc lập nào xác thực điều này?'],
          suggestedSearchTerms: parsed.suggestedSearchTerms || [claim],
          sourceUrl
        }
      };
    } catch (error) {
      console.error(`[Eval Claim Error for: ${claim}]:`, error);
      // Try to fallback only searchResults URL to provide some sources if possible
      const sourceUrl = searchResults && searchResults.length > 0 ? searchResults[0].url : '';

      return {
        text: claim,
        riskScore: 0.4,
        riskLevel: 'medium',
        signals: {
          selfInconsistency: 0.5,
          noSourceFound: 0.5,
          sourceContradiction: 0.0,
          overconfidenceLanguage
        },
        card: {
          reasonText: 'Không thể phân tích rủi ro chi tiết do lỗi kết nối AI. Cần kiểm tra lại nguồn tài liệu.',
          guidingQuestions: ['Hãy kiểm tra lại số liệu này bằng nguồn sách hoặc báo chí chính thống.'],
          suggestedSearchTerms: [claim],
          sourceUrl
        }
      };
    }
  });

  const resolvedClaims = await Promise.all(analysisPromises);

  // Aggregate overall essay score
  const totalClaims = resolvedClaims.length;
  let overallRiskSum = 0;
  resolvedClaims.forEach(c => overallRiskSum += c.riskScore);
  const averageRisk = totalClaims > 0 ? (overallRiskSum / totalClaims) : 0.5;
  // Convert risk (0 to 1) into critical thinking score (0 to 100)
  // Higher risk means lower score
  const criticalThinkingScore = Math.max(0, Math.min(100, Math.round((1 - averageRisk) * 100)));

  const verifiedCount = resolvedClaims.filter(c => c.riskLevel === 'low').length;
  const disputedCount = resolvedClaims.filter(c => c.riskLevel === 'high').length;
  const unverifiedCount = resolvedClaims.filter(c => c.riskLevel === 'medium').length;

  const summary = totalClaims === 0
    ? 'Văn bản học thuật không chứa phát ngôn cụ thể nào cần bóc tách kiểm chứng.'
    : `Hệ thống AI Ethics Guardrail phát hiện ${totalClaims} điểm dữ kiện học thuật: ${disputedCount} cảnh báo rủi ro cao, ${unverifiedCount} cần đối chiếu nguồn và ${verifiedCount} có mức độ nhất quán cao. Điểm hỗ trợ tư duy phản biện: ${criticalThinkingScore}/100.`;

  return {
    success: true,
    criticalThinkingScore,
    totalClaims,
    claims: resolvedClaims,
    summary
  };
};

// Fallback when all else fails
export const fallbackValidate = (text: string): any => {
  const sentences = text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 3);

  const claims = sentences.map(s => ({
    text: s,
    riskScore: 0.4,
    riskLevel: 'medium' as const,
    signals: {
      selfInconsistency: 0.5,
      noSourceFound: 1,
      sourceContradiction: 0,
      overconfidenceLanguage: 0
    },
    card: {
      reasonText: 'Chế độ dự phòng: Không thể kết nối AI phân tích nâng cao.',
      guidingQuestions: ['Bạn có thể tự tra cứu trên Google Scholar để xác nhận không?'],
      suggestedSearchTerms: [s],
      sourceUrl: ''
    }
  }));

  return {
    success: true,
    criticalThinkingScore: 60,
    totalClaims: claims.length,
    claims,
    summary: 'Phân tích ở chế độ dự phòng do hệ thống quá tải. Vui lòng thử lại sau.'
  };
};
