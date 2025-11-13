import Service from '../models/Service.js';

// @desc    Get all services with advanced search
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, limit = 10, page = 1 } = req.query;
    
    let query = { available: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Case-insensitive search using $regex and $or
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }; // 'i' = case-insensitive
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { 'provider.name': searchRegex }
      ];
    }
    
    // Price range filtering using MongoDB operators
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const services = await Service.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Service.countDocuments(query);
    
    res.json({
      services,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private
export const createService = async (req, res) => {
  try {
    console.log('Received service data:', req.body);
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Service creation error:', error);
    console.error('Error details:', error.errors);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors 
    });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get services by provider
// @route   GET /api/services/user/:userId
// @access  Private
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ 'provider.userId': req.params.userId })
      .sort({ createdAt: -1 });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated services
// @route   GET /api/services/top-rated
// @access  Public
export const getTopRatedServices = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const services = await Service.find({ 
      available: true,
      'rating.count': { $gt: 0 } // Only services with reviews
    })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(parseInt(limit));
    
    res.json({ data: services });
  } catch (error) {
    console.error('Error in getTopRatedServices:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review to service
// @route   POST /api/services/:id/review
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { userId, userName, bookingId, rating, comment } = req.body;
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user already reviewed this booking
    const existingReview = service.reviews.find(
      review => review.bookingId && review.bookingId.toString() === bookingId
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }
    
    // Add review
    service.reviews.push({
      userId,
      userName,
      bookingId,
      rating,
      comment,
      createdAt: new Date()
    });
    
    // Update rating average and count
    const totalRatings = service.reviews.reduce((sum, review) => sum + review.rating, 0);
    service.rating.count = service.reviews.length;
    service.rating.average = totalRatings / service.reviews.length;
    
    await service.save();
    
    res.status(201).json({
      message: 'Review added successfully',
      service
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
