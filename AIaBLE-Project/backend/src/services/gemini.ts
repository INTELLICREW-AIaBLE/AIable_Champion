import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[Warning]: GEMINI_API_KEY is not defined in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'temporary-placeholder');

/**
 * Basic helper to invoke Google Gemini model
 * @param prompt User instruction
 */
export const callGemini = async (prompt: string): Promise<string> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing from environment variables.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });


    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('[Gemini API Error]:', error);
    throw new Error(`Failed to communicate with Gemini API: ${error.message}`);
  }
};
