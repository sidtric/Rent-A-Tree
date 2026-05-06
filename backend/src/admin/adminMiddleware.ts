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
  const user = await User.findById(req.userId).select('email role');
  if (!user) { res.status(401).json({ message: 'User not found' }); return; }
  // Allow if email is in ADMIN_EMAILS env list OR if the user has role='admin' in DB
  const isAdminEmail = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const isAdminRole  = (user as any).role === 'admin';
  if (!isAdminEmail && !isAdminRole) {
    res.status(403).json({ message: 'Forbidden: admin only' }); return;
  }
  next();
};
