import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(__dirname, '../data/api_tokens.json');

export interface ApiTokenInfo {
  name: string;
  usedTokens: number;
  limit: number;
  warningThreshold: number; // percentage (e.g. 80 for 80%)
  lastWarningSent?: number; // timestamp
}

const DEFAULT_TOKENS: ApiTokenInfo[] = [
  { name: 'Gemini', usedTokens: 0, limit: 1000000, warningThreshold: 80 },
  { name: 'Groq', usedTokens: 0, limit: 500000, warningThreshold: 80 },
  { name: 'OpenRouter', usedTokens: 0, limit: 200000, warningThreshold: 80 }
];

export const readTokenInfo = (): ApiTokenInfo[] => {
  try {
    if (!fs.existsSync(TOKENS_FILE)) {
      fs.mkdirSync(path.dirname(TOKENS_FILE), { recursive: true });
      fs.writeFileSync(TOKENS_FILE, JSON.stringify(DEFAULT_TOKENS, null, 2));
      return DEFAULT_TOKENS;
    }
    const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Ensure all default tokens exist in parsed array
    let changed = false;
    DEFAULT_TOKENS.forEach(def => {
      if (!parsed.some((p: any) => p.name === def.name)) {
        parsed.push(def);
        changed = true;
      }
    });
    if (changed) {
      fs.writeFileSync(TOKENS_FILE, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (err) {
    console.error('Error reading tokens file:', err);
    return DEFAULT_TOKENS;
  }
};

export const writeTokenInfo = (tokens: ApiTokenInfo[]) => {
  try {
    fs.mkdirSync(path.dirname(TOKENS_FILE), { recursive: true });
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
  } catch (err) {
    console.error('Error writing tokens file:', err);
  }
};

/**
 * Track token usage and return warning message if threshold is reached
 */
export const trackTokens = async (apiName: string, tokensCount: number): Promise<string | null> => {
  try {
    const tokens = readTokenInfo();
    const tokenObj = tokens.find(t => t.name.toLowerCase() === apiName.toLowerCase());
    
    if (!tokenObj) return null;

    tokenObj.usedTokens += tokensCount;
    
    const usagePercent = (tokenObj.usedTokens / tokenObj.limit) * 100;
    let warningMessage: string | null = null;

    if (usagePercent >= tokenObj.warningThreshold) {
      // Limit warnings to once every 1 hour to avoid spamming
      const oneHour = 60 * 60 * 1000;
      const now = Date.now();
      if (!tokenObj.lastWarningSent || (now - tokenObj.lastWarningSent > oneHour)) {
        tokenObj.lastWarningSent = now;
        warningMessage = `Cảnh báo: API ${tokenObj.name} đã sử dụng ${tokenObj.usedTokens.toLocaleString()} / ${tokenObj.limit.toLocaleString()} tokens (${usagePercent.toFixed(1)}%). Hạn mức sắp hết!`;
      }
    }

    writeTokenInfo(tokens);
    return warningMessage;
  } catch (err) {
    console.error('Error tracking tokens:', err);
    return null;
  }
};
