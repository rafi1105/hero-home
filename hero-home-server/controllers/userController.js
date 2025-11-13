import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
export const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ 
      $or: [
        { email: req.body.email },
        { firebaseUid: req.body.firebaseUid }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider statistics
// @route   GET /api/users/:userId/provider-stats
// @access  Private
export const getProviderStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all services by this provider
    const services = await Service.find({ 'provider.userId': userId });
    const serviceIds = services.map(s => s._id);
    
    // Get all bookings for these services
    const allBookings = await Booking.find({ 
      service: { $in: serviceIds } 
    });
    
    // Calculate statistics
    const stats = {
      // Total number of services
      totalServices: services.length,
      
      // Total bookings count
      totalBookings: allBookings.length,
      
      // Bookings by status
      bookingsByStatus: {
        pending: allBookings.filter(b => b.status === 'pending').length,
        confirmed: allBookings.filter(b => b.status === 'confirmed').length,
        inProgress: allBookings.filter(b => b.status === 'in-progress').length,
        completed: allBookings.filter(b => b.status === 'completed').length,
        cancelled: allBookings.filter(b => b.status === 'cancelled').length
      },
      
      // Total revenue (from completed bookings)
      totalRevenue: allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.price || 0), 0),
      
      // Pending revenue (from pending and confirmed bookings)
      pendingRevenue: allBookings
        .filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status))
        .reduce((sum, b) => sum + (b.price || 0), 0),
      
      // Average rating across all services
      averageRating: services.length > 0 
        ? services.reduce((sum, s) => sum + (s.rating?.average || 0), 0) / services.length 
        : 0,
      
      // Total reviews
      totalReviews: services.reduce((sum, s) => sum + (s.rating?.count || 0), 0),
      
      // Monthly revenue data (last 6 months)
      monthlyRevenue: getMonthlyRevenue(allBookings),
      
      // Service performance (top 5 services by bookings)
      topServices: getTopServices(services, allBookings),
      
      // Recent bookings (last 10)
      recentBookings: allBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(b => ({
          id: b._id,
          customerName: b.customer.name,
          bookingDate: b.bookingDate,
          status: b.status,
          price: b.price,
          service: services.find(s => s._id.toString() === b.service.toString())?.name || 'Unknown'
        }))
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get monthly revenue for the last 6 months
const getMonthlyRevenue = (bookings) => {
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const monthRevenue = bookings
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === date.getMonth() &&
               bookingDate.getFullYear() === date.getFullYear() &&
               b.status === 'completed';
      })
      .reduce((sum, b) => sum + (b.price || 0), 0);
    
    months.push({
      month: monthName,
      revenue: monthRevenue,
      bookings: bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === date.getMonth() &&
               bookingDate.getFullYear() === date.getFullYear();
      }).length
    });
  }
  
  return months;
};

// Helper function to get top services by booking count
const getTopServices = (services, bookings) => {
  return services
    .map(service => ({
      id: service._id,
      name: service.name,
      category: service.category,
      rating: service.rating?.average || 0,
      reviewCount: service.rating?.count || 0,
      bookingCount: bookings.filter(b => 
        b.service.toString() === service._id.toString()
      ).length,
      revenue: bookings
        .filter(b => 
          b.service.toString() === service._id.toString() && 
          b.status === 'completed'
        )
        .reduce((sum, b) => sum + (b.price || 0), 0)
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 5);
};
