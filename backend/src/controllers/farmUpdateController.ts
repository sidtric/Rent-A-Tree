import { Request, Response } from 'express';
import FarmUpdate from '../models/FarmUpdate';

export const postUpdate = async (req: Request, res: Response): Promise<void> => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  const media = files.map(f => ({
    url: (f as any).path,
    type: f.mimetype.startsWith('video') ? 'video' as const : 'image' as const,
  }));
  const update = await FarmUpdate.create({
    rental: req.params.rentalId,
    caption: req.body.caption || '',
    media,
  });
  res.status(201).json(update);
};

export const getUpdates = async (req: Request, res: Response): Promise<void> => {
  const updates = await FarmUpdate.find({ rental: req.params.rentalId }).sort({ createdAt: -1 });
  res.json(updates);
};
