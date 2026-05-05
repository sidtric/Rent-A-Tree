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
    const order = await getRazorpay().orders.create({ amount: tree.pricePerSeason * 100, currency: 'INR', receipt: `rcpt_${Date.now()}` });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, treeName: tree.name });
  } catch (err) {
    process.stdout.write(`[createOrder error] ${String(err)}\n`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyPayment = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, treeId, deliveryAddress, season } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body).digest('hex');
    if (expectedSignature !== razorpay_signature) { res.status(400).json({ message: 'Payment verification failed' }); return; }
    const tree = await Tree.findById(treeId);
    if (!tree || !tree.isAvailable) { res.status(400).json({ message: 'Tree no longer available' }); return; }
    const rental = await Rental.create({ user: req.userId, tree: treeId, season: season || '2026', deliveryAddress, estimatedYield: Math.floor((tree.yieldMin + tree.yieldMax) / 2), paymentId: razorpay_payment_id });
    tree.isAvailable = false;
    await tree.save();
    res.status(201).json(rental);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
