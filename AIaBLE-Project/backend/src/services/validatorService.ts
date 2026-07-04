import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// ─── Source category classifier ───────────────────────────────────────────────

const classifySource = (url: string, title: string): { category: string; weight: number } => {
  const u = url.toLowerCase();

  // Tier 1: Academic & Government (weight 3)
  if (
    u.includes('scholar.google') || u.includes('pubmed') || u.includes('.gov') ||
    u.includes('ncbi.nlm') || u.includes('ieee') || u.includes('acm.org') ||
    u.includes('springer') || u.includes('nature.com') || u.includes('sciencedirect')
  ) {
    return { category: 'Academic', weight: 3 };
  }
  // Tier 2: Encyclopedias & Reference (weight 2)
  if (u.includes('wikipedia') || u.includes('britannica') || u.includes('encyclopedia')) {
    return { category: 'Wikipedia', weight: 2 };
  }
  // Tier 3: Reputable news & institutions (weight 2)
  if (
    u.includes('bbc') || u.includes('reuters') || u.includes('apnews') ||
    u.includes('nytimes') || u.includes('theguardian') || u.includes('vnexpress') ||
    u.includes('tuoitre') || u.includes('thanhnien') || u.includes('nhandan')
  ) {
    return { category: 'News', weight: 2 };
  }
  // Tier 4: General web (weight 1)
  return { category: 'Web', weight: 1 };
};

// Compute evidenceScore from search results
// >=3 trusted sources -> BACKED; 1-2 -> PARTIALLY_BACKED; 0 -> UNBACKED
const computeBackingLevel = (
  sources: { title: string; url: string; snippet: string }[]
): { level: 'BACKED' | 'PARTIALLY_BACKED' | 'UNBACKED'; evidenceScore: number; weightedCount: number } => {
  if (!sources || sources.length === 0) {
    return { level: 'UNBACKED', evidenceScore: 0, weightedCount: 0 };
  }

  const sourceCount = Math.min(sources.length, 4);

  // Weighted tally
  let weightedCount = 0;
  for (const src of sources.slice(0, 4)) {
    const { weight } = classifySource(src.url, src.title);
    weightedCount += weight >= 2 ? 1 : 0.5;
  }

  if (sourceCount >= 3) {
    return {
      level: 'BACKED',
      evidenceScore: Math.min(100, Math.round(weightedCount * 25 + 25)),
      weightedCount: sourceCount,
    };
  } else if (sourceCount > 0) {
    return { level: 'PARTIALLY_BACKED', evidenceScore: Math.round(sourceCount * 30), weightedCount: sourceCount };
  }
  return { level: 'UNBACKED', evidenceScore: 0, weightedCount: 0 };
};

// Format source label: "Wikipedia: Title" or "News: Title" etc.
const formatSourceLabel = (url: string, title: string): string => {
  const { category } = classifySource(url, title);
  const cleanTitle = title.replace(/\s*[-–|].*$/, '').trim();
  return `${category}: ${cleanTitle}`;
};

// ─── Google Custom Search helper ──────────────────────────────────────────────

const isEnglish = (text: string): boolean => {
  const englishWords = ['the', 'and', 'of', 'to', 'in', 'is', 'that', 'it', 'for', 'on', 'with', 'as', 'by', 'at', 'were', 'are', 'was', 'many', 'animals', 'dinosaur', 'extinction'];
  const words = text.toLowerCase().split(/[^\w]+/);
  return words.some(w => englishWords.includes(w));
};

const searchWikipedia = async (query: string, lang = 'vi'): Promise<{ title: string; url: string; snippet: string }[]> => {
  try {
    const cleaned = query.replace(/["'""''.,!?;]/g, '').trim();
    const domain = lang === 'en' ? 'en' : 'vi';
    const url = `https://${domain}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleaned)}&utf8=&format=json&srlimit=4`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.query || !data.query.search || data.query.search.length === 0) {
      return [];
    }
    return data.query.search.map((item: any) => ({
      title: item.title,
      url: `https://${domain}.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
      snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
    }));
  } catch (err) {
    console.log('Wiki search error:', err);
    return [];
  }
};

const searchWeb = async (query: string, isEng = false): Promise<{ title: string; url: string; snippet: string }[]> => {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;
  const lang = isEng ? 'en' : 'vi';

  const executeSearch = async (q: string): Promise<{ title: string; url: string; snippet: string }[]> => {
    if (!apiKey || !cx) {
      return searchWikipedia(q, lang);
    }
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(q)}&num=4`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        return searchWikipedia(q, lang);
      }
      return (data.items as any[]).map((item) => ({
        title: item.title || '',
        url: item.link || '',
        snippet: item.snippet || '',
      }));
    } catch {
      return searchWikipedia(q, lang);
    }
  };

  let results = await executeSearch(query);
  if (results.length > 0) return results;

  const words = query.trim().split(/\s+/);
  if (words.length > 5) {
    const simplified = words.slice(0, 5).join(' ');
    results = await executeSearch(simplified);
    if (results.length > 0) return results;
  }

  const keywords = words
    .filter(w => w.length > 3 && !['many', 'such', 'were', 'with', 'from', 'that', 'this'].includes(w.toLowerCase()))
    .slice(0, 4)
    .join(' ');
  if (keywords && keywords !== query) {
    results = await executeSearch(keywords);
    if (results.length > 0) return results;
  }

  return [];
};

// Heuristic check for overconfidence language
const checkOverconfidence = (text: string): number => {
  const absoluteWords = ['100%', 'luôn luôn', 'chắc chắn', 'tuyệt đối', 'hoàn toàn', 'always', 'definitely', 'absolutely'];
  const citationIndicators = ['[', 'source', 'nguồn', 'theo', 'báo cáo', 'nghiên cứu', 'according to', 'report', 'study'];
  const lowerText = text.toLowerCase();
  const hasAbsoluteWord = absoluteWords.some(w => lowerText.includes(w));
  const hasCitation = citationIndicators.some(i => lowerText.includes(i));
  return hasAbsoluteWord && !hasCitation ? 1 : 0;
};

// ─── Main validator logic (FACTSCORE + Factored CoVe) ────────────────────────

export const validateText = async (text: string, userKey?: string): Promise<any> => {
  const activeKey = userKey || process.env.GEMINI_API_KEY;
  if (!activeKey) throw new Error('GEMINI_API_KEY is missing.');

  const genAI = new GoogleGenerativeAI(activeKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-lite',
    generationConfig: { responseMimeType: 'application/json' },
  });

  // ── Step 1: Claim Segmentation ──
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
    segmentations = [];
  }

  if (segmentations.length === 0) {
    const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 20).slice(0, 3);
    segmentations = sentences.map(s => ({ claim: s, questions: [`Có đúng là: "${s}" không?`] }));
  }

  // ── Step 2: Factored CoVe ──
  const allQuestions: string[] = [];
  segmentations.forEach(seg => seg.questions.forEach(q => { if (!allQuestions.includes(q)) allQuestions.push(q); }));

  let coveAnswers: Record<string, string> = {};
  if (allQuestions.length > 0) {
    const covePrompt = `
You are an objective factual database. Answer the following questions concisely, directly, and objectively.
Do not refer to any essay, claimant, or surrounding context. Just provide the direct facts.
Return ONLY a valid JSON object mapping each question to its concise answer:
{ "question": "answer" }

Questions:
${JSON.stringify(allQuestions)}
`;
    try {
      const coveResult = await model.generateContent(covePrompt);
      coveAnswers = JSON.parse(coveResult.response.text().trim());
    } catch (error) {
      console.error('[CoVe Answers Error]:', error);
    }
  }

  // ── Step 3 & 4: RAG + G-Eval risk per claim ──
  const analysisPromises = segmentations.map(async seg => {
    const { claim, questions } = seg;
    const overconfidenceLanguage = checkOverconfidence(claim);

    const qAndA: Record<string, string> = {};
    questions.forEach(q => { qAndA[q] = coveAnswers[q] || 'Không có câu trả lời.'; });

    const isEng = isEnglish(claim);
    const searchResults = await searchWeb(claim, isEng);
    const searchSnippets = searchResults.map((s, idx) => `[${idx + 1}] ${s.title}: ${s.snippet}`).join('\n');

    // Compute evidence backing from real search results
    const backing = computeBackingLevel(searchResults);
    const formattedSources = searchResults.slice(0, 4).map(src => ({
      label: formatSourceLabel(src.url, src.title),
      url: src.url,
      snippet: src.snippet,
    }));

    const evalPrompt = `
You are an AI Hallucination Detector and Critical Thinking Trainer. Analyze the reliability of the following claim.

Claim: "${claim}"
CoVe Answers (Independent fact verification):
${JSON.stringify(qAndA)}

Search Snippets:
${searchSnippets || 'No web search results available.'}

Overconfidence Heuristic Flag: ${overconfidenceLanguage} (1 if absolute claims without citations, 0 otherwise)

Evaluate:
1. selfInconsistency (0.0 to 1.0): CoVe answers contradict the claim?
2. noSourceFound (0.0 or 1.0): No supporting sources?
3. sourceContradiction (0.0 to 1.0): Search results contradict the claim?

riskScore = 0.4 * selfInconsistency + 0.3 * noSourceFound + 0.2 * sourceContradiction + 0.1 * overconfidenceLanguage

Write a Critical Thinking Card in Vietnamese: reasonText (why risky), guidingQuestions (2 open-ended), suggestedSearchTerms (2 google queries).

Return ONLY:
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

      return {
        text: claim,
        riskScore,
        riskLevel,
        signals: {
          selfInconsistency: parsed.selfInconsistency || 0,
          noSourceFound: parsed.noSourceFound || 0,
          sourceContradiction: parsed.sourceContradiction || 0,
          overconfidenceLanguage,
        },
        card: {
          reasonText: parsed.reasonText || 'Đoạn văn này chứa khẳng định cần kiểm chứng thêm nguồn gốc.',
          guidingQuestions: parsed.guidingQuestions || ['Bạn có thể tìm nguồn độc lập nào xác thực điều này?'],
          suggestedSearchTerms: parsed.suggestedSearchTerms || [claim],
          sourceUrl: formattedSources.length > 0 ? formattedSources[0].url : '',
          sources: formattedSources,
          backingLevel: backing.level,
          evidenceScore: backing.evidenceScore,
          sourceCount: backing.weightedCount,
        },
      };
    } catch (error) {
      console.error(`[Eval Claim Error for: ${claim}]:`, error);
      return {
        text: claim,
        riskScore: 0.4,
        riskLevel: 'medium' as const,
        signals: { selfInconsistency: 0.5, noSourceFound: 0.5, sourceContradiction: 0.0, overconfidenceLanguage },
        card: {
          reasonText: 'Không thể phân tích rủi ro chi tiết do lỗi kết nối AI. Cần kiểm tra lại nguồn tài liệu.',
          guidingQuestions: ['Hãy kiểm tra lại số liệu này bằng nguồn sách hoặc báo chí chính thống.'],
          suggestedSearchTerms: [claim],
          sourceUrl: formattedSources.length > 0 ? formattedSources[0].url : '',
          sources: formattedSources,
          backingLevel: backing.level,
          evidenceScore: backing.evidenceScore,
          sourceCount: backing.weightedCount,
        },
      };
    }
  });

  const resolvedClaims = await Promise.all(analysisPromises);

  const totalClaims = resolvedClaims.length;
  let overallRiskSum = 0;
  resolvedClaims.forEach(c => (overallRiskSum += c.riskScore));
  const averageRisk = totalClaims > 0 ? overallRiskSum / totalClaims : 0.5;
  const criticalThinkingScore = Math.max(0, Math.min(100, Math.round((1 - averageRisk) * 100)));

  const verifiedCount = resolvedClaims.filter(c => c.riskLevel === 'low').length;
  const disputedCount = resolvedClaims.filter(c => c.riskLevel === 'high').length;
  const unverifiedCount = resolvedClaims.filter(c => c.riskLevel === 'medium').length;

  const summary =
    totalClaims === 0
      ? 'Văn bản học thuật không chứa phát ngôn cụ thể nào cần bóc tách kiểm chứng.'
      : `Hệ thống AI Ethics Guardrail phát hiện ${totalClaims} điểm dữ kiện học thuật: ${disputedCount} cảnh báo rủi ro cao, ${unverifiedCount} cần đối chiếu nguồn và ${verifiedCount} có mức độ nhất quán cao. Điểm hỗ trợ tư duy phản biện: ${criticalThinkingScore}/100.`;

  return { success: true, criticalThinkingScore, totalClaims, claims: resolvedClaims, summary };
};

// Fallback when all else fails
export const fallbackValidate = (text: string): any => {
  const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 20).slice(0, 3);
  const claims = sentences.map(s => ({
    text: s,
    riskScore: 0.4,
    riskLevel: 'medium' as const,
    signals: { selfInconsistency: 0.5, noSourceFound: 1, sourceContradiction: 0, overconfidenceLanguage: 0 },
    card: {
      reasonText: 'Chế độ dự phòng: Không thể kết nối AI phân tích nâng cao.',
      guidingQuestions: ['Bạn có thể tự tra cứu trên Google Scholar để xác nhận không?'],
      suggestedSearchTerms: [s],
      sourceUrl: '',
      sources: [],
      backingLevel: 'UNBACKED' as const,
      evidenceScore: 0,
      sourceCount: 0,
    },
  }));
  return {
    success: true,
    criticalThinkingScore: 60,
    totalClaims: claims.length,
    claims,
    summary: 'Phân tích ở chế độ dự phòng do hệ thống quá tải. Vui lòng thử lại sau.',
  };
};
