import { Router } from 'express';
import { postUpdate, getUpdates } from '../controllers/farmUpdateController';
import { protect } from '../middleware/auth';
import { uploadMixed } from '../config/cloudinary';

const router = Router();

router.get('/:rentalId', protect, getUpdates);
router.post('/:rentalId', protect, uploadMixed.array('media', 10), postUpdate);

export default router;
