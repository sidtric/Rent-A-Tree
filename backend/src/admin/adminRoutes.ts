import { Router } from 'express';
import { protect } from '../middleware/auth';
import { adminOnly } from './adminMiddleware';
import {
  getStats,
  adminGetTrees,    adminDeleteTree,
  adminGetRentals,
  adminGetReviews,  adminDeleteReview,
  adminGetUsers,    adminSearchUsers, adminSetRole,
  adminGetVideos,   adminDeleteVideo,
  adminGetFarmUpdates, adminDeleteFarmUpdate,
} from './adminController';

const router = Router();

// All admin routes require: valid JWT + admin email match
router.use(protect, adminOnly);

// Stats overview
router.get('/stats', getStats);

// Trees
router.get('/trees',         adminGetTrees);
router.delete('/trees/:id',  adminDeleteTree);

// Rentals
router.get('/rentals',       adminGetRentals);

// Reviews
router.get('/reviews',       adminGetReviews);
router.delete('/reviews/:id', adminDeleteReview);

// Users
router.get('/users',              adminGetUsers);
router.get('/users/search',       adminSearchUsers);
router.patch('/users/:id/role',   adminSetRole);

// Videos
router.get('/videos',        adminGetVideos);
router.delete('/videos/:id', adminDeleteVideo);

// Farm Updates
router.get('/farm-updates',         adminGetFarmUpdates);
router.delete('/farm-updates/:id',  adminDeleteFarmUpdate);

export default router;
