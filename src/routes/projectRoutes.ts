import { Router, Request, Response } from 'express';
import { createProject,getAllUserProjects, getProject,deleteProject, updateProject } from '../controllers/projectController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/projects', verifyToken ,createProject);
router.get('/projects', verifyToken, getAllUserProjects);
router.get('/projects/:project_id', verifyToken, getProject);
router.delete('/projects/:project_id', verifyToken, deleteProject);
router.patch('/projects/:project_id', verifyToken, updateProject);
export default router;
