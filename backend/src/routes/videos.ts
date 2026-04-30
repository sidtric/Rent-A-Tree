import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { uploadVideo } from '../config/cloudinary';
import Video from '../models/Video';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

router.post('/', protect, uploadVideo.single('video'), async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File & { path?: string };
  if (!file) { res.status(400).json({ message: 'No video uploaded' }); return; }
  const video = await Video.create({
    title:       req.body.title || 'Farm Video',
    description: req.body.description || '',
    url:         file.path,
  });
  res.status(201).json(video);
});

export default router;
