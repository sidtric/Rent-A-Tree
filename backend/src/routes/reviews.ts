import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { uploadMixed } from '../config/cloudinary';

const router = Router();

router.get('/', getReviews);
router.post('/', uploadMixed.array('media', 5), createReview);

export default router;
