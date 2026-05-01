import { Router, Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  await ContactMessage.create({ name, email, message });
  res.status(201).json({ message: 'Message received! We will get back to you soon.' });
});

export default router;
