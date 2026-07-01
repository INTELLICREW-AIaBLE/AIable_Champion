import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[Warning]: GEMINI_API_KEY is not defined in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'temporary-placeholder');

// Cache for recent prompts (simple in-memory cache)
const promptCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Basic helper to invoke Google Gemini model
 * @param prompt User instruction
 */
export const callGemini = async (prompt: string, userKey?: string): Promise<string> => {
  try {
    // Check cache first
    const cacheKey = `${userKey || 'default'}:${prompt.substring(0, 200)}`;
    const cached = promptCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[Gemini Cache Hit]');
      return cached.result;
    }

    const activeKey = userKey || process.env.GEMINI_API_KEY;
    if (!activeKey) {
      throw new Error('GEMINI_API_KEY is missing from environment variables and user settings.');
    }

    const dynamicGenAI = new GoogleGenerativeAI(activeKey);
    const model = dynamicGenAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Store in cache
    promptCache.set(cacheKey, { result: text, timestamp: Date.now() });

    // Clean old cache entries
    if (promptCache.size > 100) {
      const entries = Array.from(promptCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      entries.slice(0, 50).forEach(([key]) => promptCache.delete(key));
    }

    return text;
  } catch (error: any) {
    console.error('[Gemini API Error]:', error);
    throw new Error(`Failed to communicate with Gemini API: ${error.message}`);
  }
};

/**
 * Streaming version of callGemini for real-time response
 */
export const callGeminiStream = async (
  prompt: string,
  userKey?: string,
  onChunk?: (text: string) => void
): Promise<string> => {
  try {
    const activeKey = userKey || process.env.GEMINI_API_KEY;
    if (!activeKey) {
      throw new Error('GEMINI_API_KEY is missing from environment variables and user settings.');
    }

    const dynamicGenAI = new GoogleGenerativeAI(activeKey);
    const model = dynamicGenAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const result = await model.generateContentStream(prompt);
    let fullText = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }

    return fullText;
  } catch (error: any) {
    console.error('[Gemini Stream API Error]:', error);
    throw new Error(`Failed to communicate with Gemini API: ${error.message}`);
  }
};
