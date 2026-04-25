import { Request, Response } from 'express';
import Review from '../models/Review';

export const createReview = async (req: Request, res: Response): Promise<void> => {
  const { rating, comment, name } = req.body;

  const files = (req.files as Express.Multer.File[]) ?? [];
  const media = files.map(f => ({
    url: `/uploads/${f.filename}`,
    type: f.mimetype.startsWith('video') ? 'video' as const : 'image' as const,
  }));

  const review = await Review.create({
    name: name || 'Anonymous',
    rating: Number(rating),
    comment,
    media,
  });

  res.status(201).json(review);
};

export const getReviews = async (_req: Request, res: Response): Promise<void> => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
};
