import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { uploadImage } from '../config/cloudinary';

const router = Router();

router.get('/', getReviews);
router.post('/', uploadImage.array('media', 5), createReview);

export default router;
