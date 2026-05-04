import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

const ADMIN_PHONES = (process.env.ADMIN_PHONE || '')
  .split(',').map(e => e.trim()).filter(Boolean);

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.userId) { res.status(401).json({ message: 'Not authorized' }); return; }
  if (!ADMIN_PHONES.length) { res.status(403).json({ message: 'Admin access not configured on server' }); return; }
  const user = await User.findById(req.userId).select('phone');
  if (!user || !ADMIN_PHONES.includes(user.phone)) {
    res.status(403).json({ message: 'Forbidden: admin only' }); return;
  }
  next();
};
