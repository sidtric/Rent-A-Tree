import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { createReview, getReviews } from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|webm/;
    cb(null, allowed.test(file.mimetype));
  },
});

const router = Router();

router.get('/', getReviews);
router.post('/', protect, upload.array('media', 5), createReview);

export default router;
