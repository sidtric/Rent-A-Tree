import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.userId) { res.status(401).json({ message: 'Not authorized' }); return; }
  const user = await User.findById(req.userId).select('isAdmin');
  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'Forbidden: admin only' }); return;
  }
  next();
};
