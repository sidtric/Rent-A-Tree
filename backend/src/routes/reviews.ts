import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { uploadMixed } from '../config/cloudinary';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getReviews);
router.post('/', protect, uploadMixed.array('media', 5), createReview);

export default router;
