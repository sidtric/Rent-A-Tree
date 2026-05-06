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
  const [totalTrees, availableTrees, totalRentals, cancelledRentals, reviews, users, videos] = await Promise.all([
    Tree.countDocuments(),
    Tree.countDocuments({ isAvailable: true }),
    Rental.countDocuments(),
    Rental.countDocuments({ status: 'cancelled' }),
    Review.countDocuments(),
    User.countDocuments(),
    Video.countDocuments(),
  ]);

  const paidRentals = await Rental.find({ status: { $in: ['active', 'completed'] } }).populate<{ tree: { pricePerSeason: number } }>('tree', 'pricePerSeason');
  const totalRevenue = paidRentals.reduce((sum, r) => sum + (r.tree?.pricePerSeason ?? 0), 0);

  res.json({
    totalTrees,
    availableTrees,
    rentedTrees: totalTrees - availableTrees,
    totalRentals,
    cancelledRentals,
    reviews,
    users,
    videos,
    totalRevenue,
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

export const adminSearchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.query as { email?: string };
  if (!email?.trim()) { res.status(400).json({ message: 'email query param required' }); return; }
  const users = await User.find({ email: { $regex: email.trim(), $options: 'i' } }).select('-password').limit(10);
  res.json(users);
};

export const adminSetRole = async (req: AuthRequest, res: Response): Promise<void> => {
  const { role } = req.body as { role: 'user' | 'admin' };
  if (!['user', 'admin'].includes(role)) { res.status(400).json({ message: 'role must be "user" or "admin"' }); return; }
  const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!updated) { res.status(404).json({ message: 'User not found' }); return; }
  res.json(updated);
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
