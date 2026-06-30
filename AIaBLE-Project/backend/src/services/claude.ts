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

/**
 * Call Anthropic Claude model
 * @param prompt User instruction
 */
export const callClaude = async (prompt: string): Promise<string> => {
  if (!anthropic) {
    throw new Error('Anthropic client is not initialized because CLAUDE_API_KEY is missing.');
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content[0];
    if (textBlock && textBlock.type === 'text') {
      return textBlock.text;
    }
    return '';
  } catch (error: any) {
    console.error('[Claude API Error]:', error);
    throw new Error(`Failed to communicate with Anthropic API: ${error.message}`);
  }
};
