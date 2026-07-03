import OpenAI from 'openai';
import dotenv from 'dotenv';
import { trackTokens } from './tokenTracker';

dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;
let openrouter: OpenAI | null = null;

if (apiKey) {
  openrouter = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'AIaBLE Project',
    }
  });
} else {
  console.warn('[Warning]: OPENROUTER_API_KEY is not defined in environment variables.');
}

// Simple cache for OpenRouter responses
const cache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Call OpenRouter free model
 * @param prompt User instruction
 */
export const callOpenRouter = async (
  prompt: string,
  options?: { jsonMode?: boolean }
): Promise<string> => {
  if (!openrouter) {
    throw new Error('OpenRouter client is not initialized because OPENROUTER_API_KEY is missing.');
  }

  try {
    // Check cache
    const cacheKey = prompt;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[OpenRouter Cache Hit]');
      return cached.result;
    }

    const response = await openrouter.chat.completions.create({
      model: 'openrouter/free',
      messages: [{ role: 'user', content: prompt }],
      ...(options?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    });

    const text = response.choices[0]?.message?.content || '';

    // Track tokens
    const tokenCount = response.usage?.total_tokens || Math.ceil((prompt.length + text.length) / 3);
    await trackTokens('OpenRouter', tokenCount);

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
    console.error('[OpenRouter API Error]:', error);
    throw new Error(`Failed to communicate with OpenRouter API: ${error.message}`);
  }
};

/**
 * Streaming version for real-time response from OpenRouter
 */
export const callOpenRouterStream = async (
  prompt: string,
  onChunk?: (text: string) => void
): Promise<string> => {
  if (!openrouter) {
    throw new Error('OpenRouter client is not initialized because OPENROUTER_API_KEY is missing.');
  }

  try {
    const stream = await openrouter.chat.completions.create({
      model: 'openrouter/free',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullText += content;
      if (onChunk && content) onChunk(content);
    }

    // Track tokens (estimate)
    const tokenCount = Math.ceil((prompt.length + fullText.length) / 3);
    await trackTokens('OpenRouter', tokenCount);

    return fullText;
  } catch (error: any) {
    console.error('[OpenRouter Stream API Error]:', error);
    throw new Error(`Failed to communicate with OpenRouter API: ${error.message}`);
  }
};
