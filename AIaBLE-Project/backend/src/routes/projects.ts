import express from 'express';
import {
    getAllProjects,
    getDeletedProjects,
    getStats,
    getProject,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    restoreExistingProject,
    addTask,
    updateTask,
    deleteTask
} from '../controllers/project';

const router = express.Router();

// Project routes
router.get('/', getAllProjects);
router.get('/trash', getDeletedProjects);
router.get('/stats', getStats);
router.get('/:id', getProject);
router.post('/', createNewProject);
router.put('/:id', updateExistingProject);
router.delete('/:id', deleteExistingProject);
router.post('/:id/restore', restoreExistingProject);

// Task routes
router.post('/:id/tasks', addTask);
router.put('/:id/tasks/:taskId', updateTask);
router.delete('/:id/tasks/:taskId', deleteTask);

export default router;
