import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
let groq: OpenAI | null = null;

if (apiKey) {
  groq = new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
} else {
  console.warn('[Warning]: GROQ_API_KEY is not defined in environment variables.');
}

// Simple cache for Groq responses
const cache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Call Groq (Llama 3.1) model
 * @param prompt User instruction
 */
export const callGroq = async (prompt: string): Promise<string> => {
  if (!groq) {
    throw new Error('Groq client is not initialized because GROQ_API_KEY is missing.');
  }

  try {
    // Check cache
    const cacheKey = prompt.substring(0, 200);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[Groq Cache Hit]');
      return cached.result;
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0]?.message?.content || '';

    // Store in cache
    cache.set(cacheKey, { result: text, timestamp: Date.now() });

    // Clean old cache
    if (cache.size > 100) {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      entries.slice(0, 50).forEach(([key]) => cache.delete(key));
    }

    return text;
  } catch (error: any) {
    console.error('[Groq API Error]:', error);
    throw new Error(`Failed to communicate with Groq API: ${error.message}`);
  }
};

/**
 * Streaming version for real-time response from Groq
 */
export const callGroqStream = async (
  prompt: string,
  onChunk?: (text: string) => void
): Promise<string> => {
  if (!groq) {
    throw new Error('Groq client is not initialized because GROQ_API_KEY is missing.');
  }

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullText += content;
      if (onChunk && content) onChunk(content);
    }

    return fullText;
  } catch (error: any) {
    console.error('[Groq Stream API Error]:', error);
    throw new Error(`Failed to communicate with Groq API: ${error.message}`);
  }
};
