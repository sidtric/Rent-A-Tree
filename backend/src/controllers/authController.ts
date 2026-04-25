import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400).json({ message: 'Email already in use' });
    return;
  }
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({ token: signToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  res.json({ token: signToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
};

export const getMe = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
};
