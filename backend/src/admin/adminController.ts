import { Response } from 'express';
import Razorpay from 'razorpay';
import { AuthRequest } from '../middleware/auth';
import Tree   from '../models/Tree';
import Rental from '../models/Rental';
import Review from '../models/Review';
import User   from '../models/User';
import Video  from '../models/Video';
import FarmUpdate from '../models/FarmUpdate';

const getRazorpay = () => new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

// ── Payments (Razorpay) ───────────────────────────────────────────────────────

export const adminGetPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rzp = getRazorpay();
    const from  = req.query.from  ? Number(req.query.from)  : undefined;
    const to    = req.query.to    ? Number(req.query.to)    : undefined;
    const count = Math.min(Number(req.query.count  || 50), 100);

    const options: Record<string, unknown> = { count };
    if (from) options.from = from;
    if (to)   options.to   = to;

    // Fetch payments from Razorpay
    const rzpRes = await rzp.payments.all(options) as { items: any[]; count: number };
    const payments = rzpRes.items || [];

    // Enrich with local rental data where we have a matching paymentId
    const paymentIds = payments.map((p: any) => p.id);
    const rentals = await Rental.find({ paymentId: { $in: paymentIds } })
      .populate('user', 'name email')
      .populate('tree', 'name plan');

    const rentalMap = new Map(rentals.map(r => [r.paymentId, r]));

    const enriched = payments.map((p: any) => ({
      id:          p.id,
      orderId:     p.order_id,
      amount:      p.amount / 100,           // paise → rupees
      currency:    p.currency,
      status:      p.status,                 // captured | failed | refunded
      method:      p.method,                 // card | upi | netbanking | wallet
      email:       p.email,
      contact:     p.contact,
      description: p.description,
      createdAt:   new Date(p.created_at * 1000).toISOString(),
      rental:      rentalMap.get(p.id) || null,
    }));

    const totalCaptured = enriched
      .filter((p: any) => p.status === 'captured')
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    res.json({ payments: enriched, total: rzpRes.count, totalCaptured });
  } catch (err: any) {
    // Surface the Razorpay error message if available
    const msg = err?.error?.description || err?.message || 'Failed to fetch payments';
    res.status(500).json({ message: msg });
  }
};

export const adminGetPaymentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await getRazorpay().payments.fetch(req.params.id);
    res.json(payment);
  } catch (err: any) {
    res.status(404).json({ message: err?.error?.description || 'Payment not found' });
  }
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
