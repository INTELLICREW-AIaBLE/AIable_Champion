export interface WorkflowStep {
  stepName: string;       // Ten buoc, vi du: "Phan tich de tai"
  description: string;    // Mo ta chi tiet buoc nay lam gi
  suggestedTool: string;  // Cong cu khuyen dung, vi du: "Gemini", "Canva"
  reason: string;         // Ly do chon cong cu nay
  suggestedPrompt: string; // Prompt mau de thuc hien buoc nay
}

export interface TaskMatcherRequest {
  subject: string;  // Mon hoc, vi du: "Software Engineering"
  description: string; // Mo ta de tai, vi du: "Lam bao cao cuoi ky"
}

export interface TaskMatcherResponse {
  success: boolean;
  subject: string;
  source: 'rule-based' | 'gemini' | 'rule-based (LLM failed)'; // Tra ve tu rule co san hay tu Gemini
  steps: WorkflowStep[];
}