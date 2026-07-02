import { Request, Response } from 'express';
import {
    getProjectsByUser,
    getDeletedProjectsByUser,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addTaskToProject,
    updateTaskInProject,
    deleteTaskFromProject,
    getProjectStats,
    restoreProject as restoreProjectService
} from '../services/projectService';
import { logHistoryHelper } from './profile';

/**
 * GET /api/projects
 * Get all projects for the authenticated user
 */
export const getAllProjects = (req: Request, res: Response) => {
    try {
        // In production, get userId from JWT token
        // For now, use query param or default
        const userId = req.query.userId as string || 'default-user';

        const projects = getProjectsByUser(userId);

        res.json({
            success: true,
            data: projects
        });
    } catch (error: any) {
        console.error('[Projects Controller] Get all error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch projects'
        });
    }
};

/**
 * GET /api/projects/trash
 * Get deleted projects
 */
export const getDeletedProjects = (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string || 'default-user';
        const projects = getDeletedProjectsByUser(userId);

        res.json({
            success: true,
            data: projects
        });
    } catch (error: any) {
        console.error('[Projects Controller] Get deleted error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch deleted projects'
        });
    }
};

/**
 * GET /api/projects/stats
 * Get project statistics
 */
export const getStats = (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string || 'default-user';

        const stats = getProjectStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        console.error('[Projects Controller] Get stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch statistics'
        });
    }
};

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
export const getProject = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId as string || 'default-user';

        const project = getProjectById(id, userId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error: any) {
        console.error('[Projects Controller] Get project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch project'
        });
    }
};

/**
 * POST /api/projects
 * Create new project
 */
export const createNewProject = (req: Request, res: Response) => {
    try {
        const userId = req.body.userId || 'default-user';
        const { title, description, category, tags, color } = req.body;

        // Validation
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and category are required'
            });
        }

        const project = createProject(userId, {
            title,
            description,
            category,
            tags,
            color
        });

        logHistoryHelper(userId, 'Create Project', 'Project Manager', `Tạo dự án: ${title}`);

        res.status(201).json({
            success: true,
            data: project,
            message: 'Project created successfully'
        });
    } catch (error: any) {
        console.error('[Projects Controller] Create project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create project'
        });
    }
};

/**
 * PUT /api/projects/:id
 * Update project
 */
export const updateExistingProject = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || 'default-user';
        const { title, description, category, status, tags, color } = req.body;

        const project = updateProject(id, userId, {
            title,
            description,
            category,
            status,
            tags,
            color
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        logHistoryHelper(userId, 'Update Project', 'Project Manager', `Cập nhật dự án: ${project.title}`);

        res.json({
            success: true,
            data: project,
            message: 'Project updated successfully'
        });
    } catch (error: any) {
        console.error('[Projects Controller] Update project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update project'
        });
    }
};

/**
 * DELETE /api/projects/:id
 * Delete project
 */
export const deleteExistingProject = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId as string || 'default-user';

        const deleted = deleteProject(id, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        logHistoryHelper(userId, 'Delete Project', 'Project Manager', `Xóa dự án (ID: ${id})`);

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error: any) {
        console.error('[Projects Controller] Delete project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete project'
        });
    }
};

/**
 * POST /api/projects/:id/restore
 * Restore project
 */
export const restoreExistingProject = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || req.query.userId as string || 'default-user';

        const restored = restoreProjectService(id, userId);

        if (!restored) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or not deleted'
            });
        }

        logHistoryHelper(userId, 'Restore Project', 'Project Manager', `Khôi phục dự án (ID: ${id})`);

        res.json({
            success: true,
            message: 'Project restored successfully'
        });
    } catch (error: any) {
        console.error('[Projects Controller] Restore project error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to restore project'
        });
    }
};

/**
 * POST /api/projects/:id/tasks
 * Add task to project
 */
export const addTask = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || 'default-user';
        const { title, description, aiModel, prompt, result } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        const project = addTaskToProject(id, userId, {
            title,
            description,
            aiModel,
            prompt,
            result
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(201).json({
            success: true,
            data: project,
            message: 'Task added successfully'
        });
    } catch (error: any) {
        console.error('[Projects Controller] Add task error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add task'
        });
    }
};

/**
 * PUT /api/projects/:id/tasks/:taskId
 * Update task in project
 */
export const updateTask = (req: Request, res: Response) => {
    try {
        const { id, taskId } = req.params;
        const userId = req.body.userId || 'default-user';
        const { title, description, status, aiModel, prompt, result } = req.body;

        const project = updateTaskInProject(id, taskId, userId, {
            title,
            description,
            status,
            aiModel,
            prompt,
            result
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project or task not found'
            });
        }

        res.json({
            success: true,
            data: project,
            message: 'Task updated successfully'
        });
    } catch (error: any) {
        console.error('[Projects Controller] Update task error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update task'
        });
    }
};

/**
 * DELETE /api/projects/:id/tasks/:taskId
 * Delete task from project
 */
export const deleteTask = (req: Request, res: Response) => {
    try {
        const { id, taskId } = req.params;
        const userId = req.query.userId as string || 'default-user';

        const project = deleteTaskFromProject(id, taskId, userId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project or task not found'
            });
        }

        res.json({
            success: true,
            data: project,
            message: 'Task deleted successfully'
        });
    } catch (error: any) {
        console.error('[Projects Controller] Delete task error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete task'
        });
    }
};
