import { Request, Response } from 'express';
import Tree from '../models/Tree';

export const getAllTrees = async (_req: Request, res: Response): Promise<void> => {
  const trees = await Tree.find({ isAvailable: true });
  res.json(trees);
};

export const getTreeById = async (req: Request, res: Response): Promise<void> => {
  const tree = await Tree.findById(req.params.id);
  if (!tree) { res.status(404).json({ message: 'Tree not found' }); return; }
  res.json(tree);
};

export const createTree = async (req: Request, res: Response): Promise<void> => {
  const tree = await Tree.create(req.body);
  res.status(201).json(tree);
};
