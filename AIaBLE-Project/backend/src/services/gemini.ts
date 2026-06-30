import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_MODEL = 'gemini-2.0-flash';

// Minimum delay between Gemini calls across the whole backend.
const GEMINI_COOLDOWN_MS = Number(process.env.GEMINI_COOLDOWN_MS || 5000);

// Simple global queue lock.
let lastGeminiCallTime = 0;
let queue: Promise<void> = Promise.resolve();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForCooldown = async () => {
  queue = queue.then(async () => {
    const now = Date.now();
    const elapsed = now - lastGeminiCallTime;
    const waitTime = Math.max(0, GEMINI_COOLDOWN_MS - elapsed);

    if (waitTime > 0) {
      console.log(`[Gemini Cooldown]: waiting ${waitTime}ms before next request...`);
      await sleep(waitTime);
    }

    lastGeminiCallTime = Date.now();
  });

  return queue;
};

/**
 * Basic helper to invoke Google Gemini model safely.
 * Adds a backend-wide cooldown so services do not spam the API.
 *
 * @param prompt User instruction
 * @param userKey Optional user-provided Gemini API key
 */
export const callGemini = async (
  prompt: string,
  userKey?: string
): Promise<string> => {
  try {
    const activeKey = userKey || process.env.GEMINI_API_KEY;

    if (!activeKey) {
      throw new Error(
        'GEMINI_API_KEY is missing from environment variables and user settings.'
      );
    }

    await waitForCooldown();

    const genAI = new GoogleGenerativeAI(activeKey);
    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('[Gemini API Error]:', error);

    throw new Error(
      `Failed to communicate with Gemini API: ${
        error?.message || 'Unknown error'
      }`
    );
  }
};
