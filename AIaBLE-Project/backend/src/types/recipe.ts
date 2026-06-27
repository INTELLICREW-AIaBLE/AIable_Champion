export interface RecipeVariable {
  name: string;      
  label: string;     
  type: 'text' | 'textarea' | 'select';  
  required: boolean; 
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  variables: RecipeVariable[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}