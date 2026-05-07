import { Router } from 'express';
import { protect } from '../middleware/auth';
import { createBoxOrder, getMyBoxOrders } from '../controllers/boxOrderController';

const router = Router();
router.post('/',    protect, createBoxOrder);
router.get('/my',   protect, getMyBoxOrders);
export default router;
