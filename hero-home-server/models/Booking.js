import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  customer: {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  provider: {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  bookingTime: {
    type: String,
    required: [true, 'Booking time is required']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in hours
    default: 1
  },
  notes: {
    type: String,
    maxlength: 500
  },
  cancellationReason: String,
  cancelledBy: String,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ 'customer.userId': 1, status: 1 });
bookingSchema.index({ 'provider.userId': 1, status: 1 });
bookingSchema.index({ bookingDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
