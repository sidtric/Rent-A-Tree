import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

/**
 * Admin guard — runs after `protect`.
 * Checks the logged-in user's email against ADMIN_EMAIL in .env.
 * Add a `role` field to the User model and switch the check here
 * if you want DB-driven role management instead.
 */
export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  if (!ADMIN_EMAIL) {
    res.status(403).json({ message: 'Admin access not configured on server' });
    return;
  }

  const user = await User.findById(req.userId).select('email');
  if (!user || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    res.status(403).json({ message: 'Forbidden: admin only' });
    return;
  }

  next();
};
