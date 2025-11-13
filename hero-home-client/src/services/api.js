import axios from 'axios';

const API_URL = 'https://hero-home-server-five.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getMyServices: (userId) => api.get(`/services/user/${userId}`),
  getTopRated: (limit = 6) => api.get(`/services/top-rated`, { params: { limit } }),
  addReview: (id, data) => api.post(`/services/${id}/review`, data),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id, reason, cancelledBy) => api.put(`/bookings/${id}/cancel`, { reason, cancelledBy }),
  getUserBookings: (userId, params) => api.get(`/bookings/user/${userId}`, { params }),
  getProviderBookings: (userId, params) => api.get(`/bookings/provider/${userId}`, { params }),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getServiceReviews: (serviceId) => api.get(`/reviews/service/${serviceId}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getProviderStats: (userId) => api.get(`/users/${userId}/provider-stats`),
};

export default api;
