import express from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getUserBookings,
  getProviderBookings
} from '../controllers/bookingController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All booking routes are protected - require authentication
// Note: More specific routes must come before generic ones
router.get('/user/:userId', verifyFirebaseToken, getUserBookings);
router.get('/provider/:userId', verifyFirebaseToken, getProviderBookings);
router.get('/', verifyFirebaseToken, getBookings);
router.get('/:id', verifyFirebaseToken, getBookingById);
router.post('/', verifyFirebaseToken, createBooking);
router.put('/:id/status', verifyFirebaseToken, updateBookingStatus);
router.put('/:id/cancel', verifyFirebaseToken, cancelBooking);

export default router;
