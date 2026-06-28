export interface WorkflowStep {
  stepName: string;
  description: string;
  suggestedTool: string;
  reason: string;
  suggestedPrompt: string;
}

export interface TaskMatcherRequest {
  subject: string;
  description: string;
}

export interface TaskMatcherResponse {
  success: boolean;
  subject: string;
  source: 'rule-based' | 'gemini' | 'rule-based (LLM failed)';
  steps: WorkflowStep[];
}