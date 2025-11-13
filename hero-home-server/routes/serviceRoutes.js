import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
  getTopRatedServices,
  addReview
} from '../controllers/serviceController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/top-rated', getTopRatedServices);
router.get('/:id', getServiceById);

// Protected routes - require Firebase authentication
router.post('/', verifyFirebaseToken, createService);
router.put('/:id', verifyFirebaseToken, updateService);
router.delete('/:id', verifyFirebaseToken, deleteService);
router.get('/user/:userId', verifyFirebaseToken, getMyServices);
router.post('/:id/review', verifyFirebaseToken, addReview);

export default router;
