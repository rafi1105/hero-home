import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';
import connectDB from './config/db.js';

dotenv.config();

const services = [
  {
    name: 'Professional Plumbing',
    category: 'plumbing',
    description: 'Expert plumbing services for all your home and office needs. From leak repairs to full installations, we handle it all with precision and care.',
    price: 50,
    provider: {
      userId: 'provider1',
      name: 'John Smith',
      email: 'john@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.8,
      count: 45
    },
    bookingCount: 120
  },
  {
    name: 'Expert Electrician',
    category: 'electrical',
    description: 'Licensed electrician providing safe and reliable electrical services. We specialize in wiring, installations, and electrical repairs.',
    price: 60,
    provider: {
      userId: 'provider2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.9,
      count: 67
    },
    bookingCount: 180
  },
  {
    name: 'Deep Cleaning Service',
    category: 'cleaning',
    description: 'Professional deep cleaning for homes and offices. Our team uses eco-friendly products to ensure a spotless and healthy environment.',
    price: 80,
    provider: {
      userId: 'provider3',
      name: 'Maria Garcia',
      email: 'maria@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.7,
      count: 92
    },
    bookingCount: 250
  },
  {
    name: 'AC Repair & Maintenance',
    category: 'hvac',
    description: 'Complete HVAC solutions including AC repair, maintenance, and installation. Keep your space comfortable year-round.',
    price: 70,
    provider: {
      userId: 'provider4',
      name: 'Michael Brown',
      email: 'michael@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.6,
      count: 38
    },
    bookingCount: 95
  },
  {
    name: 'Carpentry & Woodwork',
    category: 'carpentry',
    description: 'Custom carpentry services for furniture repair, installations, and woodwork projects. Quality craftsmanship guaranteed.',
    price: 55,
    provider: {
      userId: 'provider5',
      name: 'David Wilson',
      email: 'david@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.8,
      count: 54
    },
    bookingCount: 140
  },
  {
    name: 'House Painting Pro',
    category: 'painting',
    description: 'Professional painting services for interior and exterior projects. We deliver flawless finishes with attention to detail.',
    price: 65,
    provider: {
      userId: 'provider6',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.9,
      count: 71
    },
    bookingCount: 165
  },
  {
    name: 'Garden & Landscaping',
    category: 'gardening',
    description: 'Transform your outdoor space with our expert landscaping and garden maintenance services.',
    price: 45,
    provider: {
      userId: 'provider7',
      name: 'Robert Lee',
      email: 'robert@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.5,
      count: 29
    },
    bookingCount: 75
  },
  {
    name: 'Pest Control Experts',
    category: 'pestcontrol',
    description: 'Safe and effective pest control solutions for your home or business. We eliminate pests and prevent future infestations.',
    price: 90,
    provider: {
      userId: 'provider8',
      name: 'James Martinez',
      email: 'james@example.com',
      verified: true
    },
    available: true,
    rating: {
      average: 4.7,
      count: 48
    },
    bookingCount: 110
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');
    
    // Insert new services
    await Service.insertMany(services);
    console.log('✓ Database seeded with sample services');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
