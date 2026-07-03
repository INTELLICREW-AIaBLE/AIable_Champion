import ApiToken from '../models/ApiToken';

export interface ApiTokenInfo {
  name: string;
  usedTokens: number;
  limit: number;
  warningThreshold: number; // percentage (e.g. 80 for 80%)
  lastWarningSent?: Date;
}

const DEFAULT_TOKENS: ApiTokenInfo[] = [
  { name: 'Gemini', usedTokens: 0, limit: 1000000, warningThreshold: 80 },
  { name: 'Groq', usedTokens: 0, limit: 500000, warningThreshold: 80 },
  { name: 'OpenRouter', usedTokens: 0, limit: 200000, warningThreshold: 80 }
];

export const readTokenInfo = async (): Promise<any[]> => {
  try {
    let tokens = await ApiToken.find({});
    if (tokens.length === 0) {
      // Initialize default API tokens into database
      await ApiToken.insertMany(DEFAULT_TOKENS);
      tokens = await ApiToken.find({});
    }
    
    // Ensure all default tokens exist in database
    let changed = false;
    for (const def of DEFAULT_TOKENS) {
      if (!tokens.some(t => t.name.toLowerCase() === def.name.toLowerCase())) {
        const newApi = new ApiToken(def);
        await newApi.save();
        changed = true;
      }
    }
    if (changed) {
      tokens = await ApiToken.find({});
    }
    return tokens;
  } catch (err) {
    console.error('Error reading tokens from database:', err);
    return DEFAULT_TOKENS;
  }
};

export const writeTokenInfo = async (tokens: any[]) => {
  try {
    for (const t of tokens) {
      await ApiToken.updateOne(
        { name: t.name },
        { 
          $set: { 
            usedTokens: Number(t.usedTokens), 
            limit: Number(t.limit), 
            warningThreshold: Number(t.warningThreshold) 
          } 
        }
      );
    }
  } catch (err) {
    console.error('Error writing tokens to database:', err);
  }
};

/**
 * Track token usage and return warning message if threshold is reached
 */
export const trackTokens = async (apiName: string, tokensCount: number): Promise<string | null> => {
  try {
    // Ensure tokens table is initialized
    await readTokenInfo();
    
    const tokenObj = await ApiToken.findOne({ name: new RegExp(`^${apiName}$`, 'i') });
    if (!tokenObj) return null;

    tokenObj.usedTokens += tokensCount;
    
    const usagePercent = (tokenObj.usedTokens / tokenObj.limit) * 100;
    let warningMessage: string | null = null;

    if (usagePercent >= tokenObj.warningThreshold) {
      // Limit warnings to once every 1 hour to avoid spamming
      const oneHour = 60 * 60 * 1000;
      const now = new Date();
      if (!tokenObj.lastWarningSent || (now.getTime() - new Date(tokenObj.lastWarningSent).getTime() > oneHour)) {
        tokenObj.lastWarningSent = now;
        warningMessage = `Cảnh báo: API ${tokenObj.name} đã sử dụng ${tokenObj.usedTokens.toLocaleString()} / ${tokenObj.limit.toLocaleString()} tokens (${usagePercent.toFixed(1)}%). Hạn mức sắp hết!`;
      }
    }

    await tokenObj.save();
    return warningMessage;
  } catch (err) {
    console.error('Error tracking tokens in database:', err);
    return null;
  }
};
