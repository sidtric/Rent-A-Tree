import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Tree from '../models/Tree';
import Rental from '../models/Rental';

const getRazorpay = () => new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { treeId } = req.body;
    const tree = await Tree.findById(treeId);
    if (!tree || !tree.isAvailable) { res.status(400).json({ message: 'Tree not available' }); return; }
    const amount = Math.max(100, Math.round(tree.pricePerSeason * 100));
    const order = await getRazorpay().orders.create({ amount, currency: 'INR', receipt: `rcpt_${Date.now()}` });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, treeName: tree.name });
  } catch (err: any) {
    console.error('[createOrder error]', {
      message: err?.message,
      statusCode: err?.statusCode,
      error: err?.error,
      raw: err,
    });
    res.status(500).json({ message: err?.error?.description || err?.message || 'Server error' });
  }
};

export const verifyPayment = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, treeId, deliveryAddress, season } = req.body;

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body).digest('hex');
    if (expectedSignature !== razorpay_signature) { res.status(400).json({ message: 'Payment verification failed' }); return; }

    // Idempotency: return existing rental if this payment was already processed
    const existing = await Rental.findOne({ paymentId: razorpay_payment_id });
    if (existing) { res.status(200).json(existing); return; }

    // Atomic tree lock: only succeeds if tree is still available, marks it unavailable in one DB op
    const tree = await Tree.findOneAndUpdate(
      { _id: treeId, isAvailable: true },
      { $set: { isAvailable: false } },
      { new: false }
    );
    if (!tree) { res.status(400).json({ message: 'Tree no longer available' }); return; }

    try {
      const rental = await Rental.create({
        user: req.userId,
        tree: treeId,
        season: season || String(new Date().getFullYear()),
        deliveryAddress,
        estimatedYield: Math.floor((tree.yieldMin + tree.yieldMax) / 2),
        paymentId: razorpay_payment_id,
      });
      res.status(201).json(rental);
    } catch {
      // Restore tree availability if rental creation fails
      await Tree.findByIdAndUpdate(treeId, { isAvailable: true });
      res.status(500).json({ message: 'Rental creation failed. Your payment will be refunded. Please contact support.' });
    }
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
