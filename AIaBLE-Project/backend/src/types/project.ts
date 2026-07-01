export interface Project {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: ProjectCategory;
    status: ProjectStatus;
    tasks: ProjectTask[];
    createdAt: number;
    updatedAt: number;
    tags: string[];
    color?: string;
}

export type ProjectCategory =
    | 'software-engineering'
    | 'data-science'
    | 'marketing'
    | 'business'
    | 'academic'
    | 'research'
    | 'other';

export type ProjectStatus =
    | 'planning'
    | 'in-progress'
    | 'review'
    | 'completed'
    | 'archived';

export interface ProjectTask {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    aiModel?: 'Claude' | 'GPT-4' | 'Gemini';
    prompt?: string;
    result?: string;
    createdAt: number;
    completedAt?: number;
}

export interface CreateProjectRequest {
    title: string;
    description: string;
    category: ProjectCategory;
    tags?: string[];
    color?: string;
}

export interface UpdateProjectRequest {
    title?: string;
    description?: string;
    category?: ProjectCategory;
    status?: ProjectStatus;
    tags?: string[];
    color?: string;
}

export interface AddTaskRequest {
    title: string;
    description: string;
    aiModel?: 'Claude' | 'GPT-4' | 'Gemini';
    prompt?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'done';
    aiModel?: 'Claude' | 'GPT-4' | 'Gemini';
    prompt?: string;
    result?: string;
}
