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
export const callGemini = async (prompt: string, userKey?: string): Promise<string> => {
  try {
    const activeKey = userKey || process.env.GEMINI_API_KEY;
    if (!activeKey) {
      throw new Error('GEMINI_API_KEY is missing from environment variables and user settings.');
    }

    const dynamicGenAI = new GoogleGenerativeAI(activeKey);
    const model = dynamicGenAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('[Gemini API Error]:', error);
    throw new Error(`Failed to communicate with Gemini API: ${error.message}`);
  }
};
