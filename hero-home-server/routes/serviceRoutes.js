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

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/top-rated', getTopRatedServices);
router.get('/:id', getServiceById);

// Protected routes (add authentication middleware in production)
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/user/:userId', getMyServices);
router.post('/:id/review', addReview);

export default router;
