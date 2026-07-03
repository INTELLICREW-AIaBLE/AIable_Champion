import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { ValidatorResult, AnalyzedClaim, SourceLink } from '../types/validator';

dotenv.config();

// ─── Google Custom Search helper ─────────────────────────────────────────────

const searchWikipedia = async (query: string): Promise<SourceLink[]> => {
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

const searchWeb = async (query: string): Promise<SourceLink[]> => {
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

    // Nếu Google API báo lỗi (VD: chưa bật Custom Search JSON API), fallback sang Wikipedia
    if (!data.items) {
      console.warn('Google Search API returned no items or error, falling back to Wikipedia...');
      return searchWikipedia(query);
    }

    return (data.items as any[]).map((item) => ({
      title: item.title || '',
      url: item.link || '',
      snippet: item.snippet || '',
    }));
  } catch (error) {
    console.warn('Google Search API throw exception, falling back to Wikipedia...');
    return searchWikipedia(query);
  }
};

// ─── Main validator logic ─────────────────────────────────────────────────────

export const validateText = async (
  text: string,
  userKey?: string
): Promise<ValidatorResult> => {
  const activeKey = userKey || process.env.GEMINI_API_KEY;

  if (!activeKey) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  const hasSearchKey =
    !!process.env.GOOGLE_SEARCH_API_KEY && !!process.env.GOOGLE_SEARCH_CX;

  // ── Step 1: Dùng Gemini tách các phát ngôn cần kiểm chứng ─────────────────
  const extractPrompt = `
You are a fact-checking assistant. Given the following text written in Vietnamese or English, extract all factual claims that can be independently verified (statistics, named events, historical facts, scientific claims, quotes, etc.).

CRITICAL RULE: You MUST extract the claims EXACTLY as they are written in the text. DO NOT correct any factual errors, wrong dates, or typos! If the text contains false information (e.g., a wrong year), you must extract that EXACT false information. Your job here is only extraction, not correction.

Return ONLY a valid JSON array of strings. Each string is one claim. Maximum 8 claims. No markdown, no explanation.

Text:
"""
${text.trim()}
"""
`;

  const genAI = new GoogleGenerativeAI(activeKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    generationConfig: { responseMimeType: 'application/json' },
  });

  let claims: string[] = [];
  try {
    const extractResult = await model.generateContent(extractPrompt);
    const raw = extractResult.response.text().trim();
    claims = JSON.parse(raw);
    if (!Array.isArray(claims)) claims = [];
  } catch {
    // Fallback: treat whole text as one claim
    claims = [text.trim().slice(0, 200)];
  }

  // ── Step 2: Với mỗi claim, tìm kiếm web + nhờ Gemini phân tích ────────────
  const analyzedClaims: AnalyzedClaim[] = [];

  for (const claim of claims.slice(0, 8)) {
    // Tìm nguồn từ Google Search (nếu có key)
    const sources = hasSearchKey ? await searchWeb(claim) : [];

    // Gemini phân tích claim đối chiếu với sources
    const snippets = sources
      .map((s, i) => `[${i + 1}] ${s.title}: ${s.snippet}`)
      .join('\n');

    const analyzePrompt = `
You are an expert Fact-Checker and RAG System Validator. Analyze the following claim and determine its accuracy based strictly on the search results provided (if any).

Claim: "${claim}"

Search results:
${snippets || 'No search results available.'}

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "status": "verified" | "unverified" | "disputed",
  "explanation": "1-2 sentence explanation in Vietnamese",
  "confidence": number between 0 and 100
}

Rules & Constraints:
1. Trạng thái (Status mapping): 
   - "verified" (Hợp lệ): claim is confirmed by reliable search results.
   - "disputed" (Sai lệch): claim contradicts search results or is proven false.
   - "unverified" (Không xác định): not enough evidence.
2. Ưu tiên các nguồn tin có domain chính thống, tránh các trang blog cá nhân hoặc diễn đàn. 
3. Nếu không tìm thấy nguồn tin cậy hoặc search results rỗng, bạn PHẢI ghi rõ "Không đủ bằng chứng" trong phần explanation thay vì tự suy diễn.
4. Trong explanation, hãy trích dẫn ngắn gọn nguồn hỗ trợ nếu có.
`;

    let status: AnalyzedClaim['status'] = 'unverified';
    let explanation = 'Không đủ bằng chứng.';
    let confidence = 40;

    try {
      const analyzeModel = genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        generationConfig: { responseMimeType: 'application/json' },
      });
      const analyzeResult = await analyzeModel.generateContent(analyzePrompt);
      const parsed = JSON.parse(analyzeResult.response.text().trim());
      status = parsed.status || 'unverified';
      explanation = parsed.explanation || explanation;
      confidence = typeof parsed.confidence === 'number' ? parsed.confidence : confidence;
    } catch {
      // keep defaults
    }

    analyzedClaims.push({ claim, status, explanation, sources, confidence });
  }

  // ── Step 3: Tổng hợp kết quả ───────────────────────────────────────────────
  const verifiedCount = analyzedClaims.filter((c) => c.status === 'verified').length;
  const disputedCount = analyzedClaims.filter((c) => c.status === 'disputed').length;
  const unverifiedCount = analyzedClaims.filter((c) => c.status === 'unverified').length;
  const totalClaims = analyzedClaims.length;

  const overallScore =
    totalClaims === 0
      ? 50
      : Math.round(
          analyzedClaims.reduce((sum, c) => {
            if (c.status === 'verified') return sum + c.confidence;
            if (c.status === 'disputed') return sum + (100 - c.confidence);
            return sum + 40;
          }, 0) / totalClaims
        );

  const summary =
    totalClaims === 0
      ? 'Không tìm thấy phát ngôn cụ thể nào để kiểm chứng.'
      : `Tìm thấy ${totalClaims} phát ngôn: ${verifiedCount} xác thực, ${unverifiedCount} chưa rõ, ${disputedCount} có vấn đề. Điểm tin cậy tổng thể: ${overallScore}/100.`;

  return {
    success: true,
    overallScore,
    totalClaims,
    verifiedCount,
    unverifiedCount,
    disputedCount,
    claims: analyzedClaims,
    summary,
    source: hasSearchKey ? 'gemini+search' : 'gemini-only',
  };
};

// ─── Fallback when Gemini fails completely ────────────────────────────────────

export const fallbackValidate = (text: string): ValidatorResult => {
  const sentences = text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 5);

  const claims: AnalyzedClaim[] = sentences.map((s) => ({
    claim: s,
    status: 'unverified',
    explanation: 'Không thể kết nối AI để kiểm chứng. Vui lòng thử lại sau.',
    sources: [],
    confidence: 40,
  }));

  return {
    success: true,
    overallScore: 40,
    totalClaims: claims.length,
    verifiedCount: 0,
    unverifiedCount: claims.length,
    disputedCount: 0,
    claims,
    summary: 'Không thể kết nối đến AI. Kết quả là ước tính mặc định.',
    source: 'fallback',
  };
};
