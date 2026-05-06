import { Router } from 'express';
import { getAllTrees, getTreeById, createTree } from '../controllers/treeController';
import { uploadImage } from '../config/cloudinary';
import { protect } from '../middleware/auth';
import { adminOnly } from '../admin/adminMiddleware';

const router = Router();

router.get('/', getAllTrees);
router.get('/:id', getTreeById);
router.post('/', protect, adminOnly, uploadImage.single('image'), createTree);

export default router;
