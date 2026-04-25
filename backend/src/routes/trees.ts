import { Router } from 'express';
import { getAllTrees, getTreeById, createTree } from '../controllers/treeController';

const router = Router();

router.get('/', getAllTrees);
router.get('/:id', getTreeById);
router.post('/', createTree);

export default router;
