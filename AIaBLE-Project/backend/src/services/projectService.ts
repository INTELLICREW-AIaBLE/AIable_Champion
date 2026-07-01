import fs from 'fs';
import path from 'path';
import { Project, ProjectTask, CreateProjectRequest, UpdateProjectRequest, AddTaskRequest, UpdateTaskRequest } from '../types/project';

const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');

// Ensure data directory exists
const dataDir = path.dirname(PROJECTS_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize projects file if not exists
if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
}

/**
 * Read all projects from file
 */
function readProjects(): Project[] {
    try {
        const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('[Projects Service] Error reading projects:', error);
        return [];
    }
}

/**
 * Write projects to file
 */
function writeProjects(projects: Project[]): void {
    try {
        fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    } catch (error) {
        console.error('[Projects Service] Error writing projects:', error);
        throw new Error('Failed to save projects');
    }
}

/**
 * Generate unique ID
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all projects for a user
 */
export function getProjectsByUser(userId: string): Project[] {
    const projects = readProjects();
    return projects
        .filter(p => p.userId === userId)
        .sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Get single project by ID
 */
export function getProjectById(projectId: string, userId: string): Project | null {
    const projects = readProjects();
    const project = projects.find(p => p.id === projectId && p.userId === userId);
    return project || null;
}

/**
 * Create new project
 */
export function createProject(userId: string, data: CreateProjectRequest): Project {
    const projects = readProjects();

    const newProject: Project = {
        id: generateId(),
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        status: 'planning',
        tasks: [],
        tags: data.tags || [],
        color: data.color || '#8B5CF6',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    projects.push(newProject);
    writeProjects(projects);

    return newProject;
}

/**
 * Update project
 */
export function updateProject(projectId: string, userId: string, data: UpdateProjectRequest): Project | null {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === projectId && p.userId === userId);

    if (index === -1) return null;

    projects[index] = {
        ...projects[index],
        ...data,
        updatedAt: Date.now()
    };

    writeProjects(projects);
    return projects[index];
}

/**
 * Delete project
 */
export function deleteProject(projectId: string, userId: string): boolean {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === projectId && p.userId === userId);

    if (index === -1) return false;

    projects.splice(index, 1);
    writeProjects(projects);
    return true;
}

/**
 * Add task to project
 */
export function addTaskToProject(projectId: string, userId: string, data: AddTaskRequest): Project | null {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === projectId && p.userId === userId);

    if (index === -1) return null;

    const newTask: ProjectTask = {
        id: generateId(),
        title: data.title,
        description: data.description,
        status: 'todo',
        aiModel: data.aiModel,
        prompt: data.prompt,
        createdAt: Date.now()
    };

    projects[index].tasks.push(newTask);
    projects[index].updatedAt = Date.now();

    writeProjects(projects);
    return projects[index];
}

/**
 * Update task in project
 */
export function updateTaskInProject(
    projectId: string,
    taskId: string,
    userId: string,
    data: UpdateTaskRequest
): Project | null {
    const projects = readProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId && p.userId === userId);

    if (projectIndex === -1) return null;

    const taskIndex = projects[projectIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const task = projects[projectIndex].tasks[taskIndex];

    projects[projectIndex].tasks[taskIndex] = {
        ...task,
        ...data,
        completedAt: data.status === 'done' && task.status !== 'done'
            ? Date.now()
            : task.completedAt
    };

    projects[projectIndex].updatedAt = Date.now();

    writeProjects(projects);
    return projects[projectIndex];
}

/**
 * Delete task from project
 */
export function deleteTaskFromProject(projectId: string, taskId: string, userId: string): Project | null {
    const projects = readProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId && p.userId === userId);

    if (projectIndex === -1) return null;

    const taskIndex = projects[projectIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    projects[projectIndex].tasks.splice(taskIndex, 1);
    projects[projectIndex].updatedAt = Date.now();

    writeProjects(projects);
    return projects[projectIndex];
}

/**
 * Get project statistics
 */
export function getProjectStats(userId: string) {
    const projects = getProjectsByUser(userId);

    const totalProjects = projects.length;
    const byStatus = {
        planning: projects.filter(p => p.status === 'planning').length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        review: projects.filter(p => p.status === 'review').length,
        completed: projects.filter(p => p.status === 'completed').length,
        archived: projects.filter(p => p.status === 'archived').length
    };

    const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = projects.reduce(
        (sum, p) => sum + p.tasks.filter(t => t.status === 'done').length,
        0
    );

    return {
        totalProjects,
        byStatus,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
}
