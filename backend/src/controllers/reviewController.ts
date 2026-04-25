import { Response } from 'express';
import Review from '../models/Review';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const { rating, comment, name } = req.body;

  const files = (req.files as Express.Multer.File[]) ?? [];
  const media = files.map(f => ({
    url: `/uploads/${f.filename}`,
    type: f.mimetype.startsWith('video') ? 'video' as const : 'image' as const,
  }));

  const review = await Review.create({
    user: req.userId,
    name: name || 'Anonymous',
    rating: Number(rating),
    comment,
    media,
  });

  res.status(201).json(review);
};

export const getReviews = async (_req: AuthRequest, res: Response): Promise<void> => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
};
