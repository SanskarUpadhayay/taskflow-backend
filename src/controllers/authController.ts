import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

//Register
export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, email, password } = req.body;

        //Check if user already exist
        const existingUser = await User.findOne({ email });
        if(existingUser){
            res.status(400).json({message: 'User already exist'});
            return;
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        //Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '30d'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        })
    }
    catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
}

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '30d',
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
