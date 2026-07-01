import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.CLAUDE_API_KEY;
let anthropic: Anthropic | null = null;

if (apiKey) {
  anthropic = new Anthropic({ apiKey });
} else {
  console.warn('[Warning]: CLAUDE_API_KEY is not defined in environment variables.');
}

// Simple cache for Claude responses
const cache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Call Anthropic Claude model
 * @param prompt User instruction
 */
export const callClaude = async (prompt: string): Promise<string> => {
  if (!anthropic) {
    throw new Error('Anthropic client is not initialized because CLAUDE_API_KEY is missing.');
  }

  try {
    // Check cache
    const cacheKey = prompt.substring(0, 200);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[Claude Cache Hit]');
      return cached.result;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content[0];
    const text = textBlock && textBlock.type === 'text' ? textBlock.text : '';

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
    console.error('[Claude API Error]:', error);
    throw new Error(`Failed to communicate with Anthropic API: ${error.message}`);
  }
};

/**
 * Streaming version for real-time response
 */
export const callClaudeStream = async (
  prompt: string,
  onChunk?: (text: string) => void
): Promise<string> => {
  if (!anthropic) {
    throw new Error('Anthropic client is not initialized because CLAUDE_API_KEY is missing.');
  }

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    let fullText = '';
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const text = chunk.delta.text;
        fullText += text;
        if (onChunk) onChunk(text);
      }
    }

    return fullText;
  } catch (error: any) {
    console.error('[Claude Stream API Error]:', error);
    throw new Error(`Failed to communicate with Anthropic API: ${error.message}`);
  }
};
