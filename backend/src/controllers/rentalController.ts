import { Request, Response } from 'express';
import Rental from '../models/Rental';
import Tree from '../models/Tree';

export const createRental = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const { treeId, deliveryAddress, season } = req.body;
    const tree = await Tree.findById(treeId);
    if (!tree || !tree.isAvailable) { res.status(400).json({ message: 'Tree not available' }); return; }
    const rental = await Rental.create({ user: req.userId, tree: treeId, season, deliveryAddress, estimatedYield: Math.floor((tree.yieldMin + tree.yieldMax) / 2) });
    tree.isAvailable = false;
    await tree.save();
    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyRentals = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const rentals = await Rental.find({ user: req.userId }).populate('tree');
    res.json(rentals);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelRental = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const rental = await Rental.findOne({ _id: req.params.id, user: req.userId });
    if (!rental) { res.status(404).json({ message: 'Rental not found' }); return; }
    rental.status = 'cancelled';
    await rental.save();
    await Tree.findByIdAndUpdate(rental.tree, { isAvailable: true });
    res.json({ message: 'Rental cancelled' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
