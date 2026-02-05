import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

//connect to mongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());

//Health Check Route
app.get('/health',(req: Request,res: Response) => {
    res.status(200).json({
        "status": "OK"
    });
});

app.listen(PORT,() => {
    console.log(`Server running on PORT ${PORT}`);
});