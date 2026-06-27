export interface Recipe {
  id: string;           // Unique recipe ID
  title: string;        // Recipe title
  category: string;     // Recipe category
  description: string;  // Short description
  prompt: string;       // Prompt template
  tags: string[];       // Related tags
}