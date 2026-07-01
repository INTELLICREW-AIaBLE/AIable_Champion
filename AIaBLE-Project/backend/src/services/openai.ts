import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

if (apiKey) {
  openai = new OpenAI({ apiKey });
} else {
  console.warn('[Warning]: OPENAI_API_KEY is not defined in environment variables.');
}

// Simple cache for OpenAI responses
const cache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Call OpenAI GPT-4 model
 * @param prompt User instruction
 */
export const callGPT4 = async (prompt: string): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI client is not initialized because OPENAI_API_KEY is missing.');
  }

  try {
    // Check cache
    const cacheKey = prompt.substring(0, 200);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[OpenAI Cache Hit]');
      return cached.result;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
    console.error('[OpenAI API Error]:', error);
    throw new Error(`Failed to communicate with OpenAI API: ${error.message}`);
  }
};

/**
 * Streaming version for real-time response
 */
export const callGPT4Stream = async (
  prompt: string,
  onChunk?: (text: string) => void
): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI client is not initialized because OPENAI_API_KEY is missing.');
  }

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
    console.error('[OpenAI Stream API Error]:', error);
    throw new Error(`Failed to communicate with OpenAI API: ${error.message}`);
  }
};
