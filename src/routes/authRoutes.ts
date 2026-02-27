import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, (req: Request, res: Response) => { 
    res.json(req.user);
});

export default router;
