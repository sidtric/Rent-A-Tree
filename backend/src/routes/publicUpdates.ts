import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { uploadMixed } from '../config/cloudinary';
import PublicUpdate from '../models/PublicUpdate';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const updates = await PublicUpdate.find().sort({ createdAt: -1 });
  res.json(updates);
});

router.post('/', protect, (req: Request, res: Response, next: any) => {
  uploadMixed.array('media', 20)(req, res, (err: any) => {
    if (err) { process.stdout.write(`[public-update multer err] ${JSON.stringify(err)}\n`); res.status(500).json({ message: err.message || 'Upload failed' }); return; }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const media = files.map(f => ({
      url:  (f as any).path,
      type: f.mimetype.startsWith('video') ? 'video' as const : 'image' as const,
    }));
    const update = await PublicUpdate.create({ caption: req.body.caption || '', media });
    res.status(201).json(update);
  } catch (err) {
    process.stdout.write(`[public-update create err] ${String(err)}\n`);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req: Request, res: Response) => {
  await PublicUpdate.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
