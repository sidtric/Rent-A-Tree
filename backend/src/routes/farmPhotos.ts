import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { uploadImage } from '../config/cloudinary';
import FarmPhoto from '../models/FarmPhoto';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const photos = await FarmPhoto.find().sort({ createdAt: -1 });
  res.json(photos);
});

router.post('/', protect, uploadImage.single('photo'), async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File & { path?: string };
  if (!file) { res.status(400).json({ message: 'No photo uploaded' }); return; }
  const photo = await FarmPhoto.create({
    caption: req.body.caption || '',
    url:     file.path,
  });
  res.status(201).json(photo);
});

router.delete('/:id', protect, async (req: Request, res: Response) => {
  await FarmPhoto.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
