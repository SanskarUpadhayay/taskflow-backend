import express, {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import {errorHandler} from './middleware/errorHandler';

dotenv.config();

//connect to mongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

//Health Check Route
app.get('/health',(_req: Request,res: Response) => {
    res.status(200).json({
        "status": "OK"
    });
});

app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

app.use(errorHandler)
app.listen(PORT,() => {
    console.log(`Server running on PORT ${PORT}`);
});
