// ─── Validator Types ──────────────────────────────────────────────────────────

export type ClaimStatus = 'verified' | 'unverified' | 'disputed';

export interface SourceLink {
  title: string;
  url: string;
  snippet: string;
}

export interface AnalyzedClaim {
  /** The exact sentence / claim extracted from the input text */
  claim: string;
  /** Result of cross-checking against search results */
  status: ClaimStatus;
  /** Short explanation of why this status was assigned */
  explanation: string;
  /** Supporting or contradicting sources (up to 3) */
  sources: SourceLink[];
  /** Confidence level 0-100 */
  confidence: number;
}


export interface ValidatorResult {
  success: boolean;
  overallScore: number;         // 0-100 weighted average
  totalClaims: number;
  verifiedCount: number;
  unverifiedCount: number;
  disputedCount: number;
  claims: AnalyzedClaim[];
  summary: string;              // 1-2 sentence Vietnamese summary
  source: 'gemini+search' | 'gemini-only' | 'fallback';
}
