import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import ContactMessage from '../models/ContactMessage';

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Too many messages. Try again later.' } });

const router = Router();

router.post('/', contactLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message received! We will get back to you soon.' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
