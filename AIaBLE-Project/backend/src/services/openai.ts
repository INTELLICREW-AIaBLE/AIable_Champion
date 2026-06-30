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

/**
 * Call OpenAI GPT-4 model
 * @param prompt User instruction
 */
export const callGPT4 = async (prompt: string): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI client is not initialized because OPENAI_API_KEY is missing.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('[OpenAI API Error]:', error);
    throw new Error(`Failed to communicate with OpenAI API: ${error.message}`);
  }
};
