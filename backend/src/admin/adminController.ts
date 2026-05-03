import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Tree   from '../models/Tree';
import Rental from '../models/Rental';
import Review from '../models/Review';
import User   from '../models/User';
import Video  from '../models/Video';
import FarmUpdate from '../models/FarmUpdate';

// ── Overview / Stats ─────────────────────────────────────────────────────────

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  const [trees, rentals, reviews, users, videos] = await Promise.all([
    Tree.countDocuments(),
    Rental.countDocuments(),
    Review.countDocuments(),
    User.countDocuments(),
    Video.countDocuments(),
  ]);

  const revenue = await Rental.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  res.json({
    trees,
    rentals,
    reviews,
    users,
    videos,
    revenue: revenue[0]?.total ?? 0,
  });
};

// ── Trees ─────────────────────────────────────────────────────────────────────

export const adminGetTrees = async (_req: AuthRequest, res: Response): Promise<void> => {
  const trees = await Tree.find().sort({ createdAt: -1 });
  res.json(trees);
};

export const adminDeleteTree = async (req: AuthRequest, res: Response): Promise<void> => {
  const tree = await Tree.findByIdAndDelete(req.params.id);
  if (!tree) { res.status(404).json({ message: 'Tree not found' }); return; }
  res.json({ message: 'Tree deleted' });
};

// ── Rentals ───────────────────────────────────────────────────────────────────

export const adminGetRentals = async (_req: AuthRequest, res: Response): Promise<void> => {
  const rentals = await Rental.find()
    .populate('user', 'name email')
    .populate('tree', 'name location')
    .sort({ createdAt: -1 });
  res.json(rentals);
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export const adminGetReviews = async (_req: AuthRequest, res: Response): Promise<void> => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

export const adminDeleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) { res.status(404).json({ message: 'Review not found' }); return; }
  res.json({ message: 'Review deleted' });
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const adminGetUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// ── Videos ────────────────────────────────────────────────────────────────────

export const adminGetVideos = async (_req: AuthRequest, res: Response): Promise<void> => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
};

export const adminDeleteVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) { res.status(404).json({ message: 'Video not found' }); return; }
  res.json({ message: 'Video deleted' });
};

// ── Farm Updates ──────────────────────────────────────────────────────────────

export const adminGetFarmUpdates = async (_req: AuthRequest, res: Response): Promise<void> => {
  const updates = await FarmUpdate.find().sort({ createdAt: -1 });
  res.json(updates);
};

export const adminDeleteFarmUpdate = async (req: AuthRequest, res: Response): Promise<void> => {
  const update = await FarmUpdate.findByIdAndDelete(req.params.id);
  if (!update) { res.status(404).json({ message: 'Farm update not found' }); return; }
  res.json({ message: 'Farm update deleted' });
};
