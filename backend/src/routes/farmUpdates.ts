import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { postUpdate, getUpdates } from '../controllers/farmUpdateController';
import { protect } from '../middleware/auth';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

const router = Router();

router.get('/:rentalId', protect, getUpdates);
router.post('/:rentalId', protect, upload.array('media', 10), postUpdate);

export default router;
