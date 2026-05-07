import { Request, Response } from 'express';
import BoxOrder from '../models/BoxOrder';

export const createBoxOrder = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { items, paymentId, deliveryAddress } = req.body;
    if (!items?.length) { res.status(400).json({ message: 'No items provided' }); return; }

    // Idempotency: return existing order if this payment was already recorded
    if (paymentId) {
      const existing = await BoxOrder.findOne({ paymentId });
      if (existing) { res.status(200).json(existing); return; }
    }

    const totalAmount = items.reduce((sum: number, i: { price: number; qty: number }) => sum + i.price * i.qty, 0);
    const order = await BoxOrder.create({ user: req.userId, items, paymentId, deliveryAddress, totalAmount });
    res.status(201).json(order);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyBoxOrders = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const orders = await BoxOrder.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
