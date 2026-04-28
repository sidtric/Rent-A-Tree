import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth';
import Video from '../models/Video';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

router.post('/', protect, upload.single('video'), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) { res.status(400).json({ message: 'No video uploaded' }); return; }
  const video = await Video.create({
    title:       req.body.title || 'Farm Video',
    description: req.body.description || '',
    url:         `/uploads/${file.filename}`,
  });
  res.status(201).json(video);
});

export default router;
