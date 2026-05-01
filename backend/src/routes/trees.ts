import { Router } from 'express';
import { getAllTrees, getTreeById, createTree } from '../controllers/treeController';
import { uploadImage } from '../config/cloudinary';

const router = Router();

router.get('/', getAllTrees);
router.get('/:id', getTreeById);
router.post('/', uploadImage.single('image'), createTree);

export default router;
