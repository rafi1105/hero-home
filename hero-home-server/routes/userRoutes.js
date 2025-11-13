import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProviderStats
} from '../controllers/userController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createUser); // User registration

// Protected routes - require Firebase authentication
router.get('/', verifyFirebaseToken, getUsers);
router.get('/:id', verifyFirebaseToken, getUserById);
router.put('/:id', verifyFirebaseToken, updateUser);
router.delete('/:id', verifyFirebaseToken, deleteUser);

// Provider statistics
router.get('/:userId/provider-stats', verifyFirebaseToken, getProviderStats);

export default router;
