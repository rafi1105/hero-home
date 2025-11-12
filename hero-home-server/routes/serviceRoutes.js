import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Protected routes (add authentication middleware in production)
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/user/:userId', getMyServices);

export default router;
