import { Request,Response,NextFunction } from 'express';

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
if(err.name === 'ValidationError'){
        res.status(400).json({ message: err.message});
        return;
    }
    res.status(500).json({ message: 'Server error' });
}