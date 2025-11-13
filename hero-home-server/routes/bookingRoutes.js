import express from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getUserBookings
} from '../controllers/bookingController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All booking routes are protected - require authentication
router.get('/', verifyFirebaseToken, getBookings);
router.get('/:id', verifyFirebaseToken, getBookingById);
router.post('/', verifyFirebaseToken, createBooking);
router.put('/:id/status', verifyFirebaseToken, updateBookingStatus);
router.put('/:id/cancel', verifyFirebaseToken, cancelBooking);
router.get('/user/:userId', verifyFirebaseToken, getUserBookings);

export default router;
