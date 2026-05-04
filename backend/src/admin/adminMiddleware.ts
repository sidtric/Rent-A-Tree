import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.userId) { res.status(401).json({ message: 'Not authorized' }); return; }
  if (!ADMIN_EMAILS.length) { res.status(403).json({ message: 'Admin access not configured on server' }); return; }
  const user = await User.findById(req.userId).select('email');
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    res.status(403).json({ message: 'Forbidden: admin only' }); return;
  }
  next();
};
