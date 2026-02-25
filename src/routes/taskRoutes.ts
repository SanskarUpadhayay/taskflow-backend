import { Router } from 'express';
import { createTask,getAllTasksForProject,getTask,updateTask,deleteTask } from '../controllers/taskController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/projects/:project_id/tasks', verifyToken ,createTask);
router.get('/projects/:project_id/tasks', verifyToken, getAllTasksForProject);
router.get('/projects/:project_id/tasks/:task_id', verifyToken, getTask);
router.delete('/projects/:project_id/tasks/:task_id', verifyToken, deleteTask);
router.patch('/projects/:project_id/tasks/:task_id', verifyToken, updateTask);
export default router;
